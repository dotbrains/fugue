# fugue — a deliberately minimal, no-trace runtime for AI coding agents.
#
# Design rule: nothing in this image may phone home on its own. No managed git
# hooks, no telemetry collector, no audit JSONL. The only outbound traffic a
# fugue session can make is to the model API (and only when --strict allows it).
FROM node:22-bookworm-slim

# Runtime deps:
#   nftables  — egress allowlist installed by fugue-entry
#   ca-certs  — TLS to the model API
#   dnsutils  — getent host resolution for the allowlist
#   su-exec   — privilege drop after firewall setup
#   git       — agents need it; the host's hooks are NOT carried in
RUN apt-get update && apt-get install -y --no-install-recommends \
      nftables ca-certificates dnsutils git curl \
 && rm -rf /var/lib/apt/lists/*

# su-exec (tiny setuid-free privilege dropper)
RUN curl -fsSL https://github.com/ncopa/su-exec/raw/master/su-exec.c -o /tmp/su-exec.c \
 && apt-get update && apt-get install -y --no-install-recommends gcc libc6-dev \
 && gcc -Wall -O2 /tmp/su-exec.c -o /usr/local/bin/su-exec \
 && apt-get purge -y gcc libc6-dev && apt-get autoremove -y \
 && rm -rf /var/lib/apt/lists/* /tmp/su-exec.c

# The three agent CLIs. Pin in CI; floating here for the scaffold.
RUN npm install -g \
      @anthropic-ai/claude-code \
      @openai/codex \
      @google/gemini-cli \
 && npm cache clean --force

# Unprivileged agent user. $HOME is a tmpfs mount at runtime, so we only need
# the uid/gid to line up with the launcher's --tmpfs uid=1001.
RUN groupadd -g 1001 agent && useradd -u 1001 -g 1001 -m -s /bin/bash agent

COPY src/fugue-entry /usr/local/bin/fugue-entry
RUN chmod +x /usr/local/bin/fugue-entry

# Entrypoint is set by the launcher (bin/fugue) so flags stay in one place.
ENTRYPOINT ["/usr/local/bin/fugue-entry"]

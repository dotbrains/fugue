# Prompt: generate a fugue agent profile

Use this to turn an agent CLI's documentation into a `profiles/<name>.env`. Paste
the agent's install/auth/config docs where indicated, then give the whole thing
to an LLM. **Verify the result against the real docs** — wrong `API_HOSTS` break
the strict egress allowlist, and invented telemetry vars are worse than none.

---

You are generating a configuration profile for **fugue**, which runs an AI coding
agent CLI inside a sandbox. A profile is a sourced bash file with these fields:

- `AGENT_CMD` — the exact command the user runs (e.g. `claude`).
- `API_KEY_VARS` — space-separated host env var(s) holding the credential; fugue
  forwards the first one that is set. Prefer real API-key vars; for
  account/OAuth agents, use the documented non-interactive session/token var.
- `API_HOSTS` — space-separated hostnames the agent must reach (TCP 443). Keep
  this MINIMAL; every host is a hole in the egress allowlist. Include the
  provider API host(s) and the agent's own control host if any.
- `TELEMETRY_ENV` — a bash array of `KEY=VALUE` pairs that disable telemetry,
  analytics, error reporting, and auto-update. Only include vars you can verify
  from the docs; always include `DO_NOT_TRACK=1` as a baseline.
- `BACKENDS` — `docker native` if the CLI is baked into the fugue image (npm),
  otherwise `native` (the host's installed CLI runs under sandbox-exec).

Rules:

- Do NOT invent env var names. If a telemetry/host fact isn't in the docs, omit
  it and add a `#` comment saying it's unverified.
- Keep `API_HOSTS` to the smallest set that lets the agent work.
- Match the format of the existing profiles exactly, including the
  `# shellcheck shell=bash` / `# shellcheck disable=SC2034` header.

Here is an existing profile to match:

```sh
# fugue profile: Claude Code (Anthropic)
#
# shellcheck shell=bash
# shellcheck disable=SC2034
AGENT_CMD="claude"
API_KEY_VARS="ANTHROPIC_API_KEY"
API_HOSTS="api.anthropic.com"
BACKENDS="docker native"
TELEMETRY_ENV=(
  "CLAUDE_CODE_ENABLE_TELEMETRY=0"
  "DISABLE_TELEMETRY=1"
  "DISABLE_AUTOUPDATER=1"
)
```

The agent to profile is **`<AGENT NAME>`**. Here are its docs:

```text
<PASTE THE AGENT'S INSTALL / AUTH / CONFIG / TELEMETRY DOCS HERE>
```

Output only the contents of `profiles/<name>.env`.

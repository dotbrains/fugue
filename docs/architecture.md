# Architecture

`bin/fugue` runs on the host, parses flags, resolves the agent profile, forwards
one credential, and then hands off to one of two **backends**:

- **docker** (default) — assembles a hardened `docker run`; `src/fugue-entry`
  runs inside the container, installs the egress allowlist, drops privileges, and
  execs the agent. The [`Dockerfile`](../Dockerfile) builds the minimal image.
- **native** (macOS) — generates a Seatbelt (SBPL) profile and execs the host's
  agent under `sandbox-exec`. No container; the kernel enforces the file-system
  boundary.

Both share the profile system and the telemetry kill-env; they differ in *how*
they sandbox.

## docker backend

```mermaid
sequenceDiagram
    autonumber
    participant U as You (host shell)
    participant L as bin/fugue (host)
    participant E as fugue-entry (container, root)
    participant A as agent (container, uid 1001)

    U->>L: fugue [flags] AGENT [args]
    L->>L: parse flags, source the agent profile
    L->>L: forward the one matching credential
    L->>E: docker run (tmpfs HOME, cap-drop ALL, rm container)
    Note over E: strict mode only
    E->>E: install nftables egress allowlist (or exit 3)
    E->>E: arm scrub trap (EXIT)
    E->>A: drop to uid 1001, exec the agent
    A-->>E: agent exits with rc
    E->>E: scrub trap fires, container removed
    E-->>L: return rc
    L-->>U: exit rc (nothing persists)
```

## native backend (macOS sandbox-exec)

The native backend runs the agent the host already has installed, but under a
kernel sandbox — closest to safehouse-style on-host sandboxing, with fugue's
no-trace defaults layered on.

```mermaid
flowchart TD
    P[bin/fugue native] --> H["ephemeral $HOME = mktemp -d<br/>(or real $HOME with --share-home)"]
    P --> SB[generate SBPL profile]
    SB --> R1["allow read default<br/>deny read: ~/.ssh ~/.aws ~/.gnupg<br/>keychains, gh/gcloud/kube creds, .netrc"]
    SB --> R2["deny write default<br/>allow write: project, ephemeral HOME,<br/>temp, --add-dir paths"]
    H --> X["env -i + telemetry kill-env + one credential"]
    SB --> X
    X --> S["sandbox-exec -f profile AGENT args"]
    S --> C["on exit: shred temp tree (scrub)"]
```

What it provides vs. the docker backend:

- **File system**: writes are denied outside the project / scratch areas, and
  reads of a sensitive denylist (SSH keys, cloud creds, keychains) are blocked by
  the kernel. Toolchain reads still work (read is allow-by-default minus the
  denylist).
- **`$HOME`**: ephemeral by default (shredded on exit); `--share-home` keeps the
  real one for agents that need an existing login.
- **Environment**: started from a clean `env -i` plus a small safe passthrough,
  the telemetry kill-env, and the single credential — so other host secrets in
  your environment don't leak to the agent.
- **Network**: *not* host-allowlisted. sandbox-exec can't pin egress to specific
  hosts the way nftables does, so native trades the network leash for
  zero-dependency on-host execution. Use the docker backend when you need the
  hard egress allowlist.

Extra read denials can be added via `FUGUE_DENY_READ` (space-separated absolute
subpaths).

## The launcher: `bin/fugue`

1. **Parse flags**, stopping at the agent name. Everything after the agent name
   is the agent's own argv.
2. **Resolve the profile** `profiles/<agent>.env`. An unknown agent fails with
   the list of known ones (exit `2`).
3. **Forward one credential.** It walks the profile's `API_KEY_VARS` and adds
   `-e <VAR>` for the first one present in the host env. None present → exit `2`.
4. **Assemble `docker run`** with the hardening flags:
   - `--rm -it` — the container and everything in it is destroyed on exit.
   - `--tmpfs /home/agent:...,uid=1001,gid=1001,mode=0700` — an ephemeral
     `$HOME`; all agent state, history, and transcripts land here and die.
   - `--security-opt no-new-privileges` and `--cap-drop ALL` — minimal
     privilege.
   - `--cap-add NET_ADMIN` (strict only) — just enough for the entrypoint to
     install the firewall before it drops privileges.
   - the per-agent `TELEMETRY_ENV` plus the broad `DISABLE_AUTOUPDATER` /
     `DO_NOT_TRACK` kill switches.
   - the workspace mount: `-v $(pwd):/workspace` normally, or a throwaway
     `--tmpfs /workspace` under `--ephemeral-workspace`.
5. **Run** the image's `fugue-entry`, passing `AGENT_CMD` and the agent argv.
   The agent's exit code is captured and re-emitted as fugue's own.

## The entrypoint: `src/fugue-entry`

The entrypoint starts as root (only because installing nftables needs
`NET_ADMIN`) and ends as the unprivileged `agent` user.

1. **Install the egress allowlist** (`--strict` only). It writes an `inet`
   table whose `output` chain is `policy drop`, then allows loopback,
   established/related, and DNS. For each host in `FUGUE_ALLOW_HOSTS` it
   resolves every A/AAAA record at startup and pins `daddr <ip> tcp dport 443
   accept`. If `nft` is missing, it **exits `3` before launching the agent** —
   an incognito promise it can't keep is worse than none.
2. **Arm the scrub trap.** On `EXIT` it shreds common stray-state locations
   (`/tmp`, `/var/tmp`, `*.log`, `.bash_history`). This is belt-and-suspenders:
   the container is `--rm`, so the tmpfs `$HOME` vanishes regardless.
   `--keep-on-error` skips the scrub when the agent failed, for debugging.
3. **Drop privileges and exec.** It re-execs the agent as `agent:agent`
   (uid/gid 1001) via `su-exec`, falling back to `setpriv`. The agent never
   runs privileged.

## The image: `Dockerfile`

A `node:22-bookworm-slim` base with only what a session needs:

- `nftables` — the egress allowlist installed by the entrypoint.
- `ca-certificates` — TLS to the model API.
- `dnsutils` — host resolution for the allowlist.
- `su-exec` — the privilege drop after firewall setup.
- `git` and `curl` — agents need them; the host's git hooks are **not** carried
  in.
- the agent CLIs (`@anthropic-ai/claude-code`, `@openai/codex`,
  `@google/gemini-cli`).
- an unprivileged `agent` user at uid/gid 1001, matching the tmpfs mount.

Design rule: nothing in the image may phone home on its own — no managed git
hooks, no telemetry collector, no audit log. The only outbound traffic a
session can make is to the model API, and only when `--strict` allows it.

The reasoning behind these choices lives in [adr/](adr/).

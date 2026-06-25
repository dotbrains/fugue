# Glossary

Terms used across fugue's code and docs.

**Agent.** One of the supported AI coding CLIs — `claude`, `codex`, `gemini` —
selected by name and described by a profile.

**Profile.** `profiles/<agent>.env`, the per-agent contract sourced by the
launcher: `AGENT_CMD`, `API_KEY_VARS`, `API_HOSTS`, and `TELEMETRY_ENV`. See
[configuration.md](configuration.md).

**Launcher.** `bin/fugue`, the host-side script that parses flags, resolves the
profile, forwards one credential, and assembles the `docker run`.

**Entrypoint.** `src/fugue-entry`, the container-side script that installs the
egress allowlist, arms the scrub trap, drops privileges, and execs the agent.

**No-trace session.** A run that leaves nothing behind — no transcript,
telemetry, phone-home, credentials, or caches — because the environment is made
incapable of persisting anything, not because the agent is trusted to behave.

**Strict mode (`--strict`).** The default. The entrypoint installs an nftables
egress allowlist and **fails closed** if it can't. Requires `NET_ADMIN`.

**Env-only mode (`--no-net-isolation`).** No firewall; only the telemetry
kill-env applies. Portable, but a weaker guarantee.

**Egress allowlist.** An nftables `output` chain with `policy drop` that permits
only DNS, loopback, established/related traffic, and the resolved model-API IPs
on TCP 443.

**Fail-closed.** The principle that when fugue can't enforce its guarantee
(e.g. it can't install the firewall under `--strict`), it refuses to run rather
than run unprotected.

**Scrub trap.** An `EXIT` trap in the entrypoint that shreds stray state
(`/tmp`, `*.log`, `.bash_history`). Belt-and-suspenders on top of the `--rm`
container and tmpfs `$HOME`.

**Ephemeral workspace (`--ephemeral-workspace`).** Mounts a throwaway tmpfs at
`/workspace` instead of the host working tree, so the agent's edits never touch
host files.

**tmpfs `$HOME`.** The agent's `$HOME` (`/home/agent`) is an in-memory tmpfs
mount that is destroyed when the container exits — where session state lands and
dies.

**Telemetry kill-env.** The `KEY=VALUE` pairs in a profile's `TELEMETRY_ENV`
(plus `DISABLE_AUTOUPDATER` / `DO_NOT_TRACK`) that disable an agent CLI's
telemetry, analytics, error reporting, and autoupdate.

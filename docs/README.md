# fugue Docs

fugue runs an AI coding agent — Claude, Codex, or Gemini — in a no-trace
session. The agent does the work and leaves **nothing behind**: no transcript,
no telemetry, no phone-home, no lingering credentials or caches. The guarantee
does not depend on the agent behaving; the *environment* is made incapable of
persisting anything.

These docs are for people running fugue and people changing it. Start here:

- [quickstart.md](quickstart.md): install Docker, build the image, run your
  first no-trace session.
- [installation.md](installation.md): install fugue and the developer
  toolchain (Docker, and the shell tools the quality gate uses).
- [usage.md](usage.md): the full `fugue` command-line reference — agents,
  flags, credentials, and exit codes.
- [configuration.md](configuration.md): the `profiles/<agent>.env` contract and
  the `FUGUE_*` / credential environment surface.
- [architecture.md](architecture.md): how a session is assembled and torn down,
  end to end — the launcher, the entrypoint, and the image.
- [security.md](security.md): trust boundaries and the `--strict` fail-closed
  contract, with the full [threat model](threat-model.md).
- [development.md](development.md): contributor workflow, the quality gate, and
  code organization.
- [troubleshooting.md](troubleshooting.md): common local and runtime failures.
- [glossary.md](glossary.md): project terms used across code and docs.
- [adr/](adr/): the architectural decisions behind fugue's design.

Supporting references:

- [threat-model.md](threat-model.md): what fugue does and does not defend
  against.
- [reference/](reference/): project meta — `CONTRIBUTING`, `SECURITY`.

## What fugue does

`bin/fugue` assembles a hardened `docker run` and hands control to
`src/fugue-entry` inside the container. A session is built so that every trace
surface is either ephemeral or firewalled:

| Trace surface                | Normally                                  | Under fugue                              |
| ---------------------------- | ----------------------------------------- | ---------------------------------------- |
| Session state / history      | `~/.claude`, `~/.codex`, `~/.gemini` persist | `$HOME` on **tmpfs**, gone on exit    |
| Telemetry / analytics        | enabled by default                        | killed per-agent via env                 |
| Autoupdate checks            | phone home on launch                      | disabled                                 |
| Network egress               | unrestricted                              | **nftables allowlist** → model API only  |
| Workspace artifacts / caches | linger on disk                            | container is `--rm`; optional tmpfs workspace |

In `--strict` mode fugue **fails closed**: if it cannot install the egress
firewall, it refuses to run rather than silently leak.

## Reading order for contributors

1. [quickstart.md](quickstart.md)
1. [glossary.md](glossary.md)
1. [architecture.md](architecture.md)
1. [usage.md](usage.md)
1. [configuration.md](configuration.md)
1. [adr/001-ephemeral-tmpfs-home.md](adr/001-ephemeral-tmpfs-home.md)
1. ADRs 002 and 003 as relevant to the change

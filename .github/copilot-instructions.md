# GitHub Copilot Instructions

The canonical agent guide for this repository is [`AGENTS.md`](../AGENTS.md) at
the repo root. Read it first; it applies to all coding agents.

Essentials:

- fugue runs AI agents in a no-trace session — do not weaken the security
  invariants documented in `AGENTS.md` (ephemeral `--rm` container, fail-closed
  `--strict` egress firewall, minimal `API_HOSTS`, credential isolation, least
  privilege).
- Every check is a `make` target; run `make check` before finishing.
- Shell is formatted by `shfmt -i 2 -ci` and must pass `shellcheck`.

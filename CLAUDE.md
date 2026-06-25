# Claude Instructions

Read [`AGENTS.md`](AGENTS.md) first. It is the canonical instruction file for
this repository and applies to Claude, Codex, Gemini, and any other coding
agent.

Key points:

- Run `make check` before considering a change ready — it's the same gate CI runs.
- Do not weaken fugue's no-trace security invariants (see the "Security
  invariants" section of `AGENTS.md`).
- Shell is formatted by `shfmt -i 2 -ci` and must pass `shellcheck`; run
  `make fmt`.

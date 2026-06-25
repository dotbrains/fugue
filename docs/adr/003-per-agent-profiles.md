# ADR-003: Per-agent env profiles as the extension point

**Status**: Accepted
**Owner**: maintainers
**Date**: 2026-06-25
**Supersedes**: —
**Superseded by**: —

## Context

fugue supports several agents (Claude, Codex, Gemini) that differ in three
mundane but security-relevant ways: the command to launch, the credential they
need, and the host(s) they must reach. They also each have their own telemetry
and autoupdate knobs. Hard-coding this per-agent knowledge into the launcher
would make adding an agent a code change in the hot path that assembles the
`docker run`, and would scatter security-relevant constants (which key, which
host) through control flow.

## Decision

Describe each agent declaratively in `profiles/<agent>.env`, a file the launcher
sources. A profile defines exactly four things:

- `AGENT_CMD` — the in-container command.
- `API_KEY_VARS` — the host credential variable(s); only the first present one
  is forwarded.
- `API_HOSTS` — the egress allowlist for strict mode.
- `TELEMETRY_ENV` — the telemetry/analytics/autoupdate kill switches.

Adding an agent is then: write a profile, add the CLI to the `Dockerfile`,
rebuild. The launcher stays generic; the profile-contract test in
`test/profiles.bats` validates every profile automatically.

## Consequences

**Positive**: the entire per-agent surface — credential, egress hole, telemetry
— is in one auditable file. Adding or auditing an agent needs no launcher
changes. The narrow contract is enforced by tests.

**Negative**: profiles are sourced shell, so a malformed profile is a shell bug,
not a parse error with a friendly message. The contract is convention plus the
bats test, not a schema.

**Neutral**: agent-specific quirks that don't fit the four fields (e.g. extra
mounts) would need a launcher change or a profile-format extension.

## Alternatives considered

- **Hard-code agents in `bin/fugue`.** Rejected: puts security constants in
  control flow and makes every new agent a launcher edit.
- **A structured config format (YAML/TOML) parsed by the launcher.** Rejected
  for now: it would pull a parser dependency into a dependency-free Bash
  launcher; sourced `.env` is zero-dependency and already the natural shape.

## Open items deferred

A richer profile schema (extra mounts, multiple egress ports, per-agent
resource limits) is not decided here.

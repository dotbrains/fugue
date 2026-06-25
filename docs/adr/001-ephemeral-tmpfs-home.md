# ADR-001: Ephemeral tmpfs `$HOME` on a `--rm` container

**Status**: Accepted
**Owner**: maintainers
**Date**: 2026-06-25
**Supersedes**: —
**Superseded by**: —

## Context

AI coding agents persist a lot by default: transcripts, conversation history,
memory files, caches, and credentials under `~/.claude`, `~/.codex`,
`~/.gemini`. fugue's promise is a *no-trace session* — the agent runs and leaves
nothing behind. The hard requirement is that the promise must not depend on the
agent (or its CLI) choosing to clean up after itself. A flag the agent can
ignore, or a cleanup step that runs only on the happy path, is not a guarantee.

## Decision

Run every session as a `docker run --rm` container whose `$HOME`
(`/home/agent`) is a **tmpfs** mount, owned by the unprivileged `agent` user
(uid/gid 1001, `mode=0700`). All agent state is forced into `$HOME`, which lives
only in memory and is destroyed when the container exits. The `--rm` flag
ensures the container layer itself is removed regardless of exit status. A
defense-in-depth scrub trap additionally shreds stray state outside `$HOME`
(`/tmp`, `*.log`, `.bash_history`).

## Consequences

**Positive**: persistence is structurally impossible, not merely disabled — the
filesystem that would hold a transcript ceases to exist on exit. No cleanup code
has to run correctly for the guarantee to hold.

**Negative**: nothing the agent produces in `$HOME` survives, including anything
a user might *want* to keep (e.g. session logs). Useful output must be written
to the mounted `/workspace`.

**Neutral**: `$HOME` size is bounded by tmpfs/RAM rather than disk; large caches
press on memory instead.

## Alternatives considered

- **Bind-mount a host dir and `rm -rf` it on exit.** Rejected: depends on the
  cleanup running, and on it running even when the process is killed.
- **Trust the agent's own `--no-telemetry` / cleanup flags.** Rejected: that is
  exactly the "depends on the agent behaving" failure mode fugue exists to
  avoid.

## Open items deferred

Opt-in, explicit export of selected artifacts out of an otherwise-ephemeral
session (a "keep just this file" path) is not decided here.

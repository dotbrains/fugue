# Architecture Decision Records

Decisions that shape fugue, captured in the MADR format. ADRs are
append-only — when a decision changes, supersede the old ADR with a new one
rather than editing in place.

These ADRs capture the choices that make fugue what it is: an *amnesiac*
sandbox whose guarantee comes from the environment, not the agent's good
behavior.

## Index

| #                                          | Title                                      | Status   |
| ------------------------------------------ | ------------------------------------------ | -------- |
| [001](001-ephemeral-tmpfs-home.md)         | Ephemeral tmpfs `$HOME` on a `--rm` container | Accepted |
| [002](002-fail-closed-egress-allowlist.md) | Fail-closed nftables egress allowlist      | Accepted |
| [003](003-per-agent-profiles.md)           | Per-agent env profiles as the extension point | Accepted |

## How to write a new ADR

1. Copy [`template.md`](template.md) to `NNN-short-title.md` where NNN is the
   next sequential number.
1. Fill in the sections. ADRs should be 1-2 pages — decision-focused, not
   exhaustive.
1. Update this index.
1. Open a PR. A maintainer is the approver.
1. Status flows: Proposed → Accepted → (Deprecated | Superseded by NNN).

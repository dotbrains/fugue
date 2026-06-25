# fugue — threat model

fugue gives an AI agent a *no-trace local session*. Be precise about what that
means so it isn't mistaken for anonymity it can't provide.

## What fugue defends against

| Threat | Mechanism |
| --- | --- |
| Agent writes a transcript / history / memory you didn't want kept | `$HOME` is tmpfs; container is `--rm` — nothing survives exit |
| Agent CLI phones home (telemetry, analytics, error reports, update pings) | per-agent kill-env + egress `policy drop` |
| Agent exfiltrates code to a non-API host (prompt injection, rogue tool) | nftables allowlist — only the model API IP:443 is reachable |
| Stray secrets/caches left on disk after a session | scrub trap + ephemeral filesystem |
| Credential bleed between agents | only the matching `API_KEY_VARS` is forwarded per run |
| Privilege escalation from inside the agent | `--cap-drop ALL`, `no-new-privileges`, privilege dropped to uid 1001 after firewall setup |

## What fugue does NOT defend against

- **Provider-side logging.** Anthropic/OpenAI/Google still receive and may log
  the requests you make with your own API key. fugue removes *local* trace and
  *lateral* egress, not the authenticated API call itself.
- **A malicious base image.** Trust comes from the published, reproducible
  `ghcr.io/dotbrains/fugue` build. Run your own build if you don't trust ours.
- **Host-level observation.** If something on the host is watching docker events
  or the model API socket, fugue doesn't hide the container's existence.
- **DNS-based correlation.** The startup resolution of `API_HOSTS` is a visible
  DNS lookup. fugue isn't a Tor circuit; it's an amnesiac sandbox.
- **IP rotation mid-session.** The allowlist is pinned at start; if the API's IP
  set changes during a long session, connectivity may drop (fail-closed by design).

## `--strict` fail-closed contract

In `--strict` mode, if nftables is unavailable or `NET_ADMIN` is missing,
`fugue-entry` exits non-zero **before** launching the agent. An incognito promise
that can't be enforced is worse than an honest refusal.

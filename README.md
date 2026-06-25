# fugue

> Incognito mode for AI coding agents — Claude, Codex, Gemini.

A *fugue state* is dissociative amnesia: you act, then keep no memory of having
acted. `fugue` does that to an AI agent. The agent runs, does the work, and
leaves **nothing behind** — no transcript, no telemetry, no phone-home, no
lingering credentials or caches.

The guarantee does not rely on the agent behaving. The **environment is made
incapable of persisting anything**:

| Trace surface | Normally | Under fugue |
| --- | --- | --- |
| Session state / history | `~/.claude`, `~/.codex`, `~/.gemini` persist | `$HOME` on **tmpfs**, gone on exit |
| Telemetry / analytics / error reports | enabled by default | killed per-agent via env |
| Autoupdate checks | phone home on launch | disabled |
| Network egress | unrestricted | **nftables allowlist** → model API only |
| Workspace artifacts / caches | linger on disk | container is `--rm`; optional tmpfs workspace |

If the agent *tries* to write a transcript or hit an analytics endpoint under
`--strict`, it physically can't — the firewall drops it and the filesystem
evaporates.

## Usage

```sh
fugue claude  "refactor the auth module"
fugue codex   "explain this stack trace"
fugue gemini  "scan this repo for hardcoded secrets"

# env-only mode (no firewall; portable, weaker guarantee)
fugue --no-net-isolation claude "..."

# don't even touch the host working tree — edit a throwaway copy
fugue --ephemeral-workspace gemini "try a risky migration"
```

Credentials are read from your host env (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`,
`GEMINI_API_KEY`/`GOOGLE_API_KEY`) and forwarded **only** to the matching agent —
never written to disk, never shared across agents.

## How it works

`bin/fugue` assembles a hardened `docker run`:

- `--tmpfs /home/agent` — ephemeral `$HOME`; all agent state lands here and dies on exit
- `--cap-drop ALL` + `--security-opt no-new-privileges` — minimal privilege
- `--cap-add NET_ADMIN` (strict only) — just enough for the entrypoint to install the egress allowlist, then privileges are dropped to the `agent` user
- per-agent telemetry kill-env from `profiles/<agent>.env`
- `--rm` — the container and everything in it is destroyed when the agent exits

Inside, `src/fugue-entry` resolves the profile's `API_HOSTS`, pins their IPs into
an nftables `policy drop` allowlist (DNS + loopback + established only), wires a
scrub trap, drops privileges, and execs the agent.

In `--strict` mode fugue **fails closed**: if it can't install the firewall, it
refuses to run rather than silently leak.

## Adding an agent

Drop a `profiles/<name>.env` defining `AGENT_CMD`, `API_KEY_VARS`, `API_HOSTS`,
and the `TELEMETRY_ENV` array. Add the CLI to the `Dockerfile`. That's it.

## Limitations

- The allowlist pins IPs at session start; agents using a host that rotates IPs
  mid-session may lose connectivity (re-run, or widen the profile).
- `--strict` needs `NET_ADMIN`; on hosts that forbid it, use `--no-net-isolation`
  (telemetry env still applies, but there's no hard network leash).
- fugue hides the *session*, not the API call itself — Anthropic/OpenAI/Google
  still see the requests you authenticate. It removes local trace and lateral
  egress, not provider-side logging.

See [docs/threat-model.md](docs/threat-model.md) for what fugue does and does not
defend against.

## License

[PolyForm Shield 1.0.0](LICENSE). Published at `ghcr.io/dotbrains/fugue`.

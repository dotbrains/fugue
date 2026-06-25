# Usage

```text
fugue [flags] <agent> [agent args...]
```

`fugue` launches one of the known agents in a no-trace container. Flags come
before the agent name; everything after the agent name is passed through to the
agent unchanged.

## Agents

The agent name must match a profile in [`profiles/`](../profiles). The shipped
agents are:

| Agent    | Profile               | Credential(s)                       | API host                          |
| -------- | --------------------- | ----------------------------------- | --------------------------------- |
| `claude` | `profiles/claude.env` | `ANTHROPIC_API_KEY`                 | `api.anthropic.com`               |
| `codex`  | `profiles/codex.env`  | `OPENAI_API_KEY`                    | `api.openai.com`                  |
| `gemini` | `profiles/gemini.env` | `GEMINI_API_KEY` or `GOOGLE_API_KEY`| `generativelanguage.googleapis.com` |

Adding an agent is a matter of dropping in a profile and adding the CLI to the
image — see [configuration.md](configuration.md).

## Flags

| Flag                    | Default | Effect                                                                              |
| ----------------------- | ------- | ----------------------------------------------------------------------------------- |
| `--strict`              | on      | Hard egress allowlist via nftables. Needs `NET_ADMIN`; **fails closed** if it can't install. |
| `--no-net-isolation`    | off     | Env-only mode: no firewall. Telemetry kill-env still applies. Portable, weaker.     |
| `--ephemeral-workspace` | off     | Mount a throwaway tmpfs at `/workspace` instead of your cwd; host files are untouched. |
| `--keep-on-error`       | off     | If the agent exits non-zero, skip the in-container scrub (debugging aid). The container is still `--rm`. |
| `--image <ref>`         | `ghcr.io/dotbrains/fugue:latest` | Use a specific image instead of the default.                       |
| `-h`, `--help`          | —       | Print usage and exit.                                                                |

## Examples

```sh
# default: strict egress, working tree mounted read-write
fugue claude "refactor the auth module"

# pass flags through to the agent after the agent name
fugue codex "explain this stack trace" --model o4-mini

# env-only mode on a host that won't grant NET_ADMIN
fugue --no-net-isolation gemini "summarize this repo"

# risky migration against a disposable copy of the working tree
fugue --ephemeral-workspace claude "rewrite the build system"

# pin a specific image build
fugue --image ghcr.io/dotbrains/fugue:sha-abc123 codex "..."
```

## Credentials

fugue forwards exactly one credential — the one named by the agent's
`API_KEY_VARS` — and only if it is set in your environment. If none is set, the
launcher exits before starting the container:

```text
fugue: no API key in env for claude (expected one of: ANTHROPIC_API_KEY)
```

Keys are never written to disk and never shared between agents.

## Exit codes

| Code  | Meaning                                                                 |
| ----- | ---------------------------------------------------------------------- |
| `0`   | The agent ran and exited successfully.                                  |
| `2`   | Launcher usage error (unknown agent or flag, missing credential, no Docker). |
| `3`   | `--strict` could not install the egress allowlist (e.g. no `nft` / `NET_ADMIN`); fugue refused to run. |
| other | The agent's own exit code, propagated unchanged.                        |

See [troubleshooting.md](troubleshooting.md) for what to do about each.

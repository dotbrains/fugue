# Configuration

fugue has two configuration surfaces: the **agent profiles** that define how
each agent is launched, and the **environment variables** the launcher and the
container honor.

## Agent profiles

Each agent is described by one file, `profiles/<agent>.env`, sourced by
`bin/fugue`. A profile must define four things:

| Variable        | Type            | Purpose                                                                 |
| --------------- | --------------- | ----------------------------------------------------------------------- |
| `AGENT_CMD`     | string          | The command run inside the container (e.g. `claude`).                   |
| `API_KEY_VARS`  | space-separated | The host env var(s) holding the credential. The first one that is set is forwarded. |
| `API_HOSTS`     | space-separated | The hosts egress is allowed to reach in `--strict` (TCP 443). Keep minimal — every host is a hole. |
| `TELEMETRY_ENV` | bash array      | `KEY=VALUE` pairs injected to kill telemetry, analytics, error reporting, and autoupdate. |

Example (`profiles/claude.env`):

```sh
AGENT_CMD="claude"
API_KEY_VARS="ANTHROPIC_API_KEY"
API_HOSTS="api.anthropic.com"
TELEMETRY_ENV=(
  "CLAUDE_CODE_ENABLE_TELEMETRY=0"
  "DISABLE_TELEMETRY=1"
  "DISABLE_ERROR_REPORTING=1"
  "DISABLE_BUG_COMMAND=1"
  "DISABLE_AUTOUPDATER=1"
  "DISABLE_NON_ESSENTIAL_MODEL_CALLS=1"
)
```

The first two lines of every profile carry `# shellcheck shell=bash` and a
`# shellcheck disable=SC2034` directive — the variables are consumed by the
launcher that sources the file, not within the file itself.

### Adding an agent

1. Create `profiles/<name>.env` with the four fields above.
2. Add the agent's CLI to [`package.json`](../package.json) `dependencies` (at a
   pinned version) and regenerate the lockfile:

   ```sh
   npm install --package-lock-only --omit=dev
   ```

3. Rebuild the image (`make check:build`).
4. Add a row to the agent tables in [usage.md](usage.md). The contract test
   already covers every `profiles/*.env`, so no test change is needed for a
   standard agent.

## Environment variables

### Read by the launcher (host side)

| Variable                                                  | Effect                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------ |
| `FUGUE_IMAGE`                                            | Override the default image (`ghcr.io/dotbrains/fugue:latest`). `--image` takes precedence. |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `GEMINI_API_KEY` / `GOOGLE_API_KEY` | The credential forwarded to the matching agent. |

### Set inside the container

These are injected by `bin/fugue` and consumed by `src/fugue-entry`; you do not
normally set them yourself.

| Variable               | Set when                | Meaning                                                       |
| ---------------------- | ----------------------- | ------------------------------------------------------------ |
| `FUGUE`                | always (`1`)            | Marks the process as running under fugue.                     |
| `HOME`                 | always (`/home/agent`)  | Points `$HOME` at the tmpfs mount.                            |
| `FUGUE_STRICT`         | always (`1` or `0`)     | Whether the entrypoint installs the egress allowlist.         |
| `FUGUE_ALLOW_HOSTS`    | `--strict`              | The `API_HOSTS` the entrypoint resolves and pins into the allowlist. |
| `FUGUE_EPHEMERAL_WS`   | `--ephemeral-workspace` | Signals the throwaway tmpfs workspace.                        |
| `FUGUE_KEEP_ON_ERROR`  | `--keep-on-error`       | Skip the scrub trap when the agent exits non-zero.           |
| `DISABLE_AUTOUPDATER`, `DO_NOT_TRACK` | always   | Broad autoupdate/telemetry kill switches, on top of the per-agent `TELEMETRY_ENV`. |

See [architecture.md](architecture.md) for how these flow from the launcher
into the container.

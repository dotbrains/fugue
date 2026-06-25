# Configuration

fugue has two configuration surfaces: the **agent profiles** that define how
each agent is launched, and the **environment variables** the launcher and the
container honor.

## Agent profiles

Each agent is described by one file, `profiles/<agent>.env`, sourced by
`bin/fugue`. A profile defines five things:

| Variable        | Type            | Purpose                                                                 |
| --------------- | --------------- | ----------------------------------------------------------------------- |
| `AGENT_CMD`     | string          | The command that runs the agent (e.g. `claude`, `cursor-agent`).        |
| `API_KEY_VARS`  | space-separated | The host env var(s) holding the credential. The first one that is set is forwarded. |
| `API_HOSTS`     | space-separated | The hosts egress is allowed to reach in docker `--strict` (TCP 443). Keep minimal — every host is a hole. |
| `TELEMETRY_ENV` | bash array      | `KEY=VALUE` pairs injected to kill telemetry, analytics, error reporting, and autoupdate. |
| `BACKENDS`      | space-separated | Which backends the agent runs under: `docker` (baked into the image) and/or `native` (host CLI under sandbox-exec). |

Example (`profiles/claude.env`):

```sh
AGENT_CMD="claude"
API_KEY_VARS="ANTHROPIC_API_KEY"
API_HOSTS="api.anthropic.com"
BACKENDS="docker native"
TELEMETRY_ENV=(
  "CLAUDE_CODE_ENABLE_TELEMETRY=0"
  "DISABLE_TELEMETRY=1"
  "DISABLE_ERROR_REPORTING=1"
  "DISABLE_BUG_COMMAND=1"
  "DISABLE_AUTOUPDATER=1"
  "DISABLE_NON_ESSENTIAL_MODEL_CALLS=1"
)
```

Most agents ship `BACKENDS="native"`: their CLI isn't baked into the image, so
they run from your host under `sandbox-exec`. The three first-class agents
(`claude`, `codex`, `gemini`) are also in the image, so they add `docker`.

The first two lines of every profile carry `# shellcheck shell=bash` and a
`# shellcheck disable=SC2034` directive — the variables are consumed by the
launcher that sources the file, not within the file itself.

### Adding an agent

The fast path is native-only (the agent runs from your host). Steps 1–2 are all
that's required; do 3–4 only to also bake the agent into the docker image.

1. Create `profiles/<name>.env` with the five fields above and
   `BACKENDS="native"`. The prompt at
   [`prompts/new-agent-profile.md`](../prompts/new-agent-profile.md) turns an
   agent's docs into a profile — **verify the result**, since wrong `API_HOSTS`
   break the strict allowlist.
1. Add a row to the agent table in [usage.md](usage.md). The contract test
   already covers every `profiles/*.env`, so no test change is needed.
1. (docker support) Add the agent's CLI to [`package.json`](../package.json)
   `dependencies` (pinned), regenerate the lockfile, and set
   `BACKENDS="docker native"`:

   ```sh
   npm install --package-lock-only --omit=dev
   ```

1. (docker support) Rebuild the image (`make check:build`). Only npm-installable
   CLIs fit the node image; pip/binary agents stay native-only.

## Environment variables

### Read by the launcher (host side)

| Variable                                                  | Effect                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------ |
| `FUGUE_BACKEND`                                          | Default backend (`docker` or `native`). `--backend` takes precedence. |
| `FUGUE_IMAGE`                                            | docker: override the default image (`ghcr.io/dotbrains/fugue:latest`). `--image` takes precedence. |
| `FUGUE_DENY_READ`                                        | native: space-separated absolute subpaths to additionally deny reads of, on top of the built-in secret denylist. |
| `<agent credential vars>`                                | The credential forwarded to the matching agent (per the profile's `API_KEY_VARS`). |

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

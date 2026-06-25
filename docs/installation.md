# Installation

fugue is a Bash launcher (`bin/fugue`) plus a container image. There is nothing
to compile; you need Docker to run sessions, and a handful of shell tools only
if you intend to run the quality gate.

## Runtime requirements

| Requirement | Why                                                      |
| ----------- | -------------------------------------------------------- |
| Docker      | fugue runs every session as a `docker run --rm` container |
| Bash 4+     | the launcher uses arrays and `${!var}` indirection      |
| `NET_ADMIN` capability | only for `--strict` (the default) — the entrypoint installs an nftables egress allowlist |

`--strict` needs the container to hold `NET_ADMIN`. On hosts that forbid it,
run with `--no-net-isolation` (telemetry env still applies, but there is no
hard network leash). See [security.md](security.md) for the trade-off.

## Install the launcher

Clone the repository and put `bin/` on your `PATH`:

```sh
git clone https://github.com/dotbrains/fugue.git
cd fugue
export PATH="$PWD/bin:$PATH"   # add to your shell profile to persist
```

## Get the image

The launcher defaults to `ghcr.io/dotbrains/fugue:latest`. Either pull it:

```sh
docker pull ghcr.io/dotbrains/fugue:latest
```

…or build it from source:

```sh
make check:build
```

Override the image per run with `--image <ref>` or globally with the
`FUGUE_IMAGE` environment variable. See [configuration.md](configuration.md).

## Credentials

fugue reads API keys from your host environment and forwards **only** the one
the chosen agent needs:

```sh
export ANTHROPIC_API_KEY=sk-...   # claude
export OPENAI_API_KEY=sk-...      # codex
export GEMINI_API_KEY=...         # gemini (GOOGLE_API_KEY also accepted)
```

Keys are passed to the container as environment variables for that single run;
they are never written to disk and never shared across agents.

## Developer toolchain (optional)

The quality gate (`make check`) uses these tools. Install only what you plan to
run locally — CI installs them itself.

| Tool                                                | Purpose                          | macOS (Homebrew)        |
| --------------------------------------------------- | -------------------------------- | ----------------------- |
| [shellcheck](https://www.shellcheck.net/)           | shell linting                    | `brew install shellcheck` |
| [shfmt](https://github.com/mvdan/sh)                | shell formatting                 | `brew install shfmt`    |
| [hadolint](https://github.com/hadolint/hadolint)    | Dockerfile linting               | `brew install hadolint` |
| [bats](https://github.com/bats-core/bats-core)      | shell test runner                | `brew install bats-core` |
| [actionlint](https://github.com/rhysd/actionlint)   | workflow YAML linting            | `brew install actionlint` |
| [gitleaks](https://github.com/gitleaks/gitleaks)    | secret scanning                  | `brew install gitleaks` |

See [development.md](development.md) for how each plugs into the gate.

# Development

fugue is small on purpose: a Bash launcher, a Bash entrypoint, three agent
profiles, and a Dockerfile. The quality gate keeps them honest.

## Code organization

```text
bin/fugue          # host-side launcher: flags, profile, backend dispatch
bin/lib/fugue-*    # backend implementations (docker run / sandbox-exec)
src/fugue-entry    # container-side entrypoint: firewall, scrub, privilege drop
profiles/*.env     # per-agent contract (AGENT_CMD, API_KEY_VARS, API_HOSTS, TELEMETRY_ENV)
Dockerfile         # the minimal no-trace runtime image
test/*.bats        # launcher and profile-contract tests
Makefile           # the quality gate (`make check`)
docs/              # these docs
```

## The quality gate

`make check` runs every gate CI runs, in the same order. Run it before opening a
PR.

```sh
make check
```

Each gate is also a standalone target:

| Target                  | Tool       | What it checks                                         |
| ----------------------- | ---------- | ----------------------------------------------------- |
| `make check:format`     | shfmt      | shell sources are formatted (`-i 2 -ci`)              |
| `make check:lint`       | shellcheck | the scripts (`-x`) and the profiles                  |
| `make check:dockerfile` | hadolint   | the Dockerfile (config in `.hadolint.yaml`)          |
| `make check:tests`      | bats       | `test/*.bats`                                         |
| `make check:markdown`   | markdownlint-cli2 | Markdown docs                                  |
| `make check:mermaid`    | mmdc       | Mermaid diagrams in docs                             |
| `make check:build`      | docker     | the image builds                                     |
| `make check:site`       | npm        | type-check and build the docs site                   |
| `make check:actions`    | actionlint | the workflow YAML (config in `.github/actionlint.yaml`) |
| `make check:secrets`    | gitleaks   | no secrets are committed                             |

`make fmt` auto-formats the shell sources. `make help` lists everything.

Tool binaries are overridable, which is handy if you keep them outside `PATH`:

```sh
make check:format SHFMT=/path/to/shfmt
```

## Conventions

- **Shell style** is whatever `shfmt -i 2 -ci` produces — two-space indent,
  indented `case` arms. Run `make fmt` rather than hand-aligning.
- **shellcheck must be clean.** The repo runs with `external-sources=true`
  (`.shellcheckrc`) so the sourced profile is analyzed. Prefer fixing a finding
  over a blanket disable; where a disable is genuinely correct (e.g. the SC2054
  false positives on comma-bearing `--tmpfs` specs, or the SC2034 on profile
  variables consumed by the sourcing script), scope it narrowly and comment why.
- **The Dockerfile floats versions** in the scaffold and pins them at release;
  `.hadolint.yaml` ignores the version-pin rules accordingly.
- **Tests need no Docker.** The bats suite exercises only the launcher paths
  that resolve before `docker run` (help, bad flags, unknown agent, the profile
  contract), so it's fast and hermetic.

## CI

Three workflows cover validation, scheduled security scanning, and releases:

- [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) — one `quality
  gate` job for PRs and pushes. It installs the toolchain once, then runs the
  same `make check:*` targets used locally, including workflow lint, current-tree
  secret scanning, the image build, and the site build.
- [`.github/workflows/security.yml`](../.github/workflows/security.yml) — a
  weekly and manual full-history gitleaks scan.
- [`.github/workflows/release.yml`](../.github/workflows/release.yml) — builds
  and publishes the multi-arch image to GHCR on a `v*` tag. See
  [releasing.md](releasing.md).

All run on the org's self-hosted Blacksmith runners. Pinned versions (agent
CLIs, base image, action versions) are kept current by
[Dependabot](../.github/dependabot.yml).

## Adding an agent

See [configuration.md](configuration.md#adding-an-agent). The profile-contract
test in `test/profiles.bats` automatically covers any new `profiles/*.env`.

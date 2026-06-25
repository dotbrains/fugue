# Contributing to fugue

Thanks for your interest in contributing to fugue! This guide covers everything
you need to get started.

## Getting Started

1. **Fork** the repository on GitHub.

2. **Clone** your fork locally:

   ```sh
   git clone https://github.com/<your-username>/fugue.git
   cd fugue
   ```

3. **Install the toolchain** you plan to run locally — see
   [installation.md](../installation.md#developer-toolchain-optional). Docker is
   required to build the image and run sessions.

4. **Put the launcher on your PATH** for local testing:

   ```sh
   export PATH="$PWD/bin:$PATH"
   ```

5. **Create a branch** for your work:

   ```sh
   git checkout -b fix/description-of-change
   ```

## Branch Naming

Use descriptive branch names with a category prefix:

- `fix/` — Bug fixes
- `feat/` — New features
- `docs/` — Documentation changes
- `refactor/` — Code refactoring
- `test/` — Test additions or fixes
- `ci/` — CI and tooling changes

## Build & Test Commands

```sh
make check            # the full quality gate (what CI runs)
make fmt              # auto-format shell sources with shfmt
make check:format     # verify formatting
make check:lint       # shellcheck
make check:dockerfile # hadolint
make check:tests      # bats
make check:build      # build the image
make check:markdown   # markdownlint
make check:mermaid    # validate mermaid diagrams
make check:actions    # actionlint
make check:secrets    # gitleaks
```

Always run `make check` before submitting a PR. To run the gate automatically
on every commit, install the pre-commit hooks:

```sh
pip install pre-commit   # or: brew install pre-commit
pre-commit install
pre-commit install --hook-type pre-push   # for the slower image-build gate
```

## Conventions

- **Shell** is formatted by `shfmt -i 2 -ci` and must pass `shellcheck`. Run
  `make fmt`; don't hand-align. Scope any shellcheck disable narrowly and
  comment why.
- **Dockerfile** must pass `hadolint`. Versions float in the scaffold and are
  pinned at release.
- **Docs** must pass `markdownlint`, and every `mermaid` block must parse.
- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org/):
  `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `ci:`, `chore:`. Keep the
  first line ≤ 72 characters, imperative mood, summarizing the *why*.

See [development.md](../development.md) for how the gate is wired and how the
code is organized.

## Pull Requests

1. Make sure `make check` is green.
2. Push your branch and open a PR against `main`.
3. A maintainer reviews and approves.
4. Keep PRs focused — one logical change per PR.

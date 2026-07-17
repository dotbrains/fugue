#!/usr/bin/env bats

setup() {
  [[ "$(uname -s)" == "Darwin" ]] || skip "native backend requires macOS"
  command -v sandbox-exec >/dev/null || skip "sandbox-exec not available"
  command -v git >/dev/null || skip "git not available"

  FUGUE="${BATS_TEST_DIRNAME}/../bin/fugue"
  TMP="$(mktemp -d)"
  BIN="$TMP/bin"
  REPO="$TMP/repo"
  LINKED="$TMP/linked"
  mkdir -p "$BIN" "$REPO"

  git -C "$REPO" init -q
  git -C "$REPO" config user.email "fugue@example.invalid"
  git -C "$REPO" config user.name "fugue test"
  printf 'base\n' >"$REPO/file.txt"
  git -C "$REPO" add file.txt
  git -C "$REPO" commit -q -m "initial"
  git -C "$REPO" branch feature
  git -C "$REPO" worktree add -q "$LINKED" feature

  cat >"$BIN/claude" <<'EOF'
#!/usr/bin/env bash
git branch sandbox-branch && echo "BRANCH_CREATED"
EOF
  chmod +x "$BIN/claude"
}

teardown() {
  [[ -n "${TMP:-}" ]] && rm -rf "$TMP"
  return 0
}

@test "native: linked git worktrees can write shared git metadata" {
  run bash -c '
    cd "$1" || exit 99
    PATH="$2:$PATH" ANTHROPIC_API_KEY=sk-test "$3" --backend native claude
  ' _ "$LINKED" "$BIN" "$FUGUE"

  [ "$status" -eq 0 ]
  [[ "$output" == *"BRANCH_CREATED"* ]]
  git -C "$REPO" rev-parse --verify sandbox-branch >/dev/null
}

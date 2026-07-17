#!/usr/bin/env bats

setup() {
  [[ "$(uname -s)" == "Darwin" ]] || skip "native backend requires macOS"
  command -v sandbox-exec >/dev/null || skip "sandbox-exec not available"

  FUGUE="${BATS_TEST_DIRNAME}/../bin/fugue"
  TMP="$(mktemp -d)"
  BIN="$TMP/bin"
  WORK="$TMP/work"
  mkdir -p "$BIN" "$WORK"
}

teardown() {
  [[ -n "${TMP:-}" ]] && rm -rf "$TMP"
  return 0
}

@test "native: --env-pass forwards selected host variables only" {
  cat >"$BIN/claude" <<'EOF'
#!/usr/bin/env bash
[[ "${FUGUE_TEST_ALLOWED:-}" == "allowed" ]] && echo "SAW_ALLOWED"
[[ -z "${FUGUE_TEST_BLOCKED:-}" ]] && echo "NO_BLOCKED"
EOF
  chmod +x "$BIN/claude"

  run bash -c '
    cd "$1" || exit 99
    PATH="$2:$PATH" ANTHROPIC_API_KEY=sk-test FUGUE_TEST_ALLOWED=allowed FUGUE_TEST_BLOCKED=blocked \
      "$3" --backend native --env-pass FUGUE_TEST_ALLOWED claude
  ' _ "$WORK" "$BIN" "$FUGUE"

  [ "$status" -eq 0 ]
  [[ "$output" == *"SAW_ALLOWED"* ]]
  [[ "$output" == *"NO_BLOCKED"* ]]
}

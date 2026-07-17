#!/usr/bin/env bats

setup() {
  [[ "$(uname -s)" == "Darwin" ]] || skip "native backend requires macOS"
  command -v sandbox-exec >/dev/null || skip "sandbox-exec not available"

  FUGUE="${BATS_TEST_DIRNAME}/../bin/fugue"
  TMP="$(mktemp -d)"
  BIN="$TMP/bin"
  INVOCATION="$TMP/invocation"
  SELECTED="$TMP/selected"
  mkdir -p "$BIN" "$INVOCATION" "$SELECTED"
}

teardown() {
  [[ -n "${TMP:-}" ]] && rm -rf "$TMP"
  return 0
}

@test "native: --workdir selects the sandbox workspace" {
  local selected_real
  selected_real="$(cd "$SELECTED" && pwd -P)"
  cat >"$BIN/claude" <<EOF
#!/usr/bin/env bash
[[ "\$(pwd -P)" == "$selected_real" ]] && echo "IN_SELECTED" || pwd -P
(printf ok > "$SELECTED/wrote" 2>/dev/null && echo "WROTE_SELECTED") || echo "NO_SELECTED"
EOF
  chmod +x "$BIN/claude"

  run bash -c '
    cd "$1" || exit 99
    PATH="$2:$PATH" ANTHROPIC_API_KEY=sk-test "$3" --backend native --workdir "$4" claude
  ' _ "$INVOCATION" "$BIN" "$FUGUE" "$SELECTED"

  [ "$status" -eq 0 ]
  [[ "$output" == *"IN_SELECTED"* ]]
  [[ "$output" == *"WROTE_SELECTED"* ]]
  [[ "$(cat "$SELECTED/wrote")" == "ok" ]]
}

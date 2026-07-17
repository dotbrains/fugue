#!/usr/bin/env bats

setup() {
  [[ "$(uname -s)" == "Darwin" ]] || skip "native backend requires macOS"
  command -v sandbox-exec >/dev/null || skip "sandbox-exec not available"

  FUGUE="${BATS_TEST_DIRNAME}/../bin/fugue"
  TMP="$(mktemp -d)"
  WORK="$TMP/work"
  mkdir -p "$WORK"
}

teardown() {
  [[ -n "${TMP:-}" ]] && rm -rf "$TMP"
  return 0
}

@test "native: --print-native-profile renders policy without agent credentials" {
  run bash -c '
    cd "$1" || exit 99
    PATH="/usr/bin:/bin" "$2" --backend native --print-native-profile claude
  ' _ "$WORK" "$FUGUE"

  [ "$status" -eq 0 ]
  [[ "$output" == *"(version 1)"* ]]
  [[ "$output" == *"(allow file-write* (subpath \"$WORK\"))"* ]]
}

@test "--print-native-profile is native-only" {
  run bash -c '
    cd "$1" || exit 99
    "$2" --backend docker --print-native-profile claude
  ' _ "$WORK" "$FUGUE"

  [ "$status" -eq 2 ]
  [[ "$output" == *"--print-native-profile is only supported with --backend native"* ]]
}

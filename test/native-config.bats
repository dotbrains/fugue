#!/usr/bin/env bats

setup() {
  [[ "$(uname -s)" == "Darwin" ]] || skip "native backend requires macOS"
  command -v sandbox-exec >/dev/null || skip "sandbox-exec not available"

  FUGUE="${BATS_TEST_DIRNAME}/../bin/fugue"
  TMP="$(mktemp -d)"
  BIN="$TMP/bin"
  WORK="$TMP/work"
  SECRET="$TMP/secret"
  mkdir -p "$BIN" "$WORK" "$SECRET"
  printf 'top-secret\n' >"$SECRET/key"
}

teardown() {
  [[ -n "${TMP:-}" ]] && rm -rf "$TMP"
  return 0
}

@test "native: trusted .fugue appends a relative profile" {
  local secret_real
  secret_real="$(cd "$SECRET" && pwd -P)"
  printf '(deny file-read* (subpath "%s"))\n' "$secret_real" >"$WORK/deny-secret.sb"
  printf 'append-profile=deny-secret.sb\n' >"$WORK/.fugue"
  cat >"$BIN/claude" <<EOF
#!/usr/bin/env bash
(cat "$SECRET/key" >/dev/null 2>&1 && echo "READ_SECRET") || echo "NO_SECRET"
EOF
  chmod +x "$BIN/claude"

  run bash -c '
    cd "$1" || exit 99
    PATH="$2:$PATH" ANTHROPIC_API_KEY=sk-test "$3" --backend native --trust-workdir-config claude
  ' _ "$WORK" "$BIN" "$FUGUE"

  [ "$status" -eq 0 ]
  [[ "$output" == *"NO_SECRET"* ]]
}

@test "native: trusted .fugue is protected from sandbox writes" {
  printf 'ro-dir=.\n' >"$WORK/.fugue"
  cat >"$BIN/claude" <<EOF
#!/usr/bin/env bash
(printf hacked > "$WORK/.fugue" 2>/dev/null && echo "WROTE_CONFIG") || echo "NO_CONFIG_WRITE"
EOF
  chmod +x "$BIN/claude"

  run bash -c '
    cd "$1" || exit 99
    PATH="$2:$PATH" ANTHROPIC_API_KEY=sk-test "$3" --backend native --trust-workdir-config claude
  ' _ "$WORK" "$BIN" "$FUGUE"

  [ "$status" -eq 0 ]
  [[ "$output" == *"NO_CONFIG_WRITE"* ]]
  [[ "$(cat "$WORK/.fugue")" != "hacked" ]]
}

@test "trusted workdir config is native-only" {
  run bash -c '
    cd "$1" || exit 99
    ANTHROPIC_API_KEY=sk-test "$2" --backend docker --trust-workdir-config claude
  ' _ "$WORK" "$FUGUE"

  [ "$status" -eq 2 ]
  [[ "$output" == *"--trust-workdir-config is only supported with --backend native"* ]]
}

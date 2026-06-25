#!/usr/bin/env bats
#
# Native-backend (macOS sandbox-exec) behavior. These exercise the real kernel
# sandbox, so they are gated to macOS and skip everywhere else (e.g. Linux CI).
# They run a stub agent on PATH under the `claude` profile and assert containment
# from inside the sandboxed process.

setup() {
  [[ "$(uname -s)" == "Darwin" ]] || skip "native backend requires macOS"
  command -v sandbox-exec >/dev/null || skip "sandbox-exec not available"

  FUGUE="${BATS_TEST_DIRNAME}/../bin/fugue"
  TMP="$(mktemp -d)"
  BIN="$TMP/bin"
  WORK="$TMP/work"
  SECRET="$TMP/secret"
  mkdir -p "$BIN" "$WORK" "$SECRET"
  echo "top-secret" >"$SECRET/key"

  # An escape target OUTSIDE every writable root (the real HOME is denied unless
  # --share-home), used to prove out-of-project writes are blocked.
  ESCAPE="$HOME/.fugue_native_test_escape_$$"
  rm -f "$ESCAPE"

  # Stub agent named for the `claude` profile (ANTHROPIC_API_KEY). It probes the
  # sandbox and prints stable markers. Real (non-$HOME) paths are baked in;
  # $HOME stays a runtime expansion.
  cat >"$BIN/claude" <<EOF
#!/usr/bin/env bash
[[ "\$HOME" == *fugue.* ]] && echo "EPHEMERAL_HOME" || echo "PERSISTENT_HOME"
echo "HOMEVAL=\$HOME"
(touch "$WORK/wrote" 2>/dev/null && echo "WROTE_WORKDIR") || echo "NO_WORKDIR"
(touch "$ESCAPE" 2>/dev/null && echo "WROTE_OUTSIDE") || echo "NO_OUTSIDE"
(cat "$SECRET/key" >/dev/null 2>&1 && echo "READ_SECRET") || echo "NO_SECRET"
EOF
  chmod +x "$BIN/claude"
}

teardown() {
  [[ -n "${TMP:-}" ]] && rm -rf "$TMP"
  [[ -n "${ESCAPE:-}" ]] && rm -f "$ESCAPE"
}

# Run the stub agent through fugue's native backend from the project dir.
# Args are passed positionally so the inner shell expands $PATH itself.
run_native() {
  run bash -c '
    cd "$1" || exit 99
    PATH="$2:$PATH" ANTHROPIC_API_KEY=sk-test FUGUE_DENY_READ="$3" \
      "$4" --backend native claude
  ' _ "$WORK" "$BIN" "$SECRET" "$FUGUE"
}

@test "native: runs the host agent and allows writes in the project" {
  run_native
  [ "$status" -eq 0 ]
  [[ "$output" == *"WROTE_WORKDIR"* ]]
  [ -e "$WORK/wrote" ]
}

@test "native: uses an ephemeral \$HOME by default" {
  run_native
  [ "$status" -eq 0 ]
  [[ "$output" == *"EPHEMERAL_HOME"* ]]
}

@test "native: denies writes outside the project" {
  run_native
  [ "$status" -eq 0 ]
  [[ "$output" == *"NO_OUTSIDE"* ]]
  [ ! -e "$ESCAPE" ]
}

@test "native: denies reads of FUGUE_DENY_READ paths" {
  run_native
  [ "$status" -eq 0 ]
  [[ "$output" == *"NO_SECRET"* ]]
}

@test "native: --share-home keeps the real \$HOME" {
  run bash -c '
    cd "$1" || exit 99
    PATH="$2:$PATH" ANTHROPIC_API_KEY=sk-test \
      "$3" --backend native --share-home claude
  ' _ "$WORK" "$BIN" "$FUGUE"
  [ "$status" -eq 0 ]
  [[ "$output" == *"PERSISTENT_HOME"* ]]
  [[ "$output" == *"HOMEVAL=$HOME"* ]]
}

@test "native: a missing host CLI is a clear error" {
  # Stub not on PATH; should fail before sandboxing with a helpful message.
  run bash -c 'PATH="/usr/bin:/bin" ANTHROPIC_API_KEY=sk-test "$1" --backend native claude' \
    _ "$FUGUE"
  [ "$status" -eq 2 ]
  [[ "$output" == *"installed"* ]]
}

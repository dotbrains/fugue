#!/usr/bin/env bats
#
# Every agent profile must satisfy the contract bin/fugue relies on: it defines
# the launch command, the credential variable(s), the egress allowlist, and a
# non-empty telemetry kill-env. A profile that breaks this contract would make
# the launcher forward the wrong key or open the wrong egress hole.

setup() {
  PROFILES_DIR="${BATS_TEST_DIRNAME}/../profiles"
}

# Source one profile in a clean subshell and emit the four contract fields,
# one per line, with the telemetry array rendered as its element count.
profile_fields() {
  local profile="$1"
  (
    # shellcheck disable=SC1090
    source "$profile"
    printf '%s\n' "${AGENT_CMD:-}"
    printf '%s\n' "${API_KEY_VARS:-}"
    printf '%s\n' "${API_HOSTS:-}"
    printf '%s\n' "${#TELEMETRY_ENV[@]}"
  )
}

@test "at least one profile exists" {
  run bash -c 'ls "$1"/*.env' _ "$PROFILES_DIR"
  [ "$status" -eq 0 ]
}

@test "every profile defines the full contract" {
  for profile in "$PROFILES_DIR"/*.env; do
    run profile_fields "$profile"
    [ "$status" -eq 0 ]
    # output lines: 1=AGENT_CMD 2=API_KEY_VARS 3=API_HOSTS 4=#TELEMETRY_ENV
    [ -n "${lines[0]}" ] || { echo "AGENT_CMD empty in $profile"; false; }
    [ -n "${lines[1]}" ] || { echo "API_KEY_VARS empty in $profile"; false; }
    [ -n "${lines[2]}" ] || { echo "API_HOSTS empty in $profile"; false; }
    [ "${lines[3]}" -gt 0 ] || { echo "TELEMETRY_ENV empty in $profile"; false; }
  done
}

@test "every profile sources without error under set -euo pipefail" {
  for profile in "$PROFILES_DIR"/*.env; do
    run bash -c 'set -euo pipefail; source "$1"' _ "$profile"
    [ "$status" -eq 0 ]
  done
}

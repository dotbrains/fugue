#!/usr/bin/env bats

setup() {
  FUGUE_ROOT="${BATS_TEST_DIRNAME}/.."
  source "$FUGUE_ROOT/bin/lib/fugue-native-profile"
  ADD_DIRS_RW=()
  ADD_DIRS_RO=()
  APPEND_PROFILES=()
}

die() {
  printf 'fugue: %s\n' "$*" >&2
  exit 2
}

expand_user_path() {
  printf '%s\n' "$1"
}

abspath() {
  printf '%s\n' "$1"
}

absfile() {
  printf '%s\n' "$1"
}

@test "native profile escapes quotes and backslashes in emitted paths" {
  local profile
  profile="$(native_profile '/tmp/home-"quote"-and-\-slash' '/tmp/work-"quote"-and-\-slash' '/tmp/run-"quote"-and-\-slash' '' '')"

  [[ "$profile" == *'/tmp/work-\"quote\"-and-\\-slash'* ]]
  [[ "$profile" == *'/tmp/run-\"quote\"-and-\\-slash'* ]]
  [[ "$profile" == *'/tmp/home-\"quote\"-and-\\-slash/.ssh'* ]]
}

@test "native profile rejects control characters in emitted paths" {
  run native_profile $'/tmp/bad\npath' /tmp/work /tmp/home '' ''

  [ "$status" -eq 2 ]
  [[ "$output" == *"invalid SBPL string"* ]]
}

@test "native profile denies common credential and daemon sockets" {
  local profile
  profile="$(native_profile '/tmp/home.with(regex)' /tmp/work /tmp/run '' '')"

  [[ "$profile" == *'(remote unix-socket (path-literal "/var/run/docker.sock"))'* ]]
  [[ "$profile" == *'(remote unix-socket (path-literal "/tmp/home.with(regex)/.docker/run/docker.sock"))'* ]]
  [[ "$profile" == *'(remote unix-socket (path-regex #"^/tmp/home\.with\(regex\)/\.colima/[^/]+/docker\.sock$"))'* ]]
  [[ "$profile" == *'(remote unix-socket (path-regex #"^/tmp/home\.with\(regex\)/\.local/share/containers/podman/machine/[^/]+/podman\.sock$"))'* ]]
  [[ "$profile" == *'(remote unix-socket (path-literal "/private/var/run/podman/podman.sock"))'* ]]
  [[ "$profile" == *'(remote unix-socket (path-regex #"^/private/var/run/com\.apple\.launchd\.[^/]+/Listeners$"))'* ]]
}

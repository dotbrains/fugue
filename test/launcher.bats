#!/usr/bin/env bats
#
# Launcher argument handling. These cover the paths bin/fugue resolves *before*
# it ever shells out to docker, so the suite needs no container runtime.

setup() {
  FUGUE="${BATS_TEST_DIRNAME}/../bin/fugue"
}

@test "the launcher is syntactically valid bash" {
  run bash -n "$FUGUE"
  [ "$status" -eq 0 ]
}

@test "--help prints usage and exits 0" {
  run "$FUGUE" --help
  [ "$status" -eq 0 ]
  [[ "$output" == *"Usage:"* ]]
  [[ "$output" == *"Flags:"* ]]
}

@test "no agent is a usage error" {
  run "$FUGUE"
  [ "$status" -eq 2 ]
  [[ "$output" == *"no agent given"* ]]
}

@test "an unknown flag is rejected" {
  run "$FUGUE" --does-not-exist claude "hi"
  [ "$status" -eq 2 ]
  [[ "$output" == *"unknown flag"* ]]
}

@test "an unknown agent lists the known ones" {
  run "$FUGUE" wopr "launch the missiles"
  [ "$status" -eq 2 ]
  [[ "$output" == *"unknown agent 'wopr'"* ]]
  [[ "$output" == *"claude"* ]]
  [[ "$output" == *"codex"* ]]
  [[ "$output" == *"gemini"* ]]
}

@test "--image requires a value" {
  run "$FUGUE" --image
  [ "$status" -ne 0 ]
}

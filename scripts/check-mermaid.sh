#!/usr/bin/env bash
#
# Validate every ```mermaid block in the repo's markdown by rendering it with
# mermaid-cli (mmdc). A diagram with invalid syntax makes mmdc exit non-zero,
# which fails this script — so a broken diagram can never reach main.
#
# Overridable:
#   MMDC               path to the mermaid-cli binary (default: mmdc on PATH)
#   PUPPETEER_CONFIG   puppeteer config passed to mmdc (default: alongside this script)
set -euo pipefail

MMDC="${MMDC:-mmdc}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUPPETEER_CONFIG="${PUPPETEER_CONFIG:-$ROOT/scripts/puppeteer-config.json}"

if ! command -v "$MMDC" >/dev/null 2>&1; then
  echo "check-mermaid: '$MMDC' not found; install @mermaid-js/mermaid-cli" >&2
  exit 127
fi

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

checked=0
fail=0
while IFS= read -r md; do
  grep -q '```mermaid' "$ROOT/$md" || continue
  checked=$((checked + 1))
  if "$MMDC" --quiet -p "$PUPPETEER_CONFIG" -i "$ROOT/$md" -o "$tmpdir/out.md" >"$tmpdir/log" 2>&1; then
    echo "ok   $md"
  else
    echo "FAIL $md"
    cat "$tmpdir/log" >&2
    fail=1
  fi
done < <(cd "$ROOT" && git ls-files --cached --others --exclude-standard '*.md')

if [[ "$checked" -eq 0 ]]; then
  echo "check-mermaid: no mermaid diagrams found"
fi
exit "$fail"

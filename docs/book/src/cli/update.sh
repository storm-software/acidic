#!/usr/bin/env bash
set -eo pipefail

BOOK_ROOT="$(dirname "$(dirname "$0")")"
ACIDIC=${1:-"$(dirname "$BOOK_ROOT")/target/debug/acidic"}

cmd=(
  "$(dirname "$0")/help.py"
  --root-dir "$BOOK_ROOT/"
  --root-indentation 2
  --root-summary
  --out-dir "$BOOK_ROOT/cli/"
  "$ACIDIC"
)
echo "Running: $" "${cmd[*]}"
"${cmd[@]}"

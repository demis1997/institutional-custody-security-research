#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
revision=691e253ccdc2756afe215a23384eb72e2d4fde3c
source_dir=source/quorum-custody
command -v node >/dev/null
command -v npm >/dev/null
command -v git >/dev/null
command -v anvil >/dev/null || { echo 'Install Anvil before setup; see experiments/README.md.' >&2; exit 1; }
test "$(node -p 'process.versions.node')" = 22.20.0 || { echo 'Use Node 22.20.0 (.nvmrc).' >&2; exit 1; }
if [ ! -e "$source_dir" ]; then
  mkdir -p source
  git init -q "$source_dir"
  git -C "$source_dir" remote add origin https://github.com/demis1997/quorum-custody.git
  git -C "$source_dir" fetch --depth 1 origin "$revision"
  git -C "$source_dir" checkout --detach FETCH_HEAD
fi
test "$(git -C "$source_dir" rev-parse HEAD)" = "$revision" || { echo 'Unexpected source revision; refusing to replace your checkout.' >&2; exit 1; }
node experiments/verify-source.mjs
npm ci --ignore-scripts --no-audit --no-fund
(cd "$source_dir" && npm ci --ignore-scripts --no-audit --no-fund)
echo 'Setup complete. Run: bash experiments/run.sh'

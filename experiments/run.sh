#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
# Relative paths keep the node and shell writers on the same output directory.
export RESEARCH_RESULTS_DIR=results/local
mkdir -p "$RESEARCH_RESULTS_DIR"
node experiments/verify-source.mjs
node -e 'const fs=require("node:fs"),cp=require("node:child_process"),os=require("node:os");fs.writeFileSync("results/local/environment.json",JSON.stringify({executedAt:new Date().toISOString(),node:process.version,platform:os.platform(),arch:os.arch(),release:os.release(),cpu:os.cpus()[0].model,anvil:cp.execFileSync("anvil",["--version"],{encoding:"utf8"}).trim()},null,2)+"\n")'
(cd source/quorum-custody && node --import tsx --test tests/*.test.ts) > "$RESEARCH_RESULTS_DIR/repeated-unit-tests.txt" 2>&1
node --import ./source/quorum-custody/node_modules/tsx/dist/loader.mjs experiments/security-experiments.mjs > "$RESEARCH_RESULTS_DIR/security-experiments.jsonl" 2> "$RESEARCH_RESULTS_DIR/security-experiments.stderr.txt"
node experiments/verification-benchmark.mjs > "$RESEARCH_RESULTS_DIR/verification-benchmark.stdout.txt" 2> "$RESEARCH_RESULTS_DIR/verification-benchmark.stderr.txt"
node experiments/check-results.mjs
echo 'Research runner completed; fresh records are in results/local/. Published evidence is unchanged.'

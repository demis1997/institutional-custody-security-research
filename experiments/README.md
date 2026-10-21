# Reproducing the research

Run from the repository root. The scripts fetch the exact reviewed application rather than maintaining a second application copy.

## Dependencies

- Node **22.20.0** (`nvm install && nvm use`) and npm **10.9.3**.
- Git and registry/network access for the pinned source and lockfile dependencies.
- Anvil on `PATH`. The publication used **1.3.5 nightly**, commit `9cd8a9511bc7206cb251721fa42420a76c668ae3c`; CI uses the available **v1.3.5** release. Install a chosen release using [Foundry's documented installation](https://getfoundry.sh/introduction/installation/); for the CI release use `foundryup --install v1.3.5`.
- One unused loopback port, default **18545**.

The scoped runner needs no Docker, PostgreSQL, native MPC compiler, cloud credentials, or real funds. Full native integration is a separate task and is **Not Executed** in the paper.

## Run and inspect

```sh
bash experiments/setup.sh
bash experiments/run.sh
```

Setup fetches `demis1997/quorum-custody` at `691e253ccdc2756afe215a23384eb72e2d4fde3c`, checks every file in [the source manifest](../docs/SOURCE_MANIFEST.json), and uses `npm ci --ignore-scripts` in each dependency directory. It refuses an existing source checkout at a different revision. It does not reset or delete an existing checkout.

Run verifies source integrity again, repeats the original unit suite, runs A–D, and runs six local verification benchmarks. The added `check-results.mjs` checks record presence, the 26-test TAP outcome, and benchmark shape; the experimental assertions remain in the harness.

Outputs are written to **`results/local/`**, which is ignored. The paper's original [published evidence](../results/EXPERIMENT_RESULTS.md) is retained separately and is never overwritten by the runner.

```sh
cat results/local/repeated-unit-tests.txt
cat results/local/security-experiments.json
cat results/local/verification-benchmark.json
cat results/local/environment.json
```

`security-experiments.json` contains labeled records A, B, C, and D. All four run together because D reuses B's duplicate submission. The local transaction hash is an identifier for a stopped synthetic chain, not a public explorer reference.

For another unused port:

```sh
RESEARCH_PORT=18546 bash experiments/run.sh
```

The harness creates random keys and a synthetic local balance, retains only public transaction data and assertion records, and removes its temporary recovery material. It binds Anvil to loopback and stops only the child it starts. No existing node or cloud service is targeted.

## Evidence boundaries

- **A:** actual authorization functions plus a declared divergent-ledger model. No database reservation attack or native MPC session.
- **B:** actual broadcast decision, complete synthetic key, and real local Anvil receipt. No threshold signature or full worker execution.
- **C:** actual recovery functions with synthetic ledger/session state. Same administrator; no independent-host exercise, live replay, or interrupted native protocol.
- **D:** pure transition checks and B's duplicate nonce. Signer outage, DKG outage, coordinator crash, timeout, disconnect, and native retry remain Not Executed.

The unmodified source's full-stack instructions are in its README and CONTRIBUTING.md after setup. Do not run integration or resilience tests against valuable state. See [all research limitations](../docs/RESEARCH_LIMITATIONS.md).

## Verification microbenchmark

The normal runner includes the benchmark. After setup it can also run alone:

```sh
node experiments/verification-benchmark.mjs
```

It measures ECDSA, ML-DSA-44/65/87, SLH-DSA-SHA2-128s, and an ECDSA + ML-DSA-65 logical AND. Each uses one key/message, five warmups, and seven batches of 30 valid checks; an altered message must fail. Signature and public key sizes are recorded. Fixed order, JIT, host load, and implementation choices affect timing. These are CPU observations, not EVM gas, service latency, signing, or threshold-PQ results.

## Continuous validation

[The workflow](../.github/workflows/research-validation.yml) validates publication links and artifact checksums, fetches verified source, and runs this scoped suite on Ubuntu. It uses read-only repository permissions, pinned action commits, and no cloud credentials. Fresh logs are uploaded as workflow artifacts even if the runner fails; timing differences do not alter the paper.

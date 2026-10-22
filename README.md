# Securing Institutional Digital Asset Custody: Private Keys, Distributed Trust, and the Uncomfortable Arrival of Quantum Computing

**Dimitris Konstantinou · Independent security research · 21 October 2026 · Version 1.0.0**

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.23577319.svg)](https://doi.org/10.5281/zenodo.23577319)

A mathematically valid signature does not necessarily represent an authorized transaction. This research examines the gap between protecting a key and controlling what it can authorize.

**[Published paper on Zenodo](https://zenodo.org/records/23577319)** · **[Download PDF](https://zenodo.org/records/23577319/files/custody-security-research.pdf?download=1)** · [Repository PDF](paper/custody-security-research.pdf)

[Reproduce the experiments](experiments/README.md) · [Recorded results](results/EXPERIMENT_RESULTS.md) · [Quorum Custody implementation](https://github.com/demis1997/quorum-custody) · [Security Research Index](RESEARCH_INDEX.md)

## Abstract

Institutional digital asset custody distributes signing, approvals, transaction state, and recovery across components whose assumptions may not compose. This revision-pinned case study of Quorum Custody combines source analysis, 26 repeated unit tests, a divergent spending-history model, approval expiry experiments on local Anvil, and recovery function experiments. It shows how valid approvals can coexist with inconsistent budget histories, how ordinary signed transaction bytes can outlive application authorization, and why recovery checkpoints need independent protection. Local post-quantum signature verification measurements support a proposed migration architecture covering spending, upgrades, and recovery. The evidence concerns specific enforcement boundaries; it does not establish production readiness or introduce a new cryptographic attack.

Published independently on Zenodo as a **preprint**. No peer-review status or institutional affiliation is claimed.

## Research questions and contributions

- **Who can authorize asset movement?** Trace the boundaries between MPC signing, HSM protection, exact transaction approvals, policy enforcement, and Ethereum validation.
- **Which history do signers trust?** Use real authorization calls with an executable divergent-ledger model to examine whether individually approved transactions preserve one global budget.
- **What survives expiry or rollback?** Test application expiry against portable signed bytes and test recovery functions against retained, missing, altered, and jointly rolled-back checkpoints.
- **What must quantum migration preserve?** Measure selected local signature verifiers and propose mandatory classical-and-post-quantum authorization across spending, upgrade, and recovery paths.

The contributions are an evidence-classified institutional compromise matrix, reproducible scoped experiments with retained observations, and a staged migration proposal. Models, source properties, historical integration reports, and results executed for the paper remain separate.

## Institutional custody threat model

The protected assets include signing shares, approval and policy keys, transport identities, exact transaction bytes, spending reservations, nonce history, and recovery checkpoints. The paper considers stolen API credentials, compromised approval devices or signers, hostile coordinators or databases, transport interference, shared deployment authority, privileged recovery operators, and a future adversary capable of solving the relevant elliptic curve discrete logarithm problem. Capabilities are considered separately unless a scenario explicitly combines them.

The baseline assumes fewer than two of three signing participants are compromised, sufficient approval keys remain trustworthy, and honest participants retain valid state and identities. A signing threshold does not establish consistent accounting, trustworthy review devices, or independent administration. A holder of already signed ordinary Ethereum bytes can submit them outside the custody worker; a threshold quorum can bypass application controls.

The inspected prototype runs under **one host account**, with local encrypted shares and nearby wrapping keys. It demonstrates neither HSM execution nor independent institutional trust domains. HSM/KMS protection, separate release authority, and independently governed recovery are architectural requirements to investigate, not deployed properties of this case study. See the paper's **Section 4 and Table 1**, and the [full limitations](docs/RESEARCH_LIMITATIONS.md).

## Findings and their evidence

1. **Threshold signing does not establish a shared spending history.** A declared ledger model plus the implementation's real authorization function admits two individually approved reservations totaling **1.200084 ETH against a 1 ETH budget** under divergent partial histories. A central serial model rejects the second request. This is a counterexample under an explicit attacker model, not an executed exploit against PostgreSQL or native MPC.
2. **Application approval expiry does not revoke an ordinary Ethereum signature.** The actual broadcast validator rejected expired evidence, while unchanged transaction bytes signed with a synthetic complete test key were accepted by local Anvil. Receipt status was **1**; duplicate submission was rejected. Full MPC signature generation and the custody worker were not executed in this experiment.
3. **Recovery depends on the checkpoint's independence.** Real recovery functions rejected stale, missing, or altered retained checkpoints. Restoring a matching old backup and old checkpoint together succeeded under declared privileged access. The test used one administrator and synthetic state; it does not demonstrate independently administered recovery or live replay.
4. **Threshold ECDSA inherits the quantum exposure of elliptic curve cryptography.** Distributing a secret constrains its use under classical assumptions; it does not change the public key's underlying discrete logarithm problem. This conclusion follows from cryptographic analysis, not a quantum attack experiment.

These results examine documented trust boundaries in [Quorum Custody](https://github.com/demis1997/quorum-custody), at [commit `691e253`](https://github.com/demis1997/quorum-custody/tree/691e253ccdc2756afe215a23384eb72e2d4fde3c). They do not claim a newly discovered exploitable vulnerability in Coinbase MPC or a production custodian.

## Experimental evidence

| Experiment | Research question | Observed result | Verification scope | Reproduction |
| --- | --- | --- | --- | --- |
| A · Spending history | Can valid individual approvals establish a global budget? | Divergent views admit 1.200084 ETH; central serial model rejects the second reservation. | Real `authorize` calls plus declared ledger model; no PostgreSQL or MPC execution. | [Run harness, record A](experiments/README.md#run-and-inspect) |
| B · Approval expiry | Can retained signed bytes outlive application approval? | Validator rejects expiry; direct local-chain submission succeeds; duplicate nonce is rejected. | Real validator, ordinary complete test key, real Anvil; no full worker or threshold signing. | [Run harness, record B](experiments/README.md#run-and-inspect) |
| C · Recovery rollback | What happens when state and checkpoint roll back together? | Individual stale/missing/altered checkpoints rejected; joint rollback accepted. | Unmodified recovery functions and synthetic state under one administrator. | [Run harness, record C](experiments/README.md#run-and-inspect) |
| D · Failure transitions | Which retry and terminal transitions are permitted? | Selected retries accepted; confirmed-to-signing rejected; B's duplicate nonce rejected. | Pure transition functions plus local-chain duplicate; native outage scenarios not executed. | [Run harness, record D](experiments/README.md#run-and-inspect) |
| Verification benchmark | What are local verification costs and object sizes? | Six scheme/composition rows with sizes and seven batch means each. | JavaScript CPU measurements; no EVM, gas, HSM, or threshold PQ benchmark. | [Run benchmark](experiments/README.md#verification-microbenchmark) |

The repository unit suite was repeated with **26 passed, zero failed, zero skipped**. [Raw evidence](results/) preserves the paper's run. Fresh runs write to ignored `results/local/`, so reproduction cannot replace published observations. Timing and transaction identifiers naturally vary between runs.

## Architecture and authorization

![Institutional custody architecture and trust domains](figures/architecture.svg)

*Representative trust boundaries. Dashed signer domains describe proposed institutional isolation; the inspected prototype runs under one host account. The coordinator submits verified signed bytes to RPC. Every signer also needs independently governed recovery.*

![Transaction authorization lifecycle](figures/authorization-flow.svg)

*Authorization and network validity have different lifetimes. Once ordinary signed bytes exist, another holder can submit them outside application validation.*

![Compromise and recovery boundaries](figures/compromise-recovery.svg)

*Consequences depend on which authority is compromised. A single compromised share, a threshold quorum, a coordinator, and a recovery controller have different capabilities.*

## Post-quantum cryptography and migration

The paper examines **ML-DSA-44/65/87**, **SLH-DSA-SHA2-128s**, and an **ECDSA + ML-DSA-65 logical AND**, alongside the distinction between post-quantum signatures and key establishment. Selecting a standardized primitive does not provide a threshold signing protocol. Distributed post-quantum signing is reviewed as separate research, with no implementation claimed here.

The executed JavaScript benchmark records public key/signature sizes and seven batches of 30 valid verifications per row after five warmups, using one generated key/message per scheme. Each row also rejects an altered message. The [raw benchmark](results/verification-benchmark.json) preserves all batch means; fixed order, JIT effects, host load, and different security categories limit comparison. These are local CPU observations, not Ethereum gas, signing throughput, HSM performance, or threshold-PQ measurements.

The proposed architecture requires both classical and post-quantum evidence over the same operation. A contract account must enforce that rule at the asset boundary, including upgrades and recovery. Off-chain PQ approvals do not protect an ordinary account whose ECDSA key still suffices to move its assets.

![Proposed post quantum custody migration](figures/quantum-migration.svg)

*Proposed migration, not an implemented deployment. Assets must move under the old account rules before the new rules protect them. ERC-4337 and EIP-7702 require separate analysis of surviving owner, delegation, relayer, and upgrade authority.*

See **Sections 11–12, pages 17–21**, of the [full migration proposal](paper/custody-security-research.pdf#page=17). [The AWS lab roadmap](docs/AWS_CUSTODY_SECURITY_LAB_ROADMAP.md) develops the next infrastructure questions without assuming hardware compatibility or deploying cloud resources.

## Reproduce

Use **Node 22.20.0**, **npm 10.9.3**, Git, and Anvil on `PATH`. The publication run used Apple M3 Max, macOS ARM64 / Darwin 25.5.0, and Anvil 1.3.5 nightly (`9cd8a9511bc7206cb251721fa42420a76c668ae3c`). CI uses the available Anvil **v1.3.5** release and records its exact runtime; these environments are distinct.

```sh
git clone https://github.com/demis1997/institutional-custody-security-research.git
cd institutional-custody-security-research
nvm install
nvm use
bash experiments/setup.sh
bash experiments/run.sh
```

Setup fetches the exact application commit into ignored `source/quorum-custody/`, verifies all 82 source hashes, and installs lockfile dependencies with lifecycle scripts disabled. The harness starts one loopback Anvil process on port 18545 and stops only that process. Set `RESEARCH_PORT` to a different unused port if needed. No cloud account, wallet credentials, real assets, Docker, or native MPC build is needed for this scoped runner.

Full native MPC/PostgreSQL integration, independently administered recovery, and native outage campaigns remain **Not Executed**. Follow [the detailed instructions and limitations](experiments/README.md) before interpreting the output.

## Limitations and future research

This is one prototype at one pinned revision. The paper did not execute full native MPC/PostgreSQL integration, malicious native signer scenarios, independently administered recovery, or native outage and crash campaigns. Historical implementation results do not verify the paper's later submission path. The 26 passing unit tests are a recorded suite outcome, not assurance of full-stack security; the paper also identifies a parser property-test assertion-handling issue that needs repair.

Next steps are to run the pinned full stack in an isolated environment, test reservation consistency under explicit coordinator/database faults, inject crashes at persistence boundaries, and rehearse domain loss with independent recovery authority. A hybrid account prototype needs verifier correctness, malformed-input testing, gas measurements, bundler admission, upgrade and guardian controls, and asset reconciliation before operational claims are justified.

The proposed independent signer domains and quantum migration architecture remain unimplemented in this research. No production custody certification, novel cryptographic attack, or quantum hardware timeline is asserted. [The limitations document](docs/RESEARCH_LIMITATIONS.md) lists unexecuted cases and interpretation constraints.

## Repository guide

- [Paper and editable document](paper/) · [Authoring source](paper/source/README.md)
- [Experiment scripts](experiments/) · [Published evidence](results/)
- [Research changelog](docs/RESEARCH_CHANGELOG.md) · [Limitations](docs/RESEARCH_LIMITATIONS.md)
- [Pinned source manifest](docs/SOURCE_MANIFEST.json) · [Redistribution and attribution review](docs/REDISTRIBUTION.md)
- [AWS Institutional Custody Security Lab roadmap](docs/AWS_CUSTODY_SECURITY_LAB_ROADMAP.md)

## How to Cite

Use [CITATION.cff](CITATION.cff), or cite the published version:

> Konstantinou, D. (2026). *Securing Institutional Digital Asset Custody: Private Keys, Distributed Trust, and the Uncomfortable Arrival of Quantum Computing* (Version 1.0.0) [Preprint]. Zenodo. https://doi.org/10.5281/zenodo.23577319

```bibtex
@misc{konstantinou2026custody,
  author    = {Konstantinou, Dimitris},
  title     = {Securing Institutional Digital Asset Custody: Private Keys, Distributed Trust, and the Uncomfortable Arrival of Quantum Computing},
  year      = {2026},
  month     = oct,
  publisher = {Zenodo},
  version   = {1.0.0},
  doi       = {10.5281/zenodo.23577319},
  url       = {https://doi.org/10.5281/zenodo.23577319},
  note      = {Independent research preprint; published October 21, 2026}
}
```

## Related implementation and license

[Quorum Custody](https://github.com/demis1997/quorum-custody) is the separately maintained implementation examined by this research. This repository does not modify it or vendor its full source tree; setup fetches the pinned revision. The repository retains its existing [MIT license](LICENSE). The [published Zenodo record](https://zenodo.org/records/23577319) lists the paper under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/); `CITATION.cff` identifies the research software and provides the published paper as its preferred citation. Third-party rights and retained notices are documented in [Redistribution and attribution](docs/REDISTRIBUTION.md).

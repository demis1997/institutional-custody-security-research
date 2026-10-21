# Security Research Index

Dimitris Konstantinou · Security architecture, institutional custody and reproducible adversarial testing.

Research → [MPC custody implementation](https://github.com/demis1997/quorum-custody) → [AWS security architecture](https://github.com/demis1997/aws-custody-security-lab) → [open source security contributions](#open-source-security-contributions).

## Published Research

### Securing Institutional Digital Asset Custody

*Private Keys, Distributed Trust, and the Uncomfortable Arrival of Quantum Computing* · Independent research artifact · 21 October 2026.

[Read the actual PDF](paper/custody-security-research.pdf) · [Editable document](paper/custody-security-research.docx) · [Research repository](https://github.com/demis1997/institutional-custody-security-research) · [Reproduction](experiments/README.md) · [Results](results/EXPERIMENT_RESULTS.md)

Examines how signing authority, exact transaction approvals, distributed spending history and recovery checkpoints interact. Evidence includes 26 repeated application unit tests, actual authorization/recovery function checks, a declared divergent-ledger model, an ordinary synthetic key plus real local Anvil transfer after approval expiry, and six local signature-verification benchmark rows. It does not claim executed full native MPC/database attacks, a production exploit, peer reviewed status or a quantum attack demonstration. The paper proposes an asset-boundary migration architecture with explicit governance and recovery constraints.

## Active Research

### Securing Institutional Custody Infrastructure on AWS

[Public AWS custody security lab](https://github.com/demis1997/aws-custody-security-lab) · [Architecture](https://github.com/demis1997/aws-custody-security-lab/blob/main/architecture/overview.md) · [Threat model](https://github.com/demis1997/aws-custody-security-lab/blob/main/threat-model/attack-scenarios.md) · [Validation evidence](https://github.com/demis1997/aws-custody-security-lab/blob/main/VALIDATION_REPORT.md)

Implements modular Terraform for separately administered signer, coordinator, authorization, audit and recovery domains; IAM/KMS/S3 policies; private network definitions; monitoring; and local compromise/recovery experiments. Mocked Terraform plan assertions inspect actual generated controls. The authority models distinguish one/two signer compromise, shared deployment, approval-service control, organization management and rollback of both state and trusted recovery evidence.

**Evidence boundary:** locally validated infrastructure code and executed synthetic models. No AWS resources, real IAM escalation, live mTLS, CloudHSM operation, cloud recovery or native MPC deployment is claimed. Read the lab's current validation report for exact test counts and unexecuted checks.

## Future Research

### Post Quantum Authorization for Ethereum Custody

**Planned research.** Build on the paper's proposal without treating a local CPU verification benchmark as an EVM or threshold-PQ implementation.

- ML-DSA verification and bounded parsing in a concrete account/verifier design.
- Hybrid classical and post quantum authorization over the same operation and epoch.
- ERC-4337 account validation and relayer/owner authority boundaries.
- Cryptographic agility, explicit algorithm retirement and upgrade governance.
- Recovery authority that cannot bypass the selected verifier through a surviving classical key.
- EOA migration, asset/allowance reconciliation and EIP-7702 delegation limitations.

No completed contract deployment, threshold post quantum protocol or gas benchmark is represented by this entry.

## Open Source Security Contributions

Statuses checked directly on GitHub on 21 October 2026.

- **Semgrep [#11999](https://github.com/semgrep/semgrep/pull/11999) — Open, unmerged:** Go statement-sequence matching for calls inside conditional initializers, with binding/shadowing regression coverage.
- **Trail of Bits Slither [#3119](https://github.com/crytic/slither/pull/3119) — Open, unmerged:** literal revert strings eligible for custom errors, with ABI caveats.
- **Slither [#3120](https://github.com/crytic/slither/pull/3120) — Open, unmerged:** conservative storage-packing suggestions for fresh layouts.
- **Slither [#3121](https://github.com/crytic/slither/pull/3121) — Open, unmerged:** read-only external memory parameters eligible for calldata.
- **Slither [#3122](https://github.com/crytic/slither/pull/3122) — Open, unmerged:** invariant scalar storage reads in isolated loops.
- **Slither [#3123](https://github.com/crytic/slither/pull/3123) — Open, unmerged:** conservative cacheable-accumulator metadata for costly-loop findings.
- **Slither [#1707](https://github.com/crytic/slither/pull/1707) — Closed, unmerged:** earlier gas-optimization detector proposal.

These entries describe submitted work, not merged upstream features. Follow the linked PR for current status.

## Research Standards

Each project identifies its source revision, attacker prerequisites, assumptions, reproducible commands, actual results and limitations. Evidence is classified as source inspection, model, function test, real service interaction or integrated deployment; one category is not silently promoted into another. Failed assumptions and unexecuted experiments remain visible. No unsupported security, compliance, affiliation, benchmark or production-readiness claims.

Future entries should include title/date/status, repository and paper links, contribution summary, pinned implementation revision, reproduction instructions and a clear evidence boundary. Update this index rather than creating another disconnected publication hub.

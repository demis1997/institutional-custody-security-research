# AWS Institutional Custody Security Lab

**Design roadmap · Local implementation now available · No AWS deployment performed**

The first implementation is published in [AWS Custody Security Lab](https://github.com/demis1997/aws-custody-security-lab): modular Terraform, threat models, local compromise/recovery experiments and mocked infrastructure policy tests. This roadmap retains the broader integration work; it is not a deployment-completion record.

The goal is to test whether institutional custody controls remain independent when a coordinator, signer host, administrator, or recovery domain is compromised. The starting implementation is [Quorum Custody](https://github.com/demis1997/quorum-custody), examined by [the research paper](../paper/custody-security-research.pdf). A dedicated lab repository can follow after the threat model and interface evaluation are reviewed; none is represented as already deployed.

Use **Terraform** for infrastructure as code, with reviewed plans, pinned providers, isolated state access, and separate deployment roles per trust domain. AWS CDK is an alternative if equivalent review and separation can be demonstrated. This roadmap creates no resources, uses no cloud credentials, and has no paid proof of concept attached.

## Phase 1 · Threat model and AWS architecture

Define assets, authorization invariants, availability targets, and compromise assumptions before choosing services. Include coordinator takeover, one signer host, one signer administrator, organization administration, CI/CD release authority, authorization keys, recovery authority, audit deletion, and RPC equivocation. Separate a logical 2-of-3 quorum from an administrative one.

Propose one AWS account for each signer domain, separate coordinator/authorization administration, and an independently controlled audit/recovery domain. Document every cross-account role, organization management/SCP dependency, shared build pipeline, DNS/CA authority, and break-glass path. Separate accounts still share AWS and potentially organization administrators; they are not automatically independent.

**Deliverables:** trust-boundary diagram, data-flow inventory, attack tree, control/assumption register, and design decisions for state consistency, nonce allocation, signed-byte persistence, and transaction finality.

**Exit evidence:** for every spending and restore operation, name the approving, signing, persistence, and recovery authorities. Review whether one principal or release pipeline can silently control a quorum.

## Phase 2 · Signer trust domains, networking, and identity

Design per-account VPCs/subnets, default-deny ingress, narrowly scoped signer routes, restricted egress, and private management paths. Evaluate peering or Transit Gateway against route transitivity and compromise assumptions. Separate runtime roles from deployment and operator roles; avoid long-lived access keys. Review permission boundaries, trust policies, session duration, and organization-level escalation paths.

Preserve mutual TLS with pinned peer identities, short-lived certificates, replay-resistant session binding, bounded queues, timeouts, and explicit rotation. A shared CA that can impersonate every signer belongs in the threat model. Build and promote signed artifacts with separate domain approvals; do not give a common CI job permission to replace all signers.

**Deliverables:** reviewed Terraform modules and offline plans; identity and network test matrix; certificate enrollment/revocation/rotation design.

**Exit evidence:** deny unintended cross-domain calls and role assumptions; prove that a coordinator role cannot read signer material or change signer policy. Live checks require a separately approved isolated lab deployment.

## Phase 3 · Key protection and MPC interface compatibility

Start with the actual adapter: [native/signer.cpp at the reviewed commit](https://github.com/demis1997/quorum-custody/tree/691e253ccdc2756afe215a23384eb72e2d4fde3c/native). The adapter calls `ecdsa_mp::dkg_ac` and `ecdsa_mp::sign_ac` with a serialized `buf_t key`. It encrypts/decrypts local share storage using OpenSSL, and passes the decrypted key buffer into host-process protocol execution. This is concrete host-resident share handling. Trace randomness, preprocessing, secret scalar/curve operations, and buffer lifetime in the pinned cb-mpc implementation before designing a hardware boundary.

AWS KMS `Sign` accepts a message or digest and produces a signature with a managed asymmetric key. That interface does not itself supply the secret-share operations of a threshold ECDSA participant. CloudHSM's PKCS #11 interface exposes listed mechanisms, including ECDSA; ordinary ECDSA support does not establish compatibility with cb-mpc's distributed protocol or keep its full keyshare computation inside hardware. These are interface observations and a design inference, not a hardware evaluation result.

Evaluate three distinct designs:

- **Envelope protection:** a per-domain KMS key controls wrapping/decryption of stored shares. Document that a running host able to decrypt may still hold plaintext share material; KMS wrapping is not HSM-resident threshold execution. Bind encryption context, IAM/key policy, key version, and recovery procedures.
- **HSM-backed non-MPC keys:** assess compatible policy-signing and transport identity keys separately. Map the actual Ed25519/TLS algorithms and APIs; any algorithm migration requires canonical encoding, verification, and rotation tests.
- **Protocol-aware hardware boundary:** build a capability matrix for the exact CloudHSM SDK, cluster mode, mechanism, key attributes, serialization, and required secret operations. If the API cannot express the protocol, record the incompatibility. Do not export a secret merely to call the hardware design supported.

**Deliverables:** source-to-interface matrix, memory-exposure assessment, adapter decision record, and costed options for any separately approved hardware experiment.

**Exit evidence:** reproducible compatibility tests or an explicit no-go decision. No claim that CloudHSM automatically supports the chosen threshold protocol.

Primary references, checked 21 October 2026: [KMS Sign API](https://docs.aws.amazon.com/kms/latest/APIReference/API_Sign.html), [CloudHSM SDK 5 PKCS #11 mechanisms](https://docs.aws.amazon.com/cloudhsm/latest/userguide/pkcs11-mechanisms.html), and [cb-mpc at its application pin](https://github.com/coinbase/cb-mpc/tree/0b716706f998633912ee2be9b9bf8909aed66088). Recheck service and SDK support before an implementation decision.

## Phase 4 · Authorization, policies, and audit

Separate requester and approver identities and independently administered policy signing. Bind approvals to canonical transaction bytes, chain, wallet, nonce, recipient, value, maximum fees, policy epoch, and expiry. Require signers to verify evidence rather than trust a coordinator boolean. Specify exactly where reservations and nonces are authoritative under partition or database compromise; a common database is a declared trust dependency.

Design cross-account audit collection with narrow write roles, reviewed retention, protected deletion, and independently retained state/checkpoint attestations. CloudTrail records service API activity; it does not replace application records of the exact authorized intent and signed bytes. Define alert ownership and how to reconcile ambiguous RPC outcomes. Preserve the paper's finding that application expiry cannot recall already portable signatures.

**Deliverables:** authorization schema, policy lifecycle, audit-event specification, reservation consistency model, and source-to-control traceability.

**Exit evidence:** rejection tests for changed intent, stale policy, replay, duplicated nonce, missing approvals, and attempts to exceed the shared budget; reviewers can reconstruct each successful transfer from evidence.

## Phase 5 · Recovery, backups, and disaster exercises

Assign recovery checkpoints to a domain whose administrator cannot silently replace a signer quorum or erase current history. Define backup confidentiality, restore approval, trusted latest epoch, nonce/reservation reconciliation, RPO/RTO targets, and a lost-checkpoint procedure. Distinguish restoration of encrypted files from restoration of a safe signing state.

Plan staged exercises: one signer lost, one account inaccessible, stale backup, state-plus-checkpoint rollback, compromised recovery operator, regional loss, and restore during partial signing or ambiguous broadcast. Design key/share rotation and account migration before claiming disaster recovery readiness. Backups in another account under the same effective administrator do not establish independence.

**Deliverables:** restore runbooks, recovery-authority matrix, encrypted backup format, epoch/checkpoint validation, and rehearsal evidence templates.

**Exit evidence:** measured recovery outcomes with named operators and recorded failures; obsolete history cannot silently authorize a second spend under the stated model. No exercise runs without an approved disposable lab and budget.

## Phase 6 · Adversarial testing and operating documentation

Extend the paper's models into real isolated infrastructure tests. Cover signer outage, DKG abort, coordinator kill, participant disconnect, malicious messages, certificate expiry, role escalation, budget races, database rollback, RPC ambiguity, audit suppression, and interrupted recovery. Record which native protocol and persistence boundary each test actually reaches.

Use disposable profiles and synthetic balances. Preserve seed/configuration metadata without secrets; collect redacted logs and before/after invariants. Define stop conditions, cost limits, scoped cleanup, and an incident response drill. Add dependency review, infrastructure checks, least-privilege tests, and runbooks for certificate/key rotation and release rollback.

**Deliverables:** reproducible test harness, scoped results, operating guide, residual-risk register, and a clear promotion decision.

**Exit evidence:** a reviewer can reproduce success and failure cases. A passing lab remains evidence for its stated assumptions, not a claim of a production custody service or independent certification.

## Parallel research track · Post quantum authorization

Prototype versioned contract verification, hybrid AND composition, bounded signature parsing, algorithm retirement, upgrade governance, and recovery that cannot bypass the new verifier through a classical owner key. Compare ML-DSA and SLH-DSA using native and EVM implementations only when those implementations exist and are reviewed. Keep single-party verification benchmarks distinct from threshold PQ protocol research. The classical Ethereum network and account migration still require separate threat analysis.

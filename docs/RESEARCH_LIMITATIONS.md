# Research limitations and unexecuted experiments

## Evidence actually executed

Baseline application revision: 691e253ccdc2756afe215a23384eb72e2d4fde3c. Source tree unchanged. The complete runner passed the repository's 26 named unit tests with zero failures/skips, asserted the additional function/model outcomes, submitted a real synthetic transaction to Anvil after application expiry, and completed the local CPU verification benchmark. results/ contains the observations; the paper distinguishes each scope.

## Not Executed

1. Experiment A: real native MPC with a malicious participant, signer HTTP ledger divergence, and PostgreSQL concurrent reservation enforcement. The central reservation result is an executable serial model; its implementation boundary was source inspected.
2. Experiment B: actual threshold signature generation and the full database custody worker expiry/submission sequence. The executed experiment uses real detached approval signatures and the unmodified worker decision function but an ordinary synthetic complete ECDSA key. Policy revocation during active MPC was not tested. Mainnet, reorganization and finality behavior were not tested.
3. Experiment C: independently administered hosts or accounts, a live signer replay request after restoration, real interrupted MPC/submission recovery, complete host loss, disk/power loss, durable fsync fault injection, or external checkpoint service compromise. Directory relocation used the same OS administrator. Session/ledger preservation used synthetic contents, not protocol execution.
4. Experiment D: missing signer during DKG, one signer offline during actual threshold signing, real coordinator interruption, native session timeout, participant disconnection, or retries after an interrupted native protocol. Only pure transition permissions and duplicate Anvil submission were executed.
5. Current native integration, resilience, hosted CI, browser workflow, and build checks were not rerun. Historical repository reports remain historical and revision scoped.
6. Post quantum EVM verifier, Solidity implementation, calldata/gas benchmark, bundler compatibility, deployed hybrid account, account upgrades/recovery, threshold post quantum signing, cryptographic side channels, or HSM execution.

The Docker engine was unavailable (the escalated read-only probe reported it could not connect to the daemon). No standalone PostgreSQL command was found on PATH. The cb-mpc adapter and its pinned patched OpenSSL were not built. Docker was not restarted and other services were not altered. These are recorded infrastructure and build prerequisites, not failed security assertions.

## Interpretation limits

The ledger model assumes A can hide prior local history and both transactions already possess sufficient valid approvals. It demonstrates an accounting composition issue, not signature forgery. The central serial model is not a live SQL locking test.

The rollback acceptance requires the backup password and write access to the comparison checkpoint. It matches a documented host trust limitation. The tests do not demonstrate a bypass against an independently retained latest checkpoint.

The benchmark uses one generated key/signature/message per scheme, fixed algorithm order, five warmups, seven batches of thirty successful verifications, and JavaScript implementations at different security categories. Batch ranges are descriptive, not confidence intervals. Hardware load and JIT affect results. The post quantum library's documentation states no independent audit. No FIPS validation is implied.

The diagrammed independent domains and migration architecture are proposed designs. Quorum Custody remains a single-host local prototype with no demonstrated institutional deployment. No general security theorem, new primitive, new cryptographic attack, quantum hardware timeline, legal conclusion, or custody certification is asserted.

## Document validation

The DOCX is designed for Apple Pages and Word, retains native equation objects, SVG diagrams with compatibility fallbacks, a populated linked TOC field, and standard heading styles. Rendering validates the distribution PDF layout. Native application verification and final TOC checks are recorded separately in results/document-qa.json; do not infer them merely from the filename.

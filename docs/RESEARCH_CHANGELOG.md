# Research changelog

21 October 2026. Author: Dimitris Konstantinou.

## Preserved

- Original manuscript, JSON, builder and test output under baseline/.
- Baseline revision 691e253ccdc2756afe215a23384eb72e2d4fde3c. Public HEAD was the same revision; no newer application revision was used.
- Core arguments on exact approvals, independent trust domains, aggregate history, signature portability, recovery rollback, and quantum vulnerability of threshold ECDSA.
- The observation that the parser property test can swallow an assertion failure. No application code or baseline tests were silently changed.

## Added

- Explicit research question, labeled Research Contributions, related work, discussion, limitations, and disclosure considerations.
- Four vector SVG diagrams, embedded in DOCX with PNG compatibility images and provided as editable source.
- Institutional threat matrix covering all sixteen requested compromise scenarios with evidence status.
- Executed divergent ledger model with real application authorization; explicit source-only central database boundary.
- Executed approval expiry validator versus direct Anvil submission using a complete synthetic fixture key; public transaction identifier and receipt recorded.
- Extended unmodified recovery function tests, including retained checkpoint failure and declared joint rollback; synthetic session and reservation preservation.
- Pure lifecycle checks and actual duplicate chain submission, with native availability experiments unexecuted.
- Repeated baseline 26 unit tests, zero failures/skips.
- Local verification benchmark for ECDSA, three ML-DSA sets, SLH-DSA-SHA2-128s, and a logical hybrid AND check. Exact encoded sizes, batch means, and runtime are preserved.
- References to threshold ECDSA, consistency and Byzantine replication, NIST key management and FIPS 203/204/205, distributed lattice signing, hybrid composition, organizational migration, ERC-4337, and EIP-7702.
- Author details, restrained title page, generated linked TOC field with checked page numbers, headers, footers, equation objects, five numbered tables, references, and two appendices.
- Dedicated reproducibility scripts, pinned lockfiles, source hashes, public logs, updated research content, and publication abstract.

## Corrected or qualified

- EOA delegation is discussed separately: EIP-7702 does not remove the original ECDSA root merely by delegating validation code.
- New results are divided into executed models, imported function tests, ordinary key plus real chain evidence, and unexecuted full stack scenarios.
- Joint rollback acceptance is a previously documented infrastructure assumption, not a new cryptographic vulnerability.
- CPU verification measurements are not EVM gas estimates, equivalent-security rankings, or production service benchmarks.
- No claim of peer review, general security proof, regulatory compliance, production readiness, independent security audit, or quantum attack arrival date is made.

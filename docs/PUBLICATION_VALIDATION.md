# Publication validation

Pre-publication checks completed on 21 October 2026.

## Artifacts and attribution

- The delivered PDF and DOCX were copied byte for byte from the checked research package. The 26-page PDF, 32 contents entries, five tables, four figures, and two equations retain their prior document QA.
- PDF, DOCX, figure assets, and original result records are frozen by `ARTIFACT_CHECKSUMS.json`. The validator checks these 21 hashes. Paper authoring source is included separately; repository-specific builder edits change paths only.
- The MIT notices for Quorum Custody and Coinbase are retained. The publication includes no copied third-party paper, native MPC library, dependency tree, package cache, or original application snapshot. See REDISTRIBUTION.md.
- Binary review: the editable document is approximately 1.7 MB; no intended publication file exceeds 10 MB. The PDF and SVG/PNG figures are research artifacts, not executables.

## Reproduction after restructuring

A fresh source fetch and locked installation completed with Node 22.20.0 and npm 10.9.3 on macOS ARM64. The fetched checkout matched all 82 source hashes at `691e253ccdc2756afe215a23384eb72e2d4fde3c`.

The relocated runner then completed:

- Original unit suite: **26 passed, zero failed, zero skipped**.
- Four scoped experiment records A–D, including the synthetic local Anvil transfer.
- Six verification microbenchmark rows with altered-message rejection and seven batches each.
- Fresh-result consistency checks.
- Post-run validation confirming the original publication evidence stayed unchanged.

Fresh outputs are ignored under `results/local/`; the publication's observations remain in root `results/`. The local reproduction used the available Anvil 1.3.5 nightly. The Ubuntu workflow pins the available v1.3.5 release and records its runtime separately. Consult the workflow run for the current hosted validation result; local success is not a claim that a future hosted run passed.

## Secret and credential review

Gitleaks **8.30.1**, downloaded from the official release and verified against its published SHA-256 checksum, scanned the intended publication tree and proposed profile text. Three initial findings were verified source-file SHA-256 hashes in `SOURCE_MANIFEST.json`, not credentials. `.gitleaks.toml` permits only those three exact values in that manifest path. The reviewed scan reported **no leaks found**.

The publication validator additionally scans raw file data and expanded DOCX XML for high-confidence token/private-key patterns, rejects credential-like file types and environment files, parses SVG XML, and checks artifact integrity. The source manuscript text is included as JSON and was scanned alongside the experimental logs and public local transaction. No scan is a mathematical guarantee of the absence of secrets; no private test material was identified in the intended files.

Keys and recovery passwords are randomly generated in memory or temporary files during tests and are not logged. The included transaction has chain ID 31337 and a synthetic balance on an ephemeral local chain. It is not a funded account credential. Fetched source, development state, npm dependencies, local rerun records, and Git internals are excluded from the published tree.

## Markdown, citation, and profile checks

GitHub's Markdown API rendered both READMEs successfully. The research page rendered one evidence table and includes four SVG image links. All local publication links were checked against the intended tree. Citation metadata and workflow YAML were parsed; no DOI, institutional affiliation, or peer reviewed status is claimed.

The profile comparison preserves the existing animated GIF, the entire technology-banner section, and every existing project destination. Semgrep #11999 and Slither #3119–3123 were verified open with no merge timestamp; Slither #1707 was verified closed with no merge timestamp. Statuses are dated 21 October 2026.

The AWS roadmap is documentation only. It evaluates the native adapter interface and cites AWS APIs; it creates no AWS resources and uses no cloud credentials. The original Quorum Custody repository is unchanged.

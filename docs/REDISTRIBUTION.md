# Redistribution and attribution review

Reviewed for this publication on 21 October 2026.

## Included original work

The author supplied the completed manuscript, editable document, experiment harness, generated diagrams, and research documentation and authorized public publication under an appropriate license. These original materials are published under the root MIT license, copyright Dimitris Konstantinou. The paper and diagrams are not copied publisher PDFs or third-party artwork. Citations identify underlying research; the cited papers and standards are linked, not redistributed as full texts. No institutional affiliation or publisher endorsement is implied.

## Examined application and cryptographic upstream

Quorum Custody at `691e253ccdc2756afe215a23384eb72e2d4fde3c` is MIT licensed, copyright 2026 Quorum Custody contributors. Its [notice is retained](../licenses/QUORUM-CUSTODY-MIT.txt). The full application is fetched by setup into an ignored checkout; it is not copied into the published research tree. The source manifest records the inspected files and hashes.

Quorum Custody attributes cb-mpc to Coinbase, copyright 2025 Coinbase, under MIT. Its [upstream notice is retained](../licenses/COINBASE-MIT.txt). No cb-mpc source, native object, keyshare, or HSM implementation is bundled here. Setup does not build or fetch the native cryptographic stack.

Dependencies are described by the original npm lockfiles and installed on demand with their own licenses. No node_modules directory, package cache, Git internals, or Foundry executable is redistributed. The root license does not replace third-party notices or claim rights over cited publications.

## Evidence and synthetic material

The retained transaction uses chain ID 31337, an ephemeral local Anvil chain, a random complete test key, and a synthetic balance. Its raw bytes, hash, addresses, receipt labels, and timestamps are public test evidence. They grant no authority over real funds. Private test keys, recovery passwords, wrapping keys, backups, actor tokens, and TLS keys are not included. Random keys in the harness exist in memory or temporary files; temporary recovery material is removed.

The secret scan and artifact review are documented in PUBLICATION_VALIDATION.md.

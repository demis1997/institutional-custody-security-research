# Recorded experimental outcomes

Application revision: 691e253ccdc2756afe215a23384eb72e2d4fde3c. All event times below are UTC.

## A divergent ledger counterexample

```json
{
  "experiment": "A",
  "name": "divergent ledger counterexample",
  "observedAt": "2026-10-21T15:35:59.785Z",
  "scope": "MODEL plus real authorize calls; no MPC or PostgreSQL",
  "budgetWei": "1000000000000000000",
  "amountWei": "600000000000000000",
  "reservationEachWei": "600042000000000000",
  "aggregateWei": "1200084000000000000",
  "sessions": [
    "A+B nonce 0",
    "A+C nonce 1"
  ],
  "honestViews": {
    "B": "600042000000000000",
    "C": "600042000000000000"
  },
  "globalModelExceeded": true,
  "centralReservationModel": "second rejected",
  "repositoryDatabaseBoundary": "source inspected; not executed"
}
```

## C stale backup

```json
{
  "experiment": "C",
  "name": "stale backup",
  "observedAt": "2026-10-21T15:35:59.854Z",
  "scope": "repository recovery function",
  "rejection": "stale_recovery_backup"
}
```

## C missing checkpoint

```json
{
  "experiment": "C",
  "name": "missing checkpoint",
  "observedAt": "2026-10-21T15:35:59.855Z",
  "scope": "repository recovery function",
  "rejection": "ENOENT: no such file or directory, open '/var/folders/dh/4ttpzpqx6xqcrys_2m4h8q140000gn/T/custody-research-6D3Nxr/anchor.json'"
}
```

## C tampered checkpoint digest

```json
{
  "experiment": "C",
  "name": "tampered checkpoint digest",
  "observedAt": "2026-10-21T15:35:59.856Z",
  "scope": "repository recovery function",
  "rejection": "stale_recovery_backup"
}
```

## C joint state and checkpoint rollback

```json
{
  "experiment": "C",
  "name": "joint state and checkpoint rollback",
  "observedAt": "2026-10-21T15:35:59.915Z",
  "scope": "declared privileged attacker with password and checkpoint write access; repository unchanged",
  "accepted": true,
  "restoredSessionMarker": true,
  "restoredReservation": true,
  "interpretation": "known same-host checkpoint trust limitation; no live signing/replay endpoint exercised"
}
```

## C directory relocation

```json
{
  "experiment": "C",
  "name": "directory relocation",
  "observedAt": "2026-10-21T15:35:59.980Z",
  "scope": "same OS account, not independent administration",
  "accepted": true,
  "independentAdministrators": "Not Executed",
  "partialWorkflow": "synthetic prepared session and ledger bytes preserved; real interrupted workflow Not Executed"
}
```

## D pure lifecycle checks

```json
{
  "experiment": "D",
  "name": "pure lifecycle checks",
  "observedAt": "2026-10-21T15:35:59.982Z",
  "scope": "transition function only",
  "retryTransition": "signing -> ready allowed",
  "terminalTransition": "signing -> blocked allowed",
  "confirmedResign": "invalid_transition",
  "nativeCases": "Not Executed: DKG, one signer offline, coordinator interruption, timeout, disconnection, native retry"
}
```

## B expired application authority and portable signature

```json
{
  "experiment": "B",
  "name": "expired application authority and portable signature",
  "observedAt": "2026-10-21T15:36:04.302Z",
  "scope": "real authorize and worker decision function; ordinary test ECDSA key; real Anvil. Full worker and MPC Not Executed",
  "authorizedAt": "2026-10-21T15:36:00.118Z",
  "expiresAt": "2026-10-21T15:36:04.118Z",
  "rejectedAt": "2026-10-21T15:36:04.220Z",
  "submittedAt": "2026-10-21T15:36:04.288Z",
  "applicationRejection": "approval_expired",
  "policyVersion": 1,
  "transactionHash": "0xffa529747ba093795fb1b9ff8ddbd727d9ccd5c46aa777bb36634d5d4247653d",
  "receiptStatus": 1,
  "blockNumber": 1,
  "receiptBlockTimestamp": 1792596964,
  "duplicateSubmissionOutcome": "rejected: nonce too low",
  "accountNonceAfterDuplicate": 1
}
```

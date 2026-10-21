def tables(content):
    b=content['benchmark']['rows']
    return {
    'threat':('Table 1. Institutional custody compromise matrix',['Scenario','Capabilities and boundary','Expected control','Residual risk','Evidence'],[
    ['Stolen API credentials','Call APIs within stolen role; authentication boundary','Detached approvals and signer validation','Denial of service; valid requests still possible','Source'],
    ['Compromised browser','Mislead reviewer or steal imported approval key','Independent trusted display and approval device','False intent can receive valid approvals; hardened device absent','Source'],
    ['One approval key','Issue one genuine approval','Distinct approvers and requester separation','Enough compromised keys authorize permitted transfers','Unit tests'],
    ['Policy administrator','Broaden signed limits or recipients','Separate approval keys and pinned trust set','Policy protection weakened; manual rotation','Source'],
    ['Coordinator','Choose work, deny service, retain signed bytes','Signer evidence checks and consistent reservation service','Portable signatures; stale policy and ledger divergence','A model; B function'],
    ['Single MPC signer','Leak share, abort, falsify local state','Threshold protocol and independent domains','Denial of service; inconsistent history needs separate control','A model only'],
    ['Threshold quorum','Generate signatures without application','Prevent common administration and protect shares','Direct asset movement possible','Analysis'],
    ['Malicious insider','Use granted role; collude with other authorities','Duty separation and independently reviewed intent','Collusion or misleading intent can satisfy formal policy','Unit tests only'],
    ['Database manipulation','Alter reservations, state, approvals, audit','Detached signatures; external state integrity','Global budgets and audit depend on trusted state','Source'],
    ['Signing host','Read keys, alter code or process memory','Independent hosts and external key protection','Shared prototype host defeats intended separation','Source'],
    ['HSM API abuse','Invoke permitted signing without extracting key','Operation scoped authorization at module/service boundary','Arbitrary digest access may preserve signing abuse','Analysis; no HSM'],
    ['Recovery infrastructure','Access backup password and comparison checkpoint','Independent rollback resistant checkpoints','Joint rollback accepted with declared privileges','C function'],
    ['Stale state restore','Present old encrypted backup','Retained latest checkpoint','Whole checkpoint loss or rollback outside guarantee','C function'],
    ['RPC provider','Lie about delivery, inclusion, balances','Independent observation and finality policy','Local Anvil trust; no public network failover','B Anvil only'],
    ['Software supply chain','Replace signer or common dependencies','Pinned builds, release separation, review','One trusted update root can control all signers','Source'],
    ['Quantum adversary','Derive classical key from known public key','Mandatory PQ authority and protected upgrades','Classical owner, guardian, delegation, network dependencies','Analysis']]),
    'experiments':('Table 2. Added experiments and actual execution scope',['Experiment','Observed outcome','Evidence boundary'],[
    ['A  Spending history','1.200084 ETH modeled against 1 ETH budget; central model rejects second','Executed model + authorize; real MPC and PostgreSQL Not Executed'],
    ['B  Approval expiry','Validator rejects; direct Anvil receipt status 1; duplicate nonce rejected','Executed validator + ordinary key + chain; full worker/MPC Not Executed'],
    ['C  Recovery rollback','Stale/missing/changed checkpoint rejected; joint rollback accepted','Executed recovery functions; separate administrators/live replay Not Executed'],
    ['D  Availability','Retry transitions allowed; confirmed to signing rejected','Pure state checks only; native outage/fault cases Not Executed']]),
    'sizes':('Table 3. Encoded sizes and security categories for selected schemes [7], [12], [13]',['Scheme','Security basis or category','Public key bytes','Signature bytes'],[
    ['ECDSA secp256k1','Elliptic curve discrete logarithm', '33 compressed','64 compact'],
    ['ML-DSA-44','Lattice assumptions; category 2','1,312','2,420'],
    ['ML-DSA-65','Lattice assumptions; category 3','1,952','3,309'],
    ['ML-DSA-87','Lattice assumptions; category 5','2,592','4,627'],
    ['SLH-DSA-SHA2-128s','Hash based; category 1','32','7,856'],
    ['ECDSA AND ML-DSA-65','Both verifiers required; composition dependent','1,985 sum','3,373 sum']]),
    'benchmark':('Table 4. Local CPU verification time in milliseconds per operation',['Scheme','Median of batch means','Min to max batch mean'],[
    [r['name'],f"{r['medianMs']:.3f}",f"{r['minMs']:.3f} to {r['maxMs']:.3f}"] for r in b]),
    'suitability':('Table 5. Verification and migration considerations',['Approach','Verification and EVM challenge','Custody suitability','Migration complexity'],[
    ['ML-DSA','Polynomial arithmetic, hash expansion, strict decoding; no gas result','Candidate for mandatory contract authorization; implementation review needed','New verifier, devices, key lifecycle and recovery'],
    ['SLH-DSA','Many hash operations; large calldata; no gas result','Alternative assumptions; signature volume and operational cost matter','Large message transport and account verifier integration'],
    ['Hybrid AND','Run both verifiers; bind the same context; close downgrade paths','Transition can retain protection if one scheme holds under composition assumptions','Dual key ceremonies and consistent retirement rules'],
    ['Contract account / ERC-4337','Validation interface, bundler limits and executable verifier','Can enforce PQ proof at asset boundary; not itself a signature scheme','Move EOA assets; audit owner, modules, upgrades and guardians'],
    ['Distributed PQ signing','Additional protocol rounds, proofs and abort behavior','Research direction; no implemented custody guarantee here','Protocol selection, integration, refresh and compatibility validation']])}

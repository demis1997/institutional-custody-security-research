import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {generateKeyPairSync,sign,randomBytes,randomUUID,createHash} from 'node:crypto';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,renameSync,existsSync,cpSync,rmSync} from 'node:fs';
import {tmpdir,platform,arch,release,cpus} from 'node:os';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=resolve(root,'source/quorum-custody');
const require=createRequire(resolve(source,'package.json'));
const {Transaction,SigningKey,Wallet,JsonRpcProvider,parseEther,computeAddress}=require('ethers');
const {authorize,approvalText,policyText,transition}=await import(resolve(source,'src/domain.ts'));
const {validateBroadcastDecision}=await import(resolve(source,'src/broadcast-decision.ts'));
const {initializeRecovery,checkpointRecovery,backupSigner,restoreSigner,verifyRecoveryState}=await import(resolve(source,'src/recovery.ts'));
const out=resolve(root,process.env.RESEARCH_RESULTS_DIR||'results/local'); mkdirSync(out,{recursive:true});
const records=[];
function record(experiment,name,details){const r={experiment,name,observedAt:new Date().toISOString(),...details}; records.push(r); console.log(JSON.stringify(r));}
function rejection(fn,pattern){let msg;try{fn();assert.fail('expected rejection');}catch(e){msg=e.message;assert.match(msg,pattern);}return msg;}
function fixture(value=parseEther('0.6'),nonce=0){
 const keys={};
 const actors=['requester','alice','bob','admin'].map(id=>{const p=generateKeyPairSync('ed25519');keys[id]=p.privateKey;return {id,role:id==='admin'?'admin':id==='requester'?'requester':'approver',publicKey:p.publicKey.export({type:'spki',format:'pem'}).toString(),tokenHash:'synthetic'};});
 const eth=Wallet.createRandom();
 const policy={version:1,chainId:31337,recipients:['0x000000000000000000000000000000000000bEEF'],perTransaction:parseEther('0.8').toString(),aggregate:parseEther('1').toString(),maxFeePerGas:'3000000000',requiredApprovers:2,separationOfDuties:true};
 const envelope={policy,signature:sign(null,Buffer.from(policyText(policy)),keys.admin).toString('hex')};
 const tx=Transaction.from({type:2,chainId:31337,nonce,to:policy.recipients[0],value,gasLimit:21000n,maxFeePerGas:2000000000n,maxPriorityFeePerGas:1000000000n,data:'0x',accessList:[]});
 const auth={walletId:randomUUID(),transactionId:randomUUID(),requester:'requester',digest:tx.unsignedHash,unsigned:tx.unsignedSerialized,publicKey:SigningKey.computePublicKey(eth.privateKey,true),policyVersion:1,expiresAt:new Date(Date.now()+4000).toISOString(),approvals:[],policyEnvelope:envelope};
 auth.approvals=['alice','bob'].map(actor=>({actor,signature:sign(null,Buffer.from(approvalText(auth)),keys[actor]).toString('hex')}));
 return {auth,actors,envelope,eth,keys,tx};
}

// A is explicitly a ledger model plus real application authorization, not native MPC.
{
 const f=fixture(), g={...f,auth:structuredClone(f.auth)};
 const tx=Transaction.from(g.auth.unsigned);tx.nonce=1;
 Object.assign(g.auth,{transactionId:randomUUID(),unsigned:tx.unsignedSerialized,digest:tx.unsignedHash});
 g.auth.approvals=['alice','bob'].map(actor=>({actor,signature:sign(null,Buffer.from(approvalText(g.auth)),f.keys[actor]).toString('hex')}));
 const cost1=authorize(f.auth,f.actors,f.envelope).reserved;
 const cost2=authorize(g.auth,g.actors,g.envelope).reserved;
 const budget=BigInt(f.envelope.policy.aggregate);
 const model={A:0n,B:0n,C:0n};
 assert.ok(model.A+cost1<=budget&&model.B+cost1<=budget);model.A+=cost1;model.B+=cost1;
 model.A=0n; // declared attacker model: A hides prior participation; repository not modified.
 assert.ok(model.A+cost2<=budget&&model.C+cost2<=budget);model.A+=cost2;model.C+=cost2;
 assert.ok(cost1+cost2>budget);
 let central=0n; const reserve=c=>{if(central+c>budget)return false;central+=c;return true;};
 assert.equal(reserve(cost1),true); assert.equal(reserve(cost2),false);
 record('A','divergent ledger counterexample',{scope:'MODEL plus real authorize calls; no MPC or PostgreSQL',budgetWei:budget.toString(),amountWei:parseEther('0.6').toString(),reservationEachWei:cost1.toString(),aggregateWei:(cost1+cost2).toString(),sessions:['A+B nonce 0','A+C nonce 1'],honestViews:{B:model.B.toString(),C:model.C.toString()},globalModelExceeded:true,centralReservationModel:'second rejected',repositoryDatabaseBoundary:'source inspected; not executed'});
}

// C calls unmodified repository recovery functions with synthetic data and no live signer.
{
 const temp=mkdtempSync(resolve(tmpdir(),'custody-research-'));
 try{
 const storage=resolve(temp,'signer'), anchor=resolve(temp,'anchor.json'), backup=resolve(temp,'backup.qcb');
 mkdirSync(storage,{mode:0o700});mkdirSync(resolve(storage,'sessions'),{mode:0o700});
 writeFileSync(resolve(storage,'wrapping.key'),randomBytes(32),{mode:0o600});
 const session=randomUUID();
 writeFileSync(resolve(storage,'sessions',session),'prepared',{mode:0o600});
 writeFileSync(resolve(storage,'ledger.json'),JSON.stringify({syntheticWallet:{reserved:'600042000000000000',attempts:1,nonce:0}}),{mode:0o600});
 initializeRecovery(storage,anchor);
 const identity={signer:'signer-1',fingerprint:'synthetic',trustContext:'research-only'}, password=randomBytes(32);
 backupSigner(storage,anchor,identity,password,backup);
 const oldAnchor=readFileSync(anchor);
 writeFileSync(resolve(storage,'ledger.json'),'{"new":"history"}',{mode:0o600});checkpointRecovery(storage,anchor);
 const latestAnchor=readFileSync(anchor);
 renameSync(storage,storage+'.lost');
 record('C','stale backup',{scope:'repository recovery function',rejection:rejection(()=>restoreSigner(storage,anchor,identity,password,backup),/stale_recovery_backup/)});
 renameSync(anchor,anchor+'.saved');
 record('C','missing checkpoint',{scope:'repository recovery function',rejection:rejection(()=>restoreSigner(storage,anchor,identity,password,backup),/ENOENT/)});
 writeFileSync(anchor,JSON.stringify({generation:1,digest:'0'.repeat(64)}),{mode:0o600});
 record('C','tampered checkpoint digest',{scope:'repository recovery function',rejection:rejection(()=>restoreSigner(storage,anchor,identity,password,backup),/stale_recovery_backup/)});
 writeFileSync(anchor,oldAnchor,{mode:0o600});
 restoreSigner(storage,anchor,identity,password,backup);verifyRecoveryState(storage,anchor);
 assert.equal(readFileSync(resolve(storage,'sessions',session),'utf8'),'prepared');
 assert.match(readFileSync(resolve(storage,'ledger.json'),'utf8'),/600042000000000000/);
 record('C','joint state and checkpoint rollback',{scope:'declared privileged attacker with password and checkpoint write access; repository unchanged',accepted:true,restoredSessionMarker:true,restoredReservation:true,interpretation:'known same-host checkpoint trust limitation; no live signing/replay endpoint exercised'});
 // Relocate a valid synthetic bundle and checkpoint, preserving its identity; same OS account.
 const other=resolve(temp,'other-domain-model');mkdirSync(other,{mode:0o700});
 const otherAnchor=resolve(other,'anchor.json');writeFileSync(otherAnchor,oldAnchor,{mode:0o600});
 restoreSigner(resolve(other,'signer'),otherAnchor,identity,password,backup);
 verifyRecoveryState(resolve(other,'signer'),otherAnchor);
 record('C','directory relocation',{scope:'same OS account, not independent administration',accepted:true,independentAdministrators:'Not Executed',partialWorkflow:'synthetic prepared session and ledger bytes preserved; real interrupted workflow Not Executed'});
 }finally{rmSync(temp,{recursive:true,force:true});}
}

// D limited pure lifecycle checks. Native availability cases remain Not Executed.
{
 transition('ready','signing');transition('signing','ready');transition('signing','blocked');transition('signed','broadcast');
 const rejected=rejection(()=>transition('confirmed','signing'),/invalid_transition/);
 record('D','pure lifecycle checks',{scope:'transition function only',retryTransition:'signing -> ready allowed',terminalTransition:'signing -> blocked allowed',confirmedResign:rejected,nativeCases:'Not Executed: DKG, one signer offline, coordinator interruption, timeout, disconnection, native retry'});
}

// B uses real approvals and broadcast validation plus an ordinary complete test key and Anvil.
let chain;
try{
 const port=Number(process.env.RESEARCH_PORT??18545);
 chain=spawn(process.env.ANVIL_BIN??'anvil',['--host','127.0.0.1','--port',String(port),'--chain-id','31337','--accounts','0','--silent'],{stdio:'ignore'});
 let spawnError;chain.on('error',e=>{spawnError=e;});
 const rpc=new JsonRpcProvider(`http://127.0.0.1:${port}`,31337,{staticNetwork:true});
 let ready=false;
 for(let i=0;i<50;i++){if(spawnError)throw spawnError;try{await rpc.send('eth_chainId',[]);ready=true;break;}catch{}await new Promise(r=>setTimeout(r,100));}
 assert.ok(ready,'Anvil failed to start');
 const f=fixture(parseEther('0.01'));
 const authorizedAt=new Date().toISOString();authorize(f.auth,f.actors,f.envelope);
 await rpc.send('anvil_setBalance',[f.eth.address,'0x8ac7230489e80000']);
 f.tx.signature=new SigningKey(f.eth.privateKey).sign(f.tx.unsignedHash);
 const row={state:'signed',signed_raw:f.tx.serialized,tx_hash:f.tx.hash,unsigned:f.tx.unsignedSerialized,broadcast_attempts:0};
 writeFileSync(resolve(out,'B-public-signed-transaction.json'),JSON.stringify({hash:row.tx_hash,raw:row.signed_raw,expiresAt:f.auth.expiresAt,chainId:31337},null,2));
 validateBroadcastDecision(row,f.auth,f.actors,f.envelope);
 const expiration=Date.parse(f.auth.expiresAt);
 await new Promise(r=>setTimeout(r,Math.max(0,expiration-Date.now()+100)));
 const rejectedAt=new Date().toISOString();
 const error=rejection(()=>validateBroadcastDecision(row,f.auth,f.actors,f.envelope),/approval_expired/);
 const hash=await rpc.send('eth_sendRawTransaction',[row.signed_raw]);assert.equal(hash,row.tx_hash);
 const receipt=await rpc.waitForTransaction(hash,1,10000);assert.equal(receipt.status,1);
 let duplicate;try{duplicate=await rpc.send('eth_sendRawTransaction',[row.signed_raw]);}catch(e){duplicate='rejected: '+(e?.info?.error?.message??e.shortMessage??'RPC error');}
 const nonce=await rpc.getTransactionCount(f.eth.address,'latest');assert.equal(nonce,1);
 record('B','expired application authority and portable signature',{scope:'real authorize and worker decision function; ordinary test ECDSA key; real Anvil. Full worker and MPC Not Executed',authorizedAt,expiresAt:f.auth.expiresAt,rejectedAt,submittedAt:new Date().toISOString(),applicationRejection:error,policyVersion:1,transactionHash:hash,receiptStatus:receipt.status,blockNumber:receipt.blockNumber,receiptBlockTimestamp:Number((await rpc.getBlock(receipt.blockNumber)).timestamp),duplicateSubmissionOutcome:duplicate,accountNonceAfterDuplicate:nonce});
 rpc.destroy();
}catch(e){record('B','execution failure',{scope:'Not Executed or incomplete',error:e.message});process.exitCode=1;}
finally{if(chain){chain.kill('SIGTERM');await new Promise(r=>chain.once('exit',r));}}
const result={revision:'691e253ccdc2756afe215a23384eb72e2d4fde3c',environment:{node:process.version,platform:platform(),arch:arch(),release:release(),cpu:cpus()[0]?.model},records};
writeFileSync(resolve(out,'security-experiments.json'),JSON.stringify(result,null,2));

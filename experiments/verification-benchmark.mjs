import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {randomBytes} from 'node:crypto';
import {writeFileSync,readFileSync,mkdirSync} from 'node:fs';
import {cpus,platform,arch,release} from 'node:os';
import {performance} from 'node:perf_hooks';
import {ml_dsa44,ml_dsa65,ml_dsa87} from '@noble/post-quantum/ml-dsa.js';
import {slh_dsa_sha2_128s} from '@noble/post-quantum/slh-dsa.js';
const require=createRequire(new URL('../source/quorum-custody/package.json',import.meta.url));
const {secp256k1}=require('@noble/curves/secp256k1');
const msg=randomBytes(32),sk=randomBytes(32),pk=secp256k1.getPublicKey(sk,true);
const sig=secp256k1.sign(msg,sk).toCompactRawBytes();
const classical={name:'ECDSA secp256k1 compact',pk:pk.length,sig:sig.length,verify:()=>secp256k1.verify(sig,msg,pk),tamper:()=>secp256k1.verify(sig,new Uint8Array(32),pk)};
const cases=[classical];
for(const [name,alg] of [['ML-DSA-44',ml_dsa44],['ML-DSA-65',ml_dsa65],['ML-DSA-87',ml_dsa87],['SLH-DSA-SHA2-128s',slh_dsa_sha2_128s]]){
 const keys=alg.keygen(),signature=alg.sign(msg,keys.secretKey);
 cases.push({name,pk:keys.publicKey.length,sig:signature.length,verify:()=>alg.verify(signature,msg,keys.publicKey),tamper:()=>alg.verify(signature,new Uint8Array(32),keys.publicKey)});
}
const pq=cases.find(c=>c.name==='ML-DSA-65');
cases.push({name:'Hybrid AND ECDSA + ML-DSA-65',pk:classical.pk+pq.pk,sig:classical.sig+pq.sig,verify:()=>classical.verify()&&pq.verify(),tamper:()=>classical.verify()&&pq.tamper()});
const rows=[];
for(const c of cases){
 assert.equal(c.verify(),true);assert.equal(c.tamper(),false);
 for(let i=0;i<5;i++)assert.equal(c.verify(),true);
 const samples=[];for(let batch=0;batch<7;batch++){let start=performance.now();for(let i=0;i<30;i++)assert.equal(c.verify(),true);samples.push((performance.now()-start)/30);}
 const sorted=[...samples].sort((a,b)=>a-b);
 rows.push({name:c.name,publicKeyBytes:c.pk,signatureBytes:c.sig,medianMs:sorted[3],minMs:sorted[0],maxMs:sorted[6],batchMeansMs:samples,warmup:5,batches:7,verificationsPerBatch:30,alteredMessageRejected:true});
}
const out={executedAt:new Date().toISOString(),environment:{node:process.version,platform:platform(),arch:arch(),release:release(),cpu:cpus()[0].model},libraries:{postQuantum:JSON.parse(readFileSync(new URL('../node_modules/@noble/post-quantum/package.json',import.meta.url))).version,curves:JSON.parse(readFileSync(new URL('../source/quorum-custody/node_modules/@noble/curves/package.json',import.meta.url))).version},messageBytes:32,limitations:'Single process JavaScript CPU verification only. Different security categories. No EVM verifier, gas, constant time analysis, signing benchmark, browser, HSM, or threshold PQ signing. One generated key/message/signature per algorithm; warm JIT and process noise influence timing.',rows};
const outDir=new URL('../'+(process.env.RESEARCH_RESULTS_DIR||'results/local').replace(/\/$/,'')+'/',import.meta.url);
mkdirSync(outDir,{recursive:true});
writeFileSync(new URL('verification-benchmark.json',outDir),JSON.stringify(out,null,2));console.log(JSON.stringify(out,null,2));

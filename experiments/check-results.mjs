import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=p=>JSON.parse(readFileSync(new URL('../results/local/'+p,import.meta.url)));
const tap=readFileSync(new URL('../results/local/repeated-unit-tests.txt',import.meta.url),'utf8');
assert.match(tap,/# pass 26\b/);assert.match(tap,/# fail 0\b/);assert.match(tap,/# skipped 0\b/);
const evidence=load('security-experiments.json');
assert.equal(evidence.revision,'691e253ccdc2756afe215a23384eb72e2d4fde3c');
for(const id of ['A','B','C','D'])assert.ok(evidence.records.some(r=>r.experiment===id));
const b=load('verification-benchmark.json');assert.equal(b.rows.length,6);
for(const row of b.rows){assert.equal(row.alteredMessageRejected,true);assert.equal(row.batches,7);assert.equal(row.verificationsPerBatch,30);assert.ok(row.medianMs>0);}
console.log('Fresh evidence checks passed: 26 unit tests, four scoped experiment records, six verification benchmarks.');

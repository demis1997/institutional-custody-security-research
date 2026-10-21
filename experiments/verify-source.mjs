import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const manifest=JSON.parse(readFileSync(new URL('../docs/SOURCE_MANIFEST.json',import.meta.url)));
for(const [path,expected] of Object.entries(manifest.files)){
 const data=readFileSync(new URL('../source/quorum-custody/'+path,import.meta.url));
 const actual=createHash('sha256').update(data).digest('hex');
 if(actual!==expected)throw Error('source hash mismatch: '+path);
}
console.log('Pinned source hashes match '+manifest.revision);

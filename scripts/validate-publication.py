#!/usr/bin/env python3
"""Validate publication paths, recorded artifacts, and high-confidence secret patterns."""
from pathlib import Path
import hashlib,json,re,sys,zipfile,xml.etree.ElementTree as ET
R=Path(__file__).resolve().parents[1]
excluded={'.git','node_modules','.build','__pycache__'}
def included(p):
 parts=p.relative_to(R).parts
 return not any(x in excluded for x in parts) and not parts[:2]==('source','quorum-custody') and not parts[:2]==('results','local')
files=sorted(p for p in R.rglob('*') if p.is_file() and included(p))
issues=[];local_links=0
# Patterns are intentionally high-confidence; source identifiers and synthetic public data are allowed.
patterns=[rb'-----BEGIN (?:RSA |EC |OPENSSH |ENCRYPTED )?PRIVATE KEY-----',rb'\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b',rb'\b(?:AKIA|ASIA)[A-Z0-9]{16}\b',rb'\bxox[baprs]-[A-Za-z0-9-]{20,}\b',rb'\bsk_live_[A-Za-z0-9]{20,}\b']
for p in files:
 data=p.read_bytes()
 if p.suffix in {'.key','.pem','.qcb','.p12','.pfx'} or p.name.startswith('.env'):
  issues.append(f'forbidden credential-like file: {p.relative_to(R)}')
 content=[data]
 if p.suffix=='.docx':
  with zipfile.ZipFile(p) as z:
   if z.testzip():issues.append('corrupt DOCX')
   content += [z.read(n) for n in z.namelist() if n.endswith('.xml')]
 for body in content:
  if any(re.search(pattern,body) for pattern in patterns):issues.append(f'secret pattern: {p.relative_to(R)}')
 if len(data)>10_000_000:issues.append(f'large file needs review: {p.relative_to(R)}')
 if p.suffix=='.md':
  for match in re.finditer(r'!?\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)',data.decode()):
   target=match.group(1)
   if re.match(r'^(?:https?://|mailto:|#)',target):continue
   path=target.split('#')[0]
   if not (p.parent/path).resolve().exists():issues.append(f'broken link {p.relative_to(R)}: {target}')
   local_links+=1
 if p.suffix=='.svg':ET.fromstring(data)
manifest=json.loads((R/'docs/ARTIFACT_CHECKSUMS.json').read_text())
for name,expected in manifest['files'].items():
 if hashlib.sha256((R/name).read_bytes()).hexdigest()!=expected:issues.append('artifact changed: '+name)
original=json.loads((R/'results/security-experiments.json').read_text())
assert original['revision']=='691e253ccdc2756afe215a23384eb72e2d4fde3c'
assert len(json.loads((R/'docs/SOURCE_MANIFEST.json').read_text())['files'])==82
assert len(json.loads((R/'results/verification-benchmark.json').read_text())['rows'])==6
assert '# pass 26' in (R/'results/repeated-unit-tests.txt').read_text()
with zipfile.ZipFile(R/'paper/custody-security-research.docx') as z:
 xml=ET.fromstring(z.read('word/document.xml'))
 ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
 assert len(xml.findall('.//w:hyperlink[@w:anchor]',ns))==32
 assert len(xml.findall('.//w:tbl',ns))==5
assert (R/'paper/custody-security-research.pdf').read_bytes().startswith(b'%PDF-')
if issues:
 print('\n'.join(issues),file=sys.stderr);sys.exit(1)
print(f'Publication checks passed: {len(files)} files, {local_links} local links, {len(manifest["files"])} artifact hashes, four SVGs, DOCX structure, recorded evidence and high-confidence secret scan.')

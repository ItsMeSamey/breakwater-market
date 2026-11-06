"""Build the offline HTML from local source; no downloads or dependencies."""
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).resolve().parent
html=(ROOT/'index.html').read_text()
style=(ROOT/'style.css').read_text()
core=(ROOT/'core.js').read_text()
game=(ROOT/'game.js').read_text()
assert '</script' not in (core+game).lower()
assert html.count('<link rel="stylesheet" href="style.css">')==1
assert html.count('<script defer src="core.js"></script><script defer src="game.js"></script>')==1
html=html.replace('<link rel="stylesheet" href="style.css">','<style>'+style+'</style>')
# Scripts follow the DOM so the offline build needs no defer or module loader.
html=html.replace('<script defer src="core.js"></script><script defer src="game.js"></script>','')
html=html.replace('</body>','<script>'+core+'</script><script>'+game+'</script></body>')
out=ROOT/'build';out.mkdir(exist_ok=True)
(out/'index.html').write_text(html)
documents=['SOURCE_NOTES.md','VERIFICATION.md','RULES_FREEZE.md','RULES_PRE_RUN_REVISION.md','RULES_V2.md','RULES_V3.md','EVALUATION_DRAFT.md','GAMEPLAY_DIAGNOSTIC_FREEZE.md','V3_DIAGNOSTIC_CRITERIA_FREEZE.md','STRUCTURAL_CHECK_V3_CONTRACT.md']
for name in documents:
 (out/name).write_bytes((ROOT/name).read_bytes())
manifest={name:{'bytes':(out/name).stat().st_size,'sha256':hashlib.sha256((out/name).read_bytes()).hexdigest()} for name in ['index.html',*documents]}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps(manifest,indent=2))

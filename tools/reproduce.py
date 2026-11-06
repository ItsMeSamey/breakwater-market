"""Reproduce frozen checks in a fresh directory; never overwrite bundled evidence."""
from pathlib import Path
import hashlib,json,shutil,subprocess,tempfile,time
ROOT=Path(__file__).resolve().parents[1]
FILES=['core.js','game.js','index.html','style.css','build.py','SOURCE_NOTES.md','VERIFICATION.md','RULES_FREEZE.md','RULES_PRE_RUN_REVISION.md','RULES_V2.md','RULES_V3.md','EVALUATION_DRAFT.md','GAMEPLAY_DIAGNOSTIC_FREEZE.md','V3_DIAGNOSTIC_CRITERIA_FREEZE.md','STRUCTURAL_CHECK_V3_CONTRACT.md','tests/core.test.cjs','tests/preview-evaluation.cjs','tests/gameplay-diagnostic-v3.cjs','tests/structural-v3.py']
work=Path(tempfile.mkdtemp(prefix='breakwater-reproduction-'))
report={'scope':'Isolated package reproduction, not a new untouched qualification set.','files':{},'steps':[]}
for name in FILES:
    src=ROOT/name; dst=work/name;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(src,dst)
    report['files'][name]=hashlib.sha256(src.read_bytes()).hexdigest()
(work/'evidence').mkdir()
commands=[('build',['python3','build.py']),('core',['node','--test','tests/core.test.cjs']),('preview',['node','tests/preview-evaluation.cjs']),('qualification',['node','tests/gameplay-diagnostic-v3.cjs','qualification']),('structural',['python3','tests/structural-v3.py'])]
for label,command in commands:
    start=time.monotonic()
    with (work/(label+'.stdout')).open('w') as out,(work/(label+'.stderr')).open('w') as err:
        result=subprocess.run(command,cwd=work,stdout=out,stderr=err,timeout=120)
    report['steps'].append({'label':label,'exit_code':result.returncode,'seconds':round(time.monotonic()-start,3)})
    (work/'reproduction.json').write_text(json.dumps(report,indent=2)+'\n')
    if result.returncode:
        print(json.dumps({'directory':str(work),'result':report},indent=2));raise SystemExit(result.returncode)
preview=json.loads((work/'preview.stdout').read_text())
report['preview']={key:preview[key] for key in ['primaryInputSha256','primaryCaseCount','checks','failures']}
report['qualification']=json.loads((work/'evidence/v3-qualification/gameplay-summary.json').read_text())
structural=json.loads((work/'evidence/v3-structural-check/summary.json').read_text())
report['structural']={key:structural[key] for key in ['status','structuralCases','economicCases','economicComparisonCases','stayCoverBetterThanBestSafe']}
report['build_sha256']=hashlib.sha256((work/'build/index.html').read_bytes()).hexdigest()
(work/'reproduction.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'directory':str(work),'report':str(work/'reproduction.json'),'steps':report['steps'],'preview':report['preview'],'structural':report['structural'],'build_sha256':report['build_sha256']},indent=2))

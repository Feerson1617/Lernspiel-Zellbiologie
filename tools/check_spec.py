#!/usr/bin/env python3
"""Validate this concept package, not a game or its future answer evaluator.
Requires Python >=3.10 and jsonschema. Run from any directory.
"""
from __future__ import annotations
import copy, hashlib, json, math, platform, re, shutil, subprocess, sys
from collections import Counter
from pathlib import Path
try:
    from jsonschema import Draft202012Validator
except ImportError:
    raise SystemExit('Missing dependency: jsonschema. Install it in your development environment; no learner runtime dependency.')
ROOT = Path(__file__).resolve().parents[1]
checks: list[dict] = []
def check(name: str, condition: bool, detail: str = '') -> None:
    checks.append({'check': name, 'passed': bool(condition), 'detail': detail})
def read(path: str):
    return json.loads((ROOT / path).read_text(encoding='utf-8'))
def eq(a, b):
    if isinstance(b, dict): return isinstance(a, dict) and set(a) == set(b) and all(eq(a[k],v) for k,v in b.items())
    if isinstance(b, list): return isinstance(a,list) and len(a)==len(b) and all(eq(x,y) for x,y in zip(a,b))
    if isinstance(b, (int,float)) and not isinstance(b,bool):
        return isinstance(a,(int,float)) and math.isfinite(a) and math.isclose(a,b,rel_tol=1e-10,abs_tol=1e-27)
    return a==b

def calculate(v:dict, R:float)->dict:
    i=v['inputs'];k=v['kind']
    if k=='osmotic_pressure_difference':return {'pressure_Pa':R*i['temperature_K']*i['delta_concentration_mol_m3']}
    if k=='potential':
        x=i['inside_P_Pa']-R*i['temperature_K']*i['inside_C_mol_m3'];y=i['outside_P_Pa']-R*i['temperature_K']*i['outside_C_mol_m3']
        return {'inside_Psi_Pa':x,'outside_Psi_Pa':y,'net':'zero' if abs(x-y)<1e-6 else ('in' if y>x else 'out')}
    if k=='wall_reference':return {'V_relaxed_m3':i['initial_volume_m3']/(1+i['initial_P_Pa']/i['K_Pa'])}
    if k=='solute_volume_equilibrium':
        c=i['cytosol_n_mol']/i['C_external_mol_m3'];v=i['vacuole_n_mol']/i['C_external_mol_m3'];return {'cytosol_V_m3':c,'vacuole_V_m3':v,'total_V_m3':c+v}
    if k=='volume_derivative_balance':
        e=-i['Q_ec_m3_s'];c=i['Q_ec_m3_s']-i['Q_cv_m3_s'];v=i['Q_cv_m3_s'];return {'dVe_m3_s':e,'dVc_m3_s':c,'dVv_m3_s':v,'sum':e+c+v}
    if k=='three_potentials':return {'plasma':'e_to_c' if i['e_MPa']>i['c_MPa'] else ('c_to_e' if i['e_MPa']<i['c_MPa'] else 'zero'),'tonoplast':'c_to_v' if i['c_MPa']>i['v_MPa'] else ('v_to_c' if i['c_MPa']<i['v_MPa'] else 'zero')}
    if k=='diffusion_counts':return {'left':i['left']-i['lr']+i['rl'],'right':i['right']+i['lr']-i['rl'],'net_right':i['lr']-i['rl'],'total':i['left']+i['right']}
    if k=='expected_net':return {'mean_net_right':i['p']*(i['left']-i['right'])}
    if k=='concentration_ratio':return {'N_left':i['N_total']*i['V_left']/(i['V_left']+i['V_right']),'N_right':i['N_total']*i['V_right']/(i['V_left']+i['V_right'])}
    if k=='relative_mass':return {'percent':[(m-i['m0_g'])/i['m0_g']*100 for m in i['mf_g']]}
    if k=='linear_root':return {'x0_mol_L':i['x1']-i['y1']*(i['x2']-i['x1'])/(i['y2']-i['y1'])}
    if k=='deviation':return {'target_difference':i['current']-i['target'],'upper_difference':i['current']-i['upper']}
    if k=='binary_growth':return {'N':i['N0']*2**(i['duration_min']/i['doubling_min'])}
    if k=='neutral_rate':return {'J_mol_s':i['P_m_s']*i['A_m2']*(i['Cout']-i['Cin'])+i['Jmax']*(i['Cout']/(i['Km']+i['Cout'])-i['Cin']/(i['Km']+i['Cin']))}
    raise ValueError(f'Unsupported reference kind {k}')

for f in sorted((ROOT/'spec').glob('*.json')):
    try: json.loads(f.read_text());check(f'JSON/{f.name}',True)
    except (ValueError,OSError) as e:check(f'JSON/{f.name}',False,str(e))
schemas={f.stem.replace('.schema',''):json.loads(f.read_text()) for f in (ROOT/'spec').glob('*.schema.json')}
for k,s in schemas.items():
    try:Draft202012Validator.check_schema(s);check(f'Schema/{k}',True)
    except Exception as e:check(f'Schema/{k}',False,str(e))
bank=read('spec/tasks.json');ts=bank['tasks'];missions=read('spec/missions.json')['missions'];rules=read('spec/text-rubrics.json')['rules'];fx=read('spec/reference-fixtures.json')['cases'];vec=read('spec/model-vectors.json');mid={m['id'] for m in missions};tid={t['id'] for t in ts};rids={r['id'] for r in rules}
errors=list(Draft202012Validator(schemas['task']).iter_errors(bank));check('Task-bank schema',not errors,'; '.join(e.message for e in errors[:5]))
check('79 unique tasks',len(ts)==len(tid)==79);check('19 unique mission/module records',len(missions)==len(mid)==19)
core={f'Z{i}' for i in range(1,5)}|{f'M{i}' for i in range(1,11)}
check('14 core missions x 4 tasks',all(sum(t['mission_id']==m for t in ts)==4 for m in core))
check('6 diagnostic, 9 supplementary, 8 training tasks',sum(t['mission_id']=='D0' for t in ts)==6 and sum(t['mission_id'] in {'E1','E2','E3'} for t in ts)==9 and sum(t['mission_id']=='T' for t in ts)==8)
allcrit=[c['id'] for t in ts for c in t['criteria']];check('Unique criterion IDs',len(allcrit)==len(set(allcrit)))
fields={}
for t in ts:
    id=t['id'];check(id+'/mission',t['mission_id'] in mid);check(id+'/complete authoring content',all(t[k] for k in ['material','prompt','expected','source_refs','criteria','hints']))
    check(id+'/solution equals expected',t['feedback']['solution']==t['expected'])
    opts=t['response_spec'].get('options',{})
    if t['type'] in {'single','multi'}:
        correct={t['expected']['correct_id']} if t['type']=='single' else set(t['expected']['correct_ids'])
        check(id+'/options and error reasons',bool(correct) and correct<=set(opts) and (set(opts)-correct)<=set(t['expected'].get('wrong_reasons',{})))
    if t['type']=='bounded_text':
        for f in t['response_spec']['fields']:
            fe=t['expected'].get('fields',{}).get(f['id'],t['expected']);fields[(id,f['id'])]=fe['rule_id'];check(id+'/'+f['id']+'/rule',fe['rule_id'] in rids)
check('7 bounded-text fields',len(fields)==7)
check('Unique reference case IDs',len(fx)==len({f['id'] for f in fx}))
check('Reference corpus is not mislabeled as independent/executed',not read('spec/reference-fixtures.json')['runtime_execution'] and read('spec/reference-fixtures.json')['independent_review_count']==0 and all(not f['executed_against_game'] for f in fx))
for f in fx:
    check(f['id']+'/field', (f['task_id'],f['field_id']) in fields)
    check(f['id']+'/no declared critical false judgement', not(f['semantic_truth']=='fully_correct' and f['expected_status']=='incorrect') and not(f['semantic_truth']=='incorrect' and f['expected_status']=='correct'))
check('Every text field has reference cases',set(fields)<=set((f['task_id'],f['field_id']) for f in fx))
# Runtime-schema positive/negative examples. No pupil response is run through an evaluator.
rv=Draft202012Validator(schemas['result']);base={'taskId':'Z1.02','taskVersion':'1','rubricVersion':'1','contextHash':'example','status':'correct','criteria':[{'id':'Z1.02.C01','status':'correct','evidence':[{'kind':'input_span','value':'Tonoplast','start':0,'end':9}],'reasonCode':'CORRECT_TERM'}],'unassessedRelevantText':False,'assistance':'independent','feedbackCode':'TERM_CORRECT'}
check('Result schema accepts consistent example',rv.is_valid(base))
for name,patch in [('green with unassessed rest',{'unassessedRelevantText':True}),('unknown color as status',{'status':'green'}),('green without criteria',{'criteria':[]})]:
    b=copy.deepcopy(base);b.update(patch);check('Reject '+name,not rv.is_valid(b))
b=copy.deepcopy(base);b['criteria'][0]['status']='incorrect';check('Reject green with false subcriterion',not rv.is_valid(b))
b=copy.deepcopy(base);b['status']='incorrect';check('Reject red without false criterion',not rv.is_valid(b))
b['criteria'][0]['status']='incorrect';b['criteria'][0]['evidence']=[];check('Reject red without evidence',not rv.is_valid(b))
b['criteria'][0]['evidence']=[{'kind':'input_span','value':'Zellwand','start':0,'end':8}];b['criteria'][0]['reasonCode']='WRONG_BOUNDARY';check('Accept evidenced incorrect schema sample',rv.is_valid(b))
pv=Draft202012Validator(schemas['progress']);p={'schemaVersion':1,'contentVersion':'concept','attempts':[]};check('Progress schema accepts empty state',pv.is_valid(p));p['rawAnswer']='student text';check('Reject raw pupil text in progress',not pv.is_valid(p))
p['name']='Name';check('Reject undeclared personal fields',not pv.is_valid(p))
for v in vec['vectors']:
    actual=calculate(v,vec['R_J_mol_K']);check(v['id']+'/reference arithmetic',eq(actual,v['expected']),f'calculated={actual}')
check('Tiny transport values are not hidden by a loose tolerance',not eq(0,1e-15))
# Exact generated text cross-check for F.
ftext=(ROOT/'F_Aufgabenkatalog.md').read_text()
for t in ts:
    check(t['id']+'/readable companion',ftext.count(f"### {t['id']} ·")==1 and t['prompt'] in ftext and json.dumps(t['expected'],ensure_ascii=False,indent=2) in ftext)
for pth in ROOT.glob('*.md'):check('Markdown fences/'+pth.name,pth.read_text().count('```')%2==0)
check('No original source binaries in package',not any(f.suffix.lower() in {'.pdf','.docx','.zip','.blend','.glb'} for f in ROOT.rglob('*') if f.is_file()))
# Type declaration check, if the installed compiler is available.
tsc=shutil.which('tsc');tscheck={'executed':False}
if tsc:
    proc=subprocess.run([tsc,'--noEmit','--strict','--target','ES2020',str(ROOT/'spec/contracts.d.ts')],capture_output=True,text=True,timeout=30)
    tscheck={'executed':True,'returncode':proc.returncode,'stdout':proc.stdout,'stderr':proc.stderr,'command':'tsc --noEmit --strict --target ES2020 spec/contracts.d.ts'}
    check('Type declaration compiles',proc.returncode==0,proc.stdout+proc.stderr)
report={'scope':'Concept data/schema/reference arithmetic only. No game or response evaluator exists here.','python':platform.python_version(),'checks_passed':sum(c['passed'] for c in checks),'checks_failed':sum(not c['passed'] for c in checks),'tasks':len(ts),'core_missions':len(core),'mission_module_records':len(missions),'criteria':len(allcrit),'text_fields':len(fields),'reference_cases':len(fx),'reference_case_statuses':dict(Counter(f['expected_status'] for f in fx)),'mathematical_vectors':len(vec['vectors']),'new_game_runtime_tests_executed':0,'independent_counterchecks_executed':0,'typescript_declaration_check':tscheck,'checks':checks}
(ROOT/'QA').mkdir(exist_ok=True)
(ROOT/'QA/Konzeptpruefung.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in {'checks','typescript_declaration_check'}},ensure_ascii=False,indent=2))
if report['checks_failed']:
    print('\n'.join(str(c) for c in checks if not c['passed']));sys.exit(1)

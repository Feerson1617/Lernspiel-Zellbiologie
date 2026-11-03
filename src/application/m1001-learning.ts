import { evaluateNumeric } from '../assessment/numeric.ts';
import { createM1001Context, M1001_ROWS, M1001_VERSIONS, validateM1001Context } from '../content/m1001.ts';
import { createContextBinding } from '../domain/task-context.ts';
import { createAttemptRecord, appendAttempt, parseProgress } from '../domain/progress.ts';
import type { Assistance } from '../domain/contracts.ts';
export function createM1001Learning(options: { resumed?: boolean } = {}) {
  let context=createM1001Context(crypto.randomUUID()), revision=0, evaluatedRevision=-1;
  let answers: Record<string,string>={}, writing='', assistance: Assistance='independent';
  let results: ReturnType<typeof evaluateNumeric>[] | null=null;
  let receipt: ReturnType<typeof createAttemptRecord> | null=null;
  let progress=parseProgress({ schemaVersion:1, contentVersion:M1001_VERSIONS.contentVersion, attempts:[] });
  const navigation=globalThis.performance?.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const historyUnverified=options.resumed ?? (navigation !== undefined && navigation.type!=='navigate');
  function invalidate() { revision++; receipt=null; }
  function submit() {
    validateM1001Context(context);
    if (evaluatedRevision===revision && results) return results;
    results=M1001_ROWS.map(row=>evaluateNumeric(answers[row.field] ?? '',{ expected:row.expected, tolerance:'0.05', unit:'percent' }));
    evaluatedRevision=revision;
    if (results.every(r=>r.status==='correct') && !historyUnverified) {
      receipt=createAttemptRecord(crypto.randomUUID(),{ ...createContextBinding(context),status:'correct',assistance },context);
      progress=appendAttempt(progress,receipt);
    }
    return results;
  }
  return Object.freeze({ submit,
    edit(field: string, value: string) { if (!M1001_ROWS.some(r=>r.field===field) || typeof value!=='string') throw new Error('Unknown input.'); if (answers[field]!==value) { answers={...answers,[field]:value}; invalidate(); } },
    editWriting(value: string) { writing=value; },
    help(level: 1|2|3) { if (![1,2,3].includes(level)) throw new Error('Unknown help.'); assistance=level===3 || assistance==='solution_viewed' ? 'solution_viewed':'hint'; invalidate(); },
    reset() { context=createM1001Context(crypto.randomUUID()); answers={}; writing=''; results=null; invalidate(); },
    getState:()=>Object.freeze({ context, answers:Object.freeze({...answers}), writing, assistance, historyUnverified, results:results && Object.freeze([...results]), stale:results!==null && revision!==evaluatedRevision, receipt, progress }),
  });
}
export type M1001Learning = ReturnType<typeof createM1001Learning>;

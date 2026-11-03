import { createM602Learning } from './m602-learning.ts';
import { mountM602Learning } from '../ui/m602-learning.ts';
import { createM603Learning } from './m603-learning.ts';
import { mountM603Learning } from '../ui/m603-learning.ts';
import type { M603PriorHelp } from './m603-learning.ts';
import { M602_FIELDS } from '../domain/m602-contract.ts';
import { createM604Learning } from './m604-learning.ts';
import { mountM604Learning } from '../ui/m604-learning.ts';
import type { M604PriorHelp } from './m604-learning.ts';

let m602: ReturnType<typeof createM602Learning> | undefined;
let m602View: HTMLElement | undefined;
let m603: ReturnType<typeof createM603Learning> | undefined;
let m603View: HTMLElement | undefined;
let m603Mount: ReturnType<typeof mountM603Learning> | undefined;
const priorHelp = new Map<string, M603PriorHelp>();
let priorUnverified = false;
let m604: ReturnType<typeof createM604Learning> | undefined;
let m604View: HTMLElement | undefined;

function syncM604Help() {
  if (!m604) return;
  const events: M604PriorHelp[] = [...priorHelp.values()].map(event => ({ ...event, taskId: 'M6.02' }));
  const causal = m603?.getState();
  if (causal) for (const event of causal.help) {
    // M6.02 events are already captured with their original stable identity.
    if (event.taskId === 'M6.03') events.push({ id: `causal-${event.id}`, taskId: 'M6.03', source: event.source, contextHash: event.contextHash, kind: event.kind });
  }
  m604.syncPriorHelp(events, priorUnverified || Boolean(causal?.historyUnverified));
}

function rememberM602Help() {
  if (!m602) return;
  const state = m602.getState();
  priorUnverified ||= state.support.history === 'history_unverified';
  for (const field of M602_FIELDS) for (const event of state.support.fields[field].events) {
    priorHelp.set(event.id, { id: event.id, source: `M6.02/${field}/${event.kind}`, contextHash: event.contextHash, kind: event.kind });
  }
}

/** Lazy production entry; internal regression labs remain excluded by Vite. */
export function createM602View(): HTMLElement {
  if (!m602) {
    const base = createM602Learning();
    function capture() { rememberM602Help(); m603?.syncPriorHelp([...priorHelp.values()], priorUnverified); syncM604Help(); }
    // Observe actual disclosures before case changes; the existing controller,
    // corrector, progress contract and its stored receipts remain unchanged.
    m602 = Object.freeze({ ...base,
      help: (...args: Parameters<typeof base.help>) => { base.help(...args); capture(); },
      choose: (...args: Parameters<typeof base.choose>) => { base.choose(...args); capture(); },
      showNotebookSolution: () => { base.showNotebookSolution(); capture(); },
      activateCase: (...args: Parameters<typeof base.activateCase>) => { capture(); base.activateCase(...args); capture(); },
    });
  }
  if (!m602View) { m602View = document.createElement('div'); mountM602Learning(m602View, m602); }
  return m602View;
}

/** Both public exercises intentionally share the existing authorized lazy chunk.
 * No M6.02 assessor changes and no new initial-entry solution data. */
export function createM603View(): HTMLElement {
  rememberM602Help();
  m603 ??= createM603Learning(); m603View ??= document.createElement('div');
  m603.syncPriorHelp([...priorHelp.values()], priorUnverified);
  m603Mount?.destroy();
  m603Mount = mountM603Learning(m603View, m603, () => { createM603View(); });
  return m603View;
}

/** Only this explicitly authorized task receives the reusable planning UI. */
export function createM604View(): HTMLElement {
  rememberM602Help();
  m604 ??= createM604Learning(); m604View ??= document.createElement('div');
  syncM604Help();
  mountM604Learning(m604View,m604,() => { createM604View(); });
  return m604View;
}

import { createM1001Learning } from './m1001-learning.ts';
import { mountM1001Learning } from '../ui/m1001-learning.ts';
let massView: HTMLElement | undefined;
export function createM1001View(): HTMLElement {
  if (!massView) { massView=document.createElement('div'); mountM1001Learning(massView,createM1001Learning()); }
  return massView;
}

import { createM1002Learning } from './m1002-learning.ts';
import { mountM1002Learning } from '../ui/m1002-learning.ts';
let diagramView:HTMLElement|undefined;
export function createM1002View():HTMLElement {
  if(!diagramView){diagramView=document.createElement('div');mountM1002Learning(diagramView,createM1002Learning());}
  return diagramView;
}

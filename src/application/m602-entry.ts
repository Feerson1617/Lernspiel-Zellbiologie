import { createM602Learning } from './m602-learning.ts';
import { mountM602Learning } from '../ui/m602-learning.ts';
import { createM603Learning } from './m603-learning.ts';
import { mountM603Learning } from '../ui/m603-learning.ts';
import type { M603PriorHelp } from './m603-learning.ts';
import { M602_FIELDS } from '../domain/m602-contract.ts';

let m602: ReturnType<typeof createM602Learning> | undefined;
let m602View: HTMLElement | undefined;
let m603: ReturnType<typeof createM603Learning> | undefined;
let m603View: HTMLElement | undefined;
let m603Mount: ReturnType<typeof mountM603Learning> | undefined;
const priorHelp = new Map<string, M603PriorHelp>();
let priorUnverified = false;

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
    function capture() { rememberM602Help(); m603?.syncPriorHelp([...priorHelp.values()], priorUnverified); }
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

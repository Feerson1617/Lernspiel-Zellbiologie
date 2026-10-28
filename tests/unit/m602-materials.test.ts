import { describe, expect, it } from 'vitest';
import { createM602MaterialContext, M602_MATERIAL_CASES, M602_PREVIEW_VERSIONS, readM602Material } from '../../src/content/m602-materials.ts';
import type { M602MaterialCaseId } from '../../src/content/m602-materials.ts';
import { supportsM602CuedContext } from '../../src/assessment/m602-cued.ts';
import { createM602CuedSession } from '../../src/application/m602-session.ts';
import { createTaskContext } from '../../src/domain/task-context.ts';
import type { TaskContextInput } from '../../src/domain/task-context.ts';

const contextA = () => createM602MaterialContext('water-loss-a', 'public-a');
const contextB = () => createM602MaterialContext('water-loss-b', 'public-b');
function altered(change: Partial<TaskContextInput>) {
  const { contextHash: _hash, ...input } = contextA();
  return createTaskContext({ ...input, ...change });
}

describe('public M6.02 static materials', () => {
  it('provides two different, immutable valid contexts with explicit current bindings', () => {
    const a = contextA(), b = contextB();
    expect(M602_MATERIAL_CASES).toHaveLength(2);
    for (const context of [a, b]) {
      expect(supportsM602CuedContext(context)).toBe(true);
      expect(context).toMatchObject(M602_PREVIEW_VERSIONS);
      expect(context.taskId).toBe('M6.02');
      expect(context.phase).toBe('explain');
      expect(context.modelState).toEqual({});
      const material = readM602Material(context), p = material.waterPotential;
      expect(p.unit).toBe('Pa');
      expect(p.vacuole).toBeGreaterThan(p.cytosol);
      expect(p.cytosol).toBeGreaterThan(p.external);
      expect(Object.isFrozen(context)).toBe(true);
      expect(Object.isFrozen(material)).toBe(true);
      expect(Object.isFrozen(p)).toBe(true);
    }
    expect(a.material).not.toEqual(b.material);
    expect(a.contextHash).not.toBe(b.contextHash);
    expect(a.seed).not.toBe(b.seed);
    expect(a.instanceId).not.toBe(b.instanceId);
    expect(createM602MaterialContext('water-loss-b', 'public-a').instanceId).not.toBe(a.instanceId);
    expect(contextA()).toEqual(a);
    expect(createM602MaterialContext('water-loss-a', 'another-session').contextHash).not.toBe(a.contextHash);
  });

  it.each(['', ' ', ' trailing', 'trailing ', '\n', 'bad\u0000id'])('rejects invalid supplied identity %j', identity => {
    expect(() => createM602MaterialContext('water-loss-a', identity)).toThrow();
  });

  it('rejects absent material IDs and tampered snapshots instead of supplying a fallback', () => {
    expect(() => createM602MaterialContext('water-loss-a', 'x'.repeat(256))).toThrow();
    expect(() => createM602MaterialContext('water-loss-a', undefined as unknown as string)).toThrow();
    expect(() => createM602MaterialContext('unknown' as M602MaterialCaseId, 'id')).toThrow();
    expect(() => readM602Material({ ...contextA(), contextHash: contextB().contextHash })).toThrow();
    expect(() => readM602Material({ ...contextA(), material: null })).toThrow();
    expect(() => readM602Material(altered({ taskId: 'M6.01' }))).toThrow();
    expect(() => readM602Material(altered({ rubricVersion: 'old-rubric' }))).toThrow();
    expect(() => readM602Material(altered({ contentVersion: 'old-content' }))).toThrow();
    expect(() => readM602Material(altered({ modelState: { simulated: true } }))).toThrow();
    expect(() => readM602Material(altered({ material: { ...contextA().material, waterPotential: { unit: 'Pa', vacuole: Number.NaN, cytosol: -300000, external: -700000 } } }))).toThrow();
  });

  it.each([
    ['water uptake', { waterPotential: { unit: 'Pa', vacuole: -700_000, cytosol: -300_000, external: -100_000 } }],
    ['equilibrium', { waterPotential: { unit: 'Pa', vacuole: -300_000, cytosol: -300_000, external: -300_000 } }],
    ['exchange instant', { waterPotential: { unit: 'Pa', vacuole: -300_000, cytosol: -300_000, external: -700_000 } }],
    ['wrong unit', { waterPotential: { unit: 'MPa', vacuole: -0.1, cytosol: -0.3, external: -0.7 } }],
    ['damaged cell', { cellIntegrity: 'damaged' }],
    ['wrong cell profile', { cellProfile: 'plant_leaf' }],
    ['recovery phase', { observationPhase: 'deplasmolysis' }],
    ['impermeable tonoplast', { waterPermeability: { cellMembrane: true, tonoplast: false } }],
    ['permeable sucrose', { sucroseRetention: 'permeable' }],
    ['other transport', { otherTransport: 'active' }],
  ] as const)('rejects %s at the common biological boundary', (_name, change) => {
    expect(() => readM602Material(altered({ material: { ...contextA().material, ...change } }))).toThrow();
  });

  it('preserves help on return, rejects relabelled cases and invalidates an old submission', () => {
    const a = contextA(), b = contextB();
    const session = createM602CuedSession(a, { idPrefix: 'public-session', resumed: false, loadedAttempts: [] });
    const answers = { process: 'Osmose', direction: 'nach außen', volume: 'nimmt ab' };
    session.help('direction', 'hint');
    const old = session.makeSubmission(answers, []);
    const outcome = session.submit(old);
    expect(outcome.overallStatus).toBe('correct');
    expect(outcome.support.assistance).toBe('hint');
    session.activate(b, 'new_case');
    expect(session.getState().latest).toBeNull();
    expect(() => session.submit(old)).toThrow();
    expect(() => session.record(outcome)).toThrow();
    expect(session.getState().fields.direction.assistance).toBe('independent');
    const second = session.submit(session.makeSubmission(answers, []));
    expect(second.overallStatus).toBe('correct');
    expect(second.support.assistance).toBe('independent');
    expect(second.fullResult.contextHash).toBe(b.contextHash);
    expect(() => session.activate(createM602MaterialContext('water-loss-a', 'relabeled-a'), 'new_case')).toThrow();
    session.activate(a, 'return');
    expect(session.getState().fields.direction.assistance).toBe('hint');
    expect(session.getState().latest).toBeNull();
  });
});

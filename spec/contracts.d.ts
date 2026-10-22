/** Design contracts, not a game implementation. Units are SI internally. */
export type Status = "correct" | "incorrect" | "partial" | "clarify" | "empty" | "technical";
export type Assistance = "independent" | "hint" | "wordbank" | "clarified" | "solution_viewed";
export type Evidence = Readonly<{ kind: "input_span" | "option_id" | "state_value"; value: string; start?: number; end?: number }>;
export interface TaskContext {
 readonly taskId: string; readonly taskVersion: string; readonly rubricVersion: string;
 readonly contentVersion: string; readonly modelVersion: string; readonly contextHash: string;
 readonly instanceId: string; readonly seed: string;
 readonly phase: "predict" | "investigate" | "explain" | "transfer";
 readonly material: Readonly<Record<string, unknown>>;
}
export interface CriterionResult {
 readonly id: string; readonly status: Status; readonly evidence: readonly Evidence[];
 readonly reasonCode: string;
}
export interface EvaluationResult {
 readonly taskId: string; readonly taskVersion: string; readonly rubricVersion: string;
 readonly contextHash: string; readonly status: Status;
 readonly criteria: readonly CriterionResult[]; readonly unassessedRelevantText: boolean;
 readonly assistance: Assistance; readonly feedbackCode: string;
}
export interface AttemptRecord {
 readonly attemptId: string; readonly taskId: string; readonly instanceId: string;
 readonly taskVersion: string; readonly rubricVersion: string; readonly modelVersion: string;
 readonly status: Status; readonly assistance: Assistance;
 // Raw texts deliberately absent; store only in session memory unless explicit user export.
}
export interface Compartment {
 readonly id: "external" | "cytosol" | "vacuole";
 readonly volume_m3: number; readonly osmoticAmount_mol: number;
 readonly pressure_Pa: number; readonly potential_Pa: number;
}
export interface BiologySnapshot {
 readonly modelId: string; readonly modelVersion: string;
 readonly mode: "structure" | "stochastic" | "calculated" | "scenario";
 readonly modelTime_s: number; readonly calibratedToRealTime: false;
 readonly compartments: readonly Compartment[];
 readonly reservoirLedger: Readonly<{ waterExchange_m3: number; soluteExchange_mol: number }>;
 readonly validity: "valid" | "out_of_scope" | "numerical_error";
}
export interface SemanticAnchor {
 readonly structureId: string; readonly nodeName: string; readonly viewId: string;
 readonly localPosition: readonly [number, number, number];
 readonly targetKind: "boundary" | "lumen" | "organelle";
 readonly testedVisible: boolean;
}
export interface AssetRecord {
 readonly id: string; readonly profile: "plant_leaf" | "onion_epidermis" | "animal_epithelial" | "membrane";
 readonly file: string; readonly checksum: string; readonly scaleNote: string;
 readonly modelLimits: readonly string[]; readonly anchors: readonly SemanticAnchor[];
 readonly license: string; readonly source: string; readonly approvedRevision: string | null;
}
/** Pure signatures; supplied during implementation. Renderer never changes correctness. */
export type Evaluate = (context: TaskContext, response: unknown, assistance: Assistance) => EvaluationResult;
export type StepBiology = (state: BiologySnapshot, dt_s: number) => BiologySnapshot;

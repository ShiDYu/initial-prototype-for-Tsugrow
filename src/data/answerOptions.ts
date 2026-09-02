import type {
  AnswerId,
  AnswerOption,
  ReadinessPoint,
} from "../domain/diagnosticTypes";

export const ANSWER_OPTIONS = [
  {
    id: "ready",
    label: "整理・説明できる",
    readinessPoint: 3,
    description: "現時点で大きな準備不足は見えにくい",
  },
  {
    id: "partial",
    label: "一部できる",
    readinessPoint: 2,
    description: "情報や運用に不完全な部分がある",
  },
  {
    id: "notReady",
    label: "整理できていない",
    readinessPoint: 1,
    description: "将来の確認・改善が必要",
  },
  {
    id: "unknown",
    label: "分からない",
    readinessPoint: 0,
    description: "状況を把握できていないため優先確認が必要",
  },
] as const satisfies readonly AnswerOption[];

export const READINESS_POINTS = Object.fromEntries(
  ANSWER_OPTIONS.map(({ id, readinessPoint }) => [id, readinessPoint]),
) as Record<AnswerId, ReadinessPoint>;

export const READINESS_STATUS_THRESHOLDS = {
  readyMinimum: 75,
  attentionMinimum: 45,
} as const;

export const answerOptions = ANSWER_OPTIONS;

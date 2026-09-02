import type {
  AnswerId,
  DomainCode,
  ReadinessStatus,
} from "../domain/diagnosticTypes";

export const OVERALL_READINESS_LABEL = "事業承継準備度（自己診断）";

export const DOMAIN_LABELS: Record<DomainCode, string> = {
  EQ: "利益の説明力",
  BS: "財務・資産",
  CM: "顧客・商流",
  DO: "株主・法務",
  IR: "情報整備・属人化",
};

export const STATUS_COPY: Record<
  ReadinessStatus,
  {
    label: string;
    color: "green" | "amber" | "red";
    message: string;
  }
> = {
  ready: {
    label: "おおむね準備",
    color: "green",
    message:
      "現時点で大きな準備不足は限定的です。ただし資料による確認が必要です。",
  },
  attention: {
    label: "確認・改善が必要",
    color: "amber",
    message: "一部の領域で、将来に備えた確認と改善が必要です。",
  },
  priority: {
    label: "優先的な確認が必要",
    color: "red",
    message:
      "将来の選択肢を守るため、早めに状況を確認したい領域があります。",
  },
};

export const OVERALL_RESULT_COPY: Record<ReadinessStatus, string> = {
  ready:
    "回答上は、承継に向けた基礎情報がおおむね整理されています。現在の状態を維持し、資料と実態の一致を確認しましょう。",
  attention:
    "一部の領域で、将来に備えた確認と改善が必要です。重要度の高い3項目から整理を始めましょう。",
  priority:
    "現時点で準備が十分でない領域があります。ただし、早い段階で確認できれば改善できる可能性があります。まずは上位3項目から着手しましょう。",
};

export const ANSWER_STATE_COPY: Record<AnswerId, string> = {
  ready:
    "回答上は、おおむね整理・説明できる状態です。資料と実態が一致しているかを定期的に確認してください。",
  partial:
    "一部は整理されていますが、第三者に短時間で説明できない部分が残っている可能性があります。",
  notReady:
    "現時点では整理が十分でないため、将来の確認に備えて早めの準備が推奨されます。",
  unknown:
    "現在の状態を把握できていないため、まず事実確認から始める必要があります。",
};

export const UNKNOWN_ANSWER_HELPER =
  "分からない場合もそのまま選択してください。把握できていないこと自体が、最初に確認すべきポイントになります。";

export const RESULT_CONFIDENCE_COPY =
  "回答内容に基づく簡易自己診断です。実際のリスク判断には、決算書・契約書・株主情報などの確認と、必要に応じた専門家の判断が必要です。";

export const DIAGNOSTIC_DISCLAIMER =
  "本診断は回答内容に基づく簡易的な自己診断です。企業価値算定、法務・税務判断、売却価格の保証を行うものではありません。";

export const RISK_DETAIL_BLOCK_LABELS = {
  currentState: "確認された状態",
  futureCheck: "将来確認される可能性があること",
  impact: "想定される影響",
  firstAction: "最初のアクション",
  advisorCandidates: "相談先候補",
} as const;

export const RISK_PRIORITY_LABELS = {
  high: "高",
  medium: "中",
  maintenance: "維持確認",
} as const;

export const IMPROVEMENT_ESTIMATE = "最初の確認 1〜4週間";

export const ROADMAP_COPY = [
  {
    period: "0〜30日",
    description: "必要情報の所在、担当者、現状を確認する",
  },
  {
    period: "31〜60日",
    description: "一覧・台帳・集計表を作成し、専門家と論点を確認する",
  },
  {
    period: "61〜90日",
    description: "改善方針、担当者、期限を決め、必要なら再診断する",
  },
] as const;

export const COPY = {
  overallReadinessLabel: OVERALL_READINESS_LABEL,
  domainLabels: DOMAIN_LABELS,
  statuses: STATUS_COPY,
  overallResults: OVERALL_RESULT_COPY,
  answerStates: ANSWER_STATE_COPY,
  unknownAnswerHelper: UNKNOWN_ANSWER_HELPER,
  resultConfidence: RESULT_CONFIDENCE_COPY,
  disclaimer: DIAGNOSTIC_DISCLAIMER,
  riskDetailBlockLabels: RISK_DETAIL_BLOCK_LABELS,
  riskPriorityLabels: RISK_PRIORITY_LABELS,
  improvementEstimate: IMPROVEMENT_ESTIMATE,
  roadmap: ROADMAP_COPY,
} as const;

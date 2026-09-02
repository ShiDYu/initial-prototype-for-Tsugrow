export const DOMAIN_CODES = ["EQ", "BS", "CM", "DO", "IR"] as const;

export type DomainCode = (typeof DOMAIN_CODES)[number];

export const ANSWER_IDS = ["ready", "partial", "notReady", "unknown"] as const;

export type AnswerId = (typeof ANSWER_IDS)[number];

export const QUESTION_IDS = [
  "EQ01",
  "EQ02",
  "BS01",
  "BS02",
  "CM01",
  "CM02",
  "DO01",
  "DO02",
  "IR01",
  "IR02",
] as const;

export type QuestionId = (typeof QUESTION_IDS)[number];

export const RISK_RULE_IDS = [
  "R_EQ01",
  "R_EQ02",
  "R_BS01",
  "R_BS02",
  "R_CM01",
  "R_CM02",
  "R_DO01",
  "R_DO02",
  "R_IR01",
  "R_IR02",
] as const;

export type RiskRuleId = (typeof RISK_RULE_IDS)[number];

export type ReadinessPoint = 0 | 1 | 2 | 3;
export type ImpactWeight = 1 | 2 | 3;
export type ReadinessStatus = "ready" | "attention" | "priority";
export type DiagnosticRuleVersion = "mvp-1.0";

export type Question = {
  id: QuestionId;
  domain: DomainCode;
  displayOrder: number;
  title: string;
  helperText?: string;
  impactWeight: ImpactWeight;
  priorityOrder: number;
  riskRuleId: RiskRuleId;
};

export type AnswerOption = {
  id: AnswerId;
  label: string;
  readinessPoint: ReadinessPoint;
  description: string;
};

/** A complete answer set, used only after all ten questions are answered. */
export type DiagnosticAnswers = Record<QuestionId, AnswerId>;

/** The shape used while the question wizard is still in progress. */
export type PartialDiagnosticAnswers = Partial<DiagnosticAnswers>;

export type DomainResult = {
  domain: DomainCode;
  readiness: number;
  status: ReadinessStatus;
};

export type RiskResult = {
  questionId: QuestionId;
  riskRuleId: RiskRuleId;
  score: number;
  priorityRank: number;
  answerId: AnswerId;
};

export type DiagnosticResult = {
  ruleVersion: DiagnosticRuleVersion;
  overallReadiness: number;
  overallStatus: ReadinessStatus;
  domains: DomainResult[];
  priorityRisks: RiskResult[];
};

export type RiskRule = {
  id: RiskRuleId;
  title: string;
  questionId: QuestionId;
  /** 「将来確認される可能性があること」ブロックの本文。 */
  futureCheck: string;
  impact: string;
  firstAction: string;
  advisorCandidates: string;
};

export type SelectOption<TValue extends string = string> = {
  value: TValue;
  label: string;
};

export type IndustryId =
  | "manufacturing"
  | "construction"
  | "wholesale"
  | "retail"
  | "it-communications"
  | "professional-services"
  | "consumer-services"
  | "transportation"
  | "medical-care"
  | "other";

export type RevenueBandId =
  | "under-100m"
  | "100m-500m"
  | "500m-1b"
  | "1b-5b"
  | "over-5b"
  | "prefer-not-to-answer";

export type EmployeeBandId =
  | "under-10"
  | "10-29"
  | "30-99"
  | "over-100"
  | "prefer-not-to-answer";

export type SuccessionTimingId =
  | "within-1-year"
  | "1-3-years"
  | "3-5-years"
  | "over-5-years"
  | "not-considering";

export type SuccessionOptionId =
  | "family"
  | "employee"
  | "third-party-ma"
  | "closure"
  | "undecided";

export type CompanyProfile = {
  industry: IndustryId | "";
  revenueBand: RevenueBandId | "";
  employeeBand: EmployeeBandId | "";
  successionTiming: SuccessionTimingId | "";
  successionOptions: SuccessionOptionId[];
};

export type DiagnosticStep =
  | "landing"
  | "profile"
  | "questions"
  | "calculating"
  | "results"
  | "consultation";

export type DiagnosticState = {
  currentStep: DiagnosticStep;
  profile: CompanyProfile;
  answers: PartialDiagnosticAnswers;
  currentQuestionIndex: number;
  result: DiagnosticResult | null;
  startedAt: string | null;
  completedAt: string | null;
};

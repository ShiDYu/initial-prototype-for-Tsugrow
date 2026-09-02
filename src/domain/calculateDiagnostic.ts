import {
  READINESS_POINTS,
  READINESS_STATUS_THRESHOLDS,
} from "../data/answerOptions";
import { QUESTIONS } from "../data/questions";
import {
  DOMAIN_CODES,
  type AnswerId,
  type DiagnosticAnswers,
  type DiagnosticResult,
  type DiagnosticRuleVersion,
  type DomainCode,
  type DomainResult,
  type ImpactWeight,
  type QuestionId,
  type ReadinessPoint,
  type ReadinessStatus,
  type RiskResult,
  type RiskRuleId,
} from "./diagnosticTypes";

export const DIAGNOSTIC_RULE_VERSION: DiagnosticRuleVersion = "mvp-1.0";

const MAX_READINESS_POINT = 3;
const PRIORITY_RISK_COUNT = 3;

type RiskCandidate = RiskResult & {
  domain: DomainCode;
  impactWeight: ImpactWeight;
  priorityOrder: number;
};

const clampPercent = (value: number): number =>
  Math.min(100, Math.max(0, value));

const readinessPercent = (
  points: number,
  numberOfQuestions: number,
): number => {
  if (numberOfQuestions === 0) {
    return 0;
  }

  return clampPercent(
    Math.round((points / (MAX_READINESS_POINT * numberOfQuestions)) * 100),
  );
};

export const getReadinessStatus = (
  readiness: number,
): ReadinessStatus => {
  if (readiness >= READINESS_STATUS_THRESHOLDS.readyMinimum) {
    return "ready";
  }

  if (readiness >= READINESS_STATUS_THRESHOLDS.attentionMinimum) {
    return "attention";
  }

  return "priority";
};

export const calculateQuestionRiskScore = (
  readinessPoint: ReadinessPoint,
  impactWeight: ImpactWeight,
): number => (MAX_READINESS_POINT - readinessPoint) * impactWeight;

const assertCompleteAnswers = (
  answers: Readonly<DiagnosticAnswers>,
): void => {
  for (const question of QUESTIONS) {
    const answerId = (answers as Partial<DiagnosticAnswers>)[question.id];

    if (answerId === undefined || READINESS_POINTS[answerId] === undefined) {
      throw new Error(`Question ${question.id} requires a valid answer.`);
    }
  }
};

const calculateDomainResults = (
  answers: Readonly<DiagnosticAnswers>,
): DomainResult[] =>
  DOMAIN_CODES.map((domain) => {
    const domainQuestions = QUESTIONS.filter(
      (question) => question.domain === domain,
    );
    const totalPoints = domainQuestions.reduce(
      (sum, question) => sum + READINESS_POINTS[answers[question.id]],
      0,
    );
    const readiness = readinessPercent(totalPoints, domainQuestions.length);

    return {
      domain,
      readiness,
      status: getReadinessStatus(readiness),
    };
  });

const byRiskScoreThenPriority = (
  first: RiskCandidate,
  second: RiskCandidate,
): number =>
  second.score - first.score ||
  first.priorityOrder - second.priorityOrder ||
  first.questionId.localeCompare(second.questionId);

const byImpactThenPriority = (
  first: RiskCandidate,
  second: RiskCandidate,
): number =>
  second.impactWeight - first.impactWeight ||
  first.priorityOrder - second.priorityOrder ||
  first.questionId.localeCompare(second.questionId);

const selectMaintenancePoints = (
  candidates: readonly RiskCandidate[],
): RiskCandidate[] => {
  const selectedDomains = new Set<DomainCode>();
  const selected: RiskCandidate[] = [];

  for (const candidate of [...candidates].sort(byImpactThenPriority)) {
    if (selectedDomains.has(candidate.domain)) {
      continue;
    }

    selected.push(candidate);
    selectedDomains.add(candidate.domain);

    if (selected.length === PRIORITY_RISK_COUNT) {
      break;
    }
  }

  return selected;
};

const calculatePriorityRisks = (
  answers: Readonly<DiagnosticAnswers>,
): RiskResult[] => {
  const candidates: RiskCandidate[] = QUESTIONS.map((question) => {
    const answerId = answers[question.id];

    return {
      questionId: question.id as QuestionId,
      riskRuleId: question.riskRuleId as RiskRuleId,
      score: calculateQuestionRiskScore(
        READINESS_POINTS[answerId],
        question.impactWeight,
      ),
      priorityRank: 0,
      answerId: answerId as AnswerId,
      domain: question.domain,
      impactWeight: question.impactWeight,
      priorityOrder: question.priorityOrder,
    };
  });

  const allAnswersReady = QUESTIONS.every(
    (question) => answers[question.id] === "ready",
  );
  const selected = allAnswersReady
    ? selectMaintenancePoints(candidates)
    : [...candidates]
        .sort(byRiskScoreThenPriority)
        .slice(0, PRIORITY_RISK_COUNT);

  return selected.map(
    ({
      questionId,
      riskRuleId,
      score,
      answerId,
    }, index): RiskResult => ({
      questionId,
      riskRuleId,
      score,
      priorityRank: index + 1,
      answerId,
    }),
  );
};

export const calculateDiagnostic = (
  answers: Readonly<DiagnosticAnswers>,
): DiagnosticResult => {
  assertCompleteAnswers(answers);

  const domains = calculateDomainResults(answers);
  const overallReadiness = clampPercent(
    Math.round(
      domains.reduce((sum, domain) => sum + domain.readiness, 0) /
        domains.length,
    ),
  );

  return {
    ruleVersion: DIAGNOSTIC_RULE_VERSION,
    overallReadiness,
    overallStatus: getReadinessStatus(overallReadiness),
    domains,
    priorityRisks: calculatePriorityRisks(answers),
  };
};

export default calculateDiagnostic;

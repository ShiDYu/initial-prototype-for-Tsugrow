import { describe, expect, it } from "vitest";

import { ANSWER_STATE_COPY, RISK_DETAIL_BLOCK_LABELS } from "../data/copy";
import { QUESTIONS } from "../data/questions";
import { RISK_RULES } from "../data/riskRules";
import {
  calculateDiagnostic,
  DIAGNOSTIC_RULE_VERSION,
  getReadinessStatus,
} from "./calculateDiagnostic";
import type {
  AnswerId,
  DiagnosticAnswers,
  QuestionId,
} from "./diagnosticTypes";

const answersWith = (answerId: AnswerId): DiagnosticAnswers =>
  Object.fromEntries(
    QUESTIONS.map((question) => [question.id, answerId]),
  ) as DiagnosticAnswers;

const answersWithOverrides = (
  defaultAnswer: AnswerId,
  overrides: Partial<Record<QuestionId, AnswerId>>,
): DiagnosticAnswers => ({
  ...answersWith(defaultAnswer),
  ...overrides,
});

describe("calculateDiagnostic", () => {
  it("keeps the configured ten-question display order and weights", () => {
    expect(QUESTIONS.map(({ id }) => id)).toEqual([
      "IR02",
      "CM01",
      "CM02",
      "EQ02",
      "EQ01",
      "BS01",
      "BS02",
      "IR01",
      "DO01",
      "DO02",
    ]);
    expect(QUESTIONS.map(({ impactWeight }) => impactWeight)).toEqual([
      3, 3, 2, 2, 3, 3, 3, 2, 3, 3,
    ]);
    expect(QUESTIONS.map(({ priorityOrder }) => priorityOrder)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
  });

  it("provides all five display blocks for every risk rule", () => {
    expect(RISK_RULES).toHaveLength(10);
    expect(Object.values(RISK_DETAIL_BLOCK_LABELS)).toHaveLength(5);

    for (const rule of RISK_RULES) {
      expect(QUESTIONS.some((question) => question.id === rule.questionId)).toBe(
        true,
      );
      expect(rule.futureCheck.length).toBeGreaterThan(0);
      expect(rule.impact.length).toBeGreaterThan(0);
      expect(rule.firstAction.length).toBeGreaterThan(0);
      expect(rule.advisorCandidates.length).toBeGreaterThan(0);
    }

    expect(Object.values(ANSWER_STATE_COPY).every(Boolean)).toBe(true);
  });

  it("returns 100 and three cross-domain maintenance points when all answers are ready", () => {
    const result = calculateDiagnostic(answersWith("ready"));

    expect(result.ruleVersion).toBe(DIAGNOSTIC_RULE_VERSION);
    expect(result.ruleVersion).toBe("mvp-1.0");
    expect(result.overallReadiness).toBe(100);
    expect(result.overallStatus).toBe("ready");
    expect(result.domains).toEqual([
      { domain: "EQ", readiness: 100, status: "ready" },
      { domain: "BS", readiness: 100, status: "ready" },
      { domain: "CM", readiness: 100, status: "ready" },
      { domain: "DO", readiness: 100, status: "ready" },
      { domain: "IR", readiness: 100, status: "ready" },
    ]);
    expect(result.priorityRisks).toHaveLength(3);
    expect(result.priorityRisks.map(({ questionId }) => questionId)).toEqual([
      "IR02",
      "CM01",
      "EQ01",
    ]);
    expect(result.priorityRisks.map(({ score }) => score)).toEqual([0, 0, 0]);
    expect(
      new Set(
        result.priorityRisks.map(
          ({ questionId }) =>
            QUESTIONS.find((question) => question.id === questionId)?.domain,
        ),
      ).size,
    ).toBe(3);
  });

  it("returns 0 when all answers are unknown and treats unknown as zero points", () => {
    const result = calculateDiagnostic(answersWith("unknown"));

    expect(result.overallReadiness).toBe(0);
    expect(result.overallStatus).toBe("priority");
    expect(result.domains.every(({ readiness }) => readiness === 0)).toBe(true);
    expect(result.priorityRisks).toHaveLength(3);
    expect(result.priorityRisks.map(({ score }) => score)).toEqual([9, 9, 9]);
  });

  it("calculates each two-question domain and the equally weighted overall result", () => {
    const result = calculateDiagnostic(
      answersWithOverrides("ready", {
        EQ02: "partial",
        BS01: "notReady",
        BS02: "unknown",
        DO01: "partial",
        DO02: "partial",
        IR01: "unknown",
        IR02: "unknown",
      }),
    );

    expect(result.domains).toEqual([
      { domain: "EQ", readiness: 83, status: "ready" },
      { domain: "BS", readiness: 17, status: "priority" },
      { domain: "CM", readiness: 100, status: "ready" },
      { domain: "DO", readiness: 67, status: "attention" },
      { domain: "IR", readiness: 0, status: "priority" },
    ]);
    expect(result.overallReadiness).toBe(53);
    expect(result.overallStatus).toBe("attention");
  });

  it("sorts ordinary priority risks by score and allows multiple questions from one domain", () => {
    const result = calculateDiagnostic(
      answersWithOverrides("ready", {
        CM01: "unknown",
        CM02: "unknown",
      }),
    );

    expect(result.priorityRisks).toEqual([
      {
        questionId: "CM01",
        riskRuleId: "R_CM01",
        score: 9,
        priorityRank: 1,
        answerId: "unknown",
      },
      {
        questionId: "CM02",
        riskRuleId: "R_CM02",
        score: 6,
        priorityRank: 2,
        answerId: "unknown",
      },
      {
        questionId: "IR02",
        riskRuleId: "R_IR02",
        score: 0,
        priorityRank: 3,
        answerId: "ready",
      },
    ]);
  });

  it("uses priorityOrder to break equal risk-score ties", () => {
    const result = calculateDiagnostic(
      answersWithOverrides("ready", {
        CM02: "unknown",
        EQ01: "notReady",
      }),
    );

    expect(result.priorityRisks.slice(0, 2).map(({ questionId }) => questionId)).toEqual(
      ["CM02", "EQ01"],
    );
    expect(result.priorityRisks.slice(0, 2).map(({ score }) => score)).toEqual([
      6, 6,
    ]);
  });

  it("always returns exactly three ranked risks", () => {
    const result = calculateDiagnostic(
      answersWithOverrides("partial", {
        BS02: "unknown",
      }),
    );

    expect(result.priorityRisks).toHaveLength(3);
    expect(result.priorityRisks.map(({ priorityRank }) => priorityRank)).toEqual([
      1, 2, 3,
    ]);
  });

  it("is deterministic and does not mutate the supplied answers", () => {
    const answers = Object.freeze(
      answersWithOverrides("partial", {
        IR02: "unknown",
        EQ01: "ready",
      }),
    );

    expect(calculateDiagnostic(answers)).toEqual(calculateDiagnostic(answers));
    expect(answers.IR02).toBe("unknown");
    expect(answers.EQ01).toBe("ready");
  });

  it("keeps all readiness scores within 0 to 100", () => {
    const result = calculateDiagnostic(
      answersWithOverrides("unknown", {
        EQ01: "ready",
        BS01: "partial",
        CM01: "notReady",
        DO01: "ready",
        IR01: "partial",
      }),
    );

    expect(result.overallReadiness).toBeGreaterThanOrEqual(0);
    expect(result.overallReadiness).toBeLessThanOrEqual(100);
    for (const domain of result.domains) {
      expect(domain.readiness).toBeGreaterThanOrEqual(0);
      expect(domain.readiness).toBeLessThanOrEqual(100);
    }
  });

  it("uses the specified readiness status boundaries", () => {
    expect(getReadinessStatus(100)).toBe("ready");
    expect(getReadinessStatus(75)).toBe("ready");
    expect(getReadinessStatus(74)).toBe("attention");
    expect(getReadinessStatus(45)).toBe("attention");
    expect(getReadinessStatus(44)).toBe("priority");
    expect(getReadinessStatus(0)).toBe("priority");
  });

  it("rejects an incomplete answer set", () => {
    const answers = answersWith("ready");
    delete (answers as Partial<DiagnosticAnswers>).DO02;

    expect(() => calculateDiagnostic(answers)).toThrow(
      "Question DO02 requires a valid answer.",
    );
  });
});

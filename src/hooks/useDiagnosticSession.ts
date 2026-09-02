import { useEffect, useState } from "react";
import { ANSWER_IDS, QUESTION_IDS, type DiagnosticAnswers, type DiagnosticState } from "../domain/diagnosticTypes";
import { calculateDiagnostic, DIAGNOSTIC_RULE_VERSION } from "../domain/calculateDiagnostic";
import {
  EMPLOYEE_BAND_OPTIONS,
  EMPTY_COMPANY_PROFILE,
  INDUSTRY_OPTIONS,
  REVENUE_BAND_OPTIONS,
  SUCCESSION_OPTION_OPTIONS,
  SUCCESSION_TIMING_OPTIONS,
} from "../data/profileOptions";

export const DIAGNOSTIC_SESSION_KEY = "tsugrow-readiness-scan-session";
const STORAGE_VERSION = 1;

export const INITIAL_DIAGNOSTIC_STATE: DiagnosticState = {
  currentStep: "landing",
  profile: EMPTY_COMPANY_PROFILE,
  answers: {},
  currentQuestionIndex: 0,
  result: null,
  startedAt: null,
  completedAt: null,
};

const STEPS = new Set(["landing", "profile", "questions", "calculating", "results", "consultation"]);
const VALID_ANSWERS = new Set<string>(ANSWER_IDS);
const VALID_INDUSTRIES = new Set<string>(INDUSTRY_OPTIONS.map(({ value }) => value));
const VALID_REVENUE_BANDS = new Set<string>(REVENUE_BAND_OPTIONS.map(({ value }) => value));
const VALID_EMPLOYEE_BANDS = new Set<string>(EMPLOYEE_BAND_OPTIONS.map(({ value }) => value));
const VALID_SUCCESSION_TIMINGS = new Set<string>(SUCCESSION_TIMING_OPTIONS.map(({ value }) => value));
const VALID_SUCCESSION_OPTIONS = new Set<string>(SUCCESSION_OPTION_OPTIONS.map(({ value }) => value));

function allQuestionsAnswered(answers: DiagnosticState["answers"]): answers is DiagnosticAnswers {
  return QUESTION_IDS.every((id) => VALID_ANSWERS.has(answers[id] ?? ""));
}

function restoreState(): DiagnosticState {
  try {
    const raw = window.sessionStorage.getItem(DIAGNOSTIC_SESSION_KEY);
    if (!raw) return INITIAL_DIAGNOSTIC_STATE;
    const envelope = JSON.parse(raw) as { version?: unknown; state?: unknown };
    if (envelope.version !== STORAGE_VERSION || !envelope.state || typeof envelope.state !== "object") {
      window.sessionStorage.removeItem(DIAGNOSTIC_SESSION_KEY);
      return INITIAL_DIAGNOSTIC_STATE;
    }

    const candidate = envelope.state as Partial<DiagnosticState>;
    const currentStep = typeof candidate.currentStep === "string" && STEPS.has(candidate.currentStep)
      ? candidate.currentStep as DiagnosticState["currentStep"]
      : "landing";
    const rawAnswers = candidate.answers && typeof candidate.answers === "object" ? candidate.answers : {};
    const answers: DiagnosticState["answers"] = {};
    for (const id of QUESTION_IDS) {
      const value = rawAnswers[id];
      if (typeof value === "string" && VALID_ANSWERS.has(value)) answers[id] = value as DiagnosticAnswers[typeof id];
    }

    const rawProfile = candidate.profile && typeof candidate.profile === "object" ? candidate.profile : EMPTY_COMPANY_PROFILE;
    const profile: DiagnosticState["profile"] = {
      industry: VALID_INDUSTRIES.has(rawProfile.industry) ? rawProfile.industry : "",
      revenueBand: VALID_REVENUE_BANDS.has(rawProfile.revenueBand) ? rawProfile.revenueBand : "",
      employeeBand: VALID_EMPLOYEE_BANDS.has(rawProfile.employeeBand) ? rawProfile.employeeBand : "",
      successionTiming: VALID_SUCCESSION_TIMINGS.has(rawProfile.successionTiming) ? rawProfile.successionTiming : "",
      successionOptions: Array.isArray(rawProfile.successionOptions)
        ? rawProfile.successionOptions.filter((value) => VALID_SUCCESSION_OPTIONS.has(value))
        : [],
    } as DiagnosticState["profile"];
    const index = Math.min(QUESTION_IDS.length - 1, Math.max(0, Number.isInteger(candidate.currentQuestionIndex) ? Number(candidate.currentQuestionIndex) : 0));
    const startedAt = typeof candidate.startedAt === "string" ? candidate.startedAt : null;
    const completedAt = typeof candidate.completedAt === "string" ? candidate.completedAt : null;

    if (["results", "consultation", "calculating"].includes(currentStep)) {
      if (!allQuestionsAnswered(answers)) {
        const firstMissing = QUESTION_IDS.findIndex((id) => !answers[id]);
        return { currentStep: "questions", profile, answers, currentQuestionIndex: firstMissing < 0 ? index : firstMissing, result: null, startedAt, completedAt: null };
      }
      const result = calculateDiagnostic(answers);
      return {
        currentStep: currentStep === "calculating" ? "results" : currentStep,
        profile,
        answers,
        currentQuestionIndex: index,
        result: result.ruleVersion === DIAGNOSTIC_RULE_VERSION ? result : null,
        startedAt,
        completedAt,
      };
    }

    return { currentStep, profile, answers, currentQuestionIndex: index, result: null, startedAt, completedAt: null };
  } catch {
    try { window.sessionStorage.removeItem(DIAGNOSTIC_SESSION_KEY); } catch { /* storage may be unavailable */ }
    return INITIAL_DIAGNOSTIC_STATE;
  }
}

export function useDiagnosticSession() {
  const [state, setState] = useState<DiagnosticState>(restoreState);

  useEffect(() => {
    try {
      if (!state.startedAt && state.currentStep === "landing") {
        window.sessionStorage.removeItem(DIAGNOSTIC_SESSION_KEY);
      } else {
        window.sessionStorage.setItem(DIAGNOSTIC_SESSION_KEY, JSON.stringify({ version: STORAGE_VERSION, state }));
      }
    } catch {
      // The in-memory experience remains usable when storage is unavailable.
    }
  }, [state]);

  const startNew = () => {
    try { window.sessionStorage.removeItem(DIAGNOSTIC_SESSION_KEY); } catch { /* storage may be unavailable */ }
    setState({ ...INITIAL_DIAGNOSTIC_STATE, currentStep: "profile", startedAt: new Date().toISOString() });
  };

  const reset = () => {
    try { window.sessionStorage.removeItem(DIAGNOSTIC_SESSION_KEY); } catch { /* storage may be unavailable */ }
    setState(INITIAL_DIAGNOSTIC_STATE);
  };

  return { state, setState, startNew, reset };
}

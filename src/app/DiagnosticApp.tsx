import { useEffect, useState } from "react";
import { trackDiagnosticEvent } from "../analytics/diagnosticEvents";
import { CalculatingScreen } from "../components/CalculatingScreen";
import { CompanyProfileStep } from "../components/CompanyProfileStep";
import { ConsultationForm } from "../components/ConsultationForm";
import { GlobalChrome } from "../components/GlobalChrome";
import { LandingScreen } from "../components/LandingScreen";
import { QuestionWizard } from "../components/QuestionWizard";
import { ResultsScreen } from "../components/ResultsScreen";
import { QUESTIONS } from "../data/questions";
import { calculateDiagnostic } from "../domain/calculateDiagnostic";
import type { AnswerId, DiagnosticAnswers, QuestionId } from "../domain/diagnosticTypes";
import { useDiagnosticSession } from "../hooks/useDiagnosticSession";

export function DiagnosticApp() {
  const { state, setState, startNew, reset } = useDiagnosticSession();
  const [questionError, setQuestionError] = useState<string>();

  useEffect(() => {
    trackDiagnosticEvent({ name: "diagnostic_view" });
  }, []);

  useEffect(() => {
    if (state.currentStep !== "calculating") return;

    const timer = window.setTimeout(() => {
      try {
        const result = calculateDiagnostic(state.answers as DiagnosticAnswers);
        const completedAt = new Date().toISOString();
        const started = state.startedAt ? new Date(state.startedAt).getTime() : Date.now();
        trackDiagnosticEvent({
          name: "diagnostic_complete",
          durationSeconds: Math.max(0, Math.round((Date.now() - started) / 1000)),
          domainStatuses: result.domains.map((domain) => `${domain.domain}:${domain.status}`),
        });
        setState((current) => ({ ...current, currentStep: "results", result, completedAt }));
        window.scrollTo({ top: 0 });
      } catch {
        setState((current) => ({ ...current, currentStep: "questions", currentQuestionIndex: 0, result: null }));
      }
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [setState, state.answers, state.currentStep, state.startedAt]);

  const hasProgress = Boolean(
    state.startedAt &&
    (
      Object.keys(state.answers).length > 0 ||
      Object.values(state.profile).some((value) => Array.isArray(value) ? value.length > 0 : Boolean(value)) ||
      state.currentStep !== "landing"
    ),
  );

  const start = () => {
    if (hasProgress && !window.confirm("保存中の診断内容を消して、最初から始めますか？")) return;
    startNew();
    trackDiagnosticEvent({ name: "diagnostic_start" });
    window.scrollTo({ top: 0 });
  };

  const resume = () => {
    const nextStep = state.result
      ? "results"
      : Object.keys(state.answers).length > 0
        ? "questions"
        : "profile";
    setState((current) => ({ ...current, currentStep: nextStep }));
    window.scrollTo({ top: 0 });
  };

  const restart = () => {
    if (!window.confirm("診断結果と回答を消して、最初からやり直しますか？")) return;
    reset();
    window.scrollTo({ top: 0 });
  };

  const answerQuestion = (questionId: QuestionId, answerId: AnswerId) => {
    setQuestionError(undefined);
    setState((current) => ({ ...current, answers: { ...current.answers, [questionId]: answerId } }));
  };

  const nextQuestion = () => {
    const question = QUESTIONS[state.currentQuestionIndex];
    if (!question || !state.answers[question.id]) {
      setQuestionError("回答を1つ選択してから次へ進んでください。");
      return;
    }
    const answerId = state.answers[question.id] as AnswerId;
    trackDiagnosticEvent({ name: "question_answered", questionId: question.id, answerId });
    setQuestionError(undefined);
    if (state.currentQuestionIndex === QUESTIONS.length - 1) {
      setState((current) => ({ ...current, currentStep: "calculating" }));
    } else {
      setState((current) => ({ ...current, currentQuestionIndex: current.currentQuestionIndex + 1 }));
    }
  };

  const content = (() => {
    switch (state.currentStep) {
      case "profile":
        return (
          <CompanyProfileStep
            profile={state.profile}
            onChange={(profile) => setState((current) => ({ ...current, profile }))}
            onBack={() => setState((current) => ({ ...current, currentStep: "landing" }))}
            onComplete={() => {
              trackDiagnosticEvent({
                name: "profile_complete",
                industry: state.profile.industry,
                revenueBand: state.profile.revenueBand,
                employeeBand: state.profile.employeeBand,
              });
              setState((current) => ({ ...current, currentStep: "questions" }));
              window.scrollTo({ top: 0 });
            }}
          />
        );
      case "questions":
        return (
          <QuestionWizard
            currentIndex={state.currentQuestionIndex}
            answers={state.answers}
            onAnswer={answerQuestion}
            onBack={() => {
              setQuestionError(undefined);
              setState((current) => current.currentQuestionIndex === 0
                ? { ...current, currentStep: "profile" }
                : { ...current, currentQuestionIndex: current.currentQuestionIndex - 1 });
            }}
            onNext={nextQuestion}
            error={questionError}
          />
        );
      case "calculating":
        return <CalculatingScreen />;
      case "results":
        return state.result ? (
          <ResultsScreen
            result={state.result}
            onConsultation={() => {
              trackDiagnosticEvent({ name: "consultation_cta_click" });
              setState((current) => ({ ...current, currentStep: "consultation" }));
              window.scrollTo({ top: 0 });
            }}
            onPrint={() => {
              trackDiagnosticEvent({ name: "print_result" });
              window.print();
            }}
            onRestart={restart}
            onRiskOpen={(riskRuleId) => trackDiagnosticEvent({ name: "risk_detail_open", riskRuleId })}
          />
        ) : null;
      case "consultation":
        return (
          <ConsultationForm
            onBack={() => {
              setState((current) => ({ ...current, currentStep: "results" }));
              window.scrollTo({ top: 0 });
            }}
            onSubmitComplete={() => trackDiagnosticEvent({ name: "consultation_submit" })}
          />
        );
      case "landing":
      default:
        return <LandingScreen onStart={start} onResume={resume} hasSavedProgress={hasProgress} />;
    }
  })();

  return <GlobalChrome compact={state.currentStep !== "landing"}>{content}</GlobalChrome>;
}

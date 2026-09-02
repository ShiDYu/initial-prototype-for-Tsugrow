import { useEffect, useRef } from "react";
import { ANSWER_OPTIONS } from "../data/answerOptions";
import { DOMAIN_LABELS, UNKNOWN_ANSWER_HELPER } from "../data/copy";
import { QUESTIONS } from "../data/questions";
import type { AnswerId, QuestionId } from "../domain/diagnosticTypes";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, InfoIcon } from "./Icons";
import { JourneyHeader } from "./JourneyHeader";

type QuestionWizardProps = {
  currentIndex: number;
  answers: Partial<Record<QuestionId, AnswerId>>;
  onAnswer: (questionId: QuestionId, answerId: AnswerId) => void;
  onBack: () => void;
  onNext: () => void;
  error?: string;
};

export function QuestionWizard({
  currentIndex,
  answers,
  onAnswer,
  onBack,
  onNext,
  error,
}: QuestionWizardProps) {
  const question = QUESTIONS[currentIndex];
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isLast = currentIndex === QUESTIONS.length - 1;

  useEffect(() => {
    headingRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  if (!question) return null;

  const selected = answers[question.id];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  return (
    <section className="flow-page question-page">
      <div className="flow-width">
        <JourneyHeader active={2} />

        <div className="question-progress" aria-live="polite">
          <div className="question-progress__labels">
            <span>質問 <strong>{currentIndex + 1}</strong> / {QUESTIONS.length}</span>
            <span>{Math.round(progress)}% 完了</span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={QUESTIONS.length}
            aria-valuenow={currentIndex + 1}
            aria-label={`質問 ${currentIndex + 1} / ${QUESTIONS.length}`}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <form
          className="question-panel"
          onSubmit={(event) => {
            event.preventDefault();
            onNext();
          }}
        >
          <div className="question-panel__domain">{DOMAIN_LABELS[question.domain]}</div>
          <h1 id={`question-title-${question.id}`} ref={headingRef} tabIndex={-1}>{question.title}</h1>
          <fieldset aria-labelledby={`question-title-${question.id}`}>
            <legend className="sr-only">質問 {currentIndex + 1} の回答</legend>
            {question.helperText && <p className="question-panel__helper">{question.helperText}</p>}

            <div className="answer-grid" aria-describedby="unknown-answer-note question-error">
              {ANSWER_OPTIONS.map((option, index) => (
                <label className={`answer-option ${selected === option.id ? "is-selected" : ""}`} key={option.id}>
                  <input
                    type="radio"
                    name={`answer-${question.id}`}
                    value={option.id}
                    checked={selected === option.id}
                    onChange={() => onAnswer(question.id, option.id)}
                  />
                  <span className="answer-option__marker" aria-hidden="true">
                    {selected === option.id ? <CheckIcon size={16} /> : String.fromCharCode(65 + index)}
                  </span>
                  <span className="answer-option__copy">
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="gentle-note" id="unknown-answer-note">
            <InfoIcon size={19} />
            <p>{UNKNOWN_ANSWER_HELPER}</p>
          </div>

          <p className="form-error form-error--center" id="question-error" role="alert" aria-live="assertive">
            {error ?? ""}
          </p>

          <div className="step-navigation">
            <button className="button button--secondary" type="button" onClick={onBack}>
              <ArrowLeftIcon size={18} /> 戻る
            </button>
            <button className="button button--primary" type="submit">
              {isLast ? "診断結果を見る" : "次の質問へ"} <ArrowRightIcon size={18} />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

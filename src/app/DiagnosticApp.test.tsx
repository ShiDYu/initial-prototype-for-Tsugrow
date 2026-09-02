import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CompanyProfileStep } from "../components/CompanyProfileStep";
import { ConsultationForm } from "../components/ConsultationForm";
import { RiskDetailCard } from "../components/RiskDetailCard";
import { QUESTIONS } from "../data/questions";
import type { DiagnosticAnswers, RiskResult } from "../domain/diagnosticTypes";
import {
  DIAGNOSTIC_SESSION_KEY,
  INITIAL_DIAGNOSTIC_STATE,
} from "../hooks/useDiagnosticSession";
import { DiagnosticApp } from "./DiagnosticApp";

beforeEach(() => {
  window.sessionStorage.clear();
  Object.defineProperty(window, "scrollTo", {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("診断UIの受け入れ条件", () => {
  it("基本情報の必須項目が未選択の場合は質問へ進まない", () => {
    const onComplete = vi.fn();

    render(
      <CompanyProfileStep
        profile={{
          industry: "",
          revenueBand: "",
          employeeBand: "",
          successionTiming: "",
          successionOptions: [],
        }}
        onChange={vi.fn()}
        onBack={vi.fn()}
        onComplete={onComplete}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /10問の診断へ/ }));

    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("必須の項目がまだ選択されていません");
    expect(screen.getByText("業種を選択してください。")).toBeInTheDocument();
    expect(screen.getByText("承継を考える時期を選択してください。")).toBeInTheDocument();
    expect(screen.getByText("検討している選択肢を1つ以上選んでください。")).toBeInTheDocument();
    expect(screen.getByLabelText(/^業種/)).toHaveFocus();
  });

  it("未回答では次の質問へ進まず、戻っても回答を保持する", () => {
    window.sessionStorage.setItem(
      DIAGNOSTIC_SESSION_KEY,
      JSON.stringify({
        version: 1,
        state: {
          ...INITIAL_DIAGNOSTIC_STATE,
          currentStep: "questions",
          startedAt: "2026-09-01T00:00:00.000Z",
        },
      }),
    );

    render(<DiagnosticApp />);

    expect(screen.getByRole("heading", { level: 1, name: QUESTIONS[0].title })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "次の質問へ" }));

    expect(screen.getByText("回答を1つ選択してから次へ進んでください。")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: QUESTIONS[0].title })).toBeInTheDocument();

    const firstAnswer = screen.getByRole("radio", { name: /整理・説明できる/ });
    fireEvent.click(firstAnswer);
    expect(firstAnswer).toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: "次の質問へ" }));

    expect(screen.getByRole("heading", { level: 1, name: QUESTIONS[1].title })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "戻る" }));

    expect(screen.getByRole("heading", { level: 1, name: QUESTIONS[0].title })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /整理・説明できる/ })).toBeChecked();
  });

  it("リスク詳細を開閉でき、開いたときだけイベントを通知する", () => {
    const onOpen = vi.fn();
    const risk: RiskResult = {
      questionId: "IR02",
      riskRuleId: "R_IR02",
      score: 9,
      priorityRank: 1,
      answerId: "unknown",
    };

    render(<RiskDetailCard risk={risk} onOpen={onOpen} />);

    const toggle = screen.getByRole("button", { name: /経営者への依存/ });
    const detailsHeading = screen.getByText("将来確認される可能性があること");

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(detailsHeading).not.toBeVisible();

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(detailsHeading).toBeVisible();
    expect(onOpen).toHaveBeenCalledOnce();
    expect(onOpen).toHaveBeenCalledWith("R_IR02");

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(detailsHeading).not.toBeVisible();
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it("相談フォームはメールアドレスと相談方法の両方を必須にする", () => {
    const onSubmitComplete = vi.fn();

    render(<ConsultationForm onBack={vi.fn()} onSubmitComplete={onSubmitComplete} />);

    fireEvent.click(screen.getByRole("button", { name: "相談内容を確認する" }));

    expect(onSubmitComplete).not.toHaveBeenCalled();
    expect(screen.getByText("メールアドレスを入力してください。")).toBeInTheDocument();
    expect(screen.getByText("相談方法を選択してください。")).toBeInTheDocument();
    expect(screen.getByLabelText(/^メールアドレス/)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/^メールアドレス/)).toHaveFocus();
  });

  it("sessionStorageから質問番号と回答を復元できる", () => {
    window.sessionStorage.setItem(
      DIAGNOSTIC_SESSION_KEY,
      JSON.stringify({
        version: 1,
        state: {
          ...INITIAL_DIAGNOSTIC_STATE,
          currentStep: "questions",
          currentQuestionIndex: 2,
          answers: { IR02: "ready", CM01: "partial", CM02: "unknown" },
          startedAt: "2026-09-01T00:00:00.000Z",
        },
      }),
    );

    render(<DiagnosticApp />);

    expect(screen.getByRole("heading", { level: 1, name: QUESTIONS[2].title })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /分からない/ })).toBeChecked();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "3");
  });

  it("結果画面から印刷を呼び出せる", () => {
    const answers = Object.fromEntries(QUESTIONS.map((question) => [question.id, "ready"])) as DiagnosticAnswers;
    const print = vi.fn();
    Object.defineProperty(window, "print", { configurable: true, value: print });
    window.sessionStorage.setItem(
      DIAGNOSTIC_SESSION_KEY,
      JSON.stringify({
        version: 1,
        state: {
          ...INITIAL_DIAGNOSTIC_STATE,
          currentStep: "results",
          answers,
          startedAt: "2026-09-01T00:00:00.000Z",
          completedAt: "2026-09-01T00:05:00.000Z",
        },
      }),
    );

    render(<DiagnosticApp />);
    fireEvent.click(screen.getAllByRole("button", { name: /結果を印刷する/ })[0]!);

    expect(print).toHaveBeenCalledOnce();
  });

  it("最初からやり直すと保存中の診断を消してランディングへ戻る", () => {
    const answers = Object.fromEntries(QUESTIONS.map((question) => [question.id, "partial"])) as DiagnosticAnswers;
    vi.spyOn(window, "confirm").mockReturnValue(true);
    window.sessionStorage.setItem(
      DIAGNOSTIC_SESSION_KEY,
      JSON.stringify({
        version: 1,
        state: {
          ...INITIAL_DIAGNOSTIC_STATE,
          currentStep: "results",
          answers,
          startedAt: "2026-09-01T00:00:00.000Z",
          completedAt: "2026-09-01T00:05:00.000Z",
        },
      }),
    );

    render(<DiagnosticApp />);
    fireEvent.click(screen.getByRole("button", { name: /最初からやり直す/ }));

    expect(screen.getAllByRole("button", { name: /無料で診断を始める/ }).length).toBeGreaterThan(0);
    expect(window.sessionStorage.getItem(DIAGNOSTIC_SESSION_KEY)).toBeNull();
  });
});

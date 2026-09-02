import type { Question, QuestionId } from "../domain/diagnosticTypes";

/**
 * Questions are stored in their respondent-facing order. `priorityOrder` is kept
 * separate so either ordering can be changed without changing question IDs.
 */
export const QUESTIONS = [
  {
    id: "IR02",
    domain: "IR",
    displayOrder: 1,
    title:
      "経営者が1か月不在でも、主要な営業・製造・サービス提供・意思決定を他の人が説明し、継続できますか？",
    helperText: "経営者への依存度を確認します",
    impactWeight: 3,
    priorityOrder: 1,
    riskRuleId: "R_IR02",
  },
  {
    id: "CM01",
    domain: "CM",
    displayOrder: 2,
    title:
      "最大顧客が売上に占める割合を把握し、その取引が継続する根拠を説明できますか？",
    helperText: "顧客集中度と契約・関係の継続性を確認します",
    impactWeight: 3,
    priorityOrder: 2,
    riskRuleId: "R_CM01",
  },
  {
    id: "CM02",
    domain: "CM",
    displayOrder: 3,
    title:
      "主要顧客・仕入先との契約条件や、特定の担当者・経営者への依存関係を整理していますか？",
    helperText:
      "口頭契約や社長個人の関係だけに依存していないかを確認します",
    impactWeight: 2,
    priorityOrder: 3,
    riskRuleId: "R_CM02",
  },
  {
    id: "EQ02",
    domain: "EQ",
    displayOrder: 4,
    title:
      "月次の売上・利益を、事業別または主要商品・サービス別に把握できますか？",
    helperText:
      "会社全体の年間利益だけでなく、何が利益を生んでいるかを確認します",
    impactWeight: 2,
    priorityOrder: 4,
    riskRuleId: "R_EQ02",
  },
  {
    id: "EQ01",
    domain: "EQ",
    displayOrder: 5,
    title:
      "一時的な収入・費用や、経営者個人に関係する支出を分けて、自社の本来の利益を説明できますか？",
    helperText:
      "例: 一時的な補助金、役員個人に関係する費用、通常発生しない修繕費",
    impactWeight: 3,
    priorityOrder: 5,
    riskRuleId: "R_EQ01",
  },
  {
    id: "BS01",
    domain: "BS",
    displayOrder: 6,
    title:
      "会社と経営者個人の資産、貸し借り、取引は明確に分けて整理されていますか？",
    helperText: "例: 役員貸付金、個人所有不動産、会社と個人間の取引",
    impactWeight: 3,
    priorityOrder: 6,
    riskRuleId: "R_BS01",
  },
  {
    id: "BS02",
    domain: "BS",
    displayOrder: 7,
    title:
      "遊休資産、回収が遅れている債権、簿外債務・偶発債務の有無を説明できますか？",
    helperText:
      "例: 使用していない不動産、長期未回収の売掛金、未払残業代",
    impactWeight: 3,
    priorityOrder: 7,
    riskRuleId: "R_BS02",
  },
  {
    id: "IR01",
    domain: "IR",
    displayOrder: 8,
    title:
      "過去3期分の決算書、直近試算表、主要契約、株主情報を短期間で提出できますか？",
    helperText:
      "書類の正確性ではなく、必要情報をすぐ集められるかを確認します",
    impactWeight: 2,
    priorityOrder: 8,
    riskRuleId: "R_IR01",
  },
  {
    id: "DO01",
    domain: "DO",
    displayOrder: 9,
    title:
      "すべての株主、持株比率、連絡先を最新の状態で把握していますか？",
    helperText: "古い株主名簿や連絡不能株主がいないかを確認します",
    impactWeight: 3,
    priorityOrder: 9,
    riskRuleId: "R_DO01",
  },
  {
    id: "DO02",
    domain: "DO",
    displayOrder: 10,
    title:
      "主要契約、許認可、紛争、関連当事者取引を一覧で説明できますか？",
    helperText:
      "専門的な適法性判断ではなく、所在と状況を把握しているかを確認します",
    impactWeight: 3,
    priorityOrder: 10,
    riskRuleId: "R_DO02",
  },
] as const satisfies readonly Question[];

export const QUESTIONS_BY_ID = Object.fromEntries(
  QUESTIONS.map((question) => [question.id, question]),
) as Record<QuestionId, (typeof QUESTIONS)[number]>;

export const questions = QUESTIONS;

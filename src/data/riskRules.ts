import type {
  QuestionId,
  RiskRule,
  RiskRuleId,
} from "../domain/diagnosticTypes";

/**
 * The answer-specific first block (「確認された状態」) lives in copy.ts.
 * Each rule supplies the remaining four required detail blocks.
 */
export const RISK_RULES = [
  {
    id: "R_EQ01",
    title: "本来の収益力を説明する準備",
    questionId: "EQ01",
    futureCheck:
      "一時的な収入・費用や経営者に関係する支出を区分し、本来の利益を根拠とともに説明できるか確認される可能性があります。",
    impact:
      "買い手が利益の継続性を判断しにくくなり、価格の前提を保守的に置く可能性",
    firstAction: "一時収益・一時費用・経営者関連費用の一覧を作る",
    advisorCandidates: "税理士、公認会計士",
  },
  {
    id: "R_EQ02",
    title: "利益を生む事業の可視化",
    questionId: "EQ02",
    futureCheck:
      "事業別または主要商品・サービス別の売上と利益を月次で把握し、収益源を説明できるか確認される可能性があります。",
    impact:
      "事業別の強み・成長性を説明できず、将来計画の信頼性が下がる可能性",
    firstAction: "主要事業・商品別に月次売上と粗利を集計する",
    advisorCandidates: "税理士、管理会計担当",
  },
  {
    id: "R_BS01",
    title: "会社と経営者個人の取引整理",
    questionId: "BS01",
    futureCheck:
      "会社と経営者個人の間にある資産、貸し借り、賃貸、保証、その他の取引が明確に区分されているか確認される可能性があります。",
    impact:
      "売却対象、ネットデット、取引条件について追加交渉が発生する可能性",
    firstAction: "会社・役員間の資産、貸借、賃貸、保証を一覧化する",
    advisorCandidates: "税理士、弁護士",
  },
  {
    id: "R_BS02",
    title: "潜在的な資産・負債の確認",
    questionId: "BS02",
    futureCheck:
      "遊休資産や滞留債権、未払項目、保証、紛争など、帳簿だけでは分かりにくい資産・負債の有無を確認される可能性があります。",
    impact: "価格調整、表明保証、補償条件の追加につながる可能性",
    firstAction: "滞留債権、遊休資産、未払項目、保証・紛争を一覧化する",
    advisorCandidates: "税理士、会計士、社労士",
  },
  {
    id: "R_CM01",
    title: "主要顧客への依存",
    questionId: "CM01",
    futureCheck:
      "最大顧客への売上依存度と、その取引が経営者交代後も継続すると考えられる根拠を確認される可能性があります。",
    impact:
      "売上継続性への懸念から、評価倍率や支払条件が保守的になる可能性",
    firstAction: "顧客別売上、粗利、契約期間、更新履歴を整理する",
    advisorCandidates: "営業責任者、税理士",
  },
  {
    id: "R_CM02",
    title: "契約・関係性の組織化",
    questionId: "CM02",
    futureCheck:
      "主要顧客・仕入先との契約条件や窓口、特定の担当者・経営者に依存しない関係になっているか確認される可能性があります。",
    impact: "経営者交代後の取引継続性を疑われる可能性",
    firstAction:
      "主要顧客・仕入先の契約、窓口、意思決定者、更新条件を整理する",
    advisorCandidates: "営業責任者、弁護士",
  },
  {
    id: "R_DO01",
    title: "株主情報の整理",
    questionId: "DO01",
    futureCheck:
      "すべての株主、持株比率、株式の取得経緯、連絡先が最新の資料で確認できるか確認される可能性があります。",
    impact: "意思確認や株式移転に時間がかかり、取引が遅延・中止する可能性",
    firstAction: "最新の株主名簿、持株比率、取得経緯、連絡先を確認する",
    advisorCandidates: "司法書士、弁護士、税理士",
  },
  {
    id: "R_DO02",
    title: "契約・許認可・紛争の一覧化",
    questionId: "DO02",
    futureCheck:
      "主要契約、許認可、紛争、関連当事者取引の所在と現在の状況を一覧で説明できるか確認される可能性があります。",
    impact:
      "クロージング条件、表明保証、許認可承継の追加対応が必要になる可能性",
    firstAction: "主要契約、許認可、紛争、関連当事者取引の台帳を作る",
    advisorCandidates: "弁護士、行政書士、税理士",
  },
  {
    id: "R_IR01",
    title: "DD資料を集める体制",
    questionId: "IR01",
    futureCheck:
      "決算書、直近試算表、主要契約、株主情報などの必要資料を、担当者が短期間で整合的に提出できるか確認される可能性があります。",
    impact:
      "資料提出の遅れや不整合が、買い手の信頼低下と追加質問につながる可能性",
    firstAction: "必要資料チェックリストを作り、保存場所と担当者を決める",
    advisorCandidates: "経理責任者、税理士",
  },
  {
    id: "R_IR02",
    title: "経営者への依存",
    questionId: "IR02",
    futureCheck:
      "経営者が不在でも、主要業務と意思決定を他の人が説明し、事業を継続できるか確認される可能性があります。",
    impact:
      "経営者退任後の事業継続性を疑われ、引継期間や条件が厳しくなる可能性",
    firstAction:
      "経営者しかできない業務を洗い出し、代理担当と手順を決める",
    advisorCandidates: "経営幹部、人事・組織コンサルタント",
  },
] as const satisfies readonly RiskRule[];

export const RISK_RULES_BY_ID = Object.fromEntries(
  RISK_RULES.map((rule) => [rule.id, rule]),
) as Record<RiskRuleId, (typeof RISK_RULES)[number]>;

export const RISK_RULES_BY_QUESTION_ID = Object.fromEntries(
  RISK_RULES.map((rule) => [rule.questionId, rule]),
) as Record<QuestionId, (typeof RISK_RULES)[number]>;

export const riskRules = RISK_RULES;

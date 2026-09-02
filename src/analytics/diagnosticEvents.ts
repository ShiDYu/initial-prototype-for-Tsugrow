export type DiagnosticEvent =
  | { name: "diagnostic_view" }
  | { name: "diagnostic_start" }
  | { name: "profile_complete"; industry: string; revenueBand: string; employeeBand: string }
  | { name: "question_answered"; questionId: string; answerId: string }
  | { name: "diagnostic_complete"; durationSeconds: number; domainStatuses: string[] }
  | { name: "risk_detail_open"; riskRuleId: string }
  | { name: "print_result" }
  | { name: "consultation_cta_click" }
  | { name: "consultation_submit" };

/** 接続先を持たないMVP用の呼び出し口。意図的に送信もログ出力もしません。 */
export function trackDiagnosticEvent(event: DiagnosticEvent): void {
  void event;
  // Existing analytics can be connected here in a later phase.
}

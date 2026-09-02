import { useState } from "react";
import {
  ANSWER_STATE_COPY,
  DOMAIN_LABELS,
  IMPROVEMENT_ESTIMATE,
  RISK_DETAIL_BLOCK_LABELS,
} from "../data/copy";
import { QUESTIONS_BY_ID } from "../data/questions";
import { RISK_RULES_BY_ID } from "../data/riskRules";
import type { RiskResult } from "../domain/diagnosticTypes";
import {
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  CompassIcon,
  DocumentIcon,
  UserGroupIcon,
} from "./Icons";

type RiskDetailCardProps = {
  risk: RiskResult;
  defaultOpen?: boolean;
  onOpen?: (riskRuleId: string) => void;
};

function getPriority(risk: RiskResult) {
  if (risk.score === 0) return { label: "維持確認", className: "maintenance" };
  if (risk.score >= 6) return { label: "高", className: "high" };
  return { label: "中", className: "medium" };
}

export function RiskDetailCard({ risk, defaultOpen = false, onOpen }: RiskDetailCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rule = RISK_RULES_BY_ID[risk.riskRuleId];
  const question = QUESTIONS_BY_ID[risk.questionId];
  const priority = getPriority(risk);
  const detailsId = `risk-details-${risk.riskRuleId}`;

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) onOpen?.(risk.riskRuleId);
  };

  return (
    <article className={`risk-card ${open ? "is-open" : ""}`}>
      <button
        className="risk-card__summary"
        type="button"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={toggle}
      >
        <span className="risk-card__rank">{String(risk.priorityRank).padStart(2, "0")}</span>
        <span className="risk-card__heading">
          <span className="risk-card__meta">
            <span>{DOMAIN_LABELS[question.domain]}</span>
            <i className={`priority-chip priority-chip--${priority.className}`}>優先度 {priority.label}</i>
          </span>
          <strong>{rule.title}</strong>
          <small>{ANSWER_STATE_COPY[risk.answerId]}</small>
        </span>
        <span className="risk-card__toggle" aria-hidden="true">
          <span>{open ? "閉じる" : "詳しく見る"}</span><ChevronDownIcon size={18} />
        </span>
      </button>

      <div className="risk-card__details" id={detailsId} hidden={!open}>
        <div className="detail-grid">
          <div className="detail-block detail-block--state">
            <span className="detail-block__icon"><CheckCircleIcon size={19} /></span>
            <div><h4>{RISK_DETAIL_BLOCK_LABELS.currentState}</h4><p>{ANSWER_STATE_COPY[risk.answerId]}</p></div>
          </div>
          <div className="detail-block">
            <span className="detail-block__icon"><DocumentIcon size={19} /></span>
            <div><h4>{RISK_DETAIL_BLOCK_LABELS.futureCheck}</h4><p>{rule.futureCheck}</p></div>
          </div>
          <div className="detail-block detail-block--impact">
            <span className="detail-block__icon"><CompassIcon size={19} /></span>
            <div><h4>{RISK_DETAIL_BLOCK_LABELS.impact}</h4><p>{rule.impact}</p></div>
          </div>
          <div className="detail-block detail-block--action">
            <span className="detail-block__icon"><CheckCircleIcon size={19} /></span>
            <div><h4>{RISK_DETAIL_BLOCK_LABELS.firstAction}</h4><p><strong>{rule.firstAction}</strong></p></div>
          </div>
          <div className="detail-block detail-block--advisor">
            <span className="detail-block__icon"><UserGroupIcon size={19} /></span>
            <div><h4>{RISK_DETAIL_BLOCK_LABELS.advisorCandidates}</h4><p>{rule.advisorCandidates}</p></div>
          </div>
        </div>
        <div className="improvement-estimate"><CalendarIcon size={17} /><span>改善目安</span><strong>{IMPROVEMENT_ESTIMATE}</strong><small>※ 案件固有の期間を確約するものではありません</small></div>
      </div>
    </article>
  );
}

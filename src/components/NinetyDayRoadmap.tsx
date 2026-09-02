import { ROADMAP_COPY } from "../data/copy";
import { RISK_RULES_BY_ID } from "../data/riskRules";
import type { RiskResult } from "../domain/diagnosticTypes";
import { CheckIcon } from "./Icons";

type NinetyDayRoadmapProps = {
  risks: RiskResult[];
};

function phaseAction(index: number, risk: RiskResult) {
  const rule = RISK_RULES_BY_ID[risk.riskRuleId];
  if (index === 0) return rule.firstAction;
  if (index === 1) return `${rule.title}について、${rule.advisorCandidates.split("、")[0]}と論点を確認する`;
  return `${rule.title}の改善方針・担当者・期限を決める`;
}

export function NinetyDayRoadmap({ risks }: NinetyDayRoadmapProps) {
  return (
    <div className="roadmap">
      {ROADMAP_COPY.map((phase, index) => (
        <section className="roadmap-phase" key={phase.period}>
          <div className="roadmap-phase__rail" aria-hidden="true">
            <span>{index + 1}</span><i />
          </div>
          <div className="roadmap-phase__content">
            <div className="roadmap-phase__heading">
              <span>{phase.period}</span>
              <div><h3>{phase.description}</h3><p>上位3ポイントを、できるところから順に進めます。</p></div>
            </div>
            <ul>
              {risks.map((risk) => (
                <li key={`${index}-${risk.riskRuleId}`}><span><CheckIcon size={14} /></span>{phaseAction(index, risk)}</li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}

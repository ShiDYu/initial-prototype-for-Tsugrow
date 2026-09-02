import { DOMAIN_LABELS, STATUS_COPY } from "../data/copy";
import type { DomainResult } from "../domain/diagnosticTypes";
import { CheckCircleIcon, AlertCircleIcon } from "./Icons";

type DomainReadinessListProps = {
  domains: DomainResult[];
};

export function DomainReadinessList({ domains }: DomainReadinessListProps) {
  return (
    <div className="domain-list">
      {domains.map((domain) => {
        const status = STATUS_COPY[domain.status];
        const StatusIcon = domain.status === "ready" ? CheckCircleIcon : AlertCircleIcon;
        return (
          <div className={`domain-row status-${domain.status}`} key={domain.domain}>
            <div className="domain-row__meta">
              <strong>{DOMAIN_LABELS[domain.domain]}</strong>
              <span className="domain-row__status"><StatusIcon size={15} />{status.label}</span>
              <span className="domain-row__score">{domain.readiness}<small>/100</small></span>
            </div>
            <div className="domain-row__track" aria-hidden="true">
              <span style={{ width: `${domain.readiness}%` }} />
            </div>
            <span className="sr-only">準備度 {domain.readiness}点、{status.label}</span>
          </div>
        );
      })}
    </div>
  );
}

import {
  DIAGNOSTIC_DISCLAIMER,
  OVERALL_READINESS_LABEL,
  OVERALL_RESULT_COPY,
  RESULT_CONFIDENCE_COPY,
  STATUS_COPY,
} from "../data/copy";
import type { DiagnosticResult } from "../domain/diagnosticTypes";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  InfoIcon,
  PrintIcon,
  RefreshIcon,
  ShieldIcon,
} from "./Icons";
import { JourneyHeader } from "./JourneyHeader";
import { DomainReadinessList } from "./DomainReadinessList";
import { RiskDetailCard } from "./RiskDetailCard";
import { NinetyDayRoadmap } from "./NinetyDayRoadmap";

type ResultsScreenProps = {
  result: DiagnosticResult;
  onConsultation: () => void;
  onPrint: () => void;
  onRestart: () => void;
  onRiskOpen?: (riskRuleId: string) => void;
};

export function ResultsScreen({ result, onConsultation, onPrint, onRestart, onRiskOpen }: ResultsScreenProps) {
  const status = STATUS_COPY[result.overallStatus];
  const StatusIcon = result.overallStatus === "ready" ? CheckCircleIcon : AlertCircleIcon;
  const completedDate = new Intl.DateTimeFormat("ja-JP", { dateStyle: "long" }).format(new Date());

  return (
    <section className="results-page">
      <div className="page-width results-width">
        <div className="no-print"><JourneyHeader active={3} /></div>
        <div className="print-only print-heading">
          <p>Tsugrow Value Readiness Scan</p>
          <span>診断日: {completedDate}</span>
        </div>

        <header className="result-intro">
          <span className="result-intro__check"><CheckCircleIcon size={27} /></span>
          <p>診断が完了しました</p>
          <h1>将来の選択肢を守るための、<br />いまの準備状況です。</h1>
          <span>点数の高さだけでなく、優先したい3つの確認ポイントをご覧ください。</span>
        </header>

        <section className={`overall-card status-${result.overallStatus}`} aria-labelledby="overall-title">
          <div className="overall-card__score">
            <div className="score-ring" style={{ "--score": result.overallReadiness } as React.CSSProperties}>
              <div><strong>{result.overallReadiness}</strong><span>/100</span></div>
            </div>
            <div className="overall-card__score-copy">
              <p id="overall-title">{OVERALL_READINESS_LABEL}</p>
              <span className="overall-status"><StatusIcon size={18} />{status.label}</span>
            </div>
          </div>
          <div className="overall-card__message">
            <span>YOUR READINESS</span>
            <h2>{status.message}</h2>
            <p>{OVERALL_RESULT_COPY[result.overallStatus]}</p>
          </div>
        </section>

        <aside className="confidence-note">
          <InfoIcon size={21} />
          <p><strong>この結果について</strong>{RESULT_CONFIDENCE_COPY}</p>
        </aside>

        <section className="results-section domain-section" aria-labelledby="domains-title">
          <div className="results-section__heading">
            <div><span className="section-number">01</span><div><p>5つの視点から確認</p><h2 id="domains-title">領域別の準備状況</h2></div></div>
            <p>各領域は2問の回答から算出した自己診断上の準備度です。</p>
          </div>
          <DomainReadinessList domains={result.domains} />
          <div className="domain-legend">
            <span><i className="legend-ready" />75〜100 おおむね準備</span>
            <span><i className="legend-attention" />45〜74 確認・改善が必要</span>
            <span><i className="legend-priority" />0〜44 優先的な確認が必要</span>
          </div>
        </section>

        <section className="results-section risks-section" aria-labelledby="risks-title">
          <div className="results-section__heading">
            <div><span className="section-number">02</span><div><p>ここから着手</p><h2 id="risks-title">優先的に確認したい3つのポイント</h2></div></div>
            <p>{result.overallReadiness === 100 ? "良い状態を維持するため、領域を分けて確認価値の高い項目を選びました。" : "回答と影響度から、先に確認したい順に整理しています。数値のリスクスコアは画面には表示しません。"}</p>
          </div>
          <div className="risk-list">
            {result.priorityRisks.map((risk, index) => (
              <RiskDetailCard risk={risk} defaultOpen={index === 0} onOpen={onRiskOpen} key={risk.riskRuleId} />
            ))}
          </div>
        </section>

        <section className="results-section roadmap-section" aria-labelledby="roadmap-title">
          <div className="results-section__heading">
            <div><span className="section-number">03</span><div><p>無理なく進める目安</p><h2 id="roadmap-title">最初の90日 改善ロードマップ</h2></div></div>
            <p>厳密なプロジェクト計画ではなく、社内や専門家との最初の会話を始めるための目安です。</p>
          </div>
          <NinetyDayRoadmap risks={result.priorityRisks} />
        </section>

        <section className="result-cta no-print">
          <div className="result-cta__icon"><ShieldIcon size={30} /></div>
          <div>
            <p>次の一歩を、ひとりで決めなくて大丈夫です</p>
            <h2>この結果を専門家と一緒に<br />確認しませんか？</h2>
            <span>詳細診断では、資料をもとに根拠と改善優先順位を整理します。</span>
          </div>
          <div className="result-cta__actions">
            <button className="button button--cream" type="button" onClick={onConsultation}>
              この結果を専門家と確認する <ArrowRightIcon size={18} />
            </button>
            <button className="button button--ghost-light" type="button" onClick={onPrint}>
              <PrintIcon size={18} /> 結果を印刷する
            </button>
          </div>
        </section>

        <aside className="disclaimer result-disclaimer" aria-label="免責事項">
          <InfoIcon size={20} />
          <p><strong>免責事項</strong>{DIAGNOSTIC_DISCLAIMER} 本スコアは企業価値や成約確率を示すものではありません。</p>
        </aside>

        <div className="result-utilities no-print">
          <button className="text-button" type="button" onClick={onPrint}><PrintIcon size={17} />結果を印刷する</button>
          <button className="text-button text-button--muted" type="button" onClick={onRestart}><RefreshIcon size={17} />最初からやり直す</button>
        </div>
      </div>
    </section>
  );
}

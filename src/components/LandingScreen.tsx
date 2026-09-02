import {
  ArrowRightIcon,
  ChartIcon,
  CheckCircleIcon,
  ClockIcon,
  CompassIcon,
  InfoIcon,
  LayersIcon,
  ShieldIcon,
} from "./Icons";

type LandingScreenProps = {
  onStart: () => void;
  onResume?: () => void;
  hasSavedProgress?: boolean;
};

const BENEFITS = [
  {
    number: "01",
    icon: ChartIcon,
    title: "5領域で現在地を把握",
    body: "利益・財務・顧客・法務・情報整備の観点から、いまの準備状況を見える化します。",
  },
  {
    number: "02",
    icon: CompassIcon,
    title: "優先ポイントを3つに整理",
    body: "すべてを一度に直すのではなく、将来に向けて先に確認したい項目を絞り込みます。",
  },
  {
    number: "03",
    icon: LayersIcon,
    title: "最初の90日を具体化",
    body: "情報確認から専門家との相談まで、無理なく始められる行動の目安を提示します。",
  },
];

export function LandingScreen({ onStart, onResume, hasSavedProgress = false }: LandingScreenProps) {
  return (
    <>
      <section className="hero">
        <div className="hero__glow hero__glow--one" />
        <div className="hero__glow hero__glow--two" />
        <div className="page-width hero__inner">
          <div className="hero__copy">
            <p className="eyebrow"><span />将来の選択肢を守る、5分間の企業価値リスク診断</p>
            <h1>将来の事業承継で、<br /><em>会社の価値</em>を不必要に<br className="desktop-break" />下げないために。</h1>
            <p className="hero__lead">
              10問の簡易診断で、承継やM&amp;Aのときに確認されやすい準備不足を整理します。<strong>売却を決めていない段階でも</strong>利用できます。
            </p>

            {hasSavedProgress && onResume ? (
              <div className="resume-panel" role="status">
                <div>
                  <span className="resume-panel__label">診断の途中データがあります</span>
                  <span className="resume-panel__copy">同じタブで続きから再開できます。</span>
                </div>
                <button className="button button--primary" type="button" onClick={onResume}>
                  続きから再開 <ArrowRightIcon size={18} />
                </button>
              </div>
            ) : (
              <button className="button button--primary button--hero" type="button" onClick={onStart}>
                無料で診断を始める <ArrowRightIcon size={19} />
              </button>
            )}

            {hasSavedProgress && (
              <button className="text-button hero__new-start" type="button" onClick={onStart}>
                最初から新しく診断する
              </button>
            )}

            <div className="hero__facts" aria-label="診断の概要">
              <span><ClockIcon size={17} /> 約5分</span>
              <span><CheckCircleIcon size={17} /> 10問</span>
              <span><ShieldIcon size={17} /> 匿名・資料不要</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="診断結果イメージ">
            <div className="hero-visual__topline">
              <div>
                <span className="hero-visual__kicker">VALUE READINESS</span>
                <h2>将来への準備状況</h2>
              </div>
              <span className="hero-visual__status"><CheckCircleIcon size={15} /> 自己診断</span>
            </div>
            <div className="score-orbit">
              <svg viewBox="0 0 160 160" aria-hidden="true">
                <circle cx="80" cy="80" r="66" className="score-orbit__track" />
                <circle cx="80" cy="80" r="66" className="score-orbit__value" />
              </svg>
              <div className="score-orbit__copy">
                <strong>5</strong>
                <span>つの領域</span>
              </div>
            </div>
            <div className="mini-domains" aria-hidden="true">
              <div><span>利益の説明力</span><i><b style={{ width: "78%" }} /></i></div>
              <div><span>財務・資産</span><i><b style={{ width: "62%" }} /></i></div>
              <div><span>顧客・商流</span><i><b style={{ width: "86%" }} /></i></div>
              <div><span>株主・法務</span><i><b style={{ width: "54%" }} /></i></div>
              <div><span>情報整備・属人化</span><i><b style={{ width: "70%" }} /></i></div>
            </div>
            <div className="hero-visual__bottom">
              <span>優先ポイント</span>
              <strong>3件に整理</strong>
            </div>
          </div>
        </div>
        <a className="scroll-cue no-print" href="#about">診断について詳しく見る <span aria-hidden="true">↓</span></a>
      </section>

      <section className="trust-strip" aria-label="診断の特徴">
        <div className="page-width trust-strip__inner">
          <p><ShieldIcon size={21} />会社名・連絡先なしで結果を確認</p>
          <span />
          <p><ClockIcon size={21} />回答は同じタブ内で一時保存</p>
          <span />
          <p><CheckCircleIcon size={21} />企業価値や売却価格は算定しません</p>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="page-width">
          <div className="section-heading">
            <p className="eyebrow eyebrow--center"><span />この診断でわかること</p>
            <h2>売るためではなく、<br />どの承継方法も選びやすい会社へ。</h2>
            <p>結果は「点数だけ」で終わりません。次の会話を始めるための、確認ポイントと行動をお渡しします。</p>
          </div>
          <div className="benefit-grid">
            {BENEFITS.map(({ number, icon: Icon, title, body }) => (
              <article className="benefit-card" key={number}>
                <div className="benefit-card__top">
                  <span className="benefit-card__icon"><Icon size={23} /></span>
                  <span className="benefit-card__number">{number}</span>
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="principle-section">
        <div className="page-width principle-section__inner">
          <div className="principle-section__copy">
            <p className="eyebrow"><span />安心して回答するために</p>
            <h2>この診断は、<br />専門家との会話の入口です。</h2>
            <p>正解・不正解をつけるものではありません。「分からない」も、最初に確認すべきことを見つける大切な回答です。</p>
          </div>
          <div className="principle-list">
            <div><span><CheckCircleIcon /></span><p><strong>売却を前提にしません</strong>親族・従業員・第三者への承継など、選択肢が未定でも使えます。</p></div>
            <div><span><CheckCircleIcon /></span><p><strong>機密情報は入力しません</strong>財務数値、会社名、契約内容や資料のアップロードは不要です。</p></div>
            <div><span><CheckCircleIcon /></span><p><strong>改善できる行動を示します</strong>問題を断定せず、確認事項と最初の一歩をわかりやすく整理します。</p></div>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div className="page-width landing-cta__inner">
          <div>
            <p className="eyebrow eyebrow--light"><span />まずは現在地を確認</p>
            <h2>将来の選択肢を、<br />今日から少しずつ育てる。</h2>
            <p>約5分・10問。会社名や連絡先は必要ありません。</p>
          </div>
          <button className="button button--cream" type="button" onClick={onStart}>
            無料で診断を始める <ArrowRightIcon size={19} />
          </button>
        </div>
      </section>

      <aside className="disclaimer landing-disclaimer page-width" aria-label="免責事項">
        <InfoIcon size={20} />
        <p><strong>本診断について</strong>本診断は回答内容に基づく簡易的な自己診断です。企業価値算定、法務・税務判断、売却価格の保証を行うものではありません。</p>
      </aside>
    </>
  );
}

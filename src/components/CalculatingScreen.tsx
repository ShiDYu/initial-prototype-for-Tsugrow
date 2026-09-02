import { CheckIcon } from "./Icons";

export function CalculatingScreen() {
  return (
    <section className="calculating-page" aria-live="polite" aria-busy="true">
      <div className="calculating-card">
        <div className="calculating-mark" aria-hidden="true">
          <span /><span /><span />
          <CheckIcon size={28} />
        </div>
        <p className="eyebrow eyebrow--center"><span />診断はまもなく完了です</p>
        <h1>回答内容を5つの領域に<br />整理しています</h1>
        <p>入力された内容だけを使い、固定ルールで確認ポイントをまとめています。</p>
        <div className="calculating-line" aria-hidden="true"><span /></div>
      </div>
    </section>
  );
}

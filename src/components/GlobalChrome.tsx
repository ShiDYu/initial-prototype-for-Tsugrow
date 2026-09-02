import { LeafMark, LockIcon } from "./Icons";

type GlobalChromeProps = {
  children: React.ReactNode;
  compact?: boolean;
};

export function GlobalChrome({ children, compact = false }: GlobalChromeProps) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">本文へスキップ</a>
      <header className={`global-header ${compact ? "global-header--compact" : ""}`}>
        <div className="page-width global-header__inner">
          <div className="brand" aria-label="Tsugrow">
            <LeafMark className="brand__mark" />
            <span className="brand__wordmark">Tsugrow</span>
          </div>
          <div className="header-meta">
            <LockIcon size={16} />
            <span>匿名の簡易診断</span>
          </div>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <GlobalFooter />
    </div>
  );
}

function GlobalFooter() {
  return (
    <footer className="global-footer no-print">
      <div className="page-width global-footer__inner">
        <div className="brand brand--footer">
          <LeafMark size={28} className="brand__mark" />
          <span className="brand__wordmark">Tsugrow</span>
        </div>
        <p>将来の選択肢を、今から育てる。</p>
        <p className="global-footer__note">© 2026 Tsugrow — プロトタイプ</p>
      </div>
    </footer>
  );
}

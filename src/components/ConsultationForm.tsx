import { useRef, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  InfoIcon,
  LockIcon,
  MailIcon,
  ShieldIcon,
} from "./Icons";

type ConsultationFormProps = {
  onBack: () => void;
  onSubmitComplete: () => void;
};

type ContactValues = {
  name: string;
  company: string;
  email: string;
  message: string;
  preference: "with-advisor" | "tsugrow-first" | "";
};

const EMPTY_FORM: ContactValues = {
  name: "",
  company: "",
  email: "",
  message: "",
  preference: "",
};

export function ConsultationForm({ onBack, onSubmitComplete }: ConsultationFormProps) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<{ email?: string; preference?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const preferenceRef = useRef<HTMLFieldSetElement>(null);

  const setField = <K extends keyof ContactValues>(field: K, value: ContactValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: { email?: string; preference?: string } = {};
    if (!values.email.trim()) nextErrors.email = "メールアドレスを入力してください。";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = "メールアドレスの形式を確認してください。";
    if (!values.preference) nextErrors.preference = "相談方法を選択してください。";
    setErrors(nextErrors);

    if (nextErrors.email) emailRef.current?.focus();
    else if (nextErrors.preference) preferenceRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    else {
      setSubmitting(true);
      window.setTimeout(() => {
        setSubmitting(false);
        setComplete(true);
        onSubmitComplete();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 650);
    }
  };

  if (complete) {
    return (
      <section className="flow-page consultation-page">
        <div className="consultation-complete" role="status">
          <span className="consultation-complete__icon"><CheckCircleIcon size={36} /></span>
          <p className="eyebrow eyebrow--center"><span />デモ受付が完了しました</p>
          <h1>ご相談内容を<br />確認しました。</h1>
          <p>このプロトタイプでは、入力内容は実際には送信されません。実サービスでは担当者からの連絡方法をご案内します。</p>
          <div className="demo-receipt"><InfoIcon size={20} /><span><strong>デモモード</strong>外部サービスや担当者への送信は行われていません。</span></div>
          <button className="button button--primary" type="button" onClick={onBack}>
            診断結果に戻る <ArrowRightIcon size={18} />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flow-page consultation-page">
      <div className="consultation-width">
        <button className="back-link" type="button" onClick={onBack}><ArrowLeftIcon size={17} />診断結果に戻る</button>

        <div className="consultation-layout">
          <div className="consultation-copy">
            <p className="eyebrow"><span />詳細診断・ご相談</p>
            <h1>回答の先にある、<br />事実と優先順位を<br />一緒に整理します。</h1>
            <p>簡易診断では、回答内容から確認ポイントを整理しました。詳細診断では、決算書・契約書・株主情報などを確認し、根拠と改善優先順位を整理します。</p>
            <div className="consultation-points">
              <div><span><ShieldIcon size={20} /></span><p><strong>売却の意思は問いません</strong>承継方法が決まっていない段階から相談できます。</p></div>
              <div><span><LockIcon size={20} /></span><p><strong>診断回答は送信しません</strong>このフォームには、入力した連絡先と相談内容だけが対象です。</p></div>
              <div><span><MailIcon size={20} /></span><p><strong>まずは相談内容を確認</strong>資料提供の範囲は、必要性を確認してから決められます。</p></div>
            </div>
          </div>

          <form className="contact-card" onSubmit={handleSubmit} noValidate>
            <div className="demo-banner"><InfoIcon size={19} /><p><strong>これはデモフォームです</strong>入力内容は保存・送信されません。</p></div>
            <div className="contact-card__heading"><h2>相談内容を入力</h2><p><span className="required-dot">●</span> は必須項目です</p></div>

            <div className="contact-grid">
              <div className="form-field">
                <label htmlFor="contact-name">お名前 <span className="optional-label">任意</span></label>
                <input id="contact-name" autoComplete="name" value={values.name} onChange={(event) => setField("name", event.target.value)} placeholder="例）山田 太郎" />
              </div>
              <div className="form-field">
                <label htmlFor="contact-company">会社名 <span className="optional-label">任意</span></label>
                <input id="contact-company" autoComplete="organization" value={values.company} onChange={(event) => setField("company", event.target.value)} placeholder="例）株式会社つぐろう" />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="contact-email">メールアドレス <span className="required-label">必須</span></label>
              <input
                ref={emailRef}
                id="contact-email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => setField("email", event.target.value)}
                placeholder="example@company.jp"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
              />
              {errors.email && <p className="field-error" id="contact-email-error">{errors.email}</p>}
            </div>

            <fieldset className="contact-preference" ref={preferenceRef} aria-invalid={Boolean(errors.preference)} aria-describedby={errors.preference ? "preference-error" : undefined}>
              <legend>ご希望の相談方法 <span className="required-label">必須</span></legend>
              <label className={values.preference === "with-advisor" ? "is-selected" : ""}>
                <input type="radio" name="preference" checked={values.preference === "with-advisor"} onChange={() => setField("preference", "with-advisor")} />
                <span /><strong>顧問税理士と一緒に相談したい</strong>
              </label>
              <label className={values.preference === "tsugrow-first" ? "is-selected" : ""}>
                <input type="radio" name="preference" checked={values.preference === "tsugrow-first"} onChange={() => setField("preference", "tsugrow-first")} />
                <span /><strong>まずTsugrowに相談したい</strong>
              </label>
              {errors.preference && <p className="field-error" id="preference-error">{errors.preference}</p>}
            </fieldset>

            <div className="form-field">
              <label htmlFor="contact-message">相談したいこと <span className="optional-label">任意</span></label>
              <textarea id="contact-message" rows={4} value={values.message} onChange={(event) => setField("message", event.target.value)} placeholder="気になった診断結果や、承継について考えていることをご記入ください" />
              <p className="field-helper">財務数値や契約内容などの機密情報は入力しないでください。</p>
            </div>

            <div className="transmission-note"><LockIcon size={18} /><p><strong>送信対象（実サービスの場合）</strong>お名前、会社名、メールアドレス、相談方法、相談内容。診断回答全体は含みません。</p></div>

            <button className="button button--primary button--full" type="submit" disabled={submitting}>
              {submitting ? "デモ受付を処理しています…" : "相談内容を確認する"} {!submitting && <ArrowRightIcon size={18} />}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

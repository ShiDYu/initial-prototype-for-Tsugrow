import { useRef, useState } from "react";
import {
  EMPLOYEE_BAND_OPTIONS,
  INDUSTRY_OPTIONS,
  PROFILE_HELPER,
  REVENUE_BAND_OPTIONS,
  SUCCESSION_OPTION_OPTIONS,
  SUCCESSION_TIMING_OPTIONS,
} from "../data/profileOptions";
import type {
  CompanyProfile,
  EmployeeBandId,
  IndustryId,
  RevenueBandId,
  SuccessionOptionId,
  SuccessionTimingId,
} from "../domain/diagnosticTypes";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, InfoIcon, LockIcon } from "./Icons";
import { JourneyHeader } from "./JourneyHeader";

type CompanyProfileStepProps = {
  profile: CompanyProfile;
  onChange: (profile: CompanyProfile) => void;
  onBack: () => void;
  onComplete: () => void;
};

type ProfileErrors = Partial<Record<"industry" | "successionTiming" | "successionOptions", string>>;

export function CompanyProfileStep({ profile, onChange, onBack, onComplete }: CompanyProfileStepProps) {
  const [errors, setErrors] = useState<ProfileErrors>({});
  const industryRef = useRef<HTMLSelectElement>(null);
  const timingRef = useRef<HTMLSelectElement>(null);
  const optionsRef = useRef<HTMLFieldSetElement>(null);

  const update = <K extends keyof CompanyProfile>(field: K, value: CompanyProfile[K]) => {
    onChange({ ...profile, [field]: value });
    if (field in errors) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const toggleSuccessionOption = (option: SuccessionOptionId) => {
    const next = profile.successionOptions.includes(option)
      ? profile.successionOptions.filter((value) => value !== option)
      : [...profile.successionOptions, option];
    update("successionOptions", next);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: ProfileErrors = {};
    if (!profile.industry) nextErrors.industry = "業種を選択してください。";
    if (!profile.successionTiming) nextErrors.successionTiming = "承継を考える時期を選択してください。";
    if (profile.successionOptions.length === 0) nextErrors.successionOptions = "検討している選択肢を1つ以上選んでください。";
    setErrors(nextErrors);

    if (nextErrors.industry) industryRef.current?.focus();
    else if (nextErrors.successionTiming) timingRef.current?.focus();
    else if (nextErrors.successionOptions) optionsRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    else onComplete();
  };

  return (
    <section className="flow-page profile-page">
      <div className="flow-width flow-width--profile">
        <JourneyHeader active={1} />

        <div className="flow-heading">
          <p className="eyebrow eyebrow--center"><span />診断をあなたの状況に合わせます</p>
          <h1>まず、会社のことを<br className="mobile-break" />少しだけ教えてください</h1>
          <p>診断結果の背景を整理するための匿名情報です。正確な数値を入力する必要はありません。</p>
        </div>

        <form className="profile-card" onSubmit={handleSubmit} noValidate>
          <div className="privacy-banner">
            <span><LockIcon size={21} /></span>
            <p><strong>匿名で回答できます</strong>{PROFILE_HELPER} 入力内容はこのタブ内にのみ一時保存されます。</p>
          </div>

          {Object.values(errors).some(Boolean) && (
            <div className="error-summary" role="alert" aria-live="assertive">
              <strong>入力内容を確認してください</strong>
              <span>必須の項目がまだ選択されていません。</span>
            </div>
          )}

          <div className="profile-grid">
            <div className="form-field">
              <label htmlFor="industry">業種 <span className="required-label">必須</span></label>
              <div className="select-wrap">
                <select
                  ref={industryRef}
                  id="industry"
                  value={profile.industry}
                  onChange={(event) => update("industry", event.target.value as IndustryId)}
                  aria-invalid={Boolean(errors.industry)}
                  aria-describedby={errors.industry ? "industry-error" : undefined}
                >
                  <option value="">選択してください</option>
                  {INDUSTRY_OPTIONS.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
                </select>
              </div>
              {errors.industry && <p className="field-error" id="industry-error">{errors.industry}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="successionTiming">承継を考える時期 <span className="required-label">必須</span></label>
              <div className="select-wrap">
                <select
                  ref={timingRef}
                  id="successionTiming"
                  value={profile.successionTiming}
                  onChange={(event) => update("successionTiming", event.target.value as SuccessionTimingId)}
                  aria-invalid={Boolean(errors.successionTiming)}
                  aria-describedby={errors.successionTiming ? "timing-error" : undefined}
                >
                  <option value="">選択してください</option>
                  {SUCCESSION_TIMING_OPTIONS.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
                </select>
              </div>
              {errors.successionTiming && <p className="field-error" id="timing-error">{errors.successionTiming}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="revenueBand">年間売上規模 <span className="optional-label">任意</span></label>
              <div className="select-wrap">
                <select
                  id="revenueBand"
                  value={profile.revenueBand}
                  onChange={(event) => update("revenueBand", event.target.value as RevenueBandId)}
                >
                  <option value="">選択しない</option>
                  {REVENUE_BAND_OPTIONS.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="employeeBand">従業員数 <span className="optional-label">任意</span></label>
              <div className="select-wrap">
                <select
                  id="employeeBand"
                  value={profile.employeeBand}
                  onChange={(event) => update("employeeBand", event.target.value as EmployeeBandId)}
                >
                  <option value="">選択しない</option>
                  {EMPLOYEE_BAND_OPTIONS.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          <fieldset
            className="choice-fieldset"
            ref={optionsRef}
            aria-invalid={Boolean(errors.successionOptions)}
            aria-describedby={errors.successionOptions ? "options-error options-helper" : "options-helper"}
          >
            <legend>検討している選択肢 <span className="required-label">必須</span></legend>
            <p id="options-helper">当てはまるものをすべて選んでください。「未定」と他の選択肢を一緒に選べます。</p>
            <div className="choice-grid">
              {SUCCESSION_OPTION_OPTIONS.map((option) => (
                <label className={`choice-chip ${profile.successionOptions.includes(option.value) ? "is-selected" : ""}`} key={option.value}>
                  <input
                    type="checkbox"
                    checked={profile.successionOptions.includes(option.value)}
                    onChange={() => toggleSuccessionOption(option.value)}
                  />
                  <span className="choice-chip__check" aria-hidden="true"><CheckIcon size={14} /></span>
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            {errors.successionOptions && <p className="field-error" id="options-error">{errors.successionOptions}</p>}
          </fieldset>

          <div className="gentle-note gentle-note--compact">
            <InfoIcon size={19} />
            <p>財務数値や契約内容などの機密情報は入力しないでください。</p>
          </div>

          <div className="step-navigation">
            <button className="button button--secondary" type="button" onClick={onBack}>
              <ArrowLeftIcon size={18} /> 戻る
            </button>
            <button className="button button--primary" type="submit">
              10問の診断へ <ArrowRightIcon size={18} />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

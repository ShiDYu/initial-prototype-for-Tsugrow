import type {
  CompanyProfile,
  EmployeeBandId,
  IndustryId,
  RevenueBandId,
  SelectOption,
  SuccessionOptionId,
  SuccessionTimingId,
} from "../domain/diagnosticTypes";

export const INDUSTRY_OPTIONS = [
  { value: "manufacturing", label: "製造" },
  { value: "construction", label: "建設" },
  { value: "wholesale", label: "卸売" },
  { value: "retail", label: "小売" },
  { value: "it-communications", label: "IT・情報通信" },
  { value: "professional-services", label: "専門サービス" },
  { value: "consumer-services", label: "生活関連サービス" },
  { value: "transportation", label: "運輸" },
  { value: "medical-care", label: "医療・介護" },
  { value: "other", label: "その他" },
] as const satisfies readonly SelectOption<IndustryId>[];

export const REVENUE_BAND_OPTIONS = [
  { value: "under-100m", label: "1億円未満" },
  { value: "100m-500m", label: "1〜5億円" },
  { value: "500m-1b", label: "5〜10億円" },
  { value: "1b-5b", label: "10〜50億円" },
  { value: "over-5b", label: "50億円以上" },
  { value: "prefer-not-to-answer", label: "回答しない" },
] as const satisfies readonly SelectOption<RevenueBandId>[];

export const EMPLOYEE_BAND_OPTIONS = [
  { value: "under-10", label: "10名未満" },
  { value: "10-29", label: "10〜29名" },
  { value: "30-99", label: "30〜99名" },
  { value: "over-100", label: "100名以上" },
  { value: "prefer-not-to-answer", label: "回答しない" },
] as const satisfies readonly SelectOption<EmployeeBandId>[];

export const SUCCESSION_TIMING_OPTIONS = [
  { value: "within-1-year", label: "1年以内" },
  { value: "1-3-years", label: "1〜3年" },
  { value: "3-5-years", label: "3〜5年" },
  { value: "over-5-years", label: "5年以上先" },
  { value: "not-considering", label: "まだ考えていない" },
] as const satisfies readonly SelectOption<SuccessionTimingId>[];

export const SUCCESSION_OPTION_OPTIONS = [
  { value: "family", label: "親族承継" },
  { value: "employee", label: "従業員承継" },
  { value: "third-party-ma", label: "第三者承継・M&A" },
  { value: "closure", label: "廃業" },
  { value: "undecided", label: "未定" },
] as const satisfies readonly SelectOption<SuccessionOptionId>[];

export const PROFILE_OPTIONS = {
  industry: INDUSTRY_OPTIONS,
  revenueBand: REVENUE_BAND_OPTIONS,
  employeeBand: EMPLOYEE_BAND_OPTIONS,
  successionTiming: SUCCESSION_TIMING_OPTIONS,
  successionOptions: SUCCESSION_OPTION_OPTIONS,
} as const;

export const PROFILE_FIELD_LABELS = {
  industry: "業種",
  revenueBand: "年間売上規模",
  employeeBand: "従業員数",
  successionTiming: "承継を考える時期",
  successionOptions: "検討している選択肢",
} as const;

export const EMPTY_COMPANY_PROFILE: CompanyProfile = {
  industry: "",
  revenueBand: "",
  employeeBand: "",
  successionTiming: "",
  successionOptions: [],
};

export const PROFILE_HELPER =
  "会社名や連絡先は、診断結果を見るためには必要ありません。";

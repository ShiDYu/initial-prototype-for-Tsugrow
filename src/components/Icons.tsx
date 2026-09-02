import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function baseProps({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

export function ArrowRightIcon(props: IconProps) {
  return <svg {...baseProps(props)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export function ArrowLeftIcon(props: IconProps) {
  return <svg {...baseProps(props)}><path d="M19 12H5m6 6-6-6 6-6" /></svg>;
}

export function CheckIcon(props: IconProps) {
  return <svg {...baseProps(props)}><path d="m5 12 4 4L19 6" /></svg>;
}

export function CheckCircleIcon(props: IconProps) {
  return <svg {...baseProps(props)}><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16.5 9" /></svg>;
}

export function InfoIcon(props: IconProps) {
  return <svg {...baseProps(props)}><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></svg>;
}

export function ClockIcon(props: IconProps) {
  return <svg {...baseProps(props)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
}

export function ShieldIcon(props: IconProps) {
  return <svg {...baseProps(props)}><path d="M12 3 5 6v5c0 4.6 2.8 8.1 7 10 4.2-1.9 7-5.4 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>;
}

export function LayersIcon(props: IconProps) {
  return <svg {...baseProps(props)}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></svg>;
}

export function CompassIcon(props: IconProps) {
  return <svg {...baseProps(props)}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></svg>;
}

export function ChartIcon(props: IconProps) {
  return <svg {...baseProps(props)}><path d="M4 20V10m6 10V4m6 16v-7m4 7H2" /></svg>;
}

export function LockIcon(props: IconProps) {
  return <svg {...baseProps(props)}><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;
}

export function ChevronDownIcon(props: IconProps) {
  return <svg {...baseProps(props)}><path d="m6 9 6 6 6-6" /></svg>;
}

export function PrintIcon(props: IconProps) {
  return <svg {...baseProps(props)}><path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" /><path d="M7 14h10v7H7z" /></svg>;
}

export function RefreshIcon(props: IconProps) {
  return <svg {...baseProps(props)}><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6.1 9A7 7 0 0 1 18.5 6.5L20 9m-2.1 6A7 7 0 0 1 5.5 17.5L4 15" /></svg>;
}

export function MailIcon(props: IconProps) {
  return <svg {...baseProps(props)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
}

export function CalendarIcon(props: IconProps) {
  return <svg {...baseProps(props)}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>;
}

export function UserGroupIcon(props: IconProps) {
  return <svg {...baseProps(props)}><circle cx="9" cy="8" r="3" /><path d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M16 4.5a3 3 0 0 1 0 5.8M18 14a4.5 4.5 0 0 1 2.5 4v2" /></svg>;
}

export function DocumentIcon(props: IconProps) {
  return <svg {...baseProps(props)}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>;
}

export function AlertCircleIcon(props: IconProps) {
  return <svg {...baseProps(props)}><circle cx="12" cy="12" r="9" /><path d="M12 8v5m0 3h.01" /></svg>;
}

export function BuildingIcon(props: IconProps) {
  return <svg {...baseProps(props)}><path d="M4 21V5l8-3 8 3v16M2 21h20" /><path d="M8 8h1m3 0h1m3 0h1M8 12h1m3 0h1m3 0h1M8 16h1m3 0h1m3 0h1" /></svg>;
}

export function LeafMark({ size = 32, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" {...props}>
      <rect width="32" height="32" rx="10" fill="currentColor" />
      <path d="M9 19.5c7.8.5 11.5-4.1 13.5-10-6.5.1-11.7 2.3-13.5 10Z" fill="#F3F7EE" />
      <path d="M9.5 23c1.3-5.1 4.4-7.9 9.6-10.2" stroke="#F3F7EE" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

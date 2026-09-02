import { CheckIcon } from "./Icons";

type JourneyHeaderProps = {
  active: 1 | 2 | 3;
};

const STEPS = ["基本情報", "10問の診断", "診断結果"];

export function JourneyHeader({ active }: JourneyHeaderProps) {
  return (
    <nav className="journey" aria-label="診断の進行状況">
      <ol>
        {STEPS.map((label, index) => {
          const number = (index + 1) as 1 | 2 | 3;
          const complete = number < active;
          return (
            <li className={number === active ? "is-active" : complete ? "is-complete" : ""} key={label} aria-current={number === active ? "step" : undefined}>
              <span className="journey__number">{complete ? <CheckIcon size={15} /> : number}</span>
              <span className="journey__label">{label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

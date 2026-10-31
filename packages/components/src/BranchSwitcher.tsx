export interface BranchSwitcherProps {
  index: number;
  count: number;
  onPick: (index: number) => void;
  label?: string | undefined;
}

export function BranchSwitcher({ index, count, onPick, label = "Versions" }: BranchSwitcherProps) {
  if (count < 2) return null;
  return (
    <span className="wic-branches" role="group" aria-label={label}>
      <button type="button" className="wic-branches-step wic-focus" aria-label="Previous version" disabled={index <= 0} onClick={() => onPick(index - 1)}>
        ‹
      </button>
      <span className="wic-branches-count">
        {index + 1} / {count}
      </span>
      <button type="button" className="wic-branches-step wic-focus" aria-label="Next version" disabled={index >= count - 1} onClick={() => onPick(index + 1)}>
        ›
      </button>
    </span>
  );
}

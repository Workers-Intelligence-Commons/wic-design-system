export interface SkeletonProps {
  lines?: number | undefined;
  label?: string | undefined;
}

export function Skeleton({ lines = 3, label = "Loading" }: SkeletonProps) {
  return (
    <div className="wic-skeleton" role="status" aria-label={label}>
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} className="wic-skeleton-line" />
      ))}
    </div>
  );
}

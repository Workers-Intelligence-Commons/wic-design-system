import { Badge } from "./Badge.tsx";

export interface SourceCardProps {
  name: string;
  status?: "admitted" | "refused" | "pending";
  license?: string;
  credit?: string;
  revision?: string;
  checksum?: string;
  decidedBy?: string;
}

export function SourceCard({ name, status = "pending", license, credit, revision, checksum, decidedBy }: SourceCardProps) {
  const rows = (
    [
      ["license", license],
      ["credit", credit],
      ["revision", revision],
      ["checksum", checksum],
      ["decision", decidedBy],
    ] as const
  ).filter(([, value]) => value);
  return (
    <article className="wic-source">
      <header className="wic-source-head">
        <h3 className="wic-source-name">{name}</h3>
        <Badge status={status} />
      </header>
      <dl>
        {rows.map(([label, value]) => [<dt key={`${label}-t`}>{label}</dt>, <dd key={`${label}-d`}>{value}</dd>])}
      </dl>
    </article>
  );
}

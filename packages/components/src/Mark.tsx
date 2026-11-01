import { MARKS } from "./marks.generated.ts";

export interface MarkProps {
  name: "wpt" | "wic" | "hub";
  tone?: "two-ink" | "red";
  height?: number;
  label?: string;
}

type Shape = (typeof MARKS)[keyof typeof MARKS]["ink" | "red"][number];

const MIN_HEIGHT = 24;

function draw(shape: Shape, key: number) {
  return shape.type === "polygon" ? <polygon key={key} points={shape.points} /> : <path key={key} d={shape.d} fillRule={"fillRule" in shape ? shape.fillRule : undefined} />;
}

export function Mark({ name, tone = "two-ink", height = 32, label }: MarkProps) {
  const mark = MARKS[name];
  const h = Math.max(MIN_HEIGHT, height);
  const access = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };
  return (
    <svg className="wic-mark" xmlns="http://www.w3.org/2000/svg" viewBox={mark.viewBox} height={h} width={(h * mark.width) / mark.height} {...access}>
      <g fill={tone === "red" ? "var(--red)" : "var(--ink)"}>{mark.ink.map(draw)}</g>
      <g fill="var(--red)">{mark.red.map(draw)}</g>
    </svg>
  );
}

import { cx } from "./cx.ts";

export interface SloganProps {
  kicker?: string;
  tone?: "red" | "ink";
  children: string;
}

export function Slogan({ kicker, tone = "red", children }: SloganProps) {
  return (
    <section className={cx("wic-slogan", tone === "ink" && "wic-slogan-ink")}>
      <span className="wic-bar wic-bar-1" aria-hidden="true" />
      <span className="wic-bar wic-bar-2" aria-hidden="true" />
      <span className="wic-bar wic-bar-3" aria-hidden="true" />
      <span className="wic-bar wic-bar-4" aria-hidden="true" />
      {kicker && <span className="wic-slogan-kicker">{kicker}</span>}
      <h1 className="wic-slogan-text" aria-label={children}>
        {children.split(/\s+/).map((word, i) => (
          <span key={i} className="wic-w">
            {word}
          </span>
        ))}
      </h1>
    </section>
  );
}

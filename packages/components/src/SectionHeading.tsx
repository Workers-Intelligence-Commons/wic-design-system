import type { ReactNode } from "react";

export interface SectionHeadingProps {
  kicker: string;
  level?: 2 | 3;
  children: ReactNode;
}

export function SectionHeading({ kicker, level = 2, children }: SectionHeadingProps) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <Heading className="wic-heading">
      <span className="wic-heading-kicker">{kicker}</span>
      {children}
    </Heading>
  );
}

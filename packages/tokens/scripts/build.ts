// Writes dist/tokens.css from tokens.json, the single source of every token.
import { mkdir } from "node:fs/promises";

type Themed = string | { light: string; dark: string };
type Token = { name: string; value: Themed; usage: string };
type Style = { name: string; fontSize: string; lineHeight: string | number; fontWeight: number; letterSpacing?: string; fontStyle?: string };
type Tokens = {
  color: { tokens: Token[] };
  type: {
    fonts: { family: string; file: string; weight: string; style?: string }[];
    families: Record<string, string>;
    groups: { family: string; styles: Style[] }[];
  };
  spacing: { tokens: Token[] };
  radius: { tokens: Token[] };
  shadow: { tokens: Token[] };
  tilt: { tokens: Token[] };
  motion: { tokens: Token[] };
};

const root = new URL("..", import.meta.url).pathname;
const t: Tokens = await Bun.file(`${root}tokens.json`).json();

// A clip-path cuts off box-shadow, so clipped sheets lift with a drop-shadow filter instead.
// drop-shadow takes no spread, so the shadow tokens must keep a spread of 0.
function dropShadow(boxShadow: string): string {
  const [x, y, blur, spread, ...color] = boxShadow.split(/\s+/);
  if (spread !== "0" || color.length !== 1) throw new Error(`shadow needs the form "x y blur 0 color": ${boxShadow}`);
  return `drop-shadow(${x} ${y} ${blur} ${color[0]})`;
}

function vars(theme: "light" | "dark"): string[] {
  const out: string[] = [];
  for (const token of [...t.color.tokens, ...t.shadow.tokens]) {
    if (typeof token.value === "string") continue;
    out.push(`  --${token.name}: ${token.value[theme]};`);
  }
  for (const token of t.shadow.tokens) {
    const value = typeof token.value === "string" ? token.value : token.value[theme];
    out.push(`  --${token.name}-filter: ${dropShadow(value)};`);
  }
  return out;
}

const fixed = [...t.spacing.tokens, ...t.radius.tokens, ...t.tilt.tokens, ...t.motion.tokens].map((token) => `  --${token.name}: ${token.value};`);
const families = Object.entries(t.type.families).map(([name, stack]) => `  --font-${name}: ${stack};`);
const dark = [...vars("dark"), "  color-scheme: dark;"];

const fontFaces = t.type.fonts.map(
  (f) => `@font-face { font-family: '${f.family}'; src: url('../${f.file}') format('woff2'); font-weight: ${f.weight}; font-style: ${f.style ?? "normal"}; font-display: swap; }`,
);

const styles = t.type.groups.flatMap((group) =>
  group.styles.map((s) => {
    const rules = [`font-family: var(--font-${group.family})`, `font-size: ${s.fontSize}`, `line-height: ${s.lineHeight}`, `font-weight: ${s.fontWeight}`];
    if (s.letterSpacing) rules.push(`letter-spacing: ${s.letterSpacing}`);
    if (s.fontStyle) rules.push(`font-style: ${s.fontStyle}`);
    return `.${s.name} { ${rules.join("; ")}; }`;
  }),
);

const css = [
  "/* Workers' Intelligence Commons, generated from tokens.json */",
  ...fontFaces,
  "",
  ":root {",
  ...vars("light"),
  ...fixed,
  ...families,
  "}",
  '@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {',
  ...dark,
  "} }",
  ':root[data-theme="dark"] {',
  ...dark,
  "}",
  "",
  ...styles,
  "",
].join("\n");

await mkdir(`${root}dist`, { recursive: true });
await Bun.write(`${root}dist/tokens.css`, css);

import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Badge, ButtonLink, Mark, Notice, SectionHeading, Slogan, SourceCard } from "./index.ts";

const html = (node: React.ReactNode) => renderToStaticMarkup(node);

describe("Badge", () => {
  test("pairs each status with its glyph and word, so colour is never alone", () => {
    expect(html(<Badge status="admitted" />)).toContain('<span aria-hidden="true">■</span>admitted');
    expect(html(<Badge status="refused" />)).toContain('<span aria-hidden="true">✕</span>refused');
    expect(html(<Badge status="pending" />)).toContain('<span aria-hidden="true">○</span>pending');
  });

  test("keeps the glyph when children override the word", () => {
    expect(html(<Badge status="refused">withdrawn</Badge>)).toContain('<span aria-hidden="true">✕</span>withdrawn');
  });
});

describe("Slogan", () => {
  test("is the page heading and keeps the plain sentence as its accessible label", () => {
    const out = html(<Slogan>When in doubt, refused</Slogan>);
    expect(out).toContain('<h1 class="wic-slogan-text" aria-label="When in doubt, refused">');
    expect(out.match(/class="wic-w"/g)).toHaveLength(4);
  });
});

describe("SourceCard", () => {
  test("lists only the facts that are known", () => {
    const out = html(<SourceCard name="Project Gutenberg" status="admitted" license="Public domain" checksum="9f2c…41ab" />);
    expect(out).toContain("<dt>license</dt><dd>Public domain</dd>");
    expect(out).toContain("<dt>checksum</dt><dd>9f2c…41ab</dd>");
    expect(out.match(/<dt>/g)).toHaveLength(2);
  });

  test("shows a pending badge until a decision is given", () => {
    expect(html(<SourceCard name="Unknown scrape" />)).toContain("○</span>pending");
  });
});

describe("Notice", () => {
  test("is labelled honest status unless titled otherwise", () => {
    expect(html(<Notice>No checkpoint is published yet.</Notice>)).toContain(">honest status</span>");
    expect(html(<Notice title="draft">Placeholders remain.</Notice>)).toContain(">draft</span>");
  });
});

describe("ButtonLink", () => {
  test("is a real link to its destination", () => {
    expect(html(<ButtonLink href="https://example.org/repo">Open the repository</ButtonLink>)).toMatch(/^<a href="https:\/\/example.org\/repo" class="[^"]*">Open the repository<\/a>$/);
  });
});

describe("SectionHeading", () => {
  test("puts its kicker inside the heading at the requested level", () => {
    expect(html(<SectionHeading kicker="three ways">Ways to give</SectionHeading>)).toMatch(/^<h2 [^>]*><span [^>]*>three ways<\/span>Ways to give<\/h2>$/);
    expect(html(<SectionHeading kicker="open books" level={3}>Transparency</SectionHeading>)).toMatch(/^<h3 /);
  });
});

describe("Mark", () => {
  test("is never drawn under the 24px minimum", () => {
    expect(html(<Mark name="wpt" height={12} />)).toContain('height="24"');
  });

  test("is hidden from assistive technology unless it carries a label", () => {
    expect(html(<Mark name="wic" />)).toContain('aria-hidden="true"');
    const labelled = html(<Mark name="wic" label="Workers' Intelligence Commons" />);
    expect(labelled).toContain('role="img"');
    expect(labelled).toContain('aria-label="Workers&#x27; Intelligence Commons"');
  });

  test("draws in the theme inks, the W in red for the single-ink tone", () => {
    expect(html(<Mark name="wpt" />)).toMatch(/<g fill="var\(--ink\)">.*<g fill="var\(--red\)">/);
    expect(html(<Mark name="wpt" tone="red" />)).not.toContain("var(--ink)");
  });
});

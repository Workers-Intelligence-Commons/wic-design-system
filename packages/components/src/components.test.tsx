import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { AccountField, Badge, BranchSwitcher, ButtonLink, Checkbox, CurrentPasswordField, Dialog, groupOptions, NewPasswordField, SecretField, ConversationItem, Mark, Message, Notice, Question, SectionHeading, Slogan, SourceCard, Status, TextInput, ToolCall } from "./index.ts";

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

describe("TextInput and Checkbox", () => {
  test("tie the label, the hint and the error to the control", () => {
    const out = html(<TextInput id="key" label="API key" hint="Shown once." error="This key opens no account." />);
    expect(out).toContain('<label for="key" class="wic-label">API key</label>');
    expect(out).toContain('id="key" aria-describedby="key-hint key-error" aria-invalid="true"');
    expect(out).toContain('<p id="key-error" class="wic-field-error" role="alert"><span aria-hidden="true">✕</span>This key opens no account.</p>');
  });

  test("leave the control undescribed and valid without hint or error", () => {
    const out = html(<Checkbox id="keep" label="Keep me signed in" />);
    expect(out).toContain('<input type="checkbox" id="keep" class="wic-check-box wic-focus"/>');
    expect(out).toContain('<label for="keep" class="wic-check-label">Keep me signed in</label>');
  });
});

describe("Message", () => {
  test("says how a reply ended with a glyph and a word", () => {
    expect(html(<Message from="assistant" end="interrupted">Half</Message>)).toContain('<span aria-hidden="true">○</span>interrupted');
    expect(html(<Message from="assistant" end="failed">-</Message>)).toContain('<span aria-hidden="true">✕</span>failed');
  });

  test("is busy while it streams", () => {
    const out = html(<Message from="assistant" streaming>Wri</Message>);
    expect(out).toContain('aria-busy="true"');
    expect(out).toContain("wic-message-cursor");
    expect(html(<Message from="user">Hello</Message>)).not.toContain("aria-busy");
  });
});

describe("ConversationItem", () => {
  test("renders through the link the application provides, marked when current", () => {
    const out = html(<ConversationItem title="Strike fund" current running link={(props) => <a data-router="" href="/c/1" {...props} />} />);
    expect(out).toContain('<a data-router="" href="/c/1" class="wic-conversation-link wic-focus" aria-current="page">');
    expect(out).toContain('<span aria-hidden="true">○</span>running');
  });

  test("falls back to a plain link to its href", () => {
    expect(html(<ConversationItem title="Minutes" href="/c/2" />)).toContain('<a href="/c/2" class="wic-conversation-link wic-focus">');
  });
});

describe("BranchSwitcher", () => {
  test("is absent while there is a single version", () => {
    expect(html(<BranchSwitcher index={0} count={1} onPick={() => {}} />)).toBe("");
  });

  test("counts from one and disables the step past either end", () => {
    const out = html(<BranchSwitcher index={0} count={3} onPick={() => {}} />);
    expect(out).toContain(">1 / 3</span>");
    expect(out).toMatch(/aria-label="Previous version" disabled=""/);
    expect(out).not.toMatch(/aria-label="Next version" disabled=""/);
  });
});

describe("ToolCall and Status", () => {
  test("pair each state with its glyph and word", () => {
    expect(html(<ToolCall name="read_file" state="awaiting_approval" />)).toContain('<span aria-hidden="true">○</span>awaiting approval');
    expect(html(<ToolCall name="read_file" state="error" />)).toContain('<span aria-hidden="true">✕</span>error');
    expect(html(<Status kind="offline">server offline</Status>)).toContain('<span aria-hidden="true">✕</span>server offline');
  });
});

describe("Question", () => {
  test("is a form only when it collects an answer", () => {
    expect(html(<Question question="Allow this tool?" />)).toMatch(/^<section class="wic-question">/);
    expect(html(<Question question="Your name?" onSubmit={() => {}} />)).toMatch(/^<form class="wic-question">/);
  });
});

/** Attributes of the one input in the markup, by name. */
const inputOf = (node: React.ReactNode) => Object.fromEntries([...(html(node).match(/<input [^>]*>/)?.[0] ?? "").matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

describe("credential fields", () => {
  // Password managers tell a sign-in from a sign-up, and a login from a token, only by these attributes.
  test("mark the account, the current and the new password for password managers", () => {
    expect(inputOf(<AccountField label="Email address" />)).toMatchObject({ type: "email", name: "username", autoComplete: "username" });
    expect(inputOf(<AccountField label="Email address" creating />)).toMatchObject({ type: "email", name: "username", autoComplete: "email" });
    expect(inputOf(<AccountField label="Username" type="text" creating />)).toMatchObject({ type: "text", autoComplete: "username" });
    expect(inputOf(<CurrentPasswordField label="Password" />)).toMatchObject({ type: "password", name: "current-password", autoComplete: "current-password" });
    expect(inputOf(<CurrentPasswordField label="Password" name="password" />)).toMatchObject({ name: "password", autoComplete: "current-password" });
    expect(inputOf(<NewPasswordField label="Password" minLength={8} maxLength={128} />)).toMatchObject({
      type: "password",
      name: "new-password",
      autoComplete: "new-password",
      minLength: "8",
      maxLength: "128",
      passwordrules: "minlength: 8; maxlength: 128;",
    });
  });

  test("keeps a token out of password managers", () => {
    expect(inputOf(<SecretField label="Token" name="token" />)).toMatchObject({
      type: "password",
      name: "token",
      autoComplete: "off",
      "data-1p-ignore": "",
      "data-lpignore": "true",
      "data-bwignore": "",
      "data-form-type": "other",
    });
  });
});

describe("Picker", () => {
  const options = [
    { value: "a", label: "Claude Sonnet", group: "Anthropic" },
    { value: "o", label: "GPT-5", group: "OpenAI" },
    { value: "h", label: "Claude Haiku", group: "Anthropic" },
    { value: "w", label: "wpt" },
  ];

  test("lists the options by group, each group where its first option came", () => {
    expect(groupOptions(options, "").map((g) => [g.name, g.options.map((o) => o.value)])).toEqual([
      ["Anthropic", ["a", "h"]],
      ["OpenAI", ["o"]],
      [undefined, ["w"]],
    ]);
  });

  test("keeps the options whose name or group holds every word typed, in any case", () => {
    expect(groupOptions(options, "anthropic haiku").flatMap((g) => g.options.map((o) => o.value))).toEqual(["h"]);
    expect(groupOptions(options, "CLAUDE").flatMap((g) => g.options.map((o) => o.value))).toEqual(["a", "h"]);
    expect(groupOptions(options, "mistral")).toEqual([]);
  });

  // A slug names the group before its slash: typing it narrows the list to that group, and the
  // words after the slash pick among its models.
  test("narrows to a group by the start of its slug, then by the words after the slash", () => {
    const slugged = [
      { value: "a", label: "Claude Sonnet", group: "Anthropic", slug: "anthropic/claude-sonnet" },
      { value: "h", label: "Claude Haiku", group: "Anthropic", slug: "anthropic/claude-haiku" },
      { value: "c", label: "Claude Sonnet", group: "Amazon Bedrock", slug: "amazon-bedrock/claude-sonnet" },
      { value: "o", label: "GPT-5", group: "OpenAI", slug: "openai/gpt-5" },
    ];
    const values = (filter: string) => groupOptions(slugged, filter).flatMap((g) => g.options.map((o) => o.value));
    expect(values("anthropic/")).toEqual(["a", "h"]);
    expect(values("an/sonnet")).toEqual(["a"]);
    expect(values("amazon/")).toEqual(["c"]);
    expect(values("sonnet")).toEqual(["a", "c"]);
  });
});

describe("Message details", () => {
  test("stay in the page beside the actions, so a screen reader reads them while they are hidden", () => {
    const out = html(
      <Message from="assistant" details="wpt · 52 tokens/s">
        <p>Hello</p>
      </Message>,
    );
    expect(out).toContain('<div class="wic-message-actions"><span class="wic-message-details">wpt · 52 tokens/s</span></div>');
  });
});

describe("Dialog", () => {
  test("is named by its title", () => {
    const out = html(
      <Dialog open={false} onClose={() => {}} title="Settings">
        <p>Body</p>
      </Dialog>,
    );
    const id = /aria-labelledby="([^"]+)"/.exec(out)?.[1];
    expect(out).toContain(`<h2 id="${id}" class="wic-dialog-title">Settings</h2>`);
  });
});

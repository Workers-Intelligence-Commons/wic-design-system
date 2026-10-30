import { ButtonLink, Mark, Notice, SectionHeading, Sheet, Slogan } from "@workers-intelligence-commons/components";

const CONTACT = "contact@workers-intelligence-commons.org";
const REPOSITORY = "https://github.com/Workers-Intelligence-Commons/wpt-llm";

function ToFill({ children }: { children: string }) {
  return (
    <span className="ph" title="To fill in before publishing">
      {children}
    </span>
  );
}

export function SupportPage() {
  return (
    <div className="wrap">
      <header>
        <Mark name="wic" height={28} />
        <span className="aside">workers&rsquo; intelligence commons</span>
      </header>

      <Slogan kicker="supporting wpt">Nothing pays for owning the model</Slogan>
      <p className="lead">
        WPT (Workers&rsquo; Pre-trained Transformer) is a copyleft language model trained only on content whose license is clear. Training it costs compute, and compute costs money. This page explains how you can help, and what happens to what you give.
      </p>

      <Notice>
        Draft. Items marked &ldquo;to fill in&rdquo; are placeholders until the platforms and the legal form are chosen. Until then, WPT is run by one person, and this page says so plainly.
      </Notice>

      <section>
        <SectionHeading kicker="in this order">What your support pays for</SectionHeading>
        <ol className="order">
          <li><span className="n">1</span><span>GPU compute for training and evaluation runs.</span></li>
          <li><span className="n">2</span><span>Storage and hosting for the corpus and the provenance registry.</span></li>
          <li><span className="n">3</span><span>Infrastructure for the public test service, served without margin.</span></li>
        </ol>
        <p className="after">
          Nothing pays for owning the model. WPT stays copyleft, under <code>AGPL-3.0-or-later</code>, whatever happens to funding.
        </p>
      </section>

      <section>
        <SectionHeading kicker="three ways">Ways to give</SectionHeading>
        <div className="ways">
          <Sheet tone="red" title="Money">
            <ul>
              <li>Recurring or one-time donations: <ToFill>&lt;Liberapay / Open Collective / association page link&gt;</ToFill></li>
              <li>A donation is a gift. It buys no features, no priority, and no say over which sources enter the corpus. The rule stays: when a license is doubtful, the content is refused.</li>
            </ul>
          </Sheet>
          <Sheet tone="ochre" title="Compute">
            <p>
              If you run a GPU program, a cluster or a cloud account and can grant credits or hours, write to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. Please say what hardware is offered and for how long. Compute grants are reported publicly the same way money is.
            </p>
          </Sheet>
          <Sheet title="Work">
            <p>
              Pull requests are welcome, with DCO sign-off required in CI. Contributions that are merged can earn service credits, as described in the service documentation. That is a separate mechanism from donations.
            </p>
            <div className="actions">
              <ButtonLink variant="primary" href={REPOSITORY} target="_blank" rel="noopener">Open the repository</ButtonLink>
              <ButtonLink variant="quiet" href={`${REPOSITORY}/issues`} target="_blank" rel="noopener">Propose a source</ButtonLink>
            </div>
          </Sheet>
        </div>
      </section>

      <section>
        <SectionHeading kicker="kept apart on purpose">Donations and the paid service are different things</SectionHeading>
        <div className="apart">
          <div>
            <h3>Donations</h3>
            <span className="tag tag-ink">no counterpart</span>
            <p>Unconditional. A gift to the commons, nothing in return.</p>
          </div>
          <div>
            <h3>Paid service</h3>
            <span className="tag tag-ochre">small margin</span>
            <p>Usage credits, billed at a small margin, optional. Self-hosting is always possible, and anyone may offer the model as a paid service too.</p>
          </div>
        </div>
        <p className="after">Keeping the two apart keeps the project honest about what each euro is for.</p>
      </section>

      <section>
        <SectionHeading kicker="open books">Transparency</SectionHeading>
        <p><ToFill>&lt;Budget page link&gt;</ToFill> will show money and compute received and spent.</p>
      </section>

      <section>
        <SectionHeading kicker="questions">Ask</SectionHeading>
        <p>
          Open an issue on <a href={`${REPOSITORY}/issues`} target="_blank" rel="noopener">the repository</a> or write to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
        </p>
      </section>

      <footer>
        <Mark name="wpt" height={34} />
        <span className="aside">WPT is free software under AGPL-3.0-or-later.</span>
      </footer>
    </div>
  );
}

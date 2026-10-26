Workers' Intelligence Commons holds intelligence as a means of production, in common: to everyone, or rather to no one. WPT (Workers' Pre-trained Transformer) is its first model. The look is cut paper from the years of jazz and of May 1968: Saul Bass's sleeves and title sequences (Anatomy of a Murder, scored by Duke Ellington, 1959), the screenprinted posters of the Atelier Populaire. Three inks on poster paper, letters cut with scissors, fragments that swing around a silence, liner notes in a book face, and the typed tract.

## Content fundamentals

- Say what is true, including what is missing. The project's own words: "Honest status: no checkpoint is published yet." Put a `Notice` with the honest status near the top of every page that announces something.
- State rules as rules, short and flat: "When in doubt, it is refused." "No distillation." No hedging, no hype, no superlatives, no exclamation marks.
- Speak of workers, the commons, the means of production. Speak of people who use WPT, never of "customers" or "consumers".
- First person singular while the project is one person ("What I'm asking for"); switch to "we" only when there is a we.
- Name the thing: the license is `AGPL-3.0-or-later`, written in full; a source is a source, not "data assets".
- Public copy is in English, like the repository. Sentence case everywhere. Kickers and labels are short lowercase italics (`aside`), like a credit on a record sleeve: never tiny spaced capitals.
- No emoji, anywhere.

## Colour: three inks on paper

- Three inks only, on `paper`: `ink` (black), `red`, `ochre` (the mustard of a jazz sleeve). `red-soft` is red at a light screen, not a fourth colour.
- `red` speaks: the primary button, slogans, the big sheet of the cover. Red text under 24px is `red-ink`; text on a red fill is `on-red`.
- `ink` reads and cuts: body text, headlines, the W of the monograms, the cut bars.
- `ochre` swings: cut bars, the tape on a notice, the quiet button's underline (always below the letters, never behind them), the pending badge. Never text on paper. Text or marks on ochre are always `on-ochre`, never `ink`: in the dark theme `ink` turns paper-coloured and disappears on it.
- Status pairs a glyph and a word with the ink, never colour alone: admitted `■` on `ink`, refused `✕` in `red-ink` on `red-soft`, pending `○` on `ochre`.
- Every text token's note names the grounds it reads on; all those pairs hold 4.5:1 in both themes.

## Type

- Readability comes before swing. Whatever someone must read to understand or act (headings, buttons, badges, labels, paragraphs) is set in a plain, steady face, level on its line. The funk lives in shapes, colour and one big slogan, never in the text people read.
- Gothic: Libre Franklin, extra bold and bold, the American gothic of 1960s posters and title credits, for `heading`, `title` and `cue` (buttons, badges, tape).
- Cut lettering: Barriecito, letters that look cut from paper, only for `poster` and `headline`: the one slogan at the top of a page and the name on a cover, always 56px or larger, always with the plain text available (the Slogan component sets an `aria-label`).
- Liner notes: Libre Caslon Text for reading (`lead`, `body` at 18px, `small` for footers only) and its italic for short labels (`aside`, a few words at most, never a full sentence).
- Ledger: Courier Prime for values only (`ledger`: licenses, checksums, revisions, paths), never for paragraphs.
- All four are OFL-licensed and ship as files under `packages/tokens/fonts/`; no font service is needed.

## Rhythm and layout: syncopation, not a grid

- A slogan is a phrase played, not set: every third word is set larger and every fourth in the other ink, all on one baseline, never rotated (the `Slogan` component does this). One slogan per page.
- Leave a silence. Every composition keeps an empty area that the fragments swing around; do not fill it, and never let a fragment touch text.
- Fragments are cut bars of `ink`, `red` and `ochre`, tilted by `tilt-2`, `tilt-3`, never more than a handful per view, hidden on narrow screens when they would crowd the text.
- Nothing is rounded: buttons, badges, notices and cards are clipped with slightly irregular edges. Text is never rotated beyond `tilt-1`, and only on a badge of one or two words. Only inputs take `radius-1`.
- No soft shadows. `shadow-misprint` is a sheet lifted off the wall, on hover only.
- Space generously: `space-12` around slogans and between sections; `space-4` inside cards.

## Focus and states

- Keyboard focus: a solid 3px `ink` outline, 3px off the element, over 3:1 on every surface in both themes.
- Hover: buttons and source cards lift by 2px, cards with `shadow-misprint`. Disabled: `ink-muted`, struck through. Motion is skipped under `prefers-reduced-motion`.

## Logos

The two monograms share one construction, cut from paper: the W of the workers, in ink, runs its last stroke into the next letter, and the rest of the name is pasted in red. Each stroke is a separate scrap, with small notches where the pieces meet.

- `wpt-mark.svg`: WPT. The W rises into the stem of the P; the P's top runs on as the bar of the T.
- `wic-mark.svg`: Workers' Intelligence Commons. The W rises into the I, then the C.
- `-reverse` files are for dark grounds (paper W, light red); `-red` files are single-ink, for one-colour printing.
- Keep clear space of half the mark's height; minimum 24px tall; never redraw or straighten the pieces.

## Iconography

- No icon set. Status uses the glyphs `■ ✕ ○`. If icons are ever needed, cut them like the marks: solid paper silhouettes (a hand, a factory roof, a disc), one ink, no outlines.
- The references are workers, their work and their music, not a party: prefer the hand, the factory and the cut bar over the hammer and sickle.

## Components

`window.WIC` (React 18), in `packages/components`: `Button`, `Badge`, `Slogan`, `Notice`, `SourceCard`. Load `packages/tokens/tokens.css`, then `packages/components/bundle.css`, then React, then `packages/components/bundle.js`.

# Workers' Intelligence Commons design system

- `README.md`: the brand book (voice, colours, type, rhythm, logos). Start here.
- `packages/tokens` (`@workers-intelligence-commons/tokens`):
  - `tokens.css`: every colour (light and dark), spacing, radius, tilt and font as CSS variables, plus one class per text style. Link it first.
  - `tokens.json`: the same tokens as data, for tools.
  - `fonts/`: Barriecito, Libre Franklin, Libre Caslon Text, Courier Prime (all OFL-1.1, licenses alongside). `tokens.css` loads them from here.
  - `logos/`: WPT and WIC monograms, normal, reverse (dark grounds) and single red.
- `packages/components` (`@workers-intelligence-commons/components`): `bundle.css` (styles), `bundle.js` (React 18 components as `window.WIC`), `index.d.ts` (props), one guideline file per component.
- `examples/support.html`: the support page, self-contained (fonts embedded), opens in any browser.
- `NOTICE`: the license of each part.

In a page: link `packages/tokens/tokens.css`, then `packages/components/bundle.css`. For the components, load React 18, then `packages/components/bundle.js`.

The workspace uses Bun: run `bun install` at the root.

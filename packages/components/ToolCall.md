# ToolCall

A folded slip for one call a model made to a tool: the tool's name typewritten, its state in a word and its glyph, and the input and output folded beneath. The consumer provides `name`, `state` (`running` ○, `awaiting_approval` ○, `done` ■ or `error` ✕) and optionally `progress` (a short italic note while it runs) and `children` (the detail shown when unfolded, usually `<pre>` blocks). The slip stays folded until opened, so a long result never pushes the conversation away.

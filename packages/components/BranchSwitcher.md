# BranchSwitcher

The versions of one message, after an edit or a new reply: two small arrows around the typewritten count ("2 / 3"). The consumer provides `index` (from zero), `count` and `onPick`, which receives the index to show, and optionally `label` for the group (defaults to "Versions"). It draws nothing while there is a single version, and the arrow past either end is disabled. Place it in a Message's `actions`.

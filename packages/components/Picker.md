# Picker

A choice among many options, such as the model of a conversation: a button with the current choice typed on it, which opens a panel pasted under or over it. The consumer provides `label` (what is chosen, the accessible name of the button and the list), `options`, `value` (the chosen option's `value`, or `null`) and `onChange`, and optionally `placement` (`below` by default, `above` near the bottom of a page), `placeholder` (on the button while nothing is chosen, "Choose" by default), `disabled`, `groupIcon` and `filterable`.

Each option has a `value`, a `label`, and optionally a `group` and a `slug`. The slug is typed under the label in the ledger face, as `group/name`.

When options have groups, the panel sets the groups in a column, each with the mark that `groupIcon` returns for it and the count of its options, and lists beside them the options of the group shown. It opens on the group of the chosen option and keeps its size while the groups change. On a narrow screen the column becomes a row above the list. The column is a list of tabs for screen readers.

The panel has a filter field when there are more than eight options, or as `filterable` says; without one the list takes the focus and the same keys. The focus starts in the filter field. Typing keeps the options whose label, group or slug holds every word typed, from every group, under the name of their group. With a slash, what comes before it must start the name of the group or of its slugs, and the words after it are looked for in the label and the slug.

The up and down arrows move through the options listed, Enter chooses one, Escape closes the panel and gives the focus back to the button. While the filter is empty the left and right arrows show the previous and the next group. The chosen option carries the ochre strip of the ConversationList, as does the group shown. For a handful of options that need no filter, use `Select`.

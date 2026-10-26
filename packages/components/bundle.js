(function () {
  function h() { return window.React.createElement.apply(window.React, arguments); }
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function Button(p) {
    var variant = p.variant || "ink", rest = Object.assign({}, p);
    delete rest.variant; delete rest.className;
    return h("button", Object.assign({ type: "button" }, rest, { className: cx("wic-btn", "wic-focus", "wic-btn-" + variant, p.className) }), p.children);
  }
  var GLYPH = { admitted: "■", refused: "✕", pending: "○", neutral: "", license: "" };
  var WORD = { admitted: "admitted", refused: "refused", pending: "pending" };
  function Badge(p) {
    var s = p.status || "neutral";
    return h("span", { className: "wic-badge wic-badge-" + s }, GLYPH[s] ? h("span", { "aria-hidden": "true" }, GLYPH[s]) : null, p.children || WORD[s] || "");
  }
  function Slogan(p) {
    var text = typeof p.children === "string" ? p.children : "";
    var words = text ? text.split(/\s+/).map(function (w, i) { return h("span", { key: i, className: "wic-w" }, w); }) : p.children;
    return h("section", { className: cx("wic-slogan", p.tone === "ink" && "wic-slogan-ink") },
      h("span", { className: "wic-bar wic-bar-1", "aria-hidden": "true" }),
      h("span", { className: "wic-bar wic-bar-2", "aria-hidden": "true" }),
      h("span", { className: "wic-bar wic-bar-3", "aria-hidden": "true" }),
      h("span", { className: "wic-bar wic-bar-4", "aria-hidden": "true" }),
      p.kicker ? h("span", { className: "wic-slogan-kicker" }, p.kicker) : null,
      h("p", { className: "wic-slogan-text", "aria-label": text || undefined }, words));
  }
  function Notice(p) {
    return h("aside", { className: "wic-notice" },
      h("span", { className: "wic-notice-label" }, p.title || "honest status"),
      h("p", { className: "wic-notice-body" }, p.children));
  }
  function SourceCard(p) {
    var rows = [["license", p.license], ["credit", p.credit], ["revision", p.revision], ["checksum", p.checksum], ["decision", p.decidedBy]];
    var dl = [];
    rows.forEach(function (r) { if (r[1]) { dl.push(h("dt", { key: r[0] + "t" }, r[0])); dl.push(h("dd", { key: r[0] + "d" }, r[1])); } });
    return h("article", { className: "wic-source" },
      h("header", { className: "wic-source-head" }, h("h3", { className: "wic-source-name" }, p.name), h(Badge, { status: p.status || "pending" })),
      h("dl", null, dl));
  }
  window.WIC = Object.assign(window.WIC || {}, { Button: Button, Badge: Badge, Slogan: Slogan, Notice: Notice, SourceCard: SourceCard });
})();

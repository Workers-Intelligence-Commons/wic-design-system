import { type KeyboardEvent, type ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";
import { cx } from "./cx.ts";

export interface PickerOption {
  value: string;
  label: string;
  /** Options with the same group share an entry of the column of groups, in the order they come. */
  group?: string | undefined;
  /** Identifier typed under the label, `group/name`; the part before the slash names its group in the filter. */
  slug?: string | undefined;
}

export interface PickerProps {
  /** What is being chosen, for example "Model": the accessible name of the button and the list. */
  label: string;
  options: PickerOption[];
  value: string | null;
  onChange: (value: string) => void;
  /** Where the list opens: `above` for a picker near the bottom of the page. */
  placement?: "below" | "above";
  /** Shown on the button when no option is chosen. */
  placeholder?: string;
  disabled?: boolean | undefined;
  /** A small mark for a group in the column of groups, such as the logo of a provider. */
  groupIcon?: ((group: string) => ReactNode) | undefined;
  /** Whether the panel has a filter field; by default when there are more than eight options. */
  filterable?: boolean | undefined;
}

type Group = { name: string | undefined; options: PickerOption[] };

const slugify = (text: string) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

/** Name of the group in the filter: the start of the slugs of its options, or its name as a slug. */
const groupKey = (option: PickerOption) => (option.slug?.includes("/") ? option.slug.slice(0, option.slug.indexOf("/")).toLowerCase() : slugify(option.group ?? ""));

const words = (text: string) => text.toLowerCase().split(/\s+/).filter(Boolean);

/**
 * Options matching the filter, by group, each group where its first option came. Every word typed
 * must be in the label, the group or the slug; with a slash, what comes before it must start the
 * name of the group, and the words after it are looked for in the label and the slug.
 */
export function groupOptions(options: PickerOption[], filter: string): Group[] {
  const slash = filter.indexOf("/");
  const prefix = slash < 0 ? null : filter.slice(0, slash).trim().toLowerCase();
  const wanted = words(slash < 0 ? filter : filter.slice(slash + 1));
  const groups: Group[] = [];
  for (const option of options) {
    if (prefix !== null && !groupKey(option).startsWith(prefix) && !slugify(option.group ?? "").startsWith(prefix)) continue;
    const text = `${option.label} ${prefix === null ? (option.group ?? "") : ""} ${option.slug ?? ""}`.toLowerCase();
    if (!wanted.every((w) => text.includes(w))) continue;
    let group = groups.find((g) => g.name === option.group);
    if (!group) groups.push((group = { name: option.group, options: [] }));
    group.options.push(option);
  }
  return groups;
}

export function Picker({ label, options, value, onChange, placement = "below", placeholder = "Choose", disabled, groupIcon, filterable = options.length > 8 }: PickerProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [shownGroup, setShownGroup] = useState<string | undefined>(undefined);
  const [activeValue, setActiveValue] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const id = useId();

  const all = useMemo(() => groupOptions(options, ""), [options]);
  const matches = useMemo(() => groupOptions(options, filter), [options, filter]);
  const filtering = filter.trim() !== "";
  const split = all.some((g) => g.name !== undefined);
  // Without a filter the list holds the group shown in the column; with one, every match.
  const listed = filtering || !split ? matches : all.filter((g) => g.name === shownGroup);
  const flat = listed.flatMap((g) => g.options);
  const current = options.find((o) => o.value === value);
  const activeIndex = Math.max(0, flat.findIndex((o) => o.value === activeValue));
  const active = flat[activeIndex];

  const close = (focusButton: boolean) => {
    setOpen(false);
    if (focusButton) button.current?.focus();
  };

  // The list opens on the group of the current option, with that option active.
  const show = () => {
    setFilter("");
    setShownGroup(current ? current.group : all[0]?.name);
    setActiveValue(current?.value ?? null);
    setOpen(true);
  };

  const showGroup = (name: string | undefined) => {
    setFilter("");
    setShownGroup(name);
    setActiveValue(all.find((g) => g.name === name)?.options[0]?.value ?? null);
    (input.current ?? list.current)?.focus();
  };

  useEffect(() => {
    if (!open) return;
    (input.current ?? list.current)?.focus();
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  // The active option stays in view while the keys move it.
  useEffect(() => {
    if (open) document.getElementById(`${id}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, id, shownGroup, filter]);

  const pick = (option: PickerOption) => {
    onChange(option.value);
    close(true);
  };

  const onKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (flat.length === 0) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveValue(flat[(activeIndex + step + flat.length) % flat.length]?.value ?? null);
    } else if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && !filtering && split) {
      // An empty filter has no caret to move: the side arrows go through the groups.
      event.preventDefault();
      const at = all.findIndex((g) => g.name === shownGroup);
      const step = event.key === "ArrowRight" ? 1 : -1;
      showGroup(all[(at + step + all.length) % all.length]?.name);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (active) pick(active);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "Tab") {
      close(false);
    }
  };

  const optionRow = (option: PickerOption) => {
    const n = flat.indexOf(option);
    return (
      <div
        key={option.value}
        id={`${id}-${n}`}
        role="option"
        aria-selected={option.value === value}
        className={cx("wic-picker-option", option === active && "wic-picker-active")}
        onPointerMove={() => setActiveValue(option.value)}
        onClick={() => pick(option)}
      >
        <span className="wic-picker-label">{option.label}</span>
        {option.slug && <span className="wic-picker-slug">{option.slug}</span>}
      </div>
    );
  };

  const matched = new Set(matches.map((g) => g.name));
  return (
    <div ref={root} className={cx("wic-picker", `wic-picker-${placement}`)} data-open={open || undefined}>
      <button
        ref={button}
        type="button"
        className="wic-picker-button wic-focus"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${current?.label ?? placeholder}`}
        disabled={disabled}
        onClick={() => (open ? close(false) : show())}
      >
        {current?.group !== undefined && groupIcon && <span className="wic-picker-icon">{groupIcon(current.group)}</span>}
        <span className="wic-picker-current">{current?.label ?? placeholder}</span>
      </button>
      <div className={cx("wic-picker-panel", split && "wic-picker-split")} hidden={!open}>
        {filterable && (
        <input
            ref={input}
            className="wic-input wic-picker-filter wic-focus"
            role="combobox"
            aria-label={`Filter: ${label}`}
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={active ? `${id}-${activeIndex}` : undefined}
            placeholder={split ? "Filter, or group/name" : "Filter"}
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setActiveValue(groupOptions(options, e.target.value)[0]?.options[0]?.value ?? null);
            }}
            onKeyDown={onKey}
          />
        )}
        <div className="wic-picker-body">
          {split && (
            <div role="tablist" aria-label={`${label}: groups`} aria-orientation="vertical" className="wic-picker-rail">
              {all.map((group) => (
                <button
                  key={group.name ?? ""}
                  type="button"
                  role="tab"
                  tabIndex={-1}
                  aria-selected={!filtering && group.name === shownGroup}
                  aria-controls={`${id}-list`}
                  className="wic-picker-tab"
                  data-unmatched={(filtering && !matched.has(group.name)) || undefined}
                  onClick={() => showGroup(group.name)}
                >
                  {groupIcon && group.name !== undefined && <span className="wic-picker-icon">{groupIcon(group.name)}</span>}
                  <span className="wic-picker-tab-name">{group.name ?? "Other"}</span>
                  <span className="wic-picker-count">{group.options.length}</span>
                </button>
              ))}
            </div>
          )}
          <div
            ref={list}
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            className="wic-picker-list"
            // Without a filter field the list takes the focus and the keys.
            tabIndex={filterable ? undefined : -1}
            aria-activedescendant={!filterable && active ? `${id}-${activeIndex}` : undefined}
            onKeyDown={filterable ? undefined : onKey}
          >
            {listed.map((group) =>
              filtering && split ? (
                <div key={group.name ?? ""} role="group" aria-label={group.name ?? "Other"}>
                  <div className="wic-picker-group" aria-hidden="true">
                    {group.name ?? "Other"}
                  </div>
                  {group.options.map(optionRow)}
                </div>
              ) : (
                group.options.map(optionRow)
              ),
            )}
            {flat.length === 0 && <p className="wic-picker-empty">Nothing matches.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

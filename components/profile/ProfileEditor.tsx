"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  Loader2,
  RotateCcw,
  Save,
  Upload,
  X,
  type LucideIcon,
} from "lucide-react";

/* ──────────────────────────────────────────────
   Field kit — mirrors the signup wizard's UI
   (FieldLabel / inputClass / Toggle) so the look
   and validation feel stays consistent. The editor
   renders one form with a single Save button.
   ────────────────────────────────────────────── */

export const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[13.5px] text-slate-800 placeholder:text-slate-400 outline-none transition-colors duration-150 hover:border-slate-300 focus:border-[#4161df] focus:ring-4 focus:ring-[#4161df]/10";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[13px] font-medium text-slate-600">
      {children}
    </label>
  );
}

function Toggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/30 active:scale-[0.97] ${
        active
          ? "border-[#4161df] bg-[#4161df] text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-[#4161df]/40 hover:text-[#4161df]"
      }`}
    >
      {active && <Check className="h-3 w-3" aria-hidden />}
      {label}
    </button>
  );
}

/* ──────────────────────────────────────────────
   Field specs
   ────────────────────────────────────────────── */

export type ProfileFieldSpec =
  | {
      kind: "text";
      key: string;
      label: string;
      placeholder?: string;
      textarea?: boolean;
      maxLength?: number;
      type?: "number"; // input type for single-line text fields
      hint?: string;
    }
  | {
      kind: "toggles";
      key: string;
      label: string;
      options: string[];
    }
  | {
      kind: "select";
      key: string;
      label: string;
      options: string[];
      labels?: Record<string, string>; // display label override per value
    }
  | {
      kind: "boolean";
      key: string;
      label: string;
    }
  | {
      kind: "list"; // freeform list of strings (add/remove chips)
      key: string;
      label: string;
      placeholder?: string;
      maxLength?: number; // per-item max length
    };

/* A titled group of fields rendered as one card — the profile form is
   composed of these sections (About you / Contact / etc.). */
export type ProfileSection = {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  fields: ProfileFieldSpec[];
};

/* ──────────────────────────────────────────────
   Value helpers — normalisation + draft init
   ────────────────────────────────────────────── */

// Normalise so undefined / "" / missing-array all compare equal and the form
// isn't dirty on first render.
function normaliseValue(spec: ProfileFieldSpec, v: unknown): unknown {
  if (spec.kind === "toggles" || spec.kind === "list")
    return Array.isArray(v) ? v : [];
  if (spec.kind === "boolean") return typeof v === "boolean" ? v : null;
  // Numeric text fields: compare as numbers so "5" (input) === 5 (server)
  if (spec.kind === "text" && spec.type === "number") {
    if (v === "" || v === undefined || v === null) return "";
    const n = Number(v);
    return Number.isFinite(n) ? n : String(v);
  }
  return v ?? "";
}

function initDraft(
  sections: ProfileSection[],
  profile: Record<string, unknown>,
): Record<string, unknown> {
  const draft: Record<string, unknown> = {};
  for (const section of sections)
    for (const spec of section.fields) draft[spec.key] = profile[spec.key];
  return draft;
}

// Short single-line inputs pair up on a two-column grid inside a section;
// everything else (textareas, toggles, lists, pills) takes the full row.
const isHalfWidth = (spec: ProfileFieldSpec) =>
  spec.kind === "text" && !spec.textarea;

/* ──────────────────────────────────────────────
   One field row — controlled by the parent form
   (no per-field save button; the form saves all)
   ────────────────────────────────────────────── */

function FieldRow({
  spec,
  value,
  onChange,
}: {
  spec: ProfileFieldSpec;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const [listDraft, setListDraft] = useState("");

  const addListItem = () => {
    if (spec.kind !== "list") return;
    const item = listDraft.trim().slice(0, spec.maxLength ?? 120);
    if (!item) return;
    const items = Array.isArray(value) ? value : [];
    if (!items.includes(item)) onChange([...items, item]);
    setListDraft("");
  };

  const removeListItem = (index: number) => {
    if (spec.kind !== "list" || !Array.isArray(value)) return;
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <FieldLabel>{spec.label}</FieldLabel>

      {spec.kind === "text" &&
        (spec.textarea ? (
          <textarea
            className={`${inputClass} min-h-[104px] resize-none leading-relaxed`}
            placeholder={spec.placeholder}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            maxLength={spec.maxLength}
          />
        ) : (
          <input
            className={inputClass}
            placeholder={spec.placeholder}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            type={spec.type ?? "text"}
            maxLength={spec.type === "number" ? undefined : spec.maxLength}
          />
        ))}
      {spec.kind === "text" && spec.hint && (
        <p className="mt-1.5 text-[12px] text-slate-400">{spec.hint}</p>
      )}
      {spec.kind === "text" && spec.maxLength && (
        <p className="mt-1 text-right text-[11px] tabular-nums text-slate-400">
          {String(value ?? "").length}/{spec.maxLength}
        </p>
      )}

      {spec.kind === "toggles" && (
        <div className="flex flex-wrap gap-2">
          {spec.options.map((opt) => {
            const list = Array.isArray(value) ? value : [];
            return (
              <Toggle
                key={opt}
                label={opt}
                active={list.includes(opt)}
                onClick={() =>
                  onChange(
                    list.includes(opt)
                      ? list.filter((v) => v !== opt)
                      : [...list, opt],
                  )
                }
              />
            );
          })}
        </div>
      )}

      {spec.kind === "select" && (
        <div className="flex flex-wrap gap-2">
          {spec.options.map((opt) => (
            <Toggle
              key={opt}
              label={spec.labels?.[opt] ?? opt}
              active={value === opt}
              onClick={() => onChange(value === opt ? "" : opt)}
            />
          ))}
        </div>
      )}

      {spec.kind === "boolean" && (
        <div className="flex flex-wrap gap-2">
          <Toggle
            label="Yes"
            active={value === true}
            onClick={() => onChange(true)}
          />
          <Toggle
            label="No"
            active={value === false}
            onClick={() => onChange(false)}
          />
        </div>
      )}

      {spec.kind === "list" && (
        <div>
          <div className="flex gap-2">
            <input
              className={inputClass}
              placeholder={spec.placeholder}
              value={listDraft}
              onChange={(e) => setListDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addListItem();
                }
              }}
            />
            <button
              type="button"
              onClick={addListItem}
              disabled={!listDraft.trim()}
              className="shrink-0 rounded-lg bg-[#4161df] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#3151c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add
            </button>
          </div>
          {Array.isArray(value) && value.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {value.map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#4161df]/15 bg-[#4161df]/5 py-1 pl-3 pr-1.5 text-[12.5px] font-medium text-slate-700"
                >
                  <Check className="h-3 w-3 text-[#4161df]" aria-hidden />
                  {item}
                  <button
                    type="button"
                    onClick={() => removeListItem(i)}
                    className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/30"
                    aria-label={`Remove ${item}`}
                  >
                    <X className="h-3 w-3" aria-hidden />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
/* ──────────────────────────────────────────────
   Avatar (photo) section — controlled by the form;
   the picked file is submitted with the main Save.
   ────────────────────────────────────────────── */

function AvatarSection({
  avatar,
  name,
  photo,
  preview,
  onPick,
}: {
  avatar?: string;
  name?: string;
  photo: File | null;
  preview: string | null;
  onPick: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#4161df] to-[#7c93f2] p-[3px]">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
              {preview || avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview || avatar}
                  alt={`${name ?? "Profile"} avatar`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-[#4161df]">
                  {(name ?? "P").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-label="Change profile photo"
            className="absolute -bottom-0.5 -right-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#4161df] text-white transition-colors hover:bg-[#3151c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/40 active:scale-90"
          >
            <Camera className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-slate-900">
            {name ?? "Your profile"}
          </p>
          <p className="mt-0.5 text-[12.5px] text-slate-500">
            A clear, friendly photo helps people trust who they're dealing with.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-medium text-slate-700 transition-colors hover:border-[#4161df]/40 hover:text-[#4161df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/30 active:scale-[0.98]"
            >
              <Upload className="h-4 w-4" aria-hidden />
              {photo ? "Change photo" : "Upload photo"}
            </button>
            {photo && (
              <button
                type="button"
                onClick={() => onPick(null)}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-[12px] font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Discard
              </button>
            )}
          </div>
          {photo ? (
            <p className="mt-2 max-w-full truncate text-[11.5px] text-emerald-600">
              {photo.name} ready — save to apply
            </p>
          ) : (
            <p className="mt-2 text-[11px] text-slate-400">
              PNG or JPG, up to 5MB
            </p>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
    </section>
  );
}

/* ──────────────────────────────────────────────
   Editor — one form, all fields visible at once,
   a single Save button that persists everything
   (photo included). No steps, no sequence.
   ────────────────────────────────────────────── */

export default function ProfileEditor({
  sections,
  profile,
  name,
  avatar,
  saving = false,
  onSave,
}: {
  sections: ProfileSection[];
  profile: Record<string, unknown>;
  name?: string;
  avatar?: string;
  saving?: boolean;
  onSave: (draft: Record<string, unknown>, photo: File | null) => Promise<void>;
}) {
  const [draft, setDraft] = useState<Record<string, unknown>>(() =>
    initDraft(sections, profile),
  );
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Re-sync the draft when the server value changes (e.g. after refetch)
  useEffect(() => {
    setDraft(initDraft(sections, profile));
  }, [sections, profile]);

  const handlePick = (f: File | null) => {
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const changedCount = sections.reduce(
    (count, section) =>
      count +
      section.fields.filter(
        (spec) =>
          JSON.stringify(normaliseValue(spec, draft[spec.key])) !==
          JSON.stringify(normaliseValue(spec, profile[spec.key])),
      ).length,
    0,
  );
  const dirty = changedCount > 0 || photo !== null;

  const setFieldValue = (key: string, v: unknown) => {
    setDraft((d) => ({ ...d, [key]: v }));
    setSaved(false);
  };

  const handleReset = () => {
    setDraft(initDraft(sections, profile));
    handlePick(null);
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirty || saving) return;
    try {
      await onSave(draft, photo);
      if (photo) handlePick(null); // clears the pending preview too
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Error already surfaced (toast) by the page's onSave handler.
      // Swallow here so the rejection isn't unhandled; form stays dirty.
    }
  };

  // Lay a section's fields out: short inputs pair up on a two-column grid,
  // full-width fields break the run.
  const renderFields = (fields: ProfileFieldSpec[]) => {
    const nodes: React.ReactNode[] = [];
    let run: ProfileFieldSpec[] = [];

    const flushRun = () => {
      if (run.length === 0) return;
      const pair = run;
      nodes.push(
        <div key={`pair-${pair[0].key}`} className="grid gap-5 sm:grid-cols-2">
          {pair.map((spec) => (
            <FieldRow
              key={spec.key}
              spec={spec}
              value={draft[spec.key]}
              onChange={(v) => setFieldValue(spec.key, v)}
            />
          ))}
        </div>,
      );
      run = [];
    };

    for (const spec of fields) {
      if (isHalfWidth(spec)) {
        run.push(spec);
      } else {
        flushRun();
        nodes.push(
          <FieldRow
            key={spec.key}
            spec={spec}
            value={draft[spec.key]}
            onChange={(v) => setFieldValue(spec.key, v)}
          />,
        );
      }
    }
    flushRun();
    return nodes;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 sm:space-y-5">
        <AvatarSection
          avatar={avatar}
          name={name}
          photo={photo}
          preview={preview}
          onPick={handlePick}
        />

        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <section
              key={section.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <header className="mb-5 flex items-start gap-3.5 border-b border-slate-100 pb-4">
                {Icon && (
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#4161df]/8 text-[#4161df]">
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                )}
                <div className="min-w-0 flex-1 pt-0.5">
                  <h2 className="text-[15px] font-semibold text-slate-900">
                    {section.title}
                  </h2>
                  {section.description && (
                    <p className="mt-0.5 text-[13px] text-slate-500">
                      {section.description}
                    </p>
                  )}
                </div>
              </header>

              <div className="space-y-5">{renderFields(section.fields)}</div>
            </section>
          );
        })}
      </div>

      {/* Single save bar for the whole form */}
      <div className="sticky bottom-4 z-10 mt-5">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 pl-4 shadow-lg shadow-slate-900/[0.06] backdrop-blur">
          <div className="min-w-0">
            <p
              className={`flex items-center gap-2 text-[13px] font-medium ${
                saved && !dirty
                  ? "text-emerald-600"
                  : dirty
                    ? "text-amber-600"
                    : "text-slate-400"
              }`}
            >
              <span
                className={`inline-block h-2 w-2 shrink-0 rounded-full ${
                  saved && !dirty
                    ? "bg-emerald-500"
                    : dirty
                      ? "animate-pulse bg-amber-500"
                      : "bg-slate-300"
                }`}
                aria-hidden
              />
              {saved && !dirty
                ? "All changes saved."
                : dirty
                  ? "You have unsaved changes"
                  : "You're all caught up."}
            </p>
            {dirty && (
              <p className="ml-4 text-[11px] text-slate-400">
                {changedCount > 0
                  ? `${changedCount} field${changedCount > 1 ? "s" : ""} changed${photo ? " + photo" : ""}`
                  : "New profile photo ready to upload"}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {dirty && (
              <button
                type="button"
                onClick={handleReset}
                disabled={saving}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                Discard
              </button>
            )}
            <button
              type="submit"
              disabled={!dirty || saving}
              className={`inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl px-5 text-[13px] font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
                saved && !dirty
                  ? "bg-emerald-500 hover:bg-emerald-500"
                  : "bg-[#4161df] hover:bg-[#3151c9]"
              }`}
            >
              {saved && !dirty ? (
                <>
                  <Check className="h-4 w-4" aria-hidden /> Saved
                </>
              ) : saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" aria-hidden /> Save changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

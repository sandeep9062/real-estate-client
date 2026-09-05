"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Upload, X } from "lucide-react";

/* ──────────────────────────────────────────────
   Field kit — mirrors the signup wizard's UI
   (FieldLabel / inputClass / Toggle) so the look
   and validation feel stays consistent. The editor
   renders one form with a single Save button.
   ────────────────────────────────────────────── */

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13.5px] text-slate-800 placeholder:text-slate-400 outline-none transition-colors focus:border-[#4161df] focus:ring-2 focus:ring-[#4161df]/15";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">
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
      className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-full transition-all duration-150 border"
      style={
        active
          ? { background: "#4161df", color: "#fff", borderColor: "#4161df" }
          : { background: "#fff", color: "#64748b", borderColor: "#e2e8f0" }
      }
    >
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
  fields: ProfileFieldSpec[],
  profile: Record<string, unknown>,
): Record<string, unknown> {
  const draft: Record<string, unknown> = {};
  for (const spec of fields) draft[spec.key] = profile[spec.key];
  return draft;
}

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
    <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
      <div>
        <div className="min-w-0 flex-1">
          <FieldLabel>{spec.label}</FieldLabel>

          {spec.kind === "text" &&
            (spec.textarea ? (
              <textarea
                className={`${inputClass} min-h-[96px] resize-none`}
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
          {spec.kind === "text" && spec.maxLength && (
            <p className="text-[11px] text-slate-400 mt-1 text-right">
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
                  className="shrink-0 rounded-xl bg-[#4161df] px-4 text-[13px] font-semibold text-white transition hover:bg-[#3759dd] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Add
                </button>
              </div>
              {Array.isArray(value) && value.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {value.map((item, i) => (
                    <span
                      key={`${item}-${i}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 py-1 pl-3 pr-1.5 text-[12.5px] text-slate-700"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeListItem(i)}
                        className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
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
      </div>
    </section>
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
    <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-indigo-50">
          {preview || avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview || avatar}
              alt={`${name ?? "Profile"} avatar`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-[#4161df]">
              {(name ?? "P").charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <FieldLabel>Profile photo</FieldLabel>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-medium text-slate-700 transition hover:border-[#4161df]/40 hover:text-[#4161df]"
          >
            <Upload className="h-4 w-4" aria-hidden />
            {photo ? photo.name : "Click to upload your photo"}
          </button>
          <p className="mt-1 text-[11px] text-slate-400">PNG or JPG, up to 5MB</p>
          {photo && (
            <button
              type="button"
              onClick={() => onPick(null)}
              className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-medium text-slate-400 transition hover:text-slate-600"
            >
              <X className="h-3 w-3" aria-hidden />
              Discard selected photo
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPick(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Editor — one form, all fields visible at once,
   a single Save button that persists everything
   (photo included). No steps, no sequence.
   ────────────────────────────────────────────── */

export default function ProfileEditor({
  fields,
  profile,
  name,
  avatar,
  saving = false,
  onSave,
}: {
  fields: ProfileFieldSpec[];
  profile: Record<string, unknown>;
  name?: string;
  avatar?: string;
  saving?: boolean;
  onSave: (
    draft: Record<string, unknown>,
    photo: File | null,
  ) => Promise<void>;
}) {
  const [draft, setDraft] = useState<Record<string, unknown>>(() =>
    initDraft(fields, profile),
  );
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Re-sync the draft when the server value changes (e.g. after refetch)
  useEffect(() => {
    setDraft(initDraft(fields, profile));
  }, [fields, profile]);

  const handlePick = (f: File | null) => {
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const dirty =
    photo !== null ||
    fields.some(
      (spec) =>
        JSON.stringify(normaliseValue(spec, draft[spec.key])) !==
        JSON.stringify(normaliseValue(spec, profile[spec.key])),
    );

  const setFieldValue = (key: string, v: unknown) => {
    setDraft((d) => ({ ...d, [key]: v }));
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <AvatarSection
          avatar={avatar}
          name={name}
          photo={photo}
          preview={preview}
          onPick={handlePick}
        />
        {fields.map((spec) => (
          <FieldRow
            key={spec.key}
            spec={spec}
            value={draft[spec.key]}
            onChange={(v) => setFieldValue(spec.key, v)}
          />
        ))}
      </div>

      {/* Single save bar for the whole form */}
      <div className="sticky bottom-4 z-10 mt-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200/80 bg-white/95 p-3 pl-4 shadow-lg backdrop-blur">
          <p
            className={`text-[12.5px] ${
              saved && !dirty
                ? "text-emerald-600"
                : dirty
                  ? "text-amber-600"
                  : "text-slate-400"
            }`}
          >
            {saved && !dirty
              ? "All changes saved."
              : dirty
                ? "You have unsaved changes."
                : "No changes yet."}
          </p>
          <button
            type="submit"
            disabled={!dirty || saving}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#4161df] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#3759dd] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saved && !dirty ? (
              <>
                <Check className="h-4 w-4" aria-hidden /> Saved
              </>
            ) : saving ? (
              "Saving…"
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
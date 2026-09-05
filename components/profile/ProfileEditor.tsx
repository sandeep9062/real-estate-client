"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Pencil, Upload } from "lucide-react";

/* ──────────────────────────────────────────────
   Field kit — mirrors the signup wizard's UI
   (FieldLabel / inputClass / Toggle) so the look
   and validation feel stays consistent, but usable
   independently with per-field save (no steps).
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
      hint?: string;
    }
  | {
      kind: "toggles";
      key: string;
      label: string;
      options: string[];
    };

/* ──────────────────────────────────────────────
   One independently-saveable field card
   ────────────────────────────────────────────── */

function FieldCard({
  spec,
  value,
  onSave,
}: {
  spec: ProfileFieldSpec;
  value: unknown;
  onSave: (key: string, value: unknown) => Promise<void>;
}) {
  const [draft, setDraft] = useState<unknown>(value);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Re-sync draft when the server value changes (e.g. after refetch)
  useEffect(() => {
    setDraft(value);
  }, [value]);

  const isEmpty = (v: unknown) =>
    spec.kind === "toggles" ? !Array.isArray(v) || v.length === 0 : !v;

  const dirty =
    JSON.stringify(draft ?? (spec.kind === "toggles" ? [] : "")) !==
    JSON.stringify(isEmpty(value) ? (spec.kind === "toggles" ? [] : "") : value);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(spec.key, draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Error already surfaced (toast) by the page's onSaveField handler.
      // Swallow here so the rejection isn't unhandled; card stays dirty.
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <FieldLabel>{spec.label}</FieldLabel>

          {spec.kind === "text" &&
            (spec.textarea ? (
              <textarea
                className={`${inputClass} min-h-[96px] resize-none`}
                placeholder={spec.placeholder}
                value={String(draft ?? "")}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={spec.maxLength}
              />
            ) : (
              <input
                className={inputClass}
                placeholder={spec.placeholder}
                value={String(draft ?? "")}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={spec.maxLength}
              />
            ))}
          {spec.kind === "text" && spec.maxLength && (
            <p className="text-[11px] text-slate-400 mt-1 text-right">
              {String(draft ?? "").length}/{spec.maxLength}
            </p>
          )}

          {spec.kind === "toggles" && (
            <div className="flex flex-wrap gap-2">
              {spec.options.map((opt) => {
                const list = Array.isArray(draft) ? draft : [];
                return (
                  <Toggle
                    key={opt}
                    label={opt}
                    active={list.includes(opt)}
                    onClick={() =>
                      setDraft(
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
        </div>

        <button
          type="button"
          disabled={saving || !dirty}
          onClick={handleSave}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#4161df] px-3.5 py-2 text-[12.5px] font-semibold text-white transition hover:bg-[#3759dd] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saved ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden /> Saved
            </>
          ) : (
            <>
              <Pencil className="h-3.5 w-3.5" aria-hidden />
              {saving ? "Saving…" : "Save"}
            </>
          )}
        </button>
      </div>
    </section>
  );
}
/* ──────────────────────────────────────────────
   Avatar (photo) card
   ────────────────────────────────────────────── */

function AvatarCard({
  avatar,
  name,
  onSave,
}: {
  avatar?: string;
  name?: string;
  onSave: (file: File) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handlePick = (f: File | null) => {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleSave = async () => {
    if (!file) return;
    setSaving(true);
    try {
      await onSave(file);
      setSaved(true);
      setFile(null);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

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
            {file ? file.name : "Click to upload your photo"}
          </button>
          <p className="mt-1 text-[11px] text-slate-400">PNG or JPG, up to 5MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handlePick(e.target.files?.[0] ?? null)}
          />
        </div>

        <button
          type="button"
          disabled={!file || saving}
          onClick={handleSave}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg bg-[#4161df] px-3.5 py-2 text-[12.5px] font-semibold text-white transition hover:bg-[#3759dd] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saved ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden /> Saved
            </>
          ) : (
            <>
              <Pencil className="h-3.5 w-3.5" aria-hidden />
              {saving ? "Saving…" : "Save"}
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Editor — all fields visible at once, each
   independently saveable. No steps, no sequence.
   ────────────────────────────────────────────── */

export default function ProfileEditor({
  fields,
  profile,
  name,
  avatar,
  onSaveField,
  onSavePhoto,
}: {
  fields: ProfileFieldSpec[];
  profile: Record<string, unknown>;
  name?: string;
  avatar?: string;
  onSaveField: (key: string, value: unknown) => Promise<void>;
  onSavePhoto: (file: File) => Promise<void>;
}) {
  return (
    <div className="grid gap-4">
      <AvatarCard avatar={avatar} name={name} onSave={onSavePhoto} />
      {fields.map((spec) => (
        <FieldCard
          key={spec.key}
          spec={spec}
          value={profile[spec.key]}
          onSave={onSaveField}
        />
      ))}
    </div>
  );
}
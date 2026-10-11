import type { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const ADMIN_REVALIDATE_SECRET = process.env.ADMIN_REVALIDATE_SECRET;

/**
 * Server-only revalidation trigger.
 *
 * Only the backend (which owns all writes) may call this. The public frontend
 * is read-only: its browser code only issues GETs to the backend
 * (`/v1/journals...`), it never writes and never hits this endpoint. It exists
 * solely so the backend can invalidate the Next.js ISR caches after a journal
 * create/update/delete. `revalidatePath`/`revalidateTag` are server-only Next.js
 * APIs that cannot run inside the Express process, which is why this sits in
 * Next.js and not the backend.
 *
 * Request (POST):
 *   x-admin-secret: <ADMIN_REVALIDATE_SECRET>
 *   body: { action: "create" | "update" | "delete", slug?: string }
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");
  if (secret !== ADMIN_REVALIDATE_SECRET) {
    return Response.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  let body: { action?: string; slug?: string };
  try {
    body = (await request.json()) as { action?: string; slug?: string };
  } catch {
    return Response.json({ success: false, error: "invalid json" }, { status: 400 });
  }

  const { action, slug } = body;
  if (!action) {
    return Response.json({ success: false, error: "action is required" }, { status: 400 });
  }

  const normalizedSlug = typeof slug === "string" ? slug.trim() : "";

  let paths: string[] = [];
  const tags: string[] = ["journals"];

  switch (action) {
    case "create":
    case "update":
      if (!normalizedSlug) {
        return Response.json(
          { success: false, error: "slug is required for create/update" },
          { status: 400 },
        );
      }
      paths = [`/journal/${normalizedSlug}`, "/journal"];
      tags.push(`journal-${normalizedSlug}`);
      break;
    case "delete":
      if (!normalizedSlug) {
        return Response.json(
          { success: false, error: "slug is required for delete" },
          { status: 400 },
        );
      }
      paths = [`/journal/${normalizedSlug}`, "/journal"];
      tags.push(`journal-${normalizedSlug}`);
      break;
    default:
      return Response.json(
        { success: false, error: `unknown action: ${action}` },
        { status: 400 },
      );
  }

  for (const p of paths) {
    revalidatePath(p);
  }
  for (const t of tags) {
    revalidateTag(t, "max");
  }

  return Response.json({ success: true });
}

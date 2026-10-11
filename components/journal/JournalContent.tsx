import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";

export const AUTHOR_FALLBACK = "PropertyBulbul Editorial";

// Mirrors backend normalizeMarkdown (utils/markdown.js): CRLF normalize,
// unescape star/underscore/bracket (never pipe), collapse 3+ newlines, trim.
export function cleanMarkdown(text: string | null | undefined): string {
  if (typeof text !== "string") return "";
  const LF = String.fromCharCode(10);
  const BS = String.fromCharCode(92);
  let out = text.split(String.fromCharCode(13) + LF).join(LF);
  out = out.split(String.fromCharCode(13)).join(LF);
  const singles = ["*", "_", "[", "]"];
  for (const ch of singles) {
    out = out.split(BS + ch).join(ch);
  }
  out = out.split(String.fromCharCode(160)).join(" ");
  const zw = [8203, 8204, 8205, 65279].map((c) => String.fromCharCode(c));
  for (const ch of zw) {
    out = out.split(ch).join("");
  }
  const TRIPLE = LF + LF + LF;
  const DOUBLE = LF + LF;
  let prev: string | null = null;
  while (prev !== out) {
    prev = out;
    out = out.split(TRIPLE).join(DOUBLE);
  }
  return out.trim();
}

// Strip markdown syntax for meta descriptions: images/links keep their text,
// emphasis/code markers are dropped, table pipes become spaces.
export function stripMarkdownToText(text: string | null | undefined): string {
  if (typeof text !== "string") return "";
  const BS = String.fromCharCode(92);
  let out = cleanMarkdown(text);
  out = out.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
  out = out.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  const mdChars = ["*", "_", "`", "#", ">", "|", "-", "+", BS];
  for (const ch of mdChars) {
    out = out.split(ch).join(" ");
  }
  return out.replace(/\s+/g, " ").trim();
}

function isInternalHref(href: string): boolean {
  if (href.startsWith("/")) return true;
  return href.includes("propertybulbul.com");
}

function toInternalPath(href: string): string {
  try {
    const url = new URL(href, "https://propertybulbul.com");
    return url.pathname + url.search + url.hash;
  } catch {
    return href;
  }
}

function MarkdownLink({
  href,
  children,
}: {
  href?: string;
  children?: ReactNode;
}) {
  if (!href) return <span>{children}</span>;
  if (isInternalHref(href)) {
    const path = href.startsWith("/") ? href : toInternalPath(href);
    return <Link href={path}>{children}</Link>;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function JournalContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h2 className="mt-6 text-xl font-bold text-slate-900 sm:text-2xl">
            {children}
          </h2>
        ),
        h2: ({ children }) => (
          <h2 className="mt-6 text-xl font-bold text-slate-900 sm:text-2xl">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-5 text-lg font-bold text-slate-900 sm:text-xl">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc space-y-1 pl-6 text-base text-slate-700 sm:text-lg">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal space-y-1 pl-6 text-base text-slate-700 sm:text-lg">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-200 bg-blue-50 px-4 py-2 italic text-slate-700">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <MarkdownLink href={href}>{children}</MarkdownLink>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[480px] border-collapse">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-slate-100">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="border px-3 py-2 text-left text-sm font-semibold text-slate-900">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border px-3 py-2 text-sm text-slate-700">{children}</td>
        ),
      }}
    >
      {cleanMarkdown(content)}
    </ReactMarkdown>
  );
}

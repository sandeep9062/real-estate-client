import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";

export const AUTHOR_FALLBACK = "PropertyBulbul Editorial";

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

const linkClass =
  "font-medium text-[#4161df] underline decoration-[#4161df]/30 underline-offset-4 transition-colors hover:decoration-[#4161df]";

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
    return (
      <Link href={path} className={linkClass}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
    >
      {children}
    </a>
  );
}

export default function JournalContent({ content }: { content: string }) {
  return (
    <div className="journal-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // h1 is rendered as h2: the page title is already the document's h1 (SEO).
          h1: ({ children }) => (
            <h2 className="mt-14 scroll-mt-28 font-heading text-2xl font-bold tracking-tight text-slate-900 first:mt-0 sm:text-[2rem] sm:leading-tight">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="mt-14 scroll-mt-28 border-t border-slate-200 pt-8 font-heading text-2xl font-bold tracking-tight text-slate-900 first:mt-0 first:border-0 first:pt-0 sm:text-[1.75rem] sm:leading-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-10 scroll-mt-28 font-heading text-xl font-bold tracking-tight text-slate-900 first:mt-0 sm:text-[1.35rem]">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-8 scroll-mt-28 font-heading text-base font-bold uppercase tracking-wide text-slate-800 first:mt-0">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mt-5 text-[1.0625rem] leading-[1.8] text-slate-700 sm:text-lg sm:leading-[1.85]">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="mt-5 list-disc space-y-2.5 pl-6 text-[1.0625rem] leading-[1.8] text-slate-700 marker:text-[#4161df] sm:text-lg">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-5 list-decimal space-y-2.5 pl-6 text-[1.0625rem] leading-[1.8] text-slate-700 marker:font-semibold marker:text-[#4161df] sm:text-lg">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          hr: () => <hr className="my-12 border-slate-200" />,
          blockquote: ({ children }) => (
            <blockquote className="my-8 rounded-r-xl border-l-4 border-[#4161df] bg-[#4161df]/5 px-6 py-4 text-slate-700 [&>p]:mt-0 [&>p]:italic">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <MarkdownLink href={href}>{children}</MarkdownLink>
          ),
          table: ({ children }) => (
            <div className="my-8 max-w-full overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
              <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-50 text-slate-900">{children}</thead>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-slate-200 last:border-0 even:bg-slate-50/50">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 align-top text-slate-700">{children}</td>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-slate-800">
                  {children}
                </code>
              );
            }
            return (
              <code className="my-6 block overflow-x-auto rounded-xl bg-slate-900 px-5 py-4 font-mono text-sm leading-relaxed text-slate-100">
                {children}
              </code>
            );
          },
          img: ({ src, alt, className, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              className={`my-8 h-auto max-w-full rounded-xl border border-slate-200 shadow-sm ${className || ""}`}
              {...props}
            />
          ),
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {cleanMarkdown(content)}
      </ReactMarkdown>
    </div>
  );
}

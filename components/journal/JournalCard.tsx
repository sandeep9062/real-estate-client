import React from "react";
import Image from "next/image";

export interface JournalPost {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  readTime?: string;
  publishedAt?: string;
  coverImage?: string;
  isFeatured?: boolean;
}

interface JournalCardProps {
  post: JournalPost;
  index: number;
  variant: "lead" | "second" | "reg";
}

export default function JournalCard({
  post,
  index,
  variant,
}: JournalCardProps) {
  const isLead = variant === "lead";
  const isSecond = variant === "second";
  const isReg = variant === "reg";

  const formattedIndex = String(index + 1).padStart(2, "0");

  if (isLead || isSecond) {
    return (
      <a
        href={`/journal/${post.slug}`}
        className={`group relative flex flex-col justify-end overflow-hidden bg-[#f1ede4] text-white ${
          isLead
            ? "min-h-[320px] p-5 sm:col-span-2 lg:col-span-4 lg:min-h-[480px] lg:p-[28px]"
            : "min-h-[260px] p-5 sm:col-span-2 lg:col-span-2 lg:min-h-[480px] lg:p-[24px]"
        }`}
      >
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="z-0 object-cover transition-transform duration-600 ease-in-out group-hover:scale-[1.035]"
          />
        )}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[rgba(32,29,26,0.05)] via-transparent to-[rgba(32,29,26,0.88)]" />
        <span className="absolute left-[18px] top-[16px] z-[2] font-mono text-[11px] text-white/75">
          #{formattedIndex}
        </span>
        {post.isFeatured && (
          <span className="absolute left-[18px] top-[40px] z-[2] inline-flex items-center gap-1 px-2 py-[2px] rounded-full bg-[#ae4429] text-[10px] font-bold text-white uppercase tracking-wider">
            Featured
          </span>
        )}
        <div className="relative z-[2]">
          {post.category && (
            <span className="mb-2 inline-block text-[11px] underline decoration-[#e8977e] underline-offset-[3px]">
              {post.category}
            </span>
          )}
          <h2
            className={`mb-2 font-heading leading-[1.14] ${
              isLead ? "text-[clamp(1.5rem,3vw,2rem)]" : "text-[1.3rem]"
            }`}
          >
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="mb-[10px] text-[13px] leading-[1.5] text-[#d8d2c4] line-clamp-2">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-[14px] font-mono text-[10.5px] text-white/75">
            {post.publishedAt && <span>{post.publishedAt}</span>}
            {post.readTime && <span>{post.readTime}</span>}
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={`/journal/${post.slug}`}
      className="group flex flex-col border-t-2 border-transparent bg-white p-4 text-[#201d1a] transition-colors duration-150 hover:border-t-[#ae4429] sm:col-span-1 lg:col-span-2"
    >
      <span className="mb-[10px] font-mono text-[11px] text-[#6e6b63]">
        #{formattedIndex}
      </span>
      {post.coverImage && (
        <div className="mb-[14px] aspect-[16/10] w-full overflow-hidden bg-[#e9e3d4]">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={400}
            height={250}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      {post.isFeatured && (
        <span className="mb-2 inline-flex items-center gap-1 px-2 py-[2px] rounded-full bg-[#ae4429] text-[10px] font-bold text-white uppercase tracking-wider">
          Featured
        </span>
      )}
      {post.category && (
        <span className="mb-2 inline-block text-[11px] text-[#ae4429] underline decoration-[#ae4429] underline-offset-[3px]">
          {post.category}
        </span>
      )}
      <h3 className="mb-2 font-heading text-[1.1rem] leading-[1.14]">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="mb-[10px] text-[13px] leading-[1.5] text-[#6e6b63] line-clamp-3">
          {post.excerpt}
        </p>
      )}
      <div className="mt-auto flex items-center gap-[14px] pt-2 font-mono text-[10.5px] text-[#6e6b63]">
        {post.publishedAt && <span>{post.publishedAt}</span>}
        {post.readTime && <span>{post.readTime}</span>}
      </div>
    </a>
  );
}

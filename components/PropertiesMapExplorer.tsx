"use client";

import dynamic from "next/dynamic";
import type { PropertiesMapExplorerProps } from "./PropertiesMapExplorerInner";

const PropertiesMapExplorerClient = dynamic(
  () => import("./PropertiesMapExplorerInner"),
  {
    ssr: false,
    loading: () => (
      <div className="relative h-[min(52vh,480px)] w-full animate-pulse rounded-xl border border-gray-200 bg-slate-100 shadow-sm" />
    ),
  },
);

export type { PropertiesMapExplorerProps } from "./PropertiesMapExplorerInner";

export default function PropertiesMapExplorer(props: PropertiesMapExplorerProps) {
  return <PropertiesMapExplorerClient {...props} />;
}

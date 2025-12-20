"use client";

import dynamic from "next/dynamic";

const ChatBotWidget = dynamic(() => import("./ChatBotWidget"), {
  ssr: false,
});

export default function ClientChatBotWrapper() {
  return <ChatBotWidget />;
}

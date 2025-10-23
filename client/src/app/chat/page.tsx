import { Suspense } from "react";
import { PdfChat } from "../components/PdfChat/PdfChat";

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#212121] text-white">Loading chat...</div>}>
      <PdfChat />
    </Suspense>
  );
}
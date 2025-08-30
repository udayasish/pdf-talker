"use client";
import React from "react";
import { BackgroundBeams } from "../ui/background-beams";
import { FileUploadDemo } from "../FileUpload/FileUpload";
import { TypewriterEffectSmoothDemo } from "../TypewriterEffect/TypewriterEffect";

export function Highlight() {
  return (
    // <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
    <div className="h-[100vh] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          {/* Chat with Your PDFs */}
          <TypewriterEffectSmoothDemo />
        </h1>
        <p></p>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Upload any PDF document and start asking questions instantly. Our
          AI-powered system understands your documents and provides accurate,
          contextual answers using advanced RAG technology. Transform the way
          you interact with your documents.
        </p>
        <div className="relative z-10 mt-6 w-full max-w-md mx-auto">
          <FileUploadDemo />
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}

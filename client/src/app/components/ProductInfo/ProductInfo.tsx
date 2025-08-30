import React from "react";
import { BackgroundBeamsWithCollision } from "@/app/components/ui/background-beams-with-collision";

export function ProductInfo() {
  return (
    <BackgroundBeamsWithCollision>
      <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
        Meet{" "}
        <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
          <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
            <span className="">PDF Talker</span>
          </div>
          <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
            <span className="">PDF Talker</span>
          </div>
        </div>
        <br />
        <span className="text-lg md:text-2xl lg:text-4xl text-gray-600 dark:text-gray-400 font-normal mt-4 block">
          Your AI-powered document companion that transforms static PDFs into interactive conversations.
        </span>
      </h2>
    </BackgroundBeamsWithCollision>
  );
}

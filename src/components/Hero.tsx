import React from "react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-6">
          <Badge variant="default" className="py-1 px-3.5 text-sm gap-2">
            🚀 Built with Next.js 15 & React 19
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl mx-auto leading-tight">
          Next-Generation Intelligence with{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Verid AI
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          High-performance, modular React & Next.js components crafted for scale,
          speed, and developer ergonomics.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg">
            Explore Components
          </Button>
          <a
            href="https://github.com/anirudhsharma5600-alt/Verid-AI"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg">
              View on GitHub
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

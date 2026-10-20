import React from "react";
import { Button } from "./ui/Button";

export function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            V
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
            Verid<span className="text-blue-600">AI</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
          <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Features
          </a>
          <a href="#components" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Components
          </a>
          <a href="#docs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Documentation
          </a>
          <a
            href="https://github.com/anirudhsharma5600-alt/Verid-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            GitHub
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button variant="primary" size="sm">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}

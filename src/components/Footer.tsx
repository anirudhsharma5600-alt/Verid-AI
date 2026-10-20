import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-12 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            V
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">
            Verid AI
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <a
            href="https://github.com/anirudhsharma5600-alt/Verid-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            GitHub Repository
          </a>
          <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Features
          </a>
          <a href="#components" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Components
          </a>
        </div>
      </div>
    </footer>
  );
}

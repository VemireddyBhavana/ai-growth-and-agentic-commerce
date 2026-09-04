'use client';

import * as React from 'react';

interface NexusLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textSize?: string;
}

export function NexusLogo({
  size = 32,
  className = '',
  showText = true,
  textSize = 'text-xl',
}: NexusLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Nexus Prism SVG */}
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 via-ai-violet to-ai-cyan p-0.5 shadow-lg shadow-brand-600/20 group hover:shadow-brand-600/40 transition-all duration-300"
        style={{ width: size, height: size }}
      >
        <div className="w-full h-full bg-obsidian-950/90 dark:bg-obsidian-950/90 bg-white/95 rounded-[10px] flex items-center justify-center backdrop-blur-sm overflow-hidden">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4/5 h-4/5 transition-transform duration-500 group-hover:scale-110"
          >
            <defs>
              <linearGradient id="nexus-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="100%" stopColor="#4F46E5" />
              </linearGradient>
              <linearGradient id="nexus-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient id="nexus-grad-3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            {/* Prism Facet Alpha (Top Left) */}
            <path
              d="M16 4L6 14L16 19L16 4Z"
              fill="url(#nexus-grad-1)"
              opacity="0.95"
            />
            {/* Prism Facet Beta (Top Right) */}
            <path
              d="M16 4L26 14L16 19L16 4Z"
              fill="url(#nexus-grad-2)"
              opacity="0.9"
            />
            {/* Prism Facet Gamma (Bottom) */}
            <path
              d="M6 14L16 19L26 14L16 28L6 14Z"
              fill="url(#nexus-grad-3)"
              opacity="0.85"
            />
            {/* Central Neural Core Diamond */}
            <path
              d="M16 13L19 16L16 19L13 16L16 13Z"
              fill="#FFFFFF"
              className="drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
            />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-heading font-bold tracking-tight text-foreground ${textSize}`}
            >
              AI Sales Assistant
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-ai-cyan animate-pulse" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mt-0.5">
            Autonomous Commerce
          </span>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-card/80 dark:bg-obsidian-900/80 border border-border p-8 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="w-16 h-16 mx-auto bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-brand-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight font-heading">404</h1>
          <h2 className="text-xl font-semibold">Page Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The page you are looking for doesn&apos;t exist, has been removed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-medium text-sm hover:bg-brand-500 transition-colors shadow-lg shadow-brand-600/20"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-medium text-sm border border-border transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

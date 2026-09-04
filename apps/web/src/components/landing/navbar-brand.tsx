'use client';

import Link from 'next/link';
import { NexusLogo } from './NexusLogo';

interface NavbarBrandProps {
  className?: string;
  onNavigate?: () => void;
}

export function NavbarBrand({ className = '', onNavigate }: NavbarBrandProps) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label="AI Sales Assistant Home"
      className={`group inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 rounded-xl p-1 -m-1 transition-transform duration-200 active:scale-[0.98] ${className}`}
    >
      <NexusLogo size={36} showText={true} textSize="text-lg sm:text-xl" />
    </Link>
  );
}

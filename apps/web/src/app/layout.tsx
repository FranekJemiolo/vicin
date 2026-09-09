import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vicin - Spontaneous Neighborhood Availability',
  description:
    'Frictionless, closed-loop availability broadcasting for trusted neighbors, dorms, and coworker pods.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090A0F] text-[#F8FAFC] antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}

import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vicin — Spontaneous Neighborhood & Circle Availability',
  description:
    'Frictionless, mobile-first availability broadcasting for trusted neighbors, dorms, and coworker pods. Broadcast active availability without group chat spam.',
  keywords: [
    'neighborhood availability',
    'spontaneous hangout',
    'dorm circle',
    'proximity social',
    'live activities',
    'home screen widgets',
  ],
  authors: [{ name: 'Vicin Team' }],
  metadataBase: new URL('https://franekjemiolo.github.io/vicin'),
  openGraph: {
    title: 'Vicin — Spontaneous Neighborhood Availability',
    description:
      'Broadcast time-bound availability to trusted circles. Live iOS activities, widgets, and Supabase Realtime synchronization.',
    url: 'https://franekjemiolo.github.io/vicin',
    siteName: 'Vicin',
    images: [
      {
        url: '/assets/02_active_feed.svg',
        width: 1200,
        height: 630,
        alt: 'Vicin Live Availability Feed',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vicin — Spontaneous Neighborhood Availability',
    description:
      'Passive, closed-loop availability broadcasts for trusted circles without the friction of group chats.',
    images: ['/assets/02_active_feed.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
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

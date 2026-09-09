import React from 'react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-6">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        Vicin Availability Engine
      </div>
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-2xl bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
        Spontaneous connection without the group chat noise.
      </h1>
      <p className="mt-4 text-lg text-slate-400 max-w-xl">
        Broadcast your time-bound availability to trusted neighbors, dorms, and coworker pods. Zero
        scheduling friction.
      </p>
    </main>
  );
}

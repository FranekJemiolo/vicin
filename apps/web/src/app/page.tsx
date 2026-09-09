'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface DemoBroadcast {
  id: string;
  name: string;
  emoji: string;
  activity: string;
  duration: string;
  note: string;
  timeRemaining: string;
  acks: number;
  userAcked: boolean;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'create'>('feed');
  const [selectedActivity, setSelectedActivity] = useState<{ emoji: string; name: string }>({
    emoji: '☕',
    name: 'Coffee Break',
  });
  const [selectedDuration, setSelectedDuration] = useState('45m');
  const [customNote, setCustomNote] = useState('');

  const [broadcasts, setBroadcasts] = useState<DemoBroadcast[]>([
    {
      id: '1',
      name: 'Bob Martinez',
      emoji: '☕',
      activity: 'Coffee Break',
      duration: '45m',
      note: 'At Joe Coffee on the corner, laptop open!',
      timeRemaining: '38m left',
      acks: 2,
      userAcked: false,
    },
    {
      id: '2',
      name: 'Alice Chen',
      emoji: '🐕',
      activity: 'Dog Walk',
      duration: '30m',
      note: 'Heading to Washington Square Park with Milo',
      timeRemaining: '19m left',
      acks: 1,
      userAcked: true,
    },
  ]);

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const newBc: DemoBroadcast = {
      id: Date.now().toString(),
      name: 'You',
      emoji: selectedActivity.emoji,
      activity: selectedActivity.name,
      duration: selectedDuration,
      note: customNote || 'Available now in the neighborhood!',
      timeRemaining: selectedDuration + ' left',
      acks: 0,
      userAcked: false,
    };
    setBroadcasts([newBc, ...broadcasts]);
    setCustomNote('');
    setActiveTab('feed');
  };

  const handleToggleAck = (id: string) => {
    setBroadcasts(prev =>
      prev.map(b => {
        if (b.id !== id) return b;
        return {
          ...b,
          userAcked: !b.userAcked,
          acks: b.userAcked ? b.acks - 1 : b.acks + 1,
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F8FAFC]">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090A0F]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse" />
            <span className="font-extrabold text-lg tracking-wider text-white">VICIN</span>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <a href="#features" className="text-slate-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#demo" className="text-slate-400 hover:text-white transition-colors">
              Interactive Demo
            </a>
            <a href="#screenshots" className="text-slate-400 hover:text-white transition-colors">
              Screenshots
            </a>
            <a
              href="https://github.com/FranekJemiolo/vicin"
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 hover:bg-white/15 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white transition-all border border-white/10"
            >
              GitHub ↗
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 px-6 sm:px-12 text-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-8">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Vicin availability engine • closed-loop & ephemeral
          </div>

          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-[1.1] mb-6">
            Spontaneous connection without the group chat noise.
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Passively broadcast time-bound availability to trusted neighbors, dorms, and coworker
            pods. Zero scheduling back-and-forth. Self-expiring pulses with 1-tap responses.
          </p>

          {/* App Store Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <div className="flex items-center gap-3 bg-[#12141C] border border-white/10 hover:border-emerald-500/40 px-5 py-3 rounded-2xl cursor-pointer transition-all shadow-xl">
              <span className="text-2xl"></span>
              <div className="text-left">
                <div className="text-[10px] uppercase font-semibold text-slate-400 leading-none">
                  Download on the
                </div>
                <div className="text-sm font-bold text-white">Apple App Store</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#12141C] border border-white/10 hover:border-emerald-500/40 px-5 py-3 rounded-2xl cursor-pointer transition-all shadow-xl">
              <span className="text-2xl">▶</span>
              <div className="text-left">
                <div className="text-[10px] uppercase font-semibold text-slate-400 leading-none">
                  Get it on
                </div>
                <div className="text-sm font-bold text-white">Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulator Section */}
      <section id="demo" className="py-20 px-6 sm:px-12 bg-[#0C0E14] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
              Try It Live
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Experience the Vicin Availability Loop
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              Test how spontaneous broadcasts and 1-tap acknowledgments work in real time.
            </p>
          </div>

          {/* Simulator Container */}
          <div className="bg-[#12141C] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-xl mx-auto shadow-2xl">
            {/* Simulator Header Tabs */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="font-bold text-white text-sm">Greenwich Village Pod</span>
              </div>
              <div className="flex bg-[#1A1D27] p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setActiveTab('feed')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'feed'
                      ? 'bg-emerald-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Live Feed ({broadcasts.length})
                </button>
                <button
                  onClick={() => setActiveTab('create')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'create'
                      ? 'bg-emerald-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  + Broadcast
                </button>
              </div>
            </div>

            {/* Tab: Feed */}
            {activeTab === 'feed' && (
              <div className="space-y-4">
                {broadcasts.map(b => (
                  <div
                    key={b.id}
                    className="bg-[#1A1D27]/90 border border-white/10 rounded-2xl p-4 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                          {b.name[0]}
                        </div>
                        <div>
                          <div className="text-white font-semibold text-xs">{b.name}</div>
                          <div className="text-slate-500 text-[10px]">{b.timeRemaining}</div>
                        </div>
                      </div>

                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    </div>

                    <div className="flex items-center gap-3 bg-[#12141C] p-3 rounded-xl mb-3">
                      <span className="text-2xl">{b.emoji}</span>
                      <div className="flex-1">
                        <div className="text-white font-bold text-xs">{b.activity}</div>
                        <div className="text-slate-400 text-[11px]">{b.note}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400 text-xs font-medium">
                        {b.acks > 0
                          ? `${b.acks} ${b.acks === 1 ? 'neighbor is in' : 'neighbors are in'}`
                          : 'No one has joined yet'}
                      </span>

                      <button
                        onClick={() => handleToggleAck(b.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          b.userAcked
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/10 hover:bg-white/15 text-slate-200'
                        }`}
                      >
                        {b.userAcked ? "✓ You're in!" : "I'm in"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Create */}
            {activeTab === 'create' && (
              <form onSubmit={handleCreateBroadcast} className="space-y-5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                    Pick an Activity
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { emoji: '☕', name: 'Coffee Break' },
                      { emoji: '🐕', name: 'Dog Walk' },
                      { emoji: '🍕', name: 'Quick Lunch' },
                      { emoji: '💻', name: 'Co-working' },
                    ].map(act => (
                      <button
                        key={act.name}
                        type="button"
                        onClick={() => setSelectedActivity(act)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                          selectedActivity.name === act.name
                            ? 'bg-emerald-500/20 border-emerald-500 text-white'
                            : 'bg-[#1A1D27] border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="text-lg">{act.emoji}</span>
                        <span>{act.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                    Availability Duration
                  </label>
                  <div className="flex gap-2">
                    {['15m', '30m', '45m', '1h', '2h'].map(dur => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setSelectedDuration(dur)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          selectedDuration === dur
                            ? 'bg-emerald-500 border-emerald-400 text-white'
                            : 'bg-[#1A1D27] border-white/5 text-slate-400'
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                    Optional Note
                  </label>
                  <input
                    type="text"
                    value={customNote}
                    onChange={e => setCustomNote(e.target.value)}
                    placeholder="e.g. In lobby lounge, coffee machine is on..."
                    className="w-full bg-[#1A1D27] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20"
                >
                  Broadcast to Greenwich Village Pod
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
            Why Vicin
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white">
            Designed for Trusted Physical Proximity
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#12141C] border border-white/10 rounded-3xl p-8 hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl mb-6">
              🔒
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Invite-Only Closed Loops</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              No public broadcast maps or open stranger directories. Circles require cryptographic
              deep-link invites verified via Postgres Row Level Security.
            </p>
          </div>

          <div className="bg-[#12141C] border border-white/10 rounded-3xl p-8 hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl mb-6">
              ⏱️
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Self-Expiring Pulses</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every broadcast has a hard timestamp. When your time is up, the broadcast quietly
              vanishes from the feed via automatic pg_cron cleanup.
            </p>
          </div>

          <div className="bg-[#12141C] border border-white/10 rounded-3xl p-8 hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl mb-6">
              ⚡
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Frictionless "I'm in"</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              No endless "Where are you?" or "When?" replies. A single tap signals you're joining,
              updating the broadcaster with zero chat fatigue.
            </p>
          </div>
        </div>
      </section>

      {/* Screenshot Gallery */}
      <section
        id="screenshots"
        className="py-20 px-6 sm:px-12 bg-[#0C0E14] border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
              Visual Tour
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              App Interface & User Flows
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                src: '/screenshots/01_login_screen.svg',
                title: 'Seamless Auth',
                desc: 'Minimalist sign-in with SSO',
              },
              {
                src: '/screenshots/02_active_feed.svg',
                title: 'Active Feed',
                desc: 'Realtime availability pulse',
              },
              {
                src: '/screenshots/03_create_broadcast.svg',
                title: '2-Tap Creator',
                desc: 'Pick activity & broadcast',
              },
              {
                src: '/screenshots/04_acknowledged_broadcast.svg',
                title: 'Live Activity & Acks',
                desc: 'Lock screen timer & 1-tap join',
              },
            ].map(item => (
              <div
                key={item.title}
                className="bg-[#12141C] border border-white/10 rounded-3xl p-4 overflow-hidden flex flex-col items-center shadow-xl hover:border-emerald-500/40 transition-all"
              >
                <div className="w-full aspect-[390/844] max-w-[240px] rounded-2xl overflow-hidden mb-4 border border-white/5 bg-[#090A0F]">
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={390}
                    height={844}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h4 className="text-white font-bold text-sm text-center">{item.title}</h4>
                <p className="text-slate-400 text-xs text-center mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 sm:px-12 bg-[#090A0F]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div>© 2026 Franek Jemiolo. Built with Expo, Supabase & Next.js.</div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <a
              href="https://github.com/FranekJemiolo/vicin"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

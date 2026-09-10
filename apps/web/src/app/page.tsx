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

  const [selectedCircle, setSelectedCircle] = useState<'greenwich' | 'nyu' | 'oakwood'>(
    'greenwich'
  );

  const [broadcastsByCircle, setBroadcastsByCircle] = useState<
    Record<'greenwich' | 'nyu' | 'oakwood', DemoBroadcast[]>
  >({
    greenwich: [
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
    ],
    nyu: [
      {
        id: '3',
        name: 'Jordan Lee',
        emoji: '🍕',
        activity: 'Late Night Pizza',
        duration: '40m',
        note: 'In floor 3 common room, 2 boxes left!',
        timeRemaining: '26m left',
        acks: 3,
        userAcked: false,
      },
      {
        id: '4',
        name: 'Maya Patel',
        emoji: '💻',
        activity: 'Study Session',
        duration: '2h',
        note: 'Bobst Library LL2 quiet cubicles',
        timeRemaining: '1h 15m left',
        acks: 2,
        userAcked: true,
      },
    ],
    oakwood: [
      {
        id: '5',
        name: 'David Ross',
        emoji: '🏃',
        activity: 'Morning Jog',
        duration: '30m',
        note: 'Doing the perimeter trail, easy pace',
        timeRemaining: '12m left',
        acks: 1,
        userAcked: false,
      },
    ],
  });

  const broadcasts = broadcastsByCircle[selectedCircle];

  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistNeighborhood, setWaitlistNeighborhood] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);

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
    setBroadcastsByCircle(prev => ({
      ...prev,
      [selectedCircle]: [newBc, ...prev[selectedCircle]],
    }));
    setCustomNote('');
    setActiveTab('feed');
  };

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes('@')) return;
    setWaitlistLoading(true);

    // Persist locally & simulate Supabase waitlist sync
    try {
      const stored = JSON.parse(localStorage.getItem('vicin_waitlist') || '[]');
      stored.push({
        email: waitlistEmail,
        neighborhood: waitlistNeighborhood || 'Unspecified',
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('vicin_waitlist', JSON.stringify(stored));
    } catch {
      // safe fallback in SSR or restricted environments
    }

    setTimeout(() => {
      setWaitlistLoading(false);
      setWaitlistSubmitted(true);
    }, 600);
  };

  const handleToggleAck = (id: string) => {
    setBroadcastsByCircle(prev => ({
      ...prev,
      [selectedCircle]: prev[selectedCircle].map(b => {
        if (b.id !== id) return b;
        return {
          ...b,
          userAcked: !b.userAcked,
          acks: b.userAcked ? b.acks - 1 : b.acks + 1,
        };
      }),
    }));
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

          {/* Circle Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {[
              { id: 'greenwich', name: '🏡 Greenwich Village Pod', members: '14 neighbors' },
              { id: 'nyu', name: '🎓 NYU Dorm Floor 3', members: '8 roommates' },
              { id: 'oakwood', name: '🌲 Oakwood Building 4', members: '22 residents' },
            ].map(circle => (
              <button
                key={circle.id}
                type="button"
                onClick={() => setSelectedCircle(circle.id as 'greenwich' | 'nyu' | 'oakwood')}
                className={`px-4 py-2 rounded-2xl border text-xs font-semibold transition-all flex items-center gap-2 ${
                  selectedCircle === circle.id
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
                    : 'bg-[#12141C] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{circle.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">({circle.members})</span>
              </button>
            ))}
          </div>

          {/* Simulator Grid (Feed + Live Activity Lock Screen Mockup) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            {/* Left Col: Main Interactive App Simulator */}
            <div className="lg:col-span-7 bg-[#12141C] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              {/* Simulator Header Tabs */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-white text-sm">
                    {selectedCircle === 'greenwich'
                      ? 'Greenwich Village Pod'
                      : selectedCircle === 'nyu'
                        ? 'NYU Dorm Floor 3'
                        : 'Oakwood Building 4'}
                  </span>
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
                    Broadcast to{' '}
                    {selectedCircle === 'greenwich'
                      ? 'Greenwich Village Pod'
                      : selectedCircle === 'nyu'
                        ? 'NYU Dorm Floor 3'
                        : 'Oakwood Building 4'}
                  </button>
                </form>
              )}
            </div>

            {/* Right Col: Interactive Lock Screen & Live Activity Preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[340px] bg-gradient-to-b from-[#1E2230] via-[#0E1017] to-[#090A0F] border-[6px] border-[#2A2E3D] rounded-[48px] p-5 shadow-2xl relative overflow-hidden">
                {/* Dynamic Island */}
                <div className="w-28 h-6 bg-black rounded-full mx-auto mb-6 flex items-center justify-between px-2.5 shadow-inner">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {broadcasts[0]?.emoji || '⚡'}
                  </span>
                </div>

                {/* Lock Screen Time */}
                <div className="text-center mb-6">
                  <div className="text-[11px] font-medium text-slate-400">
                    Wednesday, September 10
                  </div>
                  <div className="text-5xl font-extrabold tracking-tight text-white font-sans">
                    09:41
                  </div>
                </div>

                {/* Lock Screen Live Activity Card */}
                {broadcasts[0] ? (
                  <div className="bg-[#161925]/90 border border-emerald-500/30 rounded-3xl p-4 shadow-xl backdrop-blur-md transition-all">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          Vicin Live Pulse
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {broadcasts[0].timeRemaining}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#090A0F] border border-white/10 flex items-center justify-center text-xl">
                        {broadcasts[0].emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-xs truncate">
                          {broadcasts[0].activity}
                        </div>
                        <div className="text-slate-400 text-[10px] truncate">
                          {broadcasts[0].name} • {broadcasts[0].note}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[11px] text-slate-400">
                        {broadcasts[0].acks > 0
                          ? `${broadcasts[0].acks} in circle joined`
                          : 'Waiting for 1st neighbor'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleAck(broadcasts[0].id)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                          broadcasts[0].userAcked
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                            : 'bg-white/10 hover:bg-white/15 text-slate-200'
                        }`}
                      >
                        {broadcasts[0].userAcked ? "✓ I'm In" : "I'm In"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#12141C]/80 border border-white/10 rounded-2xl p-4 text-center">
                    <span className="text-xs text-slate-400">No active pulse right now</span>
                  </div>
                )}

                {/* Home Indicator */}
                <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mt-8 mb-1" />
              </div>

              <div className="mt-4 text-center">
                <div className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
                  <span> iOS Live Activities</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Broadcast status appears directly on Lock Screen & Dynamic Island
                </div>
              </div>
            </div>
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
                src: '/assets/01_login_screen.svg',
                title: 'Seamless Auth',
                desc: 'Minimalist sign-in with SSO',
              },
              {
                src: '/assets/02_active_feed.svg',
                title: 'Active Feed',
                desc: 'Realtime availability pulse',
              },
              {
                src: '/assets/03_create_broadcast.svg',
                title: '2-Tap Creator',
                desc: 'Pick activity & broadcast',
              },
              {
                src: '/assets/04_acknowledged_broadcast.svg',
                title: 'Live Activity & Acks',
                desc: 'Lock screen countdown & 1-tap join',
              },
              {
                src: '/assets/05_invite_generation.svg',
                title: 'Private Invites',
                desc: 'Deep link generation for trusted circles',
              },
              {
                src: '/assets/06_accept_invite.svg',
                title: 'Circle Onboarding',
                desc: 'Instant cryptographic verification',
              },
              {
                src: '/assets/07_multi_user_acknowledgment.svg',
                title: 'Multi-User Pulse',
                desc: 'Real-time neighbor participation sync',
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

      {/* Join Waitlist Section */}
      <section id="waitlist" className="py-24 px-6 sm:px-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-6">
            Early Access Alpha
          </div>

          <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Bring Vicin to Your Neighborhood
          </h3>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Get early access to our iOS TestFlight & Android builds for your apartment building,
            dormitory floor, or local street circle.
          </p>

          {waitlistSubmitted ? (
            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 text-xl font-bold flex items-center justify-center mx-auto mb-3">
                ✓
              </div>
              <h4 className="text-lg font-bold text-white mb-1">You're on the list!</h4>
              <p className="text-emerald-300 text-xs leading-relaxed">
                We'll email you an invite when Vicin launches in{' '}
                {waitlistNeighborhood || 'your area'}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleJoinWaitlist} className="space-y-3 text-left">
              <div>
                <label className="block text-[11px] uppercase font-semibold text-slate-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={e => setWaitlistEmail(e.target.value)}
                  placeholder="alex@neighborhood.org"
                  className="w-full bg-[#12141C] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-semibold text-slate-400 mb-1.5">
                  Neighborhood or Circle Name
                </label>
                <input
                  type="text"
                  value={waitlistNeighborhood}
                  onChange={e => setWaitlistNeighborhood(e.target.value)}
                  placeholder="e.g. Oakwood Building 4, NYU Dorm 7B"
                  className="w-full bg-[#12141C] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={waitlistLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 mt-2"
              >
                {waitlistLoading ? 'Submitting...' : 'Request Early Access ↗'}
              </button>
            </form>
          )}
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

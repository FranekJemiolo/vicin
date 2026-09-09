import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#090A0F] text-[#F8FAFC] py-16 px-6 sm:px-12 max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 mb-8"
      >
        ← Back to Vicin Home
      </Link>

      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
      <p className="text-xs text-slate-500 mb-10">Last updated: September 10, 2026</p>

      <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
        <section className="border-b border-white/10 pb-6">
          <h2 className="text-xl font-bold text-white mb-3">1. Privacy Philosophy</h2>
          <p>
            Vicin is engineered around **ephemeral availability** and **strict closed-loop
            privacy**. We believe your daily availability is only the business of people in your
            designated circles (neighbors, dorms, teammates). Broadcasts self-destruct upon
            expiration and are never sold, indexed, or shared with third parties.
          </p>
        </section>

        <section className="border-b border-white/10 pb-6">
          <h2 className="text-xl font-bold text-white mb-3">2. Data We Collect</h2>
          <ul className="list-disc list-inside space-y-2 text-slate-400">
            <li>
              <strong className="text-slate-200">Account Information:</strong> Name, email, and
              optional profile avatar when registering via email or OAuth SSO.
            </li>
            <li>
              <strong className="text-slate-200">Ephemeral Broadcasts:</strong> Time-bound status
              updates, duration timestamps, and optional text notes. All broadcasts automatically
              expire and vanish from the active feed.
            </li>
            <li>
              <strong className="text-slate-200">Push Tokens:</strong> Device tokens for Expo Push
              Notifications, used strictly to notify members of new availability when enabled.
            </li>
          </ul>
        </section>

        <section className="border-b border-white/10 pb-6">
          <h2 className="text-xl font-bold text-white mb-3">
            3. Database Security & Tenant Isolation
          </h2>
          <p>
            All data access is enforced at the PostgreSQL engine level using strict **Row Level
            Security (RLS)**. Group members cannot query, read, or infer broadcasts from groups they
            do not belong to.
          </p>
        </section>

        <section className="border-b border-white/10 pb-6">
          <h2 className="text-xl font-bold text-white mb-3">
            4. Account Deletion & Right to be Forgotten
          </h2>
          <p>
            You can delete your account at any time directly in the Vicin mobile application
            settings. Upon account deletion, all personal data, memberships, broadcasts, and
            acknowledgments are permanently and immediately cascade-deleted from our databases in
            compliance with GDPR and Apple App Store requirements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. Contact Us</h2>
          <p>
            If you have questions regarding this privacy policy or your data rights, reach out to us
            at <span className="text-emerald-400 font-mono">privacy@vicin.app</span>.
          </p>
        </section>
      </div>
    </main>
  );
}

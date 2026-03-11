"use client";

import Link from "next/link";

export default function Footer() {

  return (

    <footer className="border-t border-slate-800 mt-12 py-8 text-center text-sm text-slate-400">

      <div className="max-w-4xl mx-auto px-6">

        <p className="mb-4 leading-relaxed">

          AlphaScanAI provides algorithmic market analysis and AI-generated insights
          for educational and informational purposes only. The platform does not
          provide financial, investment, or trading advice. Users should conduct
          their own research or consult a licensed financial advisor before making
          any investment decisions.

        </p>

        <div className="flex justify-center gap-6 text-yellow-400 font-medium">

          <Link href="/how-to-use">How to Use</Link>

          <Link href="/privacy-policy">Privacy Policy</Link>

          <Link href="/terms">Terms</Link>

          <Link href="/contact">Contact</Link>

        </div>

        <p className="mt-4 text-slate-500">
          © 2026 AlphaScanAI. All rights reserved.
        </p>

      </div>

    </footer>

  );
}
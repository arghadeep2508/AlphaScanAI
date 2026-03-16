import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlphaScanAI",
  description: "AI powered stock market analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <div style={{ display: "flex", minHeight: "100vh" }}>

          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

            <main style={{ flex: 1, padding: "20px" }}>
              {children}
            </main>

            {/* Footer */}
            <Footer />

          </div>

        </div>

      </body>
    </html>
  );
}

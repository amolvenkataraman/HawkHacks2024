'use client'

import "~/styles/globals.css";
import Navbar from './navbar';

import { GeistSans } from "geist/font/sans";
import { AuthProvider } from "@propelauth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider authUrl="https://25870074.propelauthtest.com">
      <html lang="en" className={`${GeistSans.variable}`}  >
        <body className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
          <Navbar />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}

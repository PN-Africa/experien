import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HideOnAdmin from "@/components/layout/HideOnAdmin";
import PageShell from "@/components/layout/PageShell";
import { AuthProvider } from "@/components/auth/AuthProvider";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "Experien",
  description: "Industry-specific project management training",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <AuthProvider>
          <HideOnAdmin><Navbar /></HideOnAdmin>
          <PageShell>{children}</PageShell>
          <HideOnAdmin><Footer /></HideOnAdmin>
        </AuthProvider>
      </body>
    </html>
  );
}

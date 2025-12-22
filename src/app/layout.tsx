import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "e-Voting Kampus",
  description: "Sistem E-Voting untuk Pemilihan Ketua & Wakil Ketua BEM",
  keywords: ["e-voting", "pemilu", "kampus", "BEM"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.variable}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

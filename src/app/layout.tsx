import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Contas a Receber",
  description: "Controle de contas a receber da clínica veterinária",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0b8660",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${dmSans.variable} ${fraunces.variable} font-sans antialiased`}>
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1.5 bg-gradient-to-r from-teal-400 via-coral-400 to-sky-400"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

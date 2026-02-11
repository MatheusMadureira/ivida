import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { InactivityProvider } from "@/contexts/InactivityContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IVIDA",
  description:
    "Igreja Vivendo Intensamente o Discipulado em Amor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${dmSans.variable} font-sans bg-[#151515] text-white min-h-screen`}>
        <AuthProvider>
          <InactivityProvider>{children}</InactivityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

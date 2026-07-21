import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { PublicLayoutWrapper } from "@/components/layout/PublicLayoutWrapper";
import { GlobalAssist } from "@/components/chat/GlobalAssist";
import { createMetadata } from "@/lib/metadata";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = createMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} flex min-h-screen flex-col font-sans`}>
        <Providers>
          <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
          <GlobalAssist />
        </Providers>
      </body>
    </html>
  );
}

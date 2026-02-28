import type { Metadata } from "next";
import { Nunito, Baloo_2, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

const GA_ID = "G-51H6XNELTW";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const baloo2 = Baloo_2({
  variable: "--font-baloo2",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "Explain Like I Am 5",
    template: "%s | Explain Like I Am 5",
  },
  description:
    "Get fun, simple explanations of complex topics from unique AI personas — a curious 5-year-old, a pirate captain, a comedian, and more.",
  openGraph: {
    title: "Explain Like I Am 5",
    description:
      "Get fun, simple explanations of complex topics from unique AI personas.",
    type: "website",
  },
};

export const viewport = {
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
      <body
        className={`${nunito.variable} ${baloo2.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={300}>
            {children}
            <Toaster position="top-center" richColors />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

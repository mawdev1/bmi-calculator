import type { Metadata } from "next";
import "./globals.css";
import Script from 'next/script'

export const metadata: Metadata = {
  title: "BMI Calculator",
  description: "Calculate your Body Mass Index (BMI) quickly and easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9949461885988066'
          crossOrigin='anonymous'
          strategy='afterInteractive'
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        {children}
        {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && (
          <>
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
              crossOrigin='anonymous'
              strategy='afterInteractive'
            />
            <Script id="adsense-init" strategy="afterInteractive">
              {`
                (adsbygoogle = window.adsbygoogle || []).push({
                  google_ad_client: "${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}",
                  enable_page_level_ads: true
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}

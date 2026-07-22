import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Little Closet - Premium Children's Clothing",
    template: "%s | Little Closet",
  },
  description: "Shop premium children's clothing at Little Closet. Trendy, comfortable, and affordable fashion for kids of all ages.",
  keywords: ["kids clothing", "children fashion", "baby clothes", "kids wear", "boys clothing", "girls clothing"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Little Closet",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className} style={{ colorScheme: "light" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

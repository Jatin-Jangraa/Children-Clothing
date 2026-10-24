import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Providers from "@/providers";
import "./globals.css";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins"
});

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
        <meta name="theme-color" content="#FFF1DC" />
      </head>
      <body className={poppins.className} style={{ colorScheme: "light" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

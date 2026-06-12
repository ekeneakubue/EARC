import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EARC | Education And Research Consortium",
  description:
    "EARC is a multidisciplinary research, education, and development organization advancing evidence-based decision-making, capacity development, and sustainable community transformation across Africa and beyond.",
  keywords: [
    "research",
    "education",
    "monitoring and evaluation",
    "capacity development",
    "data analytics",
    "Africa",
    "EARC",
  ],
  openGraph: {
    title: "Education And Research Consortium (EARC)",
    description:
      "Transforming data into knowledge, knowledge into action, and action into lasting impact.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}

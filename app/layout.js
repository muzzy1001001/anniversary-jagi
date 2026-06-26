import { Gochi_Hand, Nunito } from "next/font/google";
import "./globals.css";

const gochiHand = Gochi_Hand({
  variable: "--font-gochi",
  subsets: ["latin"],
  weight: ["400"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Our Story 🤎",
  description: "June 2025 – June 2026 · 1 Year Together",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${gochiHand.variable} ${nunito.variable} antialiased`}>
      <body className="min-h-screen bg-cream">{children}</body>
    </html>
  );
}

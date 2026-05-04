import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pizza Mary | Menú de mesa",
  description: "Menú de mesa Pizza Mary - Aguada. Pizzas, pastas, hamburguesas, bebidas y más.",
  keywords: ["Pizza Mary", "menú", "Aguada", "pizza", "restaurante", "Cuba"],
  authors: [{ name: "TwinCode Service" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Pizza Mary | Menú de mesa",
    description: "Menú de mesa Pizza Mary - Aguada",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}

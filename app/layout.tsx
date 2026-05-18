import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Laboratorium Atmosfer",
  description: "Media Pembelajaran Atmosfer Spasial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${outfit.variable} dark antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex text-on-background bg-background font-body-md overflow-x-hidden">
        <div className="ambient-bg"></div>
        <Sidebar />
        <main className="flex-1 flex flex-col w-full min-h-screen relative overflow-y-auto p-container-padding gap-6">
          <Header />
          <div className="flex-grow flex flex-col gap-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}

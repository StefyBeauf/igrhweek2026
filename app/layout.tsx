import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IGRH Week – Espace Formateurs",
  description: "Toutes les infos du séminaire, en 2 clics.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground md:flex-row">
        <Navigation />
        <main className="flex-1 pb-20 md:pb-0">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}

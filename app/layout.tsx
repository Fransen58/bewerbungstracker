import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { themeInitScript } from "@/lib/theme-script";
import { langInitScript } from "@/lib/lang-script";
import { DocumentLang } from "@/components/document-lang";
import { messages, DEFAULT_LANG } from "@/messages";

// Prerendered HTML uses the default language; the client switches if needed.
const t = messages[DEFAULT_LANG];

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The title is set by <DocumentLang />, so it follows the language.
export const metadata: Metadata = {
  description: t.app.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply the theme before first paint, so there is no light flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Hide German texts until an English choice is applied. */}
        <script dangerouslySetInnerHTML={{ __html: langInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <DocumentLang />
        <SiteHeader />
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pt-6 pb-16 md:px-8">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

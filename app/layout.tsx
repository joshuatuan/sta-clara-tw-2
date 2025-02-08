import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { getUser } from "@/lib/data-service";
import type React from "react"; // Added import for React

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Multiple Activities App",
  description:
    "A web application showcasing multiple activities, built as part of a job application process.",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="flex min-h-screen flex-col">
            <nav className="flex h-16 w-full items-center justify-center border-b border-b-foreground/10">
              <div className="flex w-full max-w-[100rem] items-center justify-center px-4 sm:justify-start">
                <Link
                  className="p-2 text-lg font-semibold md:text-xl"
                  href={"/"}
                >
                  Multiple Activities App
                </Link>
              </div>
            </nav>
            {/* <div className="mt-10">{user && <NavLinks />}</div> */}
            <div className="">{children}</div>
            <footer className="w-full border-t">
              <div className="mx-auto flex max-w-[100rem] flex-col items-center px-4 py-8 sm:flex-row sm:justify-between">
                <p className="text-sm">
                  Made by <strong>Joshua Miguel Tuan</strong>
                </p>
                <ThemeSwitcher />
              </div>
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

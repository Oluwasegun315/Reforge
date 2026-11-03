import type { Metadata } from "next";
import { Space_Grotesk, Syne } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

const body = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "RepForge — Build Your Best Self",
    template: "%s · RepForge",
  },
  description:
    "Free-first bodybuilding and fitness companion for adults 18+. Discover exercises, build workouts, time sessions, and track progress.",
  applicationName: "RepForge",
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;var t=localStorage.getItem('repforge.theme');var m=t==='light'?'light':'dark';d.classList.remove('light','dark');d.classList.add(m);d.dataset.theme=m;d.style.colorScheme=m;}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${body.variable} ${display.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <Navbar />
            <main id="main">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

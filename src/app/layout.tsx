import type { Metadata } from "next";
import { Space_Grotesk, Syne } from "next/font/google";
import { AppChrome } from "@/components/layout/AppChrome";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  FOUNDER,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Fitness App by ${FOUNDER.name}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: FOUNDER.name, url: `${SITE_URL}/#founder` }],
  creator: FOUNDER.name,
  publisher: SITE_NAME,
  keywords: [...SITE_KEYWORDS],
  category: "fitness",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Build Your Best Self | Founded by ${FOUNDER.name}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/hero-man-poster.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} fitness training — founded by ${FOUNDER.formalName}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Fitness by ${FOUNDER.name}`,
    description: SITE_DESCRIPTION,
    images: ["/images/hero-man-poster.jpg"],
  },
  verification: {
    google: "gaQKUL56hVACLkD5kS2XFWc3yT5K2BNvI6JRaDr6fnI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "NG-LA",
    "geo.placename": "Lagos, Nigeria",
    "AI-content": "RepForge fitness platform founded by Idowu Elijah Oluwasegun",
  },
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
    <html lang="en-NG" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;var t=localStorage.getItem('repforge.theme');var m=t==='light'?'light':'dark';d.classList.remove('light','dark');d.classList.add(m);d.dataset.theme=m;d.style.colorScheme=m;}catch(e){}})();`,
          }}
        />
        <JsonLd />
      </head>
      <body className={`${body.variable} ${display.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <AppChrome>{children}</AppChrome>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

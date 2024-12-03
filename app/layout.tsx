import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styling/globals.css";
import theme from "@/theme/theme";
import { ThemeProvider } from "@mui/material";
import Head from "next/head";
import BugReportSection from "@/features/sections/BugReport";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Script from "next/script";
// import ReactQueryProvider from "@/utils/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GO eknihovna",
  description: "Školní knihovna Gymnázia Opatov",
  applicationName: "GO eknihovna",
  keywords: ["knihovna","gymnázium opatov", "eknihovna", "gymnázium", "opatov", "GO"],
  creator: "Ondřej Lukeš",
  publisher: "Ondřej Lukeš",
  icons: "/icon/bookLogo.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cz">
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NWF34JRK');
            `,
        }}
      />
      <Head>
        {/* Primary Favicon */}
        <link rel="icon" type="image/x-icon" href="/icon/bookLogo.ico" />

        {/* Optional: Additional Favicons for Different Sizes*/}
        <link rel="icon" type="image/png" sizes="16x16" href="/icon/bookLogo.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon/bookLogo.ico" />

        {/* Optional: Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icon/bookLogo.ico" />

        {/* Optional: Manifest File */}
        <link rel="icon" href="/icon/bookLogo.ico" />
        <meta
          name="google-site-verification"
          content="hjQ9ZFX153H0STRp1SFSLiakzbOMsi_S6s4jPvNKKJA"
        />
        {/* Optional: Theme Color */}
        <meta name="theme-color" content="#413330" />
        <title>Školní eknihovna GO</title>
        <meta name="description" content="Vyberte si z 3000 kvalitních titulů!" />
      </Head>
      <body className={inter.className}>
      <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NWF34JRK"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <ThemeProvider theme={theme}>
          <Hero />
          <main className="flex min-h-screen flex-col items-center justify-between pt-12">
            {children}
          </main>
          <BugReportSection />
          <Footer />
        </ThemeProvider>
        {/* </ReactQueryProvider   > */}
      </body>
    </html>
  );
}

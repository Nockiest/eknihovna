import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styling/globals.css";
import theme from "@/theme/theme";
import { ThemeProvider } from "@mui/material";
import Head from "next/head";
import BugReportSection from "@/features/sections/BugReport";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
// import ReactQueryProvider from "@/utils/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GO eknihovna",
  description: "Školní knihovna Gymnázia Opatov",
  applicationName: 'GO eknihovna',
  keywords: ['knihovna', 'eknihovna', 'gymnázium', "opatov", "GO"],
  creator: "Ondřej Lukeš",
  publisher: "Ondřej Lukeš",
  icons: "/img/loga/bookLogo.png"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cz">
      <Head>
        {/* Primary Favicon */}
        <link rel="icon" type="image/x-icon" href="/icon/GO.ico" />

        {/* Optional: Additional Favicons for Different Sizes */}
        <link rel="icon" type="image/png" sizes="16x16" href="/icon/GO.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon/GO.ico" />

        {/* Optional: Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icon/GO.ico" />

        {/* Optional: Manifest File */}
        <link rel="manifest" href="/icon/GO-manifest.json" />

        <meta name="google-site-verification" content="hjQ9ZFX153H0STRp1SFSLiakzbOMsi_S6s4jPvNKKJA" />
        {/* Optional: Theme Color */}
        <meta name="theme-color" content="#413330" />
      </Head>
      <body className={inter.className}>
        {/* <ReactQueryProvider   > */}
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

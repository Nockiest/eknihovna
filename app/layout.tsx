import type { GetServerSideProps, Metadata } from "next";
import { Inter } from "next/font/google";
import "./styling/globals.css";
import theme from "@/theme/theme";
import { ThemeProvider } from "@mui/material";
import dynamic from "next/dynamic";

import Head from "next/head";
import BugReportSection from "@/components/sections/BugReport";
import SessionWrapper from "@/components/SessionWrapper";
import Footer from "@/components/footer/Footer";
import Hero from "@/components/hero/Hero";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "G.O. eknihovna",
  description: "Školní knihovna Gymnázia Opatov",
};
const NoSSRHero = dynamic(() => import("@/components/hero/Hero"), {
  ssr: false,
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cz">

      <Head>
        {/* Primary Favicon */}
        <link rel="icon" type="image/x-icon" href="/bookLogo.ico" />

        {/* Optional: Additional Favicons for Different Sizes */}
        <link rel="icon" type="image/png" sizes="16x16" href="client/knihovna/public/icon/GO.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="client/knihovna/public/icon/GO.ico" />

        {/* Optional: Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="client/knihovna/public/icon/GO.ico" />

        {/* Optional: Manifest File */}
        <link rel="manifest" href="client/knihovna/public/icon/GO.ico" />

        {/* Optional: Theme Color */}
        <meta name="theme-color" content="#413330" />
      </Head>
      <body className={inter.className}>

      {/* <QueryContextProvider> */}
        <ThemeProvider theme={theme}  >

        {/* <SessionWrapper > */}
<Hero />
          {/* <NoSSRHero /> */}

          <main className="flex min-h-screen flex-col items-center justify-between  pt-12">

            {children}
          </main>
          <BugReportSection />

          <Footer />
        </ThemeProvider>
        {/* </QueryContextProvider> */}
      </body>

    </html>
  );
}

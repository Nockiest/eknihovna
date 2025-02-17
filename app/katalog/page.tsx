import CatalogPageContents from "@/app/katalog/CatalogPageContents";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import CatalogContextProvider from "./CatalogContextProvider";
export const metadata: Metadata = {
  title: "Katalog v GO eknihovny",
  description: "Prohl0dn2te si katalog knih v GO knihovně",
  applicationName: "GO eknihovna",
  keywords: ["knihovna", "eknihovna", "gymnázium", "opatov", "GO"],
  creator: "Ondřej Lukeš",
  publisher: "Ondřej Lukeš",
  icons: "/icon/bookLogo.ico",
};
// provides contex for the while page
const KatalogPage = () => {
  return (
    <CatalogContextProvider>

      <Analytics />
      <CatalogPageContents />
      </CatalogContextProvider>


  );
};

export default KatalogPage;

// Server-Side Logic
// export async function getServerSideProps(context) {
//   const { res } = context;

//   // Prefetch or fetch data for the target page
//   const prefetchData = await fetch('https://eknihvona.vercel.app').then((res) =>
//     res.json()
//   );

//   // Example: Redirect directly to the target page (uncomment if needed)
//   // if (shouldRedirect) {
//   //   res.writeHead(302, { Location: '/target-page' });
//   //   res.end();
//   //   return { props: {} };
//   // }

//   return {
//     props: {
//       prefetchData,
//     },
//   };
// }

import CatalogPageContents from "@/components/CatalogPageContents";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Katalog v GO eknihovny",
  description: "Prohl0dn2te si katalog knih v GO knihovně",
};
// provides contex for the while page
const KatalogPage = () => {
  return (
    <>
      <Analytics />
      <CatalogPageContents />
    </>
  );
};

export default KatalogPage;

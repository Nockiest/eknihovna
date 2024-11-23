import CatalogPageContents from "@/components/CatalogPageContents";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Katalog v GO knihovny",
  description: "Prohl96e4 knih v GO knihovn2",
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

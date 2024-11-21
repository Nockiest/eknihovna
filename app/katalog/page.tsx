import CatalogPageContents from "@/components/CatalogPageContents";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Katalog v G.O. knihovny",
  description: "Prohl96e4 knih v GO knihovn2",
};
// provides contex for the while page
const KatalogPage = () => {

  return <CatalogPageContents />
};

export default KatalogPage;

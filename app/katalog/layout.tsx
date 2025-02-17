import React from "react";
import CatalogContextProvider from "./CatalogContextProvider";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <CatalogContextProvider>{children}</CatalogContextProvider>;
};

export default layout;

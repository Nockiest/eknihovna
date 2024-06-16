"use client";
import BookCatalog from "@/components/Catalog";
import { Book } from "@/types/types";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const CatalogPage = () => {
  const [shownBooks, setShownBooks] = useState<Book[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3002/bookList", { params: { query: "" } })
      .then((response: any) => {
        const data = response.data;
        if (data === null) {
          return;
        }

        setShownBooks(data.rows);
      })
      .catch((error: any) => {
        throw new Error(`problem with fetching data ${error} `);
      });
  }, []);

  return (
    <Box>
      <Typography variant={"h2"}>Katalog</Typography>
      <BookCatalog shownBooks={shownBooks} />
    </Box>
  );
};

export default CatalogPage;

"use client";
import BookPreview from "@/components/BookPreview";
import { Book } from "@/types/types";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Katalog = () => {
  const [shownBooks, setShownBooks] = useState<Book[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3002/bookList", { params: { query: '' } })
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
      <Typography variant={'h2'}>Katalog</Typography>
      {shownBooks.length > 0 && (
        <table
          style={{
            width: "100%",
            zIndex: -1,
            backgroundColor: "#f7f6f2",
            padding: "0.25em",
            maxHeight: "500px",
          }}
        >
          <tbody>
            {shownBooks.map((shownBook, key) => {
              return <BookPreview key={key}  book={shownBook} />;
            })}
          </tbody>
        </table>
      )}
    </Box>
  );
};

export default Katalog;

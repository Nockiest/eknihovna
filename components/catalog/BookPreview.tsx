"use client";
import { truthyValues } from "@/data/values";
import theme from "@/theme/theme";
import { Book } from "@/types/types";
import { Box, Paper, Typography } from "@mui/material";
import Image from "next/image";
import React, { useEffect } from "react";
import Filter from "./Filter";
import { useTheme } from "@emotion/react";
import BookCover from "./BookCover";
import StarRow from "../general/starRow/StarRow";

type BookPreviewProps = {
  book: Book;
};
const BookPreview: React.FC<BookPreviewProps> = ({ book }) => {
  const {
    bookCoverURL = "",
    available = false,
    author = "Autor neznámý",
    name = "Neznámé jméno",
    genres = [],
    formaturita = false,
    rating = -1,
  } = book;

  return (
    <Paper
      className={`w-auto flex-grow text-text-50 ${
        truthyValues.includes(available)
          ? "opacity-100 bg-primary-800"
          : "opacity-50 bg-secondary-800"
      }`}
      sx={{ color: theme.palette.text.primary }}
    >
      <Box p={2}>
        <BookCover />
        <Typography variant="h6" align="center">
          {" "}
          {name}
        </Typography>


        {genres.length > 0 && (
          <Box>
            <br />
            {genres.map((gen, key) => (
              <Filter text={gen} key={key} />
            ))}
          </Box>
        )}
        <Typography variant="body1">Autor: {author}</Typography>
        <br />
        <Typography variant="body1">
          {truthyValues.includes(available) ? "Dostupný" : "Nedostupný"}
        </Typography>
        <br />
        {/* <Typography variant="body1">
          {formaturita ? "Maturitní" : ""}
        </Typography> */}
        {/* <br /> */}

        <StarRow rating={rating} />
        {/* <Typography variant="body1">Hodnocení: {rating}/100 </Typography> */}
        <br />
      </Box>
    </Paper>
  );
};
export default BookPreview;

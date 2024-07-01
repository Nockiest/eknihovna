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
      className={`w-auto h-full flex flex-col items-center  relative flex-grow text-text-50`}
      sx={{
        opacity: truthyValues.includes(available) ? "1" : "0.5",
        backgroundColor: truthyValues.includes(available)
          ? theme.palette.background.default
          : theme.palette.error.main,
        color: theme.palette.text.primary,
        maxWidth: "311px",
      }}
    >
      <Box p={2} className=" flex flex-col items-center justify-between h-full">
        <BookCover />
        <Typography variant="h6" align="center">
          {" "}
          {name}
        </Typography>
        <br />

        <Box>
          {genres && genres.length > 0 && (
            <Box>
              <br />
              {genres.map((gen, key) => (
                <Filter text={gen} key={key} />
              ))}
            </Box>
          )}
        </Box>
        <Typography variant="body1">Autor: {author}</Typography>

        <Box className="flex flex-col items-center  ">
          <Typography variant="body2">Hodnocení Studentů</Typography>
          <StarRow rating={rating} />
        </Box>
        <br />
        <Typography
          className="absolute bottom-2 right-2"
          sx={{ opacity: "1" , color: theme.palette.text.secondary}}
          variant="body1"
        >
          {truthyValues.includes(available) ? "Dostupný" : "Nedostupný"}
        </Typography>
      </Box>
    </Paper>
  );
};
export default BookPreview;

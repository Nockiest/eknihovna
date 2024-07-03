"use client";
import { truthyValues } from "@/data/values";
import theme from "@/theme/theme";
import { Book } from "@/types/types";
import { Box, Paper, Typography } from "@mui/material";
import Image from "next/image";
import React, { useEffect } from "react";
import Filter from "./CategoryChip";
import { useTheme } from "@emotion/react";
import BookCover from "./BookCover";
import StarRow from "../general/starRow/StarRow";
import CategoryChip from "./CategoryChip";
import LineWithCircle from "../general/LineWithCircle";

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
      className={`w-auto h-full items-center  relative flex-grow `}
      sx={{
        opacity: truthyValues.includes(available) ? "1" : "0.5",
        border: truthyValues.includes(available)? `2px solid ${theme.palette.primary.main}`: 0,
        color: theme.palette.text.primary,
        maxWidth: "311px",
      }}
    >
      <Box
        p={2}
        className=" flex flex-col items-center justify-around h-full"
      >
        <BookCover width={"200px"} />
        <Typography variant="h6" align="center">
          {name}
        </Typography>
        <Typography variant="body1" align="center">
          {author ? author : "Neznámý autor"}
        </Typography>
        <LineWithCircle />
        <Box>
          <p> {genres?.length}</p>

          {genres && genres.length > 0 && (
            <Box>
              <br />
              {genres.map((gen, key) => (
                <CategoryChip text={gen} key={key} />
              ))}
            </Box>
          )}
        </Box>
        {/* <Box className="flex flex-col items-center w-full  ">
          <Typography variant="body2">Hodnocení Studentů</Typography> */}
        <StarRow rating={rating} />
        {/* </Box> */}
        {/* <br />
        <Typography
          className="absolute bottom-2 right-2"
          sx={{ opacity: "1" , color: theme.palette.text.secondary}}
          variant="body1"
        >
          {truthyValues.includes(available) ? "Dostupný" : "Nedostupný"}
        </Typography> */}
      </Box>
    </Paper>
  );
};
export default BookPreview;

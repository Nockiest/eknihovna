import { truthyValues } from "@/data/values";
import theme from "@/theme/theme";
import { Book } from "@/types/types";
import { Box, Paper, Typography, useMediaQuery } from "@mui/material";
import Filter from "./CategoryChip";
import BookCover from "./BookCover";
import StarRow from "./starRow/StarRow";
import CategoryChip from "./CategoryChip";
import LineWithCircle from "../general/styling/LineWithCircle";

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
  }: Book = book;

  return (
    <Paper
      className={` h-[400px] mx-auto w-[260px] items-center  `}
      sx={{
        opacity: truthyValues.includes(available) ? "1" : "0.5",
        border: truthyValues.includes(available)
          ? `2px solid ${theme.palette.primary.main}`
          : 0,
        color: theme.palette.text.primary,
      }}
    >
      <Box
        p={2}
        sx={{ backgroundColor: "#ffffff" }}
        className=" flex flex-col items-center justify-around h-full"
      >
        <BookCover width={"200px"} />
        <Box className=" flex grow-0 flex-col items-center justify-around w-full  ">
          <Typography variant="h6" align="center">
            {name}
          </Typography>
          <Typography variant="body1" align="center">
            {author ? author : "Neznámý autor"}
          </Typography>
          <LineWithCircle />
          <Box>
            {genres && genres.length > 0 && (
              <Box>
                {genres.map((gen, key) => (
                  <CategoryChip text={gen} key={key} />
                ))}
              </Box>
            )}
          </Box>
          {/* <Typography variant="body2">Hodnocení Studentů</Typography> */}
          {/* <StarRow rating={rating} /> */}
          {!available && <Typography variant="body1">Nedostupná</Typography>}
        </Box>
      </Box>
    </Paper>
  );
};
export default BookPreview;

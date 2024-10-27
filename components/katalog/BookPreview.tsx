import { truthyValues } from "@/data/values";
import theme from "@/theme/theme";
import { Book } from "@/types/types";
import { Box, Paper, Typography,  } from "@mui/material";
import Filter from "./CategoryChip";
import CategoryChip from "./CategoryChip";
import LineWithCircle from "../general/styling/LineWithCircle";
import { useRouter } from "next/navigation";
type BookPreviewProps = {
  book: Book;
};
const BookPreview: React.FC<BookPreviewProps> = ({ book }) => {
  const router = useRouter();
  const {
    id,
    available = false,
    author = "Autor neznámý",
    name = "Neznámé jméno",
    genres = [],
    formaturita = false,
    rating = -1,
    isbn = "x",
  }: Book = book;

  return (
    <Paper
    className={`h-[90%] absolute top-0 left-1/2 transform -translate-x-1/2 pl-0 pt-0 p-0 w-[140px] items-center cursor-pointer`}

      onClick={() => {
        router.push(`/katalog/${id}`);
      }}

      sx={{
        opacity: truthyValues.includes(available) ? "1" : "0.5",
        border: truthyValues.includes(available)
          ? `2px solid ${theme.palette.primary.main}`
          : 0,
        color: theme.palette.text.primary,
        padding: '0 0 0 0',
        margin: 0,  // Explicitly set margin to zero
      }}
    >
      <Box
        p={2}
        sx={{ backgroundColor: "#ffffff" }}
        className=" flex flex-col items-center justify-around h-full"
      >
        {/* <BookCover isbn={isbn} bookId={id} /> */}
        <Box className=" flex grow-0 flex-col items-center justify-around w-full  ">
          <Typography
            variant="body2"
            align="center"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%", // Set the width as needed
              fontWeight: "900",
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%", // Set the width as needed
            }}
          >
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
          {formaturita && <Typography variant="body2">Maturitní</Typography>}
          {!available && <Typography variant="body1">Nedostupná</Typography>}
        </Box>
      </Box>
    </Paper>
  );
};
export default BookPreview;

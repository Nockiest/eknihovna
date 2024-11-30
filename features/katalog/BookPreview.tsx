import { truthyValues } from "@/data/values";
import theme from "@/theme/theme";
import { Book } from "@/types/types";
import { Box, Paper, Typography } from "@mui/material";
import CategoryChip from "../../components/CategoryChip";
import LineWithCircle from "../../components/styling/LineWithCircle";
import { useRouter } from "next/navigation";
import { differenceInMonths } from "date-fns";
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
    createdat,
  }: Book = book;

  const isNew =
    createdat &&
    differenceInMonths(new Date(), new Date(createdat)) <= 1 &&
    new Date(createdat) > new Date("2024-11-24");

  return (
    <Paper
      className={`min-h-32 items-center cursor-pointer relative`}
      onClick={() => {
        router.push(`/katalog/${id}`);
      }}
      sx={{
        opacity: truthyValues.includes(available) ? "1" : "0.5",
        border: truthyValues.includes(available)
          ? `2px solid ${theme.palette.primary.main}`
          : 0,
        color: theme.palette.text.primary,
        padding: "0",
        margin: 0,
        width: "160px",
      }}
    >
      {isNew && (
        <Box
          sx={{
            position: "absolute",
            top: -15,
            left: 0,
            backgroundColor: theme.palette.secondary.main,
            color: "#fff",
            padding: "4px 8px",
            zIndex: 1,
          }}
        >
          Nová
        </Box>
      )}
      <Box
        p={2}
        sx={{ backgroundColor: "#ffffff" }}
        className="flex flex-col items-center justify-around h-full select-none"
      >
        <Box className="flex grow-0 flex-col items-center justify-around w-full">
          <Typography
            variant="body2"
            align="center"
            sx={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              textOverflow: "ellipsis",
              fontWeight: "900",
              width: "100%",
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
              width: "100%",
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
          {formaturita && <Typography variant="body2">Maturitní</Typography>}
          {!available && <Typography variant="body1">Vypůjčená</Typography>}
        </Box>
      </Box>
    </Paper>
  );
};

export default BookPreview;

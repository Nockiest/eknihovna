"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { Book } from "@/types/types";
import { PrimaryButton, SecondaryButton } from "@/theme/buttons/Buttons";

const BookDetailPage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
  const params = useParams();
  const router = useRouter();
  const id = params.id; // Get the dynamic part of the URL
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`${apiUrl}/bookList/${id}`)
        .then((res) => res.json())
        .then((data) => setBook(data));
    }
  }, [id]);

  if (!book)
    return (
      <Typography variant="h6" sx={{ color: "gray" }}>
        Načítání...
      </Typography>
    );

  return (
    <Box
      padding={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <SecondaryButton
        variant="contained"
        onClick={() => router.back()}
        sx={{ mb: 3 }}
      >
        Zpátky do katalogu
      </SecondaryButton>

      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 600,
          padding: 4,
          borderRadius: 3,
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, mb: 2, textAlign: "center" }}
        >
          {book.name || "N/A"}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Autor:</strong> {book.author || "N/A"}
          </Typography>{" "}
          <br />
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Kategorie:</strong> {book.category || "N/A"}
          </Typography>{" "}
          <br />
          {/* <Box sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>Žánr:</strong>{" "}
              {book.genres && book.genres.length > 0 ? (
                book.genres.map((genre, index) => (
                  <Typography
                    component="span"
                    key={genre}
                    variant="body2"
                    sx={{
                      color: "#1976d2",
                      fontWeight: "medium",
                    //   marginRight: index < book?.genres?.length - 1 ? 1 : 0,
                    }}
                  >
                    {genre}
                    {book.genres  &&  <p>index { book.genres.length - 1 && <>,</>}  </p>}
                  </Typography>
                ))
              ) : (
                "N/A"
              )}
            </Typography>
          </Box> */}
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>ISBN:</strong> {book.isbn || "N/A"}
          </Typography>
        </Box>
      </Paper>
      <PrimaryButton
        variant="contained"
        onClick={() => router.push(`/katalog/${id}/checkout`)}
          className="mt-3"
>
        Pujčit si knihu
      </PrimaryButton>
    </Box>
  );
};

export default BookDetailPage;

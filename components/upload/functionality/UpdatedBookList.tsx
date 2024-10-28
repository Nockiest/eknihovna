import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { Book } from "@/types/types"; // Ensure to import the Book type

const UpdatedBooksList = ({ updatedBooks }: { updatedBooks: Book[] }) => (
  <Box sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
    <Typography variant="h6" gutterBottom>
      Updated Books
    </Typography>
    {updatedBooks.map((updated, index) => (
      <Box
        key={updated.id}
        sx={{
          p: 2,
          borderRadius: 1,
          mb: 1,
        }}
      >
        <Box className='flex flex-wrap gap-2'    >
          {Object.entries(updated).map(([key, value]) => {
            const displayValue = `${value?.toString()?.slice(0, 15)}` // Shortened display with ellipsis

            return (
              <Box className='border-black h-auto'>
                <Typography variant="body2">
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                  {displayValue}
                </Typography>


              </Box>
            );
          })}
        </Box>
      </Box>
    ))}
  </Box>
);

export default UpdatedBooksList;

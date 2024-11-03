import { Box, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const BauerovaLink = () => {
  return (
    <Box
      className=" bg-primary-800"
      sx={{
        display: "flex",
        justifyContent: "center", // Centers the text horizontally
        alignItems: "center", // Centers the text vertically (optional)
        margin: "2em auto",
        padding: "2em 0",
        borderRadius: "2px",
        textAlign: "center", // Ensures the text itself is centered
      }}
    >
      <Typography variant="body1" textAlign="center" className="text-center">
        Pokud se chcete dozvědět více, nebo potřebujete poradit, stačí nám
        napsat na email:
        <br />

          <Link
            href="mailto:bauerova@gopat.cz"
            style={{ color: "light-blue", textDecoration: "none" }}
          >
             <b>bauerova@gopat.cz </b>
          </Link>

      </Typography>
    </Box>
  );
};

export default BauerovaLink;

"use client";
import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import Link from "next/link";
import BugReport from "@mui/icons-material/BugReport";
import CloseIcon from "@mui/icons-material/Close";
import { DangerButton } from "@/theme/buttons/Buttons";

const BugReportSection = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Box
      mt={2}
      className="mx-auto px-6 py-8 w-full bg-secondary-800"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      <IconButton
        aria-label="close"
        onClick={() => setVisible(false)}
        style={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <Typography align="center" variant="body2" gutterBottom>
        Aplikace je stále ve vývoji. Možné nápady a nalezené chyby můžeš
        zaznamenat na tomto linku.
      </Typography>
      <Link href="https://forms.gle/uU2rXgcin7aDjazk8" passHref>
        <DangerButton
          className="mx-auto"
          variant="outlined"
          color="secondary"
          style={{ marginTop: "16px", display: "flex", alignItems: "center" }}
        >
          Navrhnout vylepšení/Nahlásit problém <BugReport style={{ marginLeft: "8px" }} />
        </DangerButton>
      </Link>
    </Box>
  );
};

export default BugReportSection;

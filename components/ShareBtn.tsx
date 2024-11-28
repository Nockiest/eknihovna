import React from "react";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import { Box, Typography } from "@mui/material";

const ShareButton = () => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "GO knihovna má novou aplikaci",
          text: `Proč se na to mrknout?
          3000 knih na jednom místě
        Zjistěte snadno aktuální otevírací dobu knihovny
        Najděte knihy z maturitní četby během pár vteřin.`,
          url: "https://eknihovna.vercel.app", // Replace with your app's URL
        });
        console.log("App shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  return (
    <IconButton
      className="flex flex-col justify-center align-center"
      onClick={handleShare}
      color="primary"
      aria-label="share"
    >
      <ShareIcon />
      <Typography className="text-center" variant="body2">
        Sdílet
      </Typography>
    </IconButton>
  );
};

export default ShareButton;

'use client'
import useCurrentBreakpoint from "@/features/hooks/useCustomBreakpoint";
import { Typography } from "@mui/material";
import React from "react";

const GOMobileheader = () => {
  const size = useCurrentBreakpoint();
  return (
    <>
      {(size === "xs" || size === "sm") && (
        <Typography variant="h1" className="  text-center  " align="center">
          ŠKOLNÍ EKNIHOVNA GO
        </Typography>
      )}
    </>
  );
};

export default GOMobileheader;

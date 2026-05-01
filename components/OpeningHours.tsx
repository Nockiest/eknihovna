"use client";
import React, { useEffect, useState } from "react";
import { Typography, Box, Grid } from "@mui/material";
import { OpeningHour } from "@/types/types";

const DEFAULT_HOURS: OpeningHour[] = [
  { id: "monday",    day: "Pondělí", open: "13:30", close: "15:30" },
  { id: "tuesday",   day: "Úterý",   open: "13:05", close: "15:35" },
  { id: "wednesday", day: "Středa",  open: "13:30", close: "15:30" },
  { id: "thursday",  day: "Čtvrtek", open: "12:45", close: "16:45" },
  { id: "friday",    day: "Pátek",   open: "13:30", close: "14:00" },
];

const OpeningHours: React.FC = () => {
  const [hours, setHours] = useState<OpeningHour[]>(DEFAULT_HOURS);

  useEffect(() => {
    fetch("/api/openingHours")
      .then((r) => r.json())
      .then((data) => { if (data?.length) setHours(data); })
      .catch(console.error);
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Otevírací doba
      </Typography>
      <Grid container spacing={2}>
        {hours.map((item) => (
          <Grid key={item.id} item xs={12}>
            <Box border={1} p={2} borderRadius={4} height="100%" sx={{ cursor: "pointer" }}>
              <Typography sx={{ fontWeight: "bold"  }} variant="subtitle1" gutterBottom>
                {item.day}
              </Typography>
              <Typography variant="body1" >
                {item.open && item.close
                  ? `${item.open.replace(":", ".")} – ${item.close.replace(":", ".")}`
                  : "Zavřeno"}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OpeningHours;

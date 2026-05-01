"use client";
import React, { useEffect, useState, useTransition } from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import { OpeningHour } from "@/types/types";
import axios from "axios";

const DEFAULT_HOURS: OpeningHour[] = [
  { id: "monday",    day: "Pondělí", open: "13:30", close: "15:30" },
  { id: "tuesday",   day: "Úterý",   open: "13:05", close: "15:35" },
  { id: "wednesday", day: "Středa",  open: "13:30", close: "15:30" },
  { id: "thursday",  day: "Čtvrtek", open: "12:45", close: "16:45" },
  { id: "friday",    day: "Pátek",   open: "13:30", close: "14:00" },
];

const OpeningHoursEditor = () => {
  const [hours, setHours] = useState<OpeningHour[]>(DEFAULT_HOURS);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [loading, startLoading] = useTransition();

  useEffect(() => {
    axios
      .get("/api/openingHours")
      .then((res) => { if (res.data?.length) setHours(res.data); })
      .catch(console.error);
  }, []);

  const updateTime = (id: string, field: "open" | "close", value: string) => {
    setHours((prev) => prev.map((h) => (h.id === id ? { ...h, [field]: value } : h)));
  };

  const toggleClosed = (id: string, closed: boolean) => {
    setHours((prev) =>
      prev.map((h) => (h.id === id ? { ...h, open: closed ? null : "08:00", close: closed ? null : "16:00" } : h))
    );
  };

  const save = () => {
    startLoading(async () => {
      try {
        await axios.post("/api/openingHours", { hours });
        setMessage({ text: "Otevírací doba byla úspěšně uložena.", error: false });
      } catch (err) {
        setMessage({ text: "Chyba při ukládání: " + err, error: true });
      }
    });
  };

  return (
    <Box className="flex mx-auto flex-col gap-4 p-4 w-full max-w-lg">
      <Typography variant="h6">Otevírací doba</Typography>
      {hours.map((h) => {
        const closed = !h.open || !h.close;
        return (
          <Box key={h.id} className="flex flex-col gap-2 border rounded p-3" sx={{ cursor: "pointer" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {h.day}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={closed}
                  onChange={(e) => toggleClosed(h.id, e.target.checked)}
                />
              }
              label="Zavřeno"
            />
            {!closed && (
              <Box className="flex gap-4">
                <TextField
                  label="Otevření"
                  type="text"
                  value={h.open}
                  onChange={(e) => updateTime(h.id, "open", e.target.value)}
                  placeholder="13.30"
                  inputProps={{ pattern: "[0-9]{2}\\.[0-9]{2}", style: { cursor: "pointer" } }}
                  size="small"
                />
                <TextField
                  label="Zavření"
                  type="text"
                  value={h.close}
                  onChange={(e) => updateTime(h.id, "close", e.target.value)}
                  placeholder="15.30"
                  inputProps={{ pattern: "[0-9]{2}\\.[0-9]{2}", style: { cursor: "pointer" } }}
                  size="small"
                />
              </Box>
            )}
          </Box>
        );
      })}
      {message && (
        <Alert severity={message.error ? "error" : "success"}>{message.text}</Alert>
      )}
      <PrimaryButton onClick={save} disabled={loading}>
        Uložit otevírací dobu
      </PrimaryButton>
    </Box>
  );
};

export default OpeningHoursEditor;

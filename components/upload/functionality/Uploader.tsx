"use client";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import { Box, List, ListItemText, Typography } from "@mui/material";
import React, { useState } from "react";
import readFileAsArrayBuffer from "@/utils/readFileArrayAsBUffer";
import convertExcelToJson from "@/utils/convertExcelToJson";
import { postDataToUpload } from "@/utils/apiConections/postDataToUpload";
const Uploader = () => {
  const [jsonResult, setJsonResult] = useState<any[]>([]);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      // Read the file as an ArrayBuffer using FileReader
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const jsonData = convertExcelToJson(arrayBuffer);
      console.log(jsonData);
      setJsonResult(jsonData);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(jsonResult);
    const response = await postDataToUpload(jsonResult, true);

    if (response.ok) {
      alert("soubor úspěšně nahrán");
    } else {
      const errorData = await response.json(); // Parse error message from response
      alert(
        `Error při nahrání souboru: ${errorData.message || "neznámý error"}`
      );
    }
  };

  return (
    <Box className="mx-auto px-4 flex flex-col flex-center b-black flex-grow-1 m-8 align-center  ">
      <Typography variant="h2" className="text-xl font-semibold mb-4">
        Hromadné nahrání z tabulky
      </Typography>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
          // handleParseFile();
        }}
        encType="multipart/form-data"
        className="flex flex-col items-center"
      >
        <input
          type="file"
          id="fileInput"
          name="file"
          accept=".xlsx"
          className="mb-4 cursor-pointer"
          onChange={handleFileChange}
        />
        <PrimaryButton type="submit">Nahrát</PrimaryButton>
      </form>

      <Box>
        <Box>
          <Typography variant="h6"> Návod pro hromadné nahrávání</Typography>
          <List>
            <ListItemText primary="kliněte na vybrat soubor" />
            <ListItemText primary="vyberte tabulku obsahující vaše knihy" />
            <ListItemText primary="klikněte na nahrát" />
            <ListItemText primary="aplikace ohlásí, jestli byl knihy správn nahrány" />
            <ListItemText primary="ujistěte se, že tabulka obsahuje správné názvy sloupců, jako v databázi a že délka názvu a autora knihy není > 255 znaků" />
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default Uploader;

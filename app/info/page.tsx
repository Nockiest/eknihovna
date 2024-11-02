import { PrimaryButton } from "@/theme/buttons/Buttons";
import React from "react";
import type { Metadata } from "next";
import { Box, List, ListItem, Typography } from "@mui/material";
import Link from "next/link";
import CreditMe from "@/components/CreditMe";
export const metadata: Metadata = {
  title: "Informace o G.O. knihovně",
  description: "Vše o výpůjčce a kontakt na knihovnu",
};
const page = () => {
  return (
    <Box justifyContent={"center"} className="w-full">
      <Box className="px-12 lg:px-24">
      <Typography variant="h1" className="mb-2">
        {" "}
        Vše ohledně vypůjčení knížky{" "}
      </Typography>
      <List>
        <ListItem>
          Najdete u nás přes 3000 knížek od maturitní četby až po odbornou
          literaturu
        </ListItem>
        <ListItem>Knížky jsou dostupné pro každého studenta G.O</ListItem>
        <ListItem>
          Knihu si zpravidla můžete půjčit na 1 měsíc (po domluvě i déle 🙂)
        </ListItem>
        <ListItem>
          Knihu jsou zcela zdarma a nepotřebujete žádnout průkazku
        </ListItem>
        <ListItem>Knihu jsou půjčovány na lístkový systém</ListItem>
        <ListItem>
          Knihovna je otevřena v průběhu celého školního roku{" "}
        </ListItem>
        <ListItem>
          na konci školního roku by měly být všechny knihy vráceny
        </ListItem>
        <ListItem>
          Pokud student knihu ztratí, je jeho povinností nahradit knihu
          zakoupením stejného titulu
        </ListItem>
        <ListItem>
          I vy se můžete podílet na rozšíření knihovního katalogu darováním
          vlastní knihy :-)
        </ListItem>
      </List>

      </Box>

      <Box
        className="m-auto bg-primary-800"
        sx={{
          display: "flex",
          justifyContent: "center", // Centers the text horizontally
          alignItems: "center", // Centers the text vertically (optional)
          height: "100%", // Adjust this to fit your layout needs
          margin: "2em auto",
          padding: "2em",
          borderRadius: "2px",
          textAlign: "center", // Ensures the text itself is centered
        }}
      >
        <Typography variant="body1" textAlign="center" className="text-center">
          Pokud se chcete dozvědět více, nebo potřebujete poradit, stačí nám
          napsat na email:
          <br />{" "}
          <b>
            {" "}
            <a
              href="mailto:bauerova@gopat.cz"
              style={{ color: "light-blue", textDecoration: "none" }}
            >
              bauerova@gopat.cz
            </a>
          </b>
        </Typography>
      </Box>
      <Box className="w-full my-8 flex flex-col flex-center">
        <PrimaryButton className="mx-auto">
          <Link href="/katalog">Půjčit si knihu</Link>
        </PrimaryButton>
      </Box>
      <CreditMe />
    </Box>
  );
};

export default page;

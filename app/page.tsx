// "use client";
import OpeningHours from "@/components/OpeningHours";
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import OtherProjectLinker from "@/components/OtherProjectLinker";
import useCurrentBreakpoint from "@/features/hooks/useCustomBreakpoint";
import React from "react";
import GOMobileheader from "@/components/GOMobileheader";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Novinky v GO eknihovně",
  description: "GO eknihovna hlavní stránka",
};
export default function Home() {
  return (
    <>
    <meta name="google-site-verification" content="hjQ9ZFX153H0STRp1SFSLiakzbOMsi_S6s4jPvNKKJA" />
    <Container maxWidth={"lg"} className="flex flex-col gap-2">

      <GOMobileheader />

      <Container>
        <Typography variant="body1">
          Vítejte na domovské stránce knihovny Gymnázia Opatov, kde se můžete
          seznámit s bohatým fondem naší školní knihovny a získat důležité
          informace.
        </Typography>
        <br />
        <Typography variant="body1">
          Naše knihovna je otevřeným prostorem pro vaše vzdělání a inspiraci.
          Nabízíme široký výběr literatury, studijních materiálů a časopisů.
        </Typography>
        <br />
        <Typography variant="body1">
          Projděte si naši sbírku a objevujte nové příběhy, poznatky a světy.
          Jsme tu pro vás, abychom vám pomohli s vašimi studijními potřebami
          a abychom vám poskytli prostor k odpočinku a pohodlnému čtení.
        </Typography>
        <br />
        <Typography variant="body1">
          Pokud máte zájem o konkrétní knihu, nebo potřebujete poradit
          s  yhledáním informací, neváhejte se po školních hodinách obrátit na 
          profesorku Bauerovou.
        </Typography>
        <br />
        <Typography variant="body1">
          Náš cíl je poskytnout vám kvalitní světovou i domácí literaturu.
          Přijďte navštívit naši knihovnu a objevte, co všechno pro vás máme
          připraveného. Těšíme se na vaši návštěvu!
        </Typography>
      </Container>

      <Box mt={2} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
        >
          <Link href="/katalog" color="inherit" className="no-underline">
            Přejít do katalogu
          </Link>
        </Button>
      </Box>
      <Container className="mx-auto mt-2 text-secondary-950  bg-primary-600 p-4 border border-gray-300 rounded-md mb-4">
        <Typography variant="body1">
          Stránku vytvořil Ondřej Lukeš. Děkuji za pomoc všem co se podíleli
          na projektu: Patriku Holbovi, Davidu Laušmanovi, prof. Bauerové
          a redakci Peřinky.
        </Typography>
      </Container>
      <OpeningHours />

      <OtherProjectLinker />
    </Container>
    </>

  );
}

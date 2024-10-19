"use client";
import OpeningHours from "@/components/general/OpeningHours";
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Home() {
  return (
    <Container maxWidth={"lg"}>
      <Typography variant="body1">
        Vítejte na domovské stránce knihovny Gymnázia Opatov, kde se můžete
        seznámit s bohatým fondem naší školní knihovny a získat důležité
        informace.
      </Typography>
      <br />
      <Typography variant="body1">
        Naše knihovna je otevřeným prostorem pro vaše vzdělání a inspiraci.
        Nabízíme široký výběr literatury, studijních materiálů a časopisů.
      </Typography>
      <br />
      <Typography variant="body1">
        Projděte si naši sbírku a objevujte nové příběhy, poznatky a světy. Jsme
        tu pro vás, abychom vám pomohli s vašimi studijními potřebami a abychom
        vám poskytli prostor k odpočinku a pohodlnému čtení.
      </Typography>
      <br />
      <Typography variant="body1">
        Pokud máte zájem o konkrétní knihu, nebo potřebujete poradit s
        vyhledáním informací, neváhejte se po školních hodinách obrátit na
        profesorku Bauerovou.
      </Typography>
      <br />
      <Typography variant="body1">
        Náš cíl je poskytnout vám kvalitní světovou i domácí literaturu a pomoct vám sehnat maturitní
        četbu. Přijďte navštívit
        naši knihovnu a objevte, co všechno pro vás máme připraveného. Těšíme se
        na vaši návštěvu!
      </Typography>
      <br />

      <OpeningHours />
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
      <Container className=" text-secondary-950  bg-primary-600 p-4 border border-gray-300 rounded-md mb-4">
      <Typography variant="body1">
        Stránku vytvořil Ondřej Lukeš. Děkuji za pomoc všem co se podíleli na projektu: Patriku
        Holbovi, Davidu Laušmanovi, prof. Bauerové a redakci Peřinky.
      </Typography>
      </Container>
    </Container>
  );
}

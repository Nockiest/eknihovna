'use client'
import OpeningHours from "@/components/general/OpeningHours";
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Home( ) {


  return (
    <Container maxWidth={"lg"}>
      <Typography variant="body1">
        Vítejte na domovské stránce knihovny Gymnázia Opatov, kde se můžete
        seznámit s bohatým fondem naší školní knihovny a získat důležité
        informace. Naše knihovna je otevřeným prostorem pro vaše vzdělání a
        inspiraci. Nabízíme široký výběr literatury, studijních materiálů a
        časopisů. Projděte si naši sbírku a objevujte nové příběhy, poznatky a
        světy. Jsme tu pro vás, abychom vám pomohli s vašimi studijními
        potřebami a abychom vám poskytli prostor k odpočinku a pohodlnému čtení.
        Pokud máte zájem o konkrétní knihu, nebo potřebujete poradit s
        vyhledáním informací, neváhejte se po školních hodinách obrátit na
        profesorku Bauerovou. Náš cíl je podporovat váš akademický růst a
        zvědavost. Přijďte navštívit naši knihovnu a objevte, co všechno pro vás
        máme připraveného. Těšíme se na vaši návštěvu!
      </Typography>
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

    </Container>
  );
}

 
import { Box, List, ListItem, Typography } from "@mui/material";
import OpeningHours from "./OpeningHours";

export default function BorrowingInformation() {
  return (
    <Box className="px-6 lg:px-24">
      <Typography variant="h3" className="mb-2">
        Vše ohledně vypůjčení knížky
      </Typography>
      <List>
        <ListItem>
          Najdete u nás přes 3000 knížek od maturitní četby až po odbornou
          literaturu.
        </ListItem>
        <ListItem>Knížky jsou dostupné pro každého studenta GO.</ListItem>
        <ListItem>
          Knihy si zpravidla můžete půjčit na 1 měsíc (po domluvě i déle 🙂).
        </ListItem>
        <ListItem>
          Knihy jsou zcela zdarma a nepotřebujete žádnout průkazku.
        </ListItem>
        <ListItem>Knihy jsou (zatím) půjčovány na lístkový systém.</ListItem>
        <ListItem>
          Knihovna je otevřena v průběhu celého školního roku.
        </ListItem>
        <ListItem>
          Na konci školního roku by měly být všechny knihy vráceny.
        </ListItem>
        <ListItem>
          Pokud student knihu ztratí, je jeho povinností nahradit knihu
          zakoupením stejného titulu.
        </ListItem>
      </List>
      <OpeningHours />
    </Box>
  );
}

import { Container } from "@mui/material";
import Message from "@/components/Message";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
// export const metadata: Metadata = {
//   title: "Novinky v GO eknihovně",
//   description: "Seznam novinek",
//   applicationName: "GO eknihovna",
//   keywords: ["knihovna", "eknihovna", "gymnázium opatov", "gymnázium", "opatov", "GO"],
//   creator: "Ondřej Lukeš",
//   publisher: "Ondřej Lukeš",
//   icons: "/icon/bookLogo.ico",
// };

type Message = {
  message: string;
  date: string;
};
const NewsPage: React.FC = () => {
  const messages: Message[] = [
    {
      message:
        "Vítáme vás v první verzi stránky. Můžete si prohlédnout aktuální stav knihovního katalogu nebo zjistit užitečné informace o naší knihovně.",
      date: "2024-06-24",
    },
    //  {message:"Katalog byl nedávno rozšířen o několik nových titulů", date: "2024-11-23" }
  ];
  return (
    <Container maxWidth="sm">
      <Analytics />
      {messages.map((msg, index) => (
        <Message key={index} message={msg.message} date={msg.date} />
      ))}
    </Container>
  );
};

export default NewsPage;

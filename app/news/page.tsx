import { Container } from "@mui/material";
import Message from "@/components/Message";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
export const metadata: Metadata = {
  title: "Novinky v GO eknihovně",
  description: "Seznam novinek",
  applicationName: "GO eknihovna",
  keywords: [
    "knihovna",
    "eknihovna",
    "gymnázium opatov",
    "gymnázium",
    "opatov",
    "GO",
  ],
  creator: "Ondřej Lukeš",
  publisher: "Ondřej Lukeš",
  icons: "/icon/bookLogo.ico",
};

type Message = {
  message: string;
  date: string;
};
const NewsPage: React.FC = () => {
  const messages: Message[] = [
    {
      message:
        "Eknihovna je tu! Prozkoumej tisíce titulů našeho katalogu, informuj se o jejich aktuálním stavu a půjč si je ještě dnes! Případné návrhy a prosby směřujte buď přes tlačítko níže na stránce, nebo přímo na email ondluk.m@zaci.gopat.cz.",
      date: "2024-12-10",
    },
    {
      message:
        "Odteď se zvolené filtry ukládají mezi stránkami, takže nemusíte znovu nastavovat nové při procházení katalogu.",
      date: "2025-2-17",
    },
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

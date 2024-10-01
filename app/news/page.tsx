import { Container } from '@mui/material';
import Message from '@/components/general/Message';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: "Novinky v G.O. knihovně",
  description: "Seznam novinek",
};

type Message = {
  message: string;
  date: string;
}
const NewsPage: React.FC = () => {
  const  messages:Message[] = [
   {message:"Vítáme vás v první verzi stránky. Můžete si prohlédnout aktuální stav knihovního katalogu, nebo zjistit užitečné informace o naší knihovně.", date: "2024-06-24" }
  ]
  return (
    <Container maxWidth="sm">
      {messages.map((msg, index) => (
        <Message key={index} message={msg.message} date={msg.date} />
      ))}
    </Container>
  );
};

export default NewsPage;

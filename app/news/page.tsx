import React from 'react'
import { Container } from '@mui/material';
import Message from '@/components/Message';

const page: React.FC = () => {
  const messages = [
    { message: "Vítáme vás u první verze stránky. Můžete si prohlédnout aktuální stav knihovního katalogu, nebo zjistit užitečné informace o naší knihovně.", date: "2023-06-24" },
  ];

  return (
    <Container maxWidth="sm">
      {messages.map((msg, index) => (
        <Message key={index} message={msg.message} date={msg.date} />
      ))}
    </Container>
  );
};

export default page;

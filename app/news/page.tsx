
import React, { useEffect } from 'react'
import { Container } from '@mui/material';
import Message from '@/components/general/Message';
import { prisma } from '@/data/values';

const NewsPage: React.FC = async () => {
  const messages = [
    { message: "Vítáme vás v první verzi stránky. Můžete si prohlédnout aktuální stav knihovního katalogu, nebo zjistit užitečné informace o naší knihovně.", date: "2023-06-24" },
  ];
  // const books =  await prisma.knihy.findMany()
  // console.log(books)
  // useEffect(() => {
  //   const findBooks = async ()=> {

  //   }
  //   findBooks()
  // }, [])


  return (
    <Container maxWidth="sm">
      {messages.map((msg, index) => (
        <Message key={index} message={msg.message} date={msg.date} />
      ))}
    </Container>
  );
};

export default NewsPage;

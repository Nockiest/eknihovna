'use client'
import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import Message from '@/components/general/Message';
import axios from 'axios';

const NewsPage: React.FC = () => {
  const [messages, setMessages] = useState([
    { message: "Vítáme vás v první verzi stránky. Můžete si prohlédnout aktuální stav knihovního katalogu, nebo zjistit užitečné informace o naší knihovně.", date: "2023-06-24" }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/test');
        console.log(response.data);
        // Update messages state if needed based on the API response
        // setMessages(response.data.books);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="sm">
      {messages.map((msg, index) => (
        <Message key={index} message={msg.message} date={msg.date} />
      ))}
    </Container>
  );
};

export default NewsPage;

// const books =  await prisma.knihy.findMany()
  // console.log(books)
  // useEffect(() => {
  //   const findBooks = async ()=> {

  //   }
  //   findBooks()
  // }, [])

    // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       console.log(response)
  //       // setMessages(response.data);
  //     } catch (err: any) {
  //       // setError('Failed to fetch messages');
  //       console.error(err.message);
  //     }
  //   };

  //   fetchMessages();
  // }, []);
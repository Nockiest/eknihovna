"use client";
import { Book } from "@/types/types";
import { Box, Paper, Typography } from "@mui/material";
import Image from "next/image";
import React, { useEffect } from "react";

type BookPreviewProps = {
  book: Book;
};
const BookPreview: React.FC<BookPreviewProps> = ({ book }) => {
  const {
    bookCoverURL = "",
    available = false,
    author = "Autor neznámý",
    name = "Nezn8m0 jméno",
    genre = "neznámý žánr",
    formaturita = false,
    rating = -1,
  } = book;

  return (
    <Paper className="w-auto flex-grow">
      <Box>

        <Typography>Název: {name}</Typography>
        <br />
        <Typography>Žánr:{genre}</Typography>
        <br />
        <Typography>Autor: {author}</Typography>
        <br />
        <Typography>Dostupnost: {available}</Typography>
        <br />
        <Typography>{formaturita ? "maturitni" : ""}</Typography>
        <br />
        <Typography>Hodnocení: {rating}/100 </Typography>
        <br />
      </Box>
    </Paper>
  );
};

export default BookPreview;
//  const bookCoverURL = book.bookCoverURL? book.bookCoverURL: ''
// const available =book.available? book.available: false
// const author =book.author? book.author: 'Unknown Author'
// const name = book.name? book.name:'Unknown Name'
// const genre =book.genre? book.genre: 'Unknown Genre'
// const formaturita = book.formaturita? book.formaturita:false
// const rating =book.rating? book.rating: 0

// const BioCard = ({ title, index }) => {
//   return (
//     <div className={`m-auto card ${index % 2 === 0 ? 'bg-primary-color-60' : ' gap-16 bg-white border-solid border-black'} w-72 border-solid border-black p-6`}>
//      <div className="flex justify-center m-2">
//      <Image width={200} height={200} src="/books.jpg" alt="xyz" />
//      </div>

//       <h3>{title}</h3>
//       <p className="h-32 ml-2   text-base  leading-8   overflow-hidden">
//         lorem ipsgup sagssdp jag gasjg las g§asgdsj pgd ap jdsdg sadj dsagpgjddajdslj lgj sadgilsjd
//         glsdijg dps gjdsali gjdsalgjs sd l aepofjw gúwq jgoagw wpig jdasg jsgs jla jd
//       </p>
//       <div className="flex justify-center m-2">
//       <Image src="/chat-dots.svg" width={24} height={24} />
//       </div>
//     </div>
//   );
// };

// export default BioCard;

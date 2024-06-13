import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";
import React from "react";
import Navbar from '@/components/navbar/Navbar'
// const NoSSRNavbar = dynamic(() => import("@/components/navbar/Navbar"), {
//   ssr: false,
// });
const Hero = () => {
  return (
    <Box className={"w-full flex flex-col align-center"}>
      <div className="w-auto h-64 -z-1">
        <img
          src="/img/books.jpg"
          className="w-full h-full object-cover"
          alt="Books"
        />
      </div>
      <Navbar />
    </Box>
  );
};

export default Hero;

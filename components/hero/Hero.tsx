import { Box } from "@mui/material";
import Image from "next/image";
import Navbar from '@/components/navbar/Navbar'

const Hero = () => {
  return (
    <Box className={"w-full flex flex-col align-center"}>
      <Box className="w-auto h-64 -z-1">
        <img
          src="/img/books.jpg"
          className="w-full h-full object-cover"
          alt="Books"
        />
      </Box>
      <Navbar />
    </Box>
  );
};

export default Hero;

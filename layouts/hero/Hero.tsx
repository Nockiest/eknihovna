'use client'
import { Box } from "@mui/material";
import Image from "next/image";
import CustomHamburger from "../navbar/HamburgerIcon";
import { useState } from "react";
import { HeaderContext } from "../navbar/headerConntext";
import { getURLSegment } from "@/utils/getURLSegment";
import { usePathname } from "next/navigation";
import NavBar from "../navbar/Navbar";
// import NavBar from "../navbar/Navbar";

const Hero = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);
  const currentLink = getURLSegment(usePathname(), 1);

  const toggleNav = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  return (
    <HeaderContext.Provider
      value={{
        isHamburgerOpen,
        setIsHamburgerOpen,
      }}
    >
      <Box className="w-full relative flex flex-col align-center">
        <CustomHamburger onClick={toggleNav} ariaLabel="toggle navigation" />
        <Box className="w-auto h-64 -z-1 relative">
          <Image
            src="/img/books.jpg"
            layout="fill"
            objectFit="cover"
            alt="Books"
          />
        </Box>
        <NavBar />
      </Box>
    </HeaderContext.Provider>
  );
};

export default Hero;

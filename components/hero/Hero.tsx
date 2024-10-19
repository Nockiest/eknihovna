"use client";
import { Box } from "@mui/material";
import Image from "next/image";
import CustomHamburger from "../navbar/HamburgerIcon";
import { useState } from "react";
import { HeaderContext } from "../navbar/headerConntext";
import { getURLSegment } from "@/utils/getURLSegment";
import { usePathname } from "next/navigation";
import NavBar from "../navbar/Navbar";

const Hero = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);

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
            src="/img/library/libraryTable.png"
            layout="fill"
            objectFit="cover"
            alt="Books"
          />

          <Box className="absolute bottom-4 right-4 z-1 text-white bg-black bg-opacity-30 px-2 py-1 rounded">
            Fotografie od redakce Peřinky
          </Box>
        </Box>
        <NavBar />
      </Box>
    </HeaderContext.Provider>
  );
};

export default Hero;

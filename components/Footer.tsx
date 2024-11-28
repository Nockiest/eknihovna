"use client";
import Link from "next/link";
import { navRoutes } from "@/data/values";
import { Box, Container } from "@mui/material";
import NavbarMapper from "./navbar/NavbarMaper";
import { NavButton } from "@/types/types";
import Image from "next/image";
import ShareButton from "./ShareBtn";
const Footer = () => {
  const renderButton = (button: NavButton, isActive: boolean) => (
    <Link
      className="hover:text-gray-400 m-2"
      key={button.URL}
      href={button.URL}
    >
      {button.label}
    </Link>
  );
  return (
    <footer className="bg-gray-800 w-full align-center text-white py-4 flex flex-row justify-around">
      <Box className="flex container mx-auto px-4 flex  space-x-4  md:flex-row items-center justify-between">
          <NavbarMapper
            navRoutes={navRoutes}
            renderButton={renderButton}
            renderNavStyle="flex flex-wrap"
          />
          {/* <ShareButton /> */}

      </Box>
      <Container className="w-16  p-0 my-auto h-16 flex justify-center align-center items-center">

          <Image
            src="/img/GOlogo.png"
            alt="GO logo"
            width={48}
            height={48}
          />
        </Container>
    </footer>
  );
};

export default Footer;

"use client";
import Link from "next/link";
import { navRoutes } from "@/data/values";
import { Box, Container } from "@mui/material";
import NavbarMapper from "./navbar/NavbarMaper";
import { NavButton } from "@/types/types";
import Image from "next/image";
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
    <footer className="bg-gray-800 align-center text-white py-4 flex flex-row justify-around">
      <Box className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <Box className="flex flex-wrap  flex-col md:flex-row  space-x-4">
          <NavbarMapper
            navRoutes={navRoutes}
            renderButton={renderButton}
            renderNavStyle="flex flex-wrap"
          />
        </Box>
      </Box>
      <Container className="w-16  p-0 my-auto h-16 flex justify-center align-center items-center">
          <Image
            src="/img/g.o.logo.png"
            alt="G.O. logo"
            width={48}
            height={48}
          />
        </Container>
    </footer>
  );
};

export default Footer;

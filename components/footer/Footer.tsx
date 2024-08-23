"use client";
import Link from "next/link";
import { navRoutes } from "@/data/values";
import { Box } from "@mui/material";
import NavbarMapper from "../navbar/NavbarMaper";
import { NavButton } from "@/types/types";
const Footer = () => {
  const renderButton = (button: NavButton, isActive: boolean) => (
    <Link className="hover:text-gray-400 mx-2" key={button.URL} href={button.URL}>
      {button.label}
    </Link>
  );
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <Box className="flex flex-wrap  flex-col md:flex-row  space-x-4">
          <NavbarMapper
            navRoutes={navRoutes}
            renderButton={renderButton}
          />
        </Box>
      </div>
    </footer>
  );
};

export default Footer;

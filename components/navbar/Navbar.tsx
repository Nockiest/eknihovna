"use client";

import Link from "next/link";
import { NavbarButton } from "@/theme/Buttons";
import { Box, Paper, Typography } from "@mui/material";
import HamburgerNavList from "./Hamburger";
import { navRoutes } from "@/data/routeNames";
import { useEffect, useState } from "react";
// import { useMediaQuery } from "react-responsive";

interface NavListProps {}

const NavList: React.FC<NavListProps> = ({}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Paper
      elevation={3}
      className="p-2 h-full bg-primary-600 w-full mx-0 flex flex-col sticky items-center"
    >
      <div className="wraper z-3">
        <button
          className=" nav-toggle bg-transparent border-0 cursor-pointer absolute right-10 top-4 z-3 m-4 p-4"
          onClick={toggleNav}
          aria-label="toggle navigation"
        >
          <span className={`hamburger`} />
        </button>
        <HamburgerNavList isOpen={isOpen} toggleNav={toggleNav} />
      </div>
      <Typography
        variant="h1"
        className="mb-4 text-center"
        align='center'
        // style={{ textAlign: "center" }}
      >
        ŠKOLNÍ KNIHOVNA
      </Typography>
      <Box className="hidden sm:flex flex-row justify-center align-center space-x-4">
        {navRoutes.map((button) => (
          <NavbarButton key={button.URL} variant="contained">
            <Link href={button.URL}>{button.label}</Link>
          </NavbarButton>
        ))}
      </Box>
    </Paper>
  );
};

export default NavList;

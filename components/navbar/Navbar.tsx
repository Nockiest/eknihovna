"use client";

import Link from "next/link";
import { NavbarButton } from "@/theme/buttons/Buttons";
import { Box, Paper, Typography } from "@mui/material";
import HamburgerNavList from "./Hamburger";
import { navRoutes } from "@/data/routeNames";
import { useEffect, useState } from "react";
import CustomHamburger from "@/theme/buttons/Hamburger";

interface NavListProps {}

const NavList: React.FC<NavListProps> = ({}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  // useEffect(() => {
  //   const mediaQuery = window.matchMedia('(min-width: 600px)'); // "sm" breakpoint

  //   const handleResize = () => {
  //     if (mediaQuery.matches) {
  //       setIsOpen(false);
  //     }
  //   };

  //   // Add listener to the media query
  //   mediaQuery.addEventListener('change', handleResize);

  //   // Initial check
  //   handleResize();

  //   // Cleanup function
  //   return () => {
  //     mediaQuery.removeEventListener('change', handleResize);
  //   };
  // }, []);
  return (
    <Paper
      elevation={3}
      className="p-2 h-full  w-full mx-0 flex flex-col sticky top-0 z-10 items-center"
    >
      <Box className="wraper z-3  ">
        <CustomHamburger  onClick={toggleNav}  ariaLabel="toggle navigation" />
        <HamburgerNavList isOpen={isOpen} toggleNav={toggleNav} />
      </Box>
      <Typography
        variant="h1"
        className="mb-4 text-center"
        align='center'
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


{/* <button
          className=" nav-toggle bg-transparent border-0 cursor-pointer absolute right-10 top-4 z-3 m-4 p-4"
          onClick={toggleNav}
          aria-label="toggle navigation"
        >
          <span className={`hamburger`} />
        </button> */}
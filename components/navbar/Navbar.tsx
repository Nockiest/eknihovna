"use client";

import Link from "next/link";
import { NavbarButton } from "@/theme/buttons/Buttons";
import { Box, Paper, Typography } from "@mui/material";
import HamburgerNavList from "./Hamburger";
import { navRoutes } from "@/data/routeNames";
import { useState } from "react";
import CustomHamburger from "@/theme/buttons/Hamburger";
import { getURLSegment } from "@/utils/getURLSegment";
import { usePathname } from "next/navigation";
import { HeaderContext, useHeaderContext } from "./headerConntext";

interface NavListProps {}

const NavList: React.FC<NavListProps> = ({}) => {
  const firstURLSegment = getURLSegment(usePathname(), 0);
  const {isHamburgerOpen, setIsHamburgerOpen} = useHeaderContext()

  return (
      <Paper
        elevation={3}
        className="p-2 h-full w-full mx-0 flex flex-col  z-10 items-center"
      >
        <Box className="  z-3  ">
          {/* <CustomHamburger onClick={toggleNav} ariaLabel="toggle navigation" /> */}
          <HamburgerNavList isOpen={isHamburgerOpen} toggleNav={() => {setIsHamburgerOpen(!isHamburgerOpen)}} />
        </Box>
        <Typography variant="h1" className="mb-4 text-center" align="center">
          ŠKOLNÍ KNIHOVNA
        </Typography>

        <Box className="hidden sm:flex flex-row justify-center align-center space-x-4">
          {navRoutes.map((button) => {
            const isActive = getURLSegment(button.URL, 0) === firstURLSegment;
            return (
              <NavbarButton
                key={button.URL}
                variant={isActive ? "contained" : "outlined"}
                size="small"
              >
                <Link href={button.URL}>{button.label}</Link>
              </NavbarButton>
            );
          })}
        </Box>
      </Paper>
  );
};

export default NavList;

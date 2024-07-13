"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navRoutes } from "@/data/routeNames";
import { Box } from "@mui/material";
import NavbarMapper from "./NavbarMaper";
import { NavButton } from "@/types/types";
interface HamburgerNavListProps {
  isOpen: boolean;
  toggleNav: () => void;
}

const HamburgerNavList: React.FC<HamburgerNavListProps> = ({
  isOpen,
  toggleNav,
}) => {


  const renderButton = (button: NavButton, isActive: boolean) => (
    <li key={button.URL} className="nav__item mx-auto">
              <Link
                href={button.URL}
                className="nav__link text-current hover:white text-5xl text-center no-underline font-bold"
                onClick={toggleNav}
              >
                {button.label}
              </Link>
            </li>
  );
  return (
    <Box
      className={`fixed bg-[var(--text-color)] text-white top-0 bottom-0 left-0 right-0 z-100 transform transition-transform duration-250 ease-[cubic-bezier(0.5,0,0.5,1)]  ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } sm:hidden`}
    >
      <ul className="nav__list absolute list-none flex flex-col justify-evenly items-center top-0 left-0 h-screen w-screen z-100 bg-black text-white">
      <NavbarMapper
      navRoutes={navRoutes}
      renderButton={renderButton}
    />

        {/* {navRoutes
          .filter((route) => {
            if (route.URL === "/upload" && !isAdmin) {
              return false;
            }
            return true;
          })
          .map((button, key) =>

            <li key={key} className="nav__item mx-auto">
              <Link
                href={button.URL}
                className="nav__link text-current hover:white text-5xl text-center no-underline font-bold"
                onClick={toggleNav}
              >
                {button.label}
              </Link>
            </li>
        )} */}
      </ul>
    </Box>
  );
};

export default HamburgerNavList;

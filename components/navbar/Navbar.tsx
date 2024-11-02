"use client";
import Link from "next/link";
import { NavbarButton } from "@/theme/buttons/Buttons";
import {
  Box,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import HamburgerNavList from "./Hamburger";
import { navRoutes } from "@/data/values";
import { HeaderContext, useHeaderContext } from "./headerConntext";
import useCurrentBreakpoint from "@/features/hooks/useCustomBreakpoint";
import Image from "next/image";
import NavbarMapper from "./NavbarMaper";
import { NavButton } from "@/types/types";
import MenuIcon from "@mui/icons-material/Menu";
interface NavListProps {}

const NavBar: React.FC<NavListProps> = ({}) => {
  const { isHamburgerOpen, setIsHamburgerOpen } = useHeaderContext();
  const size = useCurrentBreakpoint();
  const renderButton = (button: NavButton, isActive: boolean) => (
    <NavbarButton
      key={button.URL}
      variant={isActive ? "contained" : "outlined"}
      size="small"
      className="mx-2"
    >
      <Link href={button.URL}>{button.label}</Link>
    </NavbarButton>
  ); //
  return (
    <Paper
      elevation={3}
      className="p-2 h-full w-full z-10 mx-0 flex flex-col justify-center   items-center "
    >
      <Box className="z-3">
        {size && ["xs", "sm"].indexOf(size) > -1 && (
          <IconButton
            className="absolute top-2 right-2 p-2 rounded  bg-gray-200 bg-opacity-80 text-secondary-500 transition-colors duration-300"
            onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
            aria-label="Toggle navigation" // Using proper case for accessibility
            size="large" // Set the size of the button
            sx={{ fontSize: 64 }}
          >
            <MenuIcon fontSize="inherit" /> {/* Change the icon size */}
            {/* Inherit the font size from IconButton */}
          </IconButton>
        )}

        <HamburgerNavList
          isOpen={isHamburgerOpen}
          toggleNav={() => {
            setIsHamburgerOpen(!isHamburgerOpen);
          }}
        />
      </Box>
      {size === "xs" || size === "sm" ? (

        <Image src="/img/loga/bookLogo.png" width={64} height={64} alt="logo" />
      ) : (
        <Typography
          variant="h1"
          className="sm:mb-4 text-center  "
          align="center"
        >
          ŠKOLNÍ KNIHOVNA G.O.
        </Typography>
      )}

      {/* Navigation menu for larger screens */}
      <Box className="hidden sm:flex flex-row justify-center align-center space-x-4">
        <NavbarMapper
          navRoutes={navRoutes.filter((nav) => nav.URL !== "/upload")}
          renderButton={renderButton}
        />
      </Box>
    </Paper>
  );
};

export default NavBar;

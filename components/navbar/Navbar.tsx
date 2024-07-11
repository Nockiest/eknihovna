import Link from "next/link";
import { NavbarButton } from "@/theme/buttons/Buttons";
import { Box, Paper, Typography } from "@mui/material";
import HamburgerNavList from "./Hamburger";
import { navRoutes } from "@/data/routeNames";
import { getURLSegment } from "@/utils/getURLSegment";
import { usePathname } from "next/navigation";
import { HeaderContext, useHeaderContext } from "./headerConntext";
import useCurrentBreakpoint from "@/utils/useCustomBreakpoint";
import Image from "next/image";
import Cookies from "js-cookie"; // Make sure to install js-cookie if you haven't already

interface NavListProps {}

const NavBar: React.FC<NavListProps> = ({}) => {
  const firstURLSegment = getURLSegment(usePathname(), 0);
  const { isHamburgerOpen, setIsHamburgerOpen } = useHeaderContext();
  const size = useCurrentBreakpoint();
  const isAdmin = Cookies.get("authToken") !== undefined;
  console.log(isAdmin)
  return (
    <Paper
      elevation={3}
      className="p-2 h-full w-full mx-0 flex flex-col justify-center items-center "
    >
      <Box className="z-3">
        {/* <CustomHamburger onClick={()=> setIsHamburgerOpen(!isHamburgerOpen)} ariaLabel="toggle navigation" /> */}
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
        <Typography variant="h1" className="sm:mb-4 text-center" align="center">
          ŠKOLNÍ KNIHOVNA
        </Typography>
      )}

      {/* Navigation menu for larger screens */}
      <Box className="hidden sm:flex flex-row justify-center align-center space-x-4">
        {navRoutes
          .filter((route) => {
            if (route.URL === "/upload" && !isAdmin) {
              return false;
            }
            return true;
          })
          .map((button) => {
            const isActive = getURLSegment(button.URL, 0) === firstURLSegment;

            return (
              <NavbarButton
                key={button.URL}
                variant={isActive ? "contained" : "outlined"}
                size="small"
              >
                <Link href={button.URL}>{button.label} {isAdmin.toString()}</Link>
              </NavbarButton>
            );
          })}
      </Box>
    </Paper>
  );
};

export default NavBar;

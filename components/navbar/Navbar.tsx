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
      className="p-2 h-full bg-primary-600 w-full mx-0 flex flex-col items-center"
    >
      <div className="wraper">
        <button
          className=" nav-toggle bg-transparent border-0 cursor-pointer absolute right-10 top-4 z-1000 m-4 p-4"
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
        style={{ textAlign: "center" }}
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

// const NavComponent = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleNav = () => {
//     setIsOpen(!isOpen);
//   };

//   useEffect(() => {
//     const navToggle = document.querySelector(".nav-toggle");
//     navToggle?.addEventListener("click", toggleNav);

//     return () => {
//       navToggle?.removeEventListener("click", toggleNav);
//     };
//   }, []);

//   return (
//     <div>
//       <button className="nav-toggle bg-transparent border-0 cursor-pointer absolute right-10 top-4 z-1000 m-4 p-4" aria-label="toggle navigation">
//         <span className="hamburger" />
//       </button>
//       <HamburgerNavList isOpen={isOpen} toggleNav={toggleNav} />
//     </div>
//   );
// };

// export default NavComponent;


// useEffect(() => {
//   const fetchRoutes = async () => {
//     try {
//       const res = await fetch('/api/routeList');
//       console.log(res)
//       if (!res.ok) {
//         throw new Error(`Failed to fetch routes: ${res.statusText}`);
//       }
//       const routes: NavButton[] = await res.json();
//       console.log(routes)
//       setNavButtons(routes);
//     } catch (error) {
//       console.error('Failed to fetch routes:', error);
//     }
//   };

//   fetchRoutes();
// }, []);

// onClick={() => handleClick(button.URL)}
// onMouseEnter={handleMouseEnter}
// onMouseLeave={handleMouseLeave}
// const [isHovered, setIsHovered] = useState<boolean>(false);
// const handleMouseEnter = () => {
//   setIsHovered(true);
// };

// const handleMouseLeave = () => {
//   setIsHovered(false);
// };
// if (buttonName === "home") {
//   router.push("/");
// } else {
// }
// handleButtonClick(URL);

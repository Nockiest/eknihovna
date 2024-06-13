'use client'
import React, { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { NavbarButton } from "@/theme/Buttons";
import { Box, Paper, Typography,   } from "@mui/material";
// import HamburgerNavList from "./Hamburger";
// import { useMediaQuery } from "react-responsive";
interface NavButton {
  URL: string;
  label: string;
}

interface NavListProps {}

const NavList: React.FC<NavListProps> = ({}) => {
  const [navButtons, setNavButtons] = useState<NavButton[]>([
    { URL: "/", label: "Home" },
    { URL: "/about", label: "O Knihovně" },
    { URL: "/katalog", label: "katalog" },
    { URL: "/news", label: "Zprávy" },
    { URL: "/contact", label: "Kontakt" },
  ]);
  // const isMobile = true
  // useMediaQuery({ maxWidth: 858 });


  return (
    <Paper elevation={3} className="p-2 h-full bg-primary-600 w-full mx-0 flex flex-col items-center">
      <Typography variant="h1" className="mb-4 text-center" style={{ textAlign: 'center' }}>
        ŠKOLNÍ KNIHOVNA
      </Typography>
      <Box className="flex flex-row justify-center align-center    space-x-4">

      {/* {isMobile ? (
        <div>
          <button className="nav-toggle mt-0" aria-label="toggle navigation">
           <span className={`hamburger`} />
          </button>
          <div className="right-nav nav">
            <HamburgerNavList />
          </div>
        </div>
      ) : ( */}
        {/* <>  */}
        {navButtons.map((button) => (
          <NavbarButton
            key={button.URL}
            variant="contained"
          >
            <Link href={button.URL}>{button.label}</Link>
          </NavbarButton>
        ))}
        {/* </>
      )*/}

      }


      </Box>
    </Paper>
  );
};

export default NavList;

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

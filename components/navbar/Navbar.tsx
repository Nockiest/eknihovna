"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { NavbarButton } from "@/theme/Buttons";

interface NavButton {
  URL: string;
  label: string;
}

interface NavListProps {}

const NavList: React.FC<NavListProps> = ({}) => {
  const [navButtons, setNavButtons] = useState<NavButton[]>([
    { URL: "/", label: "Home" },
    { URL: "/about", label: "O Peřince" },
    { URL: "/aktualni-cislo", label: "Aktuální Číslo" },
    { URL: "/archiv", label: "Archiv" },
    { URL: "/bonus", label: "Bonus" },
  ]);


  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="btn-row flex m-4">
      {/* {pathname} */}
      {navButtons.map((button) => (
        <NavbarButton
          key={button.URL}
          variant="contained"
          className={`   ${
            pathname === button.URL ? "MuiButton-containedPrimary" : ""
          }`}
        >
          <Link href={button.URL}>{button.label}</Link>
        </NavbarButton>
      ))}
    </div>
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

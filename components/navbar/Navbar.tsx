'use client'
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";


interface NavButton {
  URL: string;
  label: string;
}

interface NavListProps {
  // handleButtonClick: (buttonName: string) => void;
  // activeButton: string;
}
const navButtons: NavButton[] = [
  { URL: "/", label: "Home" },
  { URL: "about", label: "O Peřince" },
  { URL: "aktualni-cislo", label: "Aktuální Číslo" },
  { URL: "archiv", label: "Archiv" },
  { URL: "bonus", label: "Bonus" },
];

const NavList: React.FC<NavListProps> = ({      }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (URL: string) => {
    // Extract the current directory from the pathname (e.g., "/x")
    // if (buttonName === "home") {
    //   router.push("/");
    // } else {
    console.log(URL)
      router.push(`${URL}`);
    // }
    // handleButtonClick(URL);
  };

  return (
    <div className="btn-row flex m-4">
      {pathname}
      {navButtons.map((button) => (
        <button
          key={button.URL}
          className={`nav-btn   ${pathname === button.URL ? "btn-clicked" : ""}`}
          onClick={() => handleClick(button.URL)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default NavList;

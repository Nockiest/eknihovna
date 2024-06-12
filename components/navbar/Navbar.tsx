"use client";
/////////////////////////////font awesmome
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import NavList from "@/components/navbar/NavList";
import HamburgerNavList from "@/components/navbar/Hamburger";
import { useMediaQuery } from "react-responsive";
import { useRouter, usePathname } from "next/navigation";

interface NavButton {
  name: string;
  label: string;
}

interface NavListProps {
//   handleButtonClick: (buttonName: string) => void;
  activeButton: string;
}

const NavBar: React.FC<NavListProps> = ({  activeButton }) => {
    //handleButtonClick,
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const navButtons: NavButton[] = [
    { name: "home", label: "Home" },
    { name: "about", label: "O Peřince" },
    { name: "aktualni-cislo", label: "Aktuální Číslo" },
    { name: "archiv", label: "Archiv" },
    { name: "bonus", label: "Bonus" },
  ];

  const router = useRouter();
  const pathname = usePathname();

  const handleCustomButtonClick = (buttonName: string) => {
    // Extract the current directory from the pathname (e.g., "/x")
    if (buttonName === "home") {
      router.push("/");
    } else {
      router.push(`/${buttonName}`);
    }
    // handleButtonClick(buttonName);
  };

  return (
    <div className="btn-row flex m-4">
      {navButtons.map((button) => (
        <button
          key={button.name}
          className={`nav-btn ${activeButton === button.name ? "btn-clicked" : ""}`}
          onClick={() => handleCustomButtonClick(button.name)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default NavBar;

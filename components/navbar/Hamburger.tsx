"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navRoutes } from "@/data/routeNames";

// const HamburgerNavList = () => {
//   const handleNavToggle = () => {
//     console.log("Nav-toggle");
//     document.body.classList.toggle("nav-open");
//   };
//   useEffect(() => {
//     const navToggle = document.querySelector(".nav-toggle");
//     const navLinks = document.querySelectorAll(".nav__link");

//     const handleNavLinkClick = () => {
//       console.log("nav-open");
//       document.body.classList.remove("nav-open");
//     };

//     navToggle?.addEventListener("click", handleNavToggle);

//     navLinks.forEach((link) => {
//       link.addEventListener("click", handleNavLinkClick);
//     });

//     return () => {
//       navToggle?.removeEventListener("click", handleNavToggle);

//       navLinks.forEach((link) => {
//         link.removeEventListener("click", handleNavLinkClick);
//       });
//     };
//   }, []);

//   return (
//     <ul className="nav__list absolute  list-none flex flex-col justify-evenly items-center top-0 left-0  h-screen   w-screen z-100   bg-black text-white ">
//       {navRoutes.map((button, key) => (
//         <li key={key} className="nav__item mx-auto">
//           <Link href={button.URL} className="nav__link text-current hover:white  text-5xl text-center no-underline font-bold">
//             {button.label}
//           </Link>
//         </li>
//       ))}
//     </ul>
//   );
// };

interface HamburgerNavListProps {
  isOpen: boolean;
  toggleNav: () => void;
}

const HamburgerNavList: React.FC<HamburgerNavListProps> = ({ isOpen, toggleNav }) => {
  return (
    <div
      className={`fixed bg-[var(--text-color)] text-white top-0 bottom-0 left-0 right-0 z-100 transform transition-transform duration-250 ease-[cubic-bezier(0.5,0,0.5,1)] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <ul className="nav__list absolute list-none flex flex-col justify-evenly items-center top-0 left-0 h-screen w-screen z-100 bg-black text-white">
        {navRoutes.map((button, key) => (
          <li key={key} className="nav__item mx-auto">
            <Link
              href={button.URL}
              className="nav__link text-current hover:white text-5xl text-center no-underline font-bold"
              onClick={toggleNav}
            >
              {button.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

 export default HamburgerNavList;

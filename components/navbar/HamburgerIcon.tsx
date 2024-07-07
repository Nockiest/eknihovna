'use client'
import React from "react";
import Button from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";

interface CustomHamburgerProps {
  onClick: () => void;
  ariaLabel: string;
}

const CustomIconButton = styled(Button)(({ theme }) => ({
  margin: '0',
  zIndex: '2',
  //   backgroundColor: 'transparent',
  //   border: 0,
  //   cursor: 'pointer',
  //   position: 'absolute',
  //   right: '15px', // Tailwind `right-10`
  //   top: '15px', // Tailwind `top-4`
  //   zIndex: 3,
  //   margin: '1rem', // Tailwind `m-4`
  //   padding: '1rem', // Tailwind `p-4`
  //   '&:hover': {
  //     backgroundColor: 'transparent',
  //   },
}));

const HamburgerSpan = styled("span")({
  /* Add your hamburger span styles here */
});

const CustomHamburger: React.FC<CustomHamburgerProps> = ({
  onClick,
  ariaLabel,
}) => {
  return (
    <CustomIconButton
      className="border-0 cursor-pointer  fixed right-0 top-1   sm:hidden"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <HamburgerSpan className="hamburger z-2  mt-6 mr-6 block relative my-4 mx-2       h-1.5 rounded-full transition-transform duration-250 ease-in-out   ">
        {/* <span className="block bg-secondary-300 w-12 h-1.5 rounded-full transition-transform duration-250 ease-in-out"></span>
        <span className="block bg-secondary-300 w-12 h-1.5 rounded-full transition-transform duration-250 ease-in-out mt-3.5 absolute"></span>
        <span className="block bg-secondary-300 w-12 h-1.5 rounded-full transition-transform duration-250 ease-in-out mb-3.5 absolute"></span> */}
      </HamburgerSpan>
    </CustomIconButton>
  );
};

export default CustomHamburger;

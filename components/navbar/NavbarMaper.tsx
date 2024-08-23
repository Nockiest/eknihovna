"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import { getURLSegment } from "@/utils/getURLSegment";
import { usePathname } from "next/navigation";

interface NavRoute {
  URL: string;
  label: string;
}

interface NavbarProps {
  navRoutes: NavRoute[];
  renderButton: (button: NavRoute, isActive: boolean) => React.ReactNode;
  renderNavStyle?: string
}

const NavbarMapper: React.FC<NavbarProps> = ({renderNavStyle, navRoutes, renderButton }) => {
  const firstURLSegment = getURLSegment(usePathname(), 0);

  return (
    <nav className={renderNavStyle}>
      {navRoutes?.map((button) => {
        const isActive = getURLSegment(button.URL, 0) === firstURLSegment;
        return renderButton(button, isActive);
      })}
    </nav>
  );
};
export default NavbarMapper;

'use client'
import React from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';
import { usePathname } from 'next/navigation';
import { getURLSegment } from '@/utils/getURLSegment';

interface NavRoute {
  URL: string;
  label: string;
}

interface NavbarProps {
  navRoutes: NavRoute[];
  isAdmin: boolean;
  renderButton: (button: NavRoute, isActive: boolean) => React.ReactNode;
}

const NavbarMapper: React.FC<NavbarProps> = ({ navRoutes, isAdmin,   renderButton }) => {
  const firstURLSegment = getURLSegment(usePathname(), 0);

  return (
    <nav>
      {navRoutes
        .filter((route) => {
          if ((route.URL === "/upload" && !isAdmin)|| (route.URL === "/login" &&isAdmin)) {
            return false;
          }
          return true;
        })
        .map((button) => {
          const isActive = getURLSegment(button.URL, 0) === firstURLSegment;
          return renderButton(button, isActive);
        })}
    </nav>
  );
};
 export default NavbarMapper;
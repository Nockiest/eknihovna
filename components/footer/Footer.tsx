// components/Footer.tsx

import Link from "next/link";
import Image from "next/image";
import { navRoutes } from "@/data/routeNames";
import { Box } from "@mui/material";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <Box className="flex flex-wrap  flex-col md:flex-row  space-x-4">
          {navRoutes.map((button, key) => (
            <Link className="hover:text-gray-400" key={key} href={button.URL}>
              {button.label}
            </Link>
          ))}
          <Link className="hover:text-gray-400" href={"/upload"}>
            Dev
          </Link>
        </Box>

        {/* Social Media Links */}
        {/* <div className="mt-4 md:mt-0">
          <a href="#" className="text-gray-400 hover:text-white">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.167 6.84 9.49-.099-.823-.184-2.086.04-2.995.2-.823 1.284-5.232 1.284-5.232s-.328-.663-.328-1.642c0-1.54.893-2.694 2.006-2.694 1.26 0 1.868.947 1.868 2.08 0 1.268-.807 3.167-1.225 4.933-.355 1.563.747 2.838 2.275 2.838 2.728 0 4.826-2.883 4.826-7.054C20 4.477 15.523 0 10 0z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a href="#" className="ml-4 text-gray-400 hover:text-white">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.167 6.84 9.49-.099-.823-.184-2.086.04-2.995.2-.823 1.284-5.232 1.284-5.232s-.328-.663-.328-1.642c0-1.54.893-2.694 2.006-2.694 1.26 0 1.868.947 1.868 2.08 0 1.268-.807 3.167-1.225 4.933-.355 1.563.747 2.838 2.275 2.838 2.728 0 4.826-2.883 4.826-7.054C20 4.477 15.523 0 10 0z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;

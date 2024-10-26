import { styled } from "@mui/material";

const HamburgerButton = styled("span")(({ theme }) => ({
  display: "none", // Hide by default
  backgroundColor: "var(--secondary)", // Use backgroundColor instead of background-color
  width: "3em",
  height: "5px",
  borderRadius: "1em",
  position: "relative",
  transition: "transform 250ms ease-in-out",

  // Media query for small screens
  [theme.breakpoints.down('sm')]: { // This assumes you're using Material-UI's theme
    display: "block", // Show on small screens
  },

  "&::before, &::after": {
    content: '""',
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "var(--secondary)", // Use backgroundColor instead of background-color
    height: "5px",
    borderRadius: "1em",
    transition: "transform 250ms ease-in-out",
  },

  "&::before": {
    top: "12px", // Positioning for top bar
  },

  "&::after": {
    bottom: "12px", // Positioning for bottom bar
  },
}));



const HamburgerMenu  = ({className}:{className:string}) => {
  return <HamburgerButton className={"hamburger"+className} />;
};

export default HamburgerMenu;
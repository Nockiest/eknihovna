import React from "react";
import {
  Slide,
  Paper,
  useTheme,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Fab,
} from "@mui/material";
import SearchBar from "./SearchBar";
import Filter from "./Filter";
import Image from "next/image";

interface SearcherProps {
  isOpen: boolean;
  setIsOpen:  React.Dispatch<React.SetStateAction<boolean>>;
}

const Searcher: React.FC<SearcherProps> = ({ isOpen,setIsOpen }) => {
  const classes = useTheme();
  return (
    <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>

      <Paper
        elevation={3}
        style={{
          position: "fixed",
          bottom: 0,
          left: "16px",
          right: "16px",
        //   minWidth: '400px',
          zIndex: 999, // Adjust z-index as necessary
          padding: "16px", // Adjust padding as necessary
          height: "75vh",
        }}
      >
        <button onClick={() => {setIsOpen(!isOpen)}}>
        <Fab >
        <Image src={"icon/cross.svg"} alt="cross" width={"32"} height={32} />
      </Fab>
        </button>

        <SearchBar />
        <Filter text={"román"} />
        <Filter text={"maturitní"} />
        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="maturitní" />
          {/* <FormControlLabel required control={<Checkbox />} label="Required" />
  <FormControlLabel disabled control={<Checkbox />} label="Disabled" /> */}
        </FormGroup>
      </Paper>
    </Slide>
  );
};

export default Searcher;

import { Chip, Typography } from "@mui/material";


interface FilterProps {
  text: string;
}

const Filter: React.FC<FilterProps> = ({ text }) => {

  return (
    <Chip
    label={
      <Typography variant="body1">
        {text}
      </Typography>
    }
  />
  );
};

export default Filter;

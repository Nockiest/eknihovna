import { Box } from "@mui/material";
// import StarEmpty from "./star-empty.svg";
// import StarFull from "./star-full.svg";
import Image from "next/image";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface StarRowProps {
  rating: number;
}

const StarRow: React.FC<StarRowProps> = ({ rating }) => {
  // Convert the rating from 1-100 to a 0-5 scale
  const filledStars = Math.round((rating / 100) * 5);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      sx={{ padding: "0 12px" }}
    >
      {[...Array(5)].map((_, index) => (
        index < filledStars ? (
          <StarIcon key={index} style={{ fontSize: 32 }} />
        ) : (
          <StarBorderIcon key={index} style={{ fontSize: 32 }} />
        )
      ))}
    </Box>
  );
};

export default StarRow;

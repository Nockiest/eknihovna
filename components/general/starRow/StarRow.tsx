import { Box } from "@mui/material";
import StarEmpty from "./star-empty.svg";
import StarFull from "./star-full.svg";
import Image from "next/image";
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
      {[...Array(5)].map((key, index) => (
        <Image
          key={key}
          src={index < filledStars ? StarFull : StarEmpty}
          alt={"star"}
          height={32}
          width={32}
        />
      ))}
    </Box>
  );
};

export default StarRow;

 
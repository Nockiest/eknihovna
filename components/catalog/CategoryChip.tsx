import { Chip, IconButton, Typography } from "@mui/material";
import Image from "next/image";


interface FilterProps {
  text: string;
}

// const CategoryChip: React.FC<FilterProps> = ({ text }) => {

//   return (
//     <Chip
//     label={
//       <Typography variant="body1">
//         {text}
//       </Typography>
//     }
//   />
//   );
// };


const CategoryChip: React.FC<{ text: string, onRemove: () => void }> = ({ text, onRemove }) => {
  return (
    <Chip
      label={text}
      onDelete={onRemove}
      deleteIcon={<IconButton onClick={onRemove} size="small"><Image src='/icon/cross.svg' alt='cross icon' height={16} width={16} /></IconButton>}
    />
  );
};
export default CategoryChip

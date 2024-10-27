import theme from "@/theme/theme";
import { Chip, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import CloseIcon from '@mui/icons-material/Close';
interface FilterProps {
  text: string;
  onRemove?: () => void;
}

const CategoryChip: React.FC<FilterProps> = ({ text, onRemove }) => {
  return (
    <Chip
      sx={{ margin: "2px 4px" ,
backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#e0e0e0", // Dark mode & light mode colors
        color: theme.palette.mode === "dark" ? "#fff" : "#000", // Adjust text color for contrast

      }}
      label={<Typography variant="body1">{text}</Typography>}
      onDelete={onRemove ? onRemove : undefined}
      deleteIcon={
        onRemove && (
          <IconButton onClick={onRemove} size="small">
          <CloseIcon />
          </IconButton>
        )
      }
    />
  );
};
export default CategoryChip;

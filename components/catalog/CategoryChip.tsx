import { Chip, IconButton, Typography } from "@mui/material";
import Image from "next/image";

interface FilterProps {
  text: string;
  onRemove?: () => void;
}

const CategoryChip: React.FC<FilterProps> = ({ text, onRemove }) => {
  return (
    <Chip
      sx={{ margin: "2px 4px" }}
      label={<Typography variant="body1">{text}</Typography>}
      onDelete={onRemove ? onRemove : undefined}
      deleteIcon={
        onRemove && (
          <IconButton onClick={onRemove} size="small">
            <Image
              src="/icon/cross.svg"
              alt="cross icon"
              height={16}
              width={16}
            />
          </IconButton>
        )
      }
    />
  );
};
export default CategoryChip;

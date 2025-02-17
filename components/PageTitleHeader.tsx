import { Box, Typography } from "@mui/material";

interface CatalogHeaderProps {
  title: string;
}

const PageTitleHeader: React.FC<CatalogHeaderProps> = ({ title }) => {
  return (
    <Box display="flex" alignItems="space-between" justifyContent={"center"}>
      <Typography className="mx-auto text-center mb-3" variant={"h2"}>
        {title}
      </Typography>
    </Box>
  );
};

export default PageTitleHeader;
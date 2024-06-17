import BookPreview from "@/components/BookPreview";
// import ThemedButtons from "@/theme/buttons/Buttons";
import { Typography } from "@mui/material";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>
          <Typography  variant="h1" component="h2"> jumping over the lazy brown foxes</Typography>
          <Typography  variant="h2" component="h2"> jumping over the lazy brown foxes</Typography>
          <Typography  variant="h3" component="h2"> jumping over the lazy brown foxes</Typography>
          <Typography  variant="h4" component="h2"> jumping over the lazy brown foxes</Typography>
          <Typography  variant="h5" component="h2"> jumping over the lazy brown foxes</Typography>
          <Typography  variant="h6" component="h2"> jumping over the lazy brown foxes</Typography>
          <Typography  variant="body1" component="h2"> jumping over the lazy brown foxes</Typography>
        </div>
    </main>
  );
}

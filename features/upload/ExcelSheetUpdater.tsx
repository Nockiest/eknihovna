"use client";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import { Box,  Paper, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import ReroutToAUth from "../../components/ReroutToAUth";
import { useEffect, useState } from "react";
import Uploader from "./functionality/Uploader";
import BookDeleter from "../apiCalls/BookDeleter";
import BookCountLogger from "../apiCalls/BookCountLogger";
import BookFetcher from "../apiCalls/BookFetcher";
import SingleBookDeleter from "./functionality/SingleBookDeleter";
import CustomButtonGroup from "../../components/styling/ButtonGroup";
import { splited_emails } from "@/data/values";
import SingleBookCreator from "./functionality/SingleBookCreator";
import BookGrid from "./functionality/BookRowsViewers";
import { UploadContext } from "@/app/upload/context";
import { Book } from "@/types/types";
import   fetchFilteredBooks   from "@/features/apiCalls/fetchFilteredBooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export const revalidate = 0;

// TODO: refactor to split auth and render functionality
const ExcelSheetUpdater = () => {
  const [books, setBooks] = useState<Book[]>([]);
  useEffect(() => {
    const fetching = async () => {
      const b: Book[] = await fetchFilteredBooks();
      console.log("Fetched books:", b.length);
      setBooks(b);
    };
    fetching();
  }, []);
  const { data: session, status } = useSession({ required: true });

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState( parseInt(searchParams.get("tab") || "0", 10) || 1); // Výchozí tab je první

  const changeTabInURL = (newPage: number) => {
    const currentQuery = new URLSearchParams(searchParams.toString());
    currentQuery.set("tab", newPage.toString());
    router.push(`${pathname}?${currentQuery.toString()}`);
  };

  if (!session) {
    return (
      <Box className="flex flex-col flex-center">
        <ReroutToAUth />
      </Box>
    );
  }


  if (!splited_emails|| !session?.user?.email) {
    console.log("splited_emails is undefined or empty",splited_emails, process.env.NEXT_PUBLIC_WHITE_LIST_EMAILS, process.env.TEST_ENV,  process.env.NEXT_PUBLIC_APP_API_URL, process.env);
    return (
      <>
        <Typography variant="body1">x {process?.env?.WHITE_LIST_EMAILS} x</Typography>
        <Typography variant="h6">
          Přihlašování selhalo, chyba je na straně apilkace
        </Typography>
      </>
    );
  }
  if (
    splited_emails.indexOf(session?.user?.email) < 0
  ) {
    return (
      <>
        <Typography variant="h2" className="text-xl font-semibold mb-4">
          Neplatný administrátorský účet
        </Typography>
        <PrimaryButton onClick={() => signOut()}>
          <Typography>Odhlásit se</Typography>
        </PrimaryButton>
      </>
    );
  }

  // Funkce pro vykreslení správné komponenty
  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <Uploader />;
      case 1:
        return <SingleBookCreator />;
      case 2:
        return <SingleBookDeleter />;
      case 3:
        return <BookGrid />;


      default:
        return null;
    }
  };
  return (
    <UploadContext.Provider value={{ books ,setBooks}}>
   <Box className="flex flex-col h-auto gap-4 z-0 select-none px-12 items-center justify-center">
      <Paper className="flex flex-col  h-auto gap-16 w-full">
        <CustomButtonGroup
          buttons={[
            { text: "Hromadné nahrání", onClick: () => changeTabInURL(0) },
            { text: "Vytvořit Knihu", onClick: () => changeTabInURL(1) },
            { text: "Smazat Knihu", onClick: () => changeTabInURL(2) },
            { text: "Prohlédnout knihy", onClick: () => changeTabInURL(3) },
          ]}
          activeIndex={activeTab}
          setActiveIndex={setActiveTab}
          activeButtonStyles="text-gray-400"
          inactiveOpacity="0.5"
        />
        {/* Box pro vykreslení vybrané komponenty */}
        <Box className="flex w-full h-screen bg-white shadow-lg rounded-lg overflow-hidden">
          {renderContent()}
        </Box>

        <Box className="mb-4 ml-8">
          <BookFetcher />
          <BookDeleter />
          <BookCountLogger />
        </Box>
      </Paper>

      <PrimaryButton onClick={() => signOut()} sx={{ margin: "2em" }}>
        <Typography>Odhlásit se</Typography>
      </PrimaryButton>
    </Box>
    </UploadContext.Provider>


  );
};

export default ExcelSheetUpdater;

"use client";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import { Box, Button, Paper, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import ReroutToAUth from "../general/ReroutToAUth";
import Announcer from "@/utils/Announcer";
import { useState } from "react";
import SingleBookEditor from "./functionality/SingleBookEditor";
import Uploader from "./functionality/Uploader";
import BookDeleter from "./functionality/BookDeleter";
import BookCountLogger from "./functionality/BookCountLogger";
import BookFetcher from "./functionality/BookFetcher";
import SingleBookDeleter from "./functionality/SingleBookDeleter";
import CustomButtonGroup from "../general/ButtonGroup";
export const revalidate = 0;

const ExcelSheetUpdater = () => {
  const { data: session, status } = useSession({ required: true });
  const [activeTab, setActiveTab] = useState(1); // Výchozí tab je první

  if (!session) {
    return (
      <Box className="flex flex-col flex-center">
        <ReroutToAUth />
      </Box>
    );
  }
  var splited_emails = process?.env?.WHITE_LIST_EMAILS?.split(":");
  if (
    splited_emails &&
    session?.user?.email &&
    splited_emails.indexOf(session?.user?.email) < 0
  ) {
    //  session?.user?.email !== "ondralukes06@seznam.cz" && session?.user?.email !== "bauerova@gopat.cz"
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
        return <SingleBookEditor />;
      case 2:
        return <SingleBookDeleter />;
    
      default:
        return null;
    }
  };
  return (
    <Box className="flex flex-col h-auto gap-4 z-0 select-none px-12 items-center justify-center">
      <Paper className="flex flex-col  h-auto gap-16 w-full">
        <CustomButtonGroup
          buttons={[
            { text: 'Hromadné nahrání', onClick: () => setActiveTab(0) },
            { text: 'Editovat Knihu', onClick: () => setActiveTab(1) },
            { text: 'Smazat Knihu', onClick: () => setActiveTab(2) },
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
  );
};

export default ExcelSheetUpdater;

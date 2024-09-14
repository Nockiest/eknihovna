"use client";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import { Box, Paper, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import ReroutToAUth from "../general/ReroutToAUth";
import Announcer from "@/theme/Announcer";
import { useState } from "react";
import SingleBookEditor from "./functionality/SingleBookEditor";
import Uploader from "./functionality/Uploader";
import BookDeleter from "./functionality/BookDeleter";
import BookCountLogger from "./functionality/BookCountLogger";
import BookFetcher from "./functionality/BookFetcher";
import SingleBookDeleter from "./functionality/SingleBookDeleter";
export const revalidate = 0;

const ExcelSheetUpdater = () => {
  const { data: session, status } = useSession({ required: true });
  const [responseMessage, setResponseMessage] = useState<string | null>("");

  if (!session) {
    return (
      <div className="flex flex-center">
        <ReroutToAUth />
      </div>
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

  return (
    <Box className="flex flex-col h-auto gap-4 z-0 select-none items-center justify-center">
      <Paper className='flex flex-col  h-auto gap-16 w-full'>
        <Box className="flex flex-col md:flex-row w-full  h-screen bg-white shadow-lg rounded-lg overflow-hidden">
          <Uploader setResponseMessage={setResponseMessage} />
          <BookFetcher setResponseMessage={setResponseMessage} />
          <SingleBookEditor setResponseMessage={setResponseMessage} />
          <SingleBookDeleter setResponseMessage={setResponseMessage}/>
        </Box>

        <Box className="mb-4 ml-8">
          <BookDeleter setResponseMessage={setResponseMessage} />
          <BookCountLogger setResponseMessage={setResponseMessage} />
        </Box>
      </Paper>
      <Announcer message={responseMessage} type={"normal"} />

      <PrimaryButton onClick={() => signOut()} sx={{ margin: "2em" }}>
        <Typography>Odhlásit se</Typography>
      </PrimaryButton>

    </Box>
  );
};

export default ExcelSheetUpdater;

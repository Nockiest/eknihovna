'use client'
import React, { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Uploader from "./functionality/Uploader";
import SingleBookCreator from "./functionality/SingleBookCreator";
import SingleBookDeleter from "./functionality/SingleBookDeleter";
import BookGrid from "./functionality/BookRowsViewers";
import CustomButtonGroup from "../../components/styling/ButtonGroup";
import { UploadContext } from "@/app/upload/context";
import BookFetcher from "../apiCalls/BookFetcher";
import BookDeleter from "../apiCalls/BookDeleter";
import BookCountLogger from "../apiCalls/BookCountLogger";
import { Book } from "@/types/types";
import fetchFilteredBooks from "../apiCalls/fetchFilteredBooks";

const AdminPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  useEffect(() => {
    const fetching = async () => {
      const b: Book[] = await fetchFilteredBooks();
      console.log("Fetched books:", b.length);
      setBooks(b);
    };
    fetching();
  }, []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(
    parseInt(searchParams.get("tab") || "0", 10) || 1
  );

  const changeTabInURL = (newPage: number) => {
    const currentQuery = new URLSearchParams(searchParams.toString());
    currentQuery.set("tab", newPage.toString());
    router.push(`${pathname}?${currentQuery.toString()}`);
  };

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
    <UploadContext.Provider value={{ books, setBooks }}>
      <Box className="flex flex-col h-auto gap-4 z-0 select-none px-12 items-center justify-center">
        <Paper className="flex flex-col h-auto gap-16 w-full">
          <CustomButtonGroup
            buttons={[
              { text: "Hromadné nahrání", onClick: () => changeTabInURL(0) },
              { text: "Vytvořit Knihu", onClick: () => changeTabInURL(1) },
              { text: "Smazat Knihu", onClick: () => changeTabInURL(2) },
              { text: "Prohlédnout/Editovat knihy", onClick: () => changeTabInURL(3) },
            ]}
            activeIndex={activeTab}
            setActiveIndex={setActiveTab}
            activeButtonStyles="text-gray-400"
            inactiveOpacity="0.5"
          />
          <Box className="flex w-full  bg-white shadow-lg rounded-lg overflow-hidden">
            {renderContent()}
          </Box>
          <Box className="mb-4 ml-8">
            <BookFetcher   />
            <BookDeleter />
            <BookCountLogger />
          </Box>
        </Paper>
      </Box>
    </UploadContext.Provider>
  );
};

export default AdminPage;

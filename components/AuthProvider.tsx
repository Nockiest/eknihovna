'use client'
import React from "react";
import SessionWrapper from "./SessionWrapper";
import ExcelSheetUpdater from "./general/ExcelSheetUpdater";

const AuthProvider = ({children}:{children:React.ReactNode}) => {
  return (
    <SessionWrapper>
     {children}
    </SessionWrapper>
  );
};

export default AuthProvider;

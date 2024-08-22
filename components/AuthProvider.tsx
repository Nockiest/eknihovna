'use client'
import React from "react";
import SessionWrapper from "./SessionWrapper";

const AuthProvider = ({children}:{children:React.ReactNode}) => {
  return (
    <SessionWrapper>
     {children}
    </SessionWrapper>
  );
};

export default AuthProvider;

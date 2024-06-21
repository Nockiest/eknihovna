'use client'
import DotsShower from "@/components/DotsShower";
import { useEffect, useState } from "react";

const LoadingPage = () => {


    return (
       <div
       style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
            <DotsShower />
       </div>
    );
  };

  export default LoadingPage;

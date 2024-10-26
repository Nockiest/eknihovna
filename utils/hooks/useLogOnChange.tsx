 'use client'
import { useEffect } from "react";

const useLogOnChange = (val: any) => {
  useEffect(() => {
    console.log(val);
  }, [val]);
};

export default useLogOnChange;
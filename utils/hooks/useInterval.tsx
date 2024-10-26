import { useEffect } from "react";

const useInterval = (callback: () => void, condition: boolean) => {
    useEffect(() => {
      // Only set up the interval if the condition is true
      if (!condition) return;

      const intervalId = setInterval(() => {
        callback();
      }, 1000); // Call the function every second (1000 ms)

      // Cleanup function to clear the interval when the condition changes or component unmounts
      return () => clearInterval(intervalId);
    }, [callback, condition]); // Dependencies: callback and condition
  };

export default useInterval
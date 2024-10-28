import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Optional for development
import React, { ReactNode } from "react";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,          // Retry once on failure
      refetchOnWindowFocus: false, // Do not refetch on window focus
    },
  },
});


const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} /> {/* Remove in production */}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;

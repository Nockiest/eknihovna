// import { usePathname, useRouter } from "next/navigation";

import { NextRouter } from "next/router";

export const getLastURLSegment = (pathname : string ): string => {
    const segments = pathname.split("/");
    return segments[segments.length - 1];
  };
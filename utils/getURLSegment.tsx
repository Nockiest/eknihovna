// import { usePathname, useRouter } from "next/navigation";

import { NextRouter } from "next/router";

export const getURLSegment = (pathname: string, segmentIndex: number): string => {
    const segments = pathname.split("/").filter(Boolean); // Filter to remove empty strings
    if (segmentIndex < 0 || segmentIndex >= segments.length) {
      return '';
    }
    return segments[segmentIndex];
  };

// pages/api/[your-endpoint].js

import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

  var splited_TRUSTED_DOMAINS =
  process.env.TRUSTED_DOMAINS?.split(";");

  export default function verifyDomain(req: NextRequest) {
    const origin = req.headers.get("origin") || req.headers.get("referer");
    console.log(splited_TRUSTED_DOMAINS)
    if (!splited_TRUSTED_DOMAINS|| splited_TRUSTED_DOMAINS.length === 0) {
      console.error("Trusted domains are not set up correctly in environment variables.");
      return  false
    }

    if (!splited_TRUSTED_DOMAINS.includes(origin || "")) {
      console.error(splited_TRUSTED_DOMAINS + "doesnt include" + origin);
      return false
    }

    // Return null to indicate the request is valid and can proceed
    return true;
  }
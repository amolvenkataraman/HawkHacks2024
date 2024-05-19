import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse  } from "next/server";

export default async function GET( req: NextApiRequest ) {

    return NextResponse.json({ message: "Hello from Next.js!" }, { status: 200 });
}

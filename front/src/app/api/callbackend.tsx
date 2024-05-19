import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
    
    const body = req.body;
    console.log(body)

    res.status(200).json({ message: "Hello from Next.js!" });
}

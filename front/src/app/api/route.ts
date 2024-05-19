import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse  } from "next/server";

export async function POST(req: NextApiRequest) {

    /*
        We will put the target url in the body and request type
    */
   try {
    const body = req.body;
    const headers = req.headers
    
    const buffer = [];
    for await (const chunk of body) {
      buffer.push(chunk);
    }

    const requestBody = Buffer.concat(buffer).toString('utf-8');
    const getData = JSON.parse(requestBody);

    // Convert incoming HTTP headers to Headers object
    const requestHeaders = new Headers();
    requestHeaders.append('content-type', 'application/json')
    requestHeaders.append('authorization', getData.authorization)

    const response = await fetch(body.targetUrl, {
        method: getData.method,
        headers: requestHeaders,
        body: requestBody
    });

    if (!response.ok) {
        return NextResponse.json({'message': response.statusText}, {status: response.status})
    }

    const data = await response.json()

    return NextResponse.json(data, { status: 200 });
   } catch (err) {
    console.log(err)
    return NextResponse.json({'error': err}, { status: 400 });
   }
}

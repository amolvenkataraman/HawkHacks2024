

function requestHandler(_request: Request): Response {
    return Response.json({ message: "Hello from Next.js!" });
  }
  
export { requestHandler as GET };

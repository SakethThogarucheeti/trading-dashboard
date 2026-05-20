export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const upstream = `${process.env.API_URL}/api/decisions/stream?${searchParams}`;

  const response = await fetch(upstream, {
    headers: { Accept: "text/event-stream" },
  });

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

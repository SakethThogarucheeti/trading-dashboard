import { createFileRoute } from "@tanstack/react-router";

const API_URL = process.env.VITE_API_URL ?? "http://localhost:8081";

export const proxyHandler = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const target = `${API_URL}${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? request.body
      : undefined;

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body,
    // @ts-expect-error - Node.js fetch requires duplex for streaming bodies
    duplex: "half",
  });

  // Node's fetch transparently decompresses gzip/br/deflate bodies, but the
  // upstream response's content-encoding/content-length headers still
  // describe the original *compressed* bytes, not the decoded body we're
  // about to forward. Passing those headers through unchanged made the
  // browser try to gunzip an already-decoded body, failing with
  // ERR_CONTENT_DECODING_FAILED on any upstream response large enough to
  // cross FastAPI's GZipMiddleware threshold (e.g. /api/algos, but not the
  // smaller /api/positions) — silently empty panels/selectors across the
  // dashboard rather than a visible error.
  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
};

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: proxyHandler,
      POST: proxyHandler,
      PUT: proxyHandler,
      PATCH: proxyHandler,
      DELETE: proxyHandler,
    },
  },
});

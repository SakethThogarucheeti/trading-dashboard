import { createFileRoute } from "@tanstack/react-router";

const API_URL = process.env.VITE_API_URL ?? "http://localhost:8081";

const proxyHandler = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const target = `${API_URL}${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? request.body
      : undefined;

  return fetch(target, {
    method: request.method,
    headers,
    body,
    // @ts-expect-error - Node.js fetch requires duplex for streaming bodies
    duplex: "half",
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

import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { gzipSync } from "node:zlib";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { proxyHandler } from "@/src/routes/api.$";

const UPSTREAM = "http://localhost:8081";

// Real upstream responses that cross FastAPI's GZipMiddleware threshold are
// actually gzip-compressed on the wire; Node's fetch() transparently
// decompresses them before we ever see the body. Compress the mock body for
// real so this test exercises the same decompression path production hits,
// rather than a header set on plaintext (which the previous version of this
// test — and the bug itself — was blind to).
const gzipped = gzipSync(Buffer.from(JSON.stringify([{ name: "default" }])));

const server = setupServer(
  http.get(`${UPSTREAM}/api/algos`, () =>
    new HttpResponse(gzipped, {
      headers: {
        "content-type": "application/json",
        "content-encoding": "gzip",
        "content-length": String(gzipped.length),
      },
    })
  ),
  http.get(`${UPSTREAM}/api/positions`, () => HttpResponse.json([]))
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("proxyHandler", () => {
  it("strips content-encoding/content-length so the browser doesn't try to re-decode an already-decoded body", async () => {
    const request = new Request("http://localhost:3000/api/algos");
    const response = await proxyHandler({ request });

    expect(response.headers.get("content-encoding")).toBeNull();
    expect(response.headers.get("content-length")).toBeNull();
    expect(await response.json()).toEqual([{ name: "default" }]);
  });

  it("passes through responses with no content-encoding unchanged", async () => {
    const request = new Request("http://localhost:3000/api/positions");
    const response = await proxyHandler({ request });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
  });
});

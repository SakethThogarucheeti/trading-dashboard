import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { T } from "@/lib/echarts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
    },
  },
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Algo Trading Dashboard" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap",
      },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body style={{ backgroundColor: T.bg, color: T.text, minHeight: "100vh", margin: 0, fontFamily: T.font }}>
        <QueryClientProvider client={queryClient}>
          <nav
            style={{
              backgroundColor: T.surface,
              borderBottom: `1px solid ${T.border}`,
              padding: "10px 24px",
              display: "flex",
              gap: 24,
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 15, color: T.text }}>Algo Trading</span>
            <Link to="/" style={{ fontSize: 12, color: T.text, textDecoration: "none" }}>
              Live
            </Link>
            <Link to="/reports" style={{ fontSize: 12, color: T.text, textDecoration: "none" }}>
              Reports
            </Link>
            <Link to="/login" style={{ fontSize: 12, color: T.text, textDecoration: "none", marginLeft: "auto" }}>
              Login
            </Link>
          </nav>
          <main style={{ padding: 24 }}>
            <Outlet />
          </main>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}

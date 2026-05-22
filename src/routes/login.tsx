import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { T } from "@/lib/echarts";
import { fetchLoginUrl, postAuthCallback } from "@/lib/api";

const searchSchema = z.object({
  request_token: z.string().optional(),
  status: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  component: LoginPage,
});

type State = "idle" | "redirecting" | "exchanging" | "success" | "error";

function LoginPage() {
  const navigate = useNavigate();
  const { request_token, status } = Route.useSearch();

  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!request_token || status !== "success") return;
    setState("exchanging");
    postAuthCallback(request_token)
      .then((result) => {
        setUserName(result.user_name);
        setState("success");
        setTimeout(() => navigate({ to: "/" }), 2000);
      })
      .catch((err: unknown) => {
        setMessage(err instanceof Error ? err.message : String(err));
        setState("error");
      });
  }, [request_token, status, navigate]);

  async function handleLogin() {
    setState("redirecting");
    try {
      const { url } = await fetchLoginUrl();
      window.location.href = url;
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : String(err));
      setState("error");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 24,
      }}
    >
      <div
        style={{
          backgroundColor: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          padding: "40px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          minWidth: 320,
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Zerodha Login</span>

        {state === "idle" && (
          <>
            <p style={{ fontSize: 13, color: T.muted, textAlign: "center", margin: 0 }}>
              Authenticate with Zerodha to refresh your access token.
            </p>
            <button onClick={handleLogin} style={btnStyle}>
              Login with Zerodha
            </button>
          </>
        )}
        {state === "redirecting" && <p style={{ fontSize: 13, color: T.muted }}>Opening Zerodha login…</p>}
        {state === "exchanging" && <p style={{ fontSize: 13, color: T.muted }}>Exchanging token…</p>}
        {state === "success" && (
          <p style={{ fontSize: 13, color: T.pos }}>
            Logged in{userName ? ` as ${userName}` : ""}. Redirecting…
          </p>
        )}
        {state === "error" && (
          <>
            <p style={{ fontSize: 13, color: T.neg }}>{message || "An error occurred."}</p>
            <button onClick={() => setState("idle")} style={btnStyle}>
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  backgroundColor: T.accent,
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "10px 24px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  width: "100%",
};

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchReport } from "@/lib/api";
import { ReportRenderer } from "@/components/reports/ReportRenderer";
import { T } from "@/lib/echarts";

export const Route = createFileRoute("/reports/$sessionId")({
  component: ReportDetailPage,
});

function ReportDetailPage() {
  const { sessionId } = Route.useParams();
  const { data: report, error } = useQuery({
    queryKey: ["report", sessionId],
    queryFn: () => fetchReport(sessionId),
    retry: false,
  });

  return (
    <div>
      <Link
        to="/reports"
        style={{ color: T.muted, fontSize: 12, textDecoration: "none", display: "block", marginBottom: 16 }}
      >
        ← Back to Reports
      </Link>
      {error && (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            color: T.neg,
            backgroundColor: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
          }}
        >
          Report not found: <code>{sessionId}</code>
        </div>
      )}
      {report && <ReportRenderer report={report} />}
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { fetchCampaigns, fetchResources, fetchEmergencyContacts, fetchReportsForAdmin, getLocalSurveyResponses } from "../../lib/services";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { Container, Card, Badge, LoadingSpinner } from "../../components/ui/Primitives";
import type { Campaign, EmergencyContact, Resource, SafetyReport, ReportStatus } from "../../types";

const COLORS = ["#0e7c7b", "#ea9a2e", "#0f1b2d", "#b3402c", "#4a5568", "#c97e1a"];

type TabKey = "overview" | "analytics" | "reports" | "campaigns" | "resources" | "emergency";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "analytics", label: "Survey Analytics" },
  { key: "reports", label: "Safety Reports" },
  { key: "campaigns", label: "Campaigns" },
  { key: "resources", label: "Resources" },
  { key: "emergency", label: "Emergency Contacts" },
];

export function AdminDashboard() {
  const [tab, setTab] = useState<TabKey>("overview");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [emergency, setEmergency] = useState<EmergencyContact[]>([]);
  const [reports, setReports] = useState<SafetyReport[]>([]);
  const [surveyAnswerCount, setSurveyAnswerCount] = useState(0);
  const [concernDistribution, setConcernDistribution] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [c, r, e, rep] = await Promise.all([
        fetchCampaigns(),
        fetchResources(),
        fetchEmergencyContacts(),
        fetchReportsForAdmin(),
      ]);
      setCampaigns(c);
      setResources(r);
      setEmergency(e);
      setReports(rep);

      // Aggregate the "which safety concerns" checkbox question (q1) across responses,
      // whether backed by Supabase or the local demo store.
      const counts: Record<string, number> = {};
      let totalResponses = 0;

      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase
          .from("survey_answers")
          .select("answer_value, question_id")
          .eq("question_id", "q1");
        (data ?? []).forEach((row: { answer_value: string }) => {
          row.answer_value.split("||").forEach((v) => {
            if (!v) return;
            counts[v] = (counts[v] ?? 0) + 1;
          });
        });
        const { count } = await supabase.from("survey_responses").select("*", { count: "exact", head: true });
        totalResponses = count ?? 0;
      } else {
        const local = getLocalSurveyResponses();
        totalResponses = local.length;
        local.forEach((resp) => {
          const val = resp.answers["q1"];
          if (!val) return;
          val.split("||").forEach((v) => {
            if (!v) return;
            counts[v] = (counts[v] ?? 0) + 1;
          });
        });
      }

      setSurveyAnswerCount(totalResponses);
      setConcernDistribution(Object.entries(counts).map(([name, value]) => ({ name, value })));
      setLoading(false);
    }
    load();
  }, []);

  const reportStatusData = useMemo(() => {
    const statuses: ReportStatus[] = ["new", "reviewing", "resolved", "closed"];
    return statuses.map((s) => ({ name: s, value: reports.filter((r) => r.status === s).length }));
  }, [reports]);

  if (loading) return <LoadingSpinner label="Loading admin dashboard" />;

  return (
    <Container className="py-10">
      <h1 className="font-display text-3xl text-navy">Admin dashboard</h1>
      <p className="mt-1 text-sm text-slate">Manage surveys, campaigns, resources, reports, and emergency contacts.</p>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-line pb-4">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}>
            <Badge tone={tab === t.key ? "teal" : "neutral"}>{t.label}</Badge>
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "overview" && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Survey responses" value={surveyAnswerCount} />
            <StatCard label="Safety reports" value={reports.length} />
            <StatCard label="Active campaigns" value={campaigns.length} />
            <StatCard label="Published resources" value={resources.length} />
          </div>
        )}

        {tab === "analytics" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <p className="font-display text-lg text-navy">Most reported safety concerns</p>
              <p className="text-xs text-slate">From survey question: "Which safety concerns do you encounter most often?"</p>
              <div className="mt-4 h-64">
                {concernDistribution.length === 0 ? (
                  <p className="pt-16 text-center text-sm text-slate">No survey responses yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={concernDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d9d4c8" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0e7c7b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            <Card>
              <p className="font-display text-lg text-navy">Report status breakdown</p>
              <p className="text-xs text-slate">Across all submitted safety reports.</p>
              <div className="mt-4 h-64">
                {reports.length === 0 ? (
                  <p className="pt-16 text-center text-sm text-slate">No reports submitted yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={reportStatusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                        {reportStatusData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </div>
        )}

        {tab === "reports" && <ReportsTable reports={reports} setReports={setReports} />}

        {tab === "campaigns" && (
          <ListTable
            headers={["Title", "Category", "Status", "Dates"]}
            rows={campaigns.map((c) => [c.title, c.category, c.status, `${c.start_date} → ${c.end_date}`])}
          />
        )}

        {tab === "resources" && (
          <ListTable headers={["Title", "Category", "Published"]} rows={resources.map((r) => [r.title, r.category, r.published ? "Yes" : "No"])} />
        )}

        {tab === "emergency" && (
          <ListTable headers={["Name", "Category", "Phone", "Jurisdiction"]} rows={emergency.map((e) => [e.name, e.category, e.phone, e.jurisdiction])} />
        )}
      </div>

      {!isSupabaseConfigured && (
        <p className="mt-10 text-xs text-slate">
          Campaigns, resources, and emergency contacts shown here come from local demo data. Connect Supabase (see
          <code className="mx-1 rounded bg-paper-dim px-1">SUPABASE_SETUP.md</code>) and manage these tables directly
          in the Supabase Table Editor, or extend this dashboard with create/edit forms following the same pattern
          used for Safety Reports below.
        </p>
      )}
    </Container>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <p className="font-display text-3xl text-navy">{value}</p>
      <p className="mt-1 text-sm text-slate">{label}</p>
    </Card>
  );
}

function ListTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-paper-dim">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-medium text-navy">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={headers.length} className="px-4 py-6 text-center text-slate">No records yet.</td></tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="border-b border-line last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-slate">{cell}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
}

function ReportsTable({
  reports,
  setReports,
}: {
  reports: SafetyReport[];
  setReports: (r: SafetyReport[]) => void;
}) {
  async function updateStatus(id: string, status: ReportStatus) {
    if (isSupabaseConfigured && supabase) {
      await supabase.from("safety_reports").update({ status }).eq("id", id);
    } else {
      const key = "safeaware_demo_reports";
      const all = JSON.parse(localStorage.getItem(key) ?? "[]");
      const updated = all.map((r: SafetyReport) => (r.id === id ? { ...r, status } : r));
      localStorage.setItem(key, JSON.stringify(updated));
    }
    setReports(reports.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-paper-dim">
          <tr>
            <th className="px-4 py-3 font-medium text-navy">Category</th>
            <th className="px-4 py-3 font-medium text-navy">Description</th>
            <th className="px-4 py-3 font-medium text-navy">Anonymous</th>
            <th className="px-4 py-3 font-medium text-navy">Submitted</th>
            <th className="px-4 py-3 font-medium text-navy">Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 ? (
            <tr><td colSpan={5} className="px-4 py-6 text-center text-slate">No reports submitted yet.</td></tr>
          ) : (
            reports.map((r) => (
              <tr key={r.id} className="border-b border-line align-top last:border-0">
                <td className="px-4 py-3 text-slate">{r.category}</td>
                <td className="max-w-sm px-4 py-3 text-slate">{r.description}</td>
                <td className="px-4 py-3 text-slate">{r.is_anonymous ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-slate">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value as ReportStatus)}
                    className="rounded-md border border-line px-2 py-1 text-xs"
                  >
                    {["new", "reviewing", "resolved", "closed"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
}

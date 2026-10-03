import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { fetchResources } from "../lib/services";
import { Container, Card, Badge, LoadingSpinner, SectionHeading, EmptyState } from "../components/ui/Primitives";
import type { Resource } from "../types";

export function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetchResources().then((r) => {
      setResources(r);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(resources.map((r) => r.category)))], [resources]);

  const filtered = resources.filter((r) => {
    const matchesCategory = category === "All" || r.category === category;
    const matchesQuery = r.title.toLowerCase().includes(query.toLowerCase()) || r.summary.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Safety Resources"
        title="Short, practical safety guides"
        description="Searchable, categorised guidance you can read in under two minutes."
      />

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources…"
            className="w-full rounded-md border border-line py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-line px-3 py-2.5 text-sm outline-none focus:border-teal"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading resources" />
      ) : filtered.length === 0 ? (
        <div className="mt-8"><EmptyState title="No resources match" description="Try a different search term or category." /></div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {filtered.map((r) => (
            <Card key={r.id} className="cursor-pointer" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
              <Badge>{r.category}</Badge>
              <h3 className="font-display mt-3 text-lg text-navy">{r.title}</h3>
              <p className="mt-2 text-sm text-slate">{r.summary}</p>
              {expanded === r.id && <p className="mt-3 border-t border-line pt-3 text-sm text-slate">{r.content}</p>}
              <p className="mt-3 text-xs font-medium text-teal-dark">{expanded === r.id ? "Show less" : "Read more"}</p>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}

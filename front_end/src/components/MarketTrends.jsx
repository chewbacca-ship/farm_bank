import { useMemo } from "react";
import { TrendingUp, TrendingDown, Newspaper, BarChart2, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import useNews from "../hooks/useNews";

const MarketTrends = () => {
  const { data, isLoading, isError } = useNews();

  const commodityData = useMemo(
    () => [
      { month: "Jan", corn: 425, wheat: 650, soybeans: 1350, cattle: 140 },
      { month: "Feb", corn: 435, wheat: 660, soybeans: 1380, cattle: 142 },
      { month: "Mar", corn: 445, wheat: 675, soybeans: 1420, cattle: 145 },
      { month: "Apr", corn: 460, wheat: 685, soybeans: 1450, cattle: 148 },
      { month: "May", corn: 475, wheat: 695, soybeans: 1480, cattle: 151 },
      { month: "Jun", corn: 480, wheat: 705, soybeans: 1500, cattle: 153 },
    ],
    [],
  );

  const marketSummary = useMemo(
    () => [
      {
        name: "Corn",
        price: "$4.80/bu",
        changePct: "+2.4%",
        changeValue: "+$0.11",
        positive: true,
        note: "Export demand strengthens"
      },
      {
        name: "Wheat",
        price: "$7.05/bu",
        changePct: "+1.8%",
        changeValue: "+$0.12",
        positive: true,
        note: "Weather support in Midwest"
      },
      {
        name: "Soybeans",
        price: "$15.00/bu",
        changePct: "+3.2%",
        changeValue: "+$0.47",
        positive: true,
        note: "China purchases surprise"
      },
      {
        name: "Cattle",
        price: "$153/cwt",
        changePct: "-0.8%",
        changeValue: "-$1.20",
        positive: false,
        note: "Processing capacity softens"
      },
    ],
    [],
  );

  const fallbackNews = useMemo(
    () => [
      {
        title: "Corn futures rally on strong export demand",
        published_at: "2024-09-04T08:30:00Z",
        category: "Commodities",
      },
      {
        title: "Weather concerns boost wheat prices in the Midwest",
        published_at: "2024-09-04T06:15:00Z",
        category: "Weather",
      },
      {
        title: "Soybean exports to Asia reach monthly high",
        published_at: "2024-09-03T21:10:00Z",
        category: "Trade",
      },
      {
        title: "Cattle prices ease amid processing issues",
        published_at: "2024-09-03T17:45:00Z",
        category: "Livestock",
      },
    ],
    [],
  );

  const newsItems = useMemo(() => {
    if (!data || !Array.isArray(data?.data)) return fallbackNews;
    return data.data.slice(0, 6).map((item) => ({
      title: item.title,
      category: item.category || item.source || "News",
      published_at: item.published_at,
    }));
  }, [data, fallbackNews]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const published = new Date(timestamp);
    if (Number.isNaN(published.getTime())) return "Just now";
    const diffMs = Date.now() - published.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours <= 0) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (isLoading) {
    return <div className="mx-auto max-w-4xl rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">Loading market trends…</div>;
  }

  if (isError) {
    return <div className="mx-auto max-w-4xl rounded-xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-600">Market data is unavailable right now. Please refresh later.</div>;
  }

  return (
    <section className="min-h-screen bg-slate-100 py-10">
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6">
        <header className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-3">
            <p className="text-[13px] uppercase tracking-wide text-slate-500">Market overview</p>
            <h1 className="text-3xl font-semibold text-slate-900">Agricultural commodity pulse</h1>
            <p className="text-sm text-slate-600">
              Price performance, trading volumes, and headlines that shape the farm economy. Updated with six-month benchmarks and curated news.
            </p>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {marketSummary.map((item) => (
            <article key={item.name} className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${item.positive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                  {item.positive ? "Bullish" : "Soft"}
                </span>
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{item.price}</p>
              <div className={`mt-2 inline-flex items-center gap-1 text-sm ${item.positive ? "text-emerald-600" : "text-rose-600"}`}>
                {item.positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{item.changePct}</span>
                <span className="text-xs text-slate-500">({item.changeValue})</span>
              </div>
              <p className="mt-3 text-xs text-slate-500">{item.note}</p>
            </article>
          ))}
        </div>

        <div className="space-y-6">
          <article className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Commodity price trends</h2>
                <p className="text-sm text-slate-500">Six-month spot price history (¢/bu)</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                <BarChart2 className="h-4 w-4" />
                Seasonal pattern
              </span>
            </header>
            <div className="mt-4 h-[22rem] w-full">
              <ResponsiveContainer>
                <LineChart data={commodityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 100}`} />
                  <Tooltip formatter={(value) => `$${Number(value / 100).toFixed(2)}`} contentStyle={{ borderRadius: "0.75rem", border: "1px solid #e2e8f0" }} />
                  <Line type="monotone" dataKey="corn" stroke="#059669" strokeWidth={2} dot={false} name="Corn" />
                  <Line type="monotone" dataKey="wheat" stroke="#2563eb" strokeWidth={2} dot={false} name="Wheat" />
                  <Line type="monotone" dataKey="soybeans" stroke="#f59e0b" strokeWidth={2} dot={false} name="Soybeans" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Monthly volume comparison</h2>
                <p className="text-sm text-slate-500">Futures contract volume by commodity</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-4 w-4" />
                Rolling six months
              </span>
            </header>
            <div className="mt-4 h-[22rem] w-full">
              <ResponsiveContainer>
                <BarChart data={commodityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid #e2e8f0" }} />
                  <Bar dataKey="corn" fill="#059669" name="Corn" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="wheat" fill="#2563eb" name="Wheat" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="soybeans" fill="#f59e0b" name="Soybeans" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </div>

        <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Latest market news</h2>
              <p className="text-sm text-slate-500">Live feed of agriculture headlines</p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs text-slate-500">
              <Newspaper className="h-4 w-4" />
              RSS stream
            </span>
          </header>
          <div className="relative h-24 overflow-hidden bg-slate-50">
            <div className="absolute inset-0 flex min-w-max gap-6 px-6 py-4" style={{ animation: "marquee-left 35s linear infinite" }}>
              {[...newsItems, ...newsItems].map((news, index) => (
                <div
                  key={`${news.title}-${index}`}
                  className="flex min-w-[260px] flex-col gap-1 rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {news.category}
                    </span>
                    <span aria-hidden="true">•</span>
                    <span>{formatTime(news.published_at)}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800">{news.title}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default MarketTrends;

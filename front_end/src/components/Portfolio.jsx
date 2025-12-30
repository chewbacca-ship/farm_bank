import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  DollarSign,
  ShieldCheck,
  Sprout,
  Factory,
  BarChart3,
} from "lucide-react";

const Portfolio = () => {
  const portfolioPerformance = [
    { month: "Jan", value: 95000 },
    { month: "Feb", value: 98000 },
    { month: "Mar", value: 105000 },
    { month: "Apr", value: 112000 },
    { month: "May", value: 118000 },
    { month: "Jun", value: 125000 },
  ];

  const allocationData = [
    { name: "Crops", value: 55000, percentage: 44, color: "#22c55e" },
    { name: "Farmland", value: 45000, percentage: 36, color: "#3b82f6" },
    { name: "Livestock", value: 25000, percentage: 20, color: "#f59e0b" },
  ];

  const metricHighlights = [
    {
      title: "Total Return",
      value: "+14.4%",
      description: "Since inception",
      icon: TrendingUp,
      tone: "text-emerald-600",
      chip: "YoY",
    },
    {
      title: "Annualized Return",
      value: "+12.8%",
      description: "12 month average",
      icon: Target,
      tone: "text-sky-600",
      chip: "Trailing",
    },
    {
      title: "Volatility",
      value: "8.2%",
      description: "Standard deviation",
      icon: AlertTriangle,
      tone: "text-amber-600",
      chip: "Low",
    },
    {
      title: "Sharpe Ratio",
      value: "1.56",
      description: "Risk-adjusted",
      icon: DollarSign,
      tone: "text-purple-600",
      chip: "Above avg",
    },
  ];

  const topPerformers = [
    { name: "Midwest Farmland REIT", return: "+17.6%", value: 45000 },
    { name: "Corn Futures Q2", return: "+13.6%", value: 35000 },
    { name: "Cattle Ranch Partnership", return: "+12.6%", value: 25000 },
    { name: "Soybean Commodity Fund", return: "+11.1%", value: 20000 },
  ];

  const riskSignals = [
    {
      label: "Portfolio diversification",
      score: 82,
      status: "Healthy mix across assets",
      tone: "bg-emerald-500",
    },
    {
      label: "Risk exposure",
      score: 64,
      status: "Moderate volatility on commodities",
      tone: "bg-amber-500",
    },
    {
      label: "Liquidity buffer",
      score: 88,
      status: "Sufficient cash for obligations",
      tone: "bg-sky-500",
    },
  ];

  const recommendations = [
    "Increase livestock allocation towards 25% to capture protein demand",
    "Add sustainable agriculture fund exposure for ESG balance",
    "Lock in partial gains on corn futures; watch price resistance at $6.20",
  ];

  const formatCurrency = (value) =>
    `$${Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-100 py-12 px-6">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="rounded-3xl bg-white/80 px-8 py-6 shadow-xl ring-1 ring-slate-100 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm font-medium uppercase tracking-wide">Portfolio overview</span>
              </div>
              <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
                Your agricultural investments at a glance
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Monitor performance, track allocation trends, and spot opportunities to keep your farm investments thriving.
              </p>
            </div>
            <div className="flex flex-col gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <Sprout className="h-4 w-4 text-emerald-500" />
                <span>Farming assets spread across 3 regions</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <Factory className="h-4 w-4 text-sky-500" />
                <span>Processing partners delivering 21% blended margin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {metricHighlights.map((metric) => {
            const Icon = metric.icon;
            return (
              <article
                key={metric.title}
                className="rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-md shadow-emerald-50 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">{metric.title}</p>
                    <p className={`mt-2 text-2xl font-semibold ${metric.tone}`}>{metric.value}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                    <Icon className={`h-4 w-4 ${metric.tone.replace("text", "fill")}`} />
                    {metric.chip}
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-500">{metric.description}</p>
              </article>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <article className="rounded-3xl bg-white/80 p-6 shadow-xl ring-1 ring-slate-100 backdrop-blur">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Performance trajectory</h2>
                <p className="text-sm text-slate-500">Portfolio value across the last six months</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-4 w-4" />
                +$12,000 in growth
              </span>
            </header>

            <div className="mt-6 h-72 w-full">
              <ResponsiveContainer>
                <AreaChart data={portfolioPerformance}>
                  <defs>
                    <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Portfolio value"]}
                    contentStyle={{
                      borderRadius: "1rem",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} fill="url(#portfolioGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-3xl bg-white/80 p-6 shadow-xl ring-1 ring-slate-100 backdrop-blur">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Asset allocation</h2>
                <p className="text-sm text-slate-500">Diversification across categories</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                <BarChart3 className="h-4 w-4" />
                Updated weekly
              </span>
            </header>

            <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="mx-auto h-56 w-56 lg:mx-0">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {allocationData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex-1 space-y-4">
                {allocationData.map((item) => (
                  <li key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{formatCurrency(item.value)} invested</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{item.percentage}%</p>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <article className="rounded-3xl bg-white/80 p-6 shadow-xl ring-1 ring-slate-100 backdrop-blur">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Top performers</h2>
                <p className="text-sm text-slate-500">Leaders driving portfolio gains</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-4 w-4" />
                Momentum
              </span>
            </header>

            <ul className="mt-6 space-y-4">
              {topPerformers.map((instrument, index) => (
                <li
                  key={instrument.name}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-sm font-semibold text-emerald-600">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{instrument.name}</p>
                      <p className="text-xs text-slate-500">Current value {formatCurrency(instrument.value)}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-emerald-600">{instrument.return}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl bg-white/80 p-6 shadow-xl ring-1 ring-slate-100 backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-900">Risk & actions</h2>
            <p className="text-sm text-slate-500">Understand exposure and next steps.</p>

            <ul className="mt-5 space-y-4">
              {riskSignals.map((signal) => (
                <li key={signal.label} className="rounded-2xl border border-slate-100 bg-white px-4 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">{signal.label}</p>
                    <span className="text-xs font-medium text-slate-500">Score {signal.score}</span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${signal.tone}`}
                      style={{ width: `${signal.score}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{signal.status}</p>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl bg-emerald-50 px-4 py-4">
              <h3 className="text-sm font-semibold text-emerald-700">Recommendations</h3>
              <ul className="mt-3 space-y-2 text-xs text-emerald-600">
                {recommendations.map((tip) => (
                  <li key={tip}>• {tip}</li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

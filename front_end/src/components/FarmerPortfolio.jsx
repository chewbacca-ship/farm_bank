import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Calendar,
  ClipboardList,
  TrendingUp,
  Tractor,
  Sprout,
  Wheat,
} from "lucide-react";

const FarmerPortfolio = () => {
  const yieldPerformance = [
    { season: "Spring", corn: 4.2, wheat: 3.6, soy: 3.1 },
    { season: "Summer", corn: 4.6, wheat: 3.8, soy: 3.4 },
    { season: "Autumn", corn: 4.8, wheat: 3.9, soy: 3.6 },
    { season: "Winter", corn: 3.9, wheat: 3.2, soy: 2.8 },
  ];

  const fieldObservation = [
    { date: "Jul 04", note: "Corn tasseling across north field. Moisture adequate." },
    { date: "Jul 06", note: "Soybean leaves showing slight yellowing near irrigation line." },
    { date: "Jul 08", note: "Cattle herd moved to east pasture. Salt blocks replenished." },
    { date: "Jul 09", note: "Checked irrigation pivots – no leaks detected." },
  ];

  const upcomingJobs = [
    {
      title: "Sprayer calibration",
      date: "Jul 11, 08:00 AM",
      details: "Prepare sprayer for foliar feeding on soybeans.",
    },
    {
      title: "Corn scouting",
      date: "Jul 13, 06:30 AM",
      details: "Check for armyworm pressure along south perimeter.",
    },
    {
      title: "Bale inspection",
      date: "Jul 15, 03:00 PM",
      details: "Inspect baler knives before upcoming cutting.",
    },
  ];

  const resourceSummary = [
    {
      title: "Water usage",
      value: "18,200 gal",
      caption: "Weekly total across drip and pivot irrigation",
    },
    {
      title: "Fuel consumption",
      value: "132 gal",
      caption: "Diesel usage for tractors and sprayers",
    },
    {
      title: "Fertiliser applied",
      value: "2.4 tons",
      caption: "Split application of potassium",    
    },
    {
      title: "Livestock health",
      value: "No issues",
      caption: "Daily checks – weight gain on track",
    },
  ];

  return (
    <section className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6">
        <header className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-3">
            <p className="text-[13px] uppercase tracking-wide text-slate-500">Farm portfolio</p>
            <h1 className="text-3xl font-semibold text-slate-900">Yield records and field observations</h1>
            <p className="text-sm text-slate-600">
              A consolidated view of seasonal yields, weekly field notes, and jobs to keep your operation organised.
            </p>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {resourceSummary.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-800">{item.title}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{item.value}</p>
              <p className="mt-2 text-xs text-slate-500">{item.caption}</p>
            </article>
          ))}
        </div>

        <article className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Seasonal yield performance</h2>
              <p className="text-sm text-slate-500">Average yield per acre across major crops (metric tons)</p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs text-slate-500">
              <TrendingUp className="h-4 w-4" />
              Last four seasons
            </span>
          </header>
          <div className="mt-4 h-[22rem] w-full">
            <ResponsiveContainer>
              <AreaChart data={yieldPerformance}>
                <defs>
                  <linearGradient id="corn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="wheat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="soy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="season" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => value.toFixed(1)} />
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid #e2e8f0" }} />
                <Area type="monotone" dataKey="corn" stroke="#16a34a" fill="url(#corn)" name="Corn" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="wheat" stroke="#2563eb" fill="url(#wheat)" name="Wheat" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="soy" stroke="#f97316" fill="url(#soy)" name="Soybeans" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Field notes</h2>
                <p className="text-sm text-slate-500">Observations recorded over the past week</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                <ClipboardList className="h-4 w-4" />
                Scouting log
              </span>
            </header>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {fieldObservation.map((entry) => (
                <li key={entry.date} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold text-slate-500">{entry.date}</p>
                  <p className="mt-1 text-sm text-slate-700">{entry.note}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Upcoming jobs</h2>
                <p className="text-sm text-slate-500">Tasks to keep the operation on schedule</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="h-4 w-4" />
                Work orders
              </span>
            </header>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {upcomingJobs.map((job) => (
                <li key={job.title} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">{job.title}</p>
                  <p className="text-xs text-slate-500">{job.date}</p>
                  <p className="mt-1 text-xs text-slate-500">{job.details}</p>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Seasonal focus areas</h2>
              <p className="text-sm text-slate-500">Keep an eye on these field priorities</p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs text-slate-500">
              <Sprout className="h-4 w-4" />
              Field planning
            </span>
          </header>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm text-slate-600">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-semibold text-slate-800">Corn</p>
              <p className="text-xs text-slate-500">Monitor silk growth and pollination success; watch for pests.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-semibold text-slate-800">Soybeans</p>
              <p className="text-xs text-slate-500">Check nodulation and leaf color; prepare for foliar feed.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-semibold text-slate-800">Pasture</p>
              <p className="text-xs text-slate-500">Track regrowth after grazing; rotate herds every 5–7 days.</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default FarmerPortfolio;

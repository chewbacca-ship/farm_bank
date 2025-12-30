import { useMemo, useState } from "react";
import {
  Sprout,
  Tractor,
  Droplet,
  MapPin,
  Clock,
  ClipboardList,
  BarChart3,
  Leaf,
} from "lucide-react";
import useProfile from "../hooks/useProfile";
import useOpportunities from "../hooks/useOpportunities";

const FarmerDashboard = () => {
  const { data: profile, isLoading, error } = useProfile();
  const { data: opportunities } = useOpportunities();
  const [showAllProjects, setShowAllProjects] = useState(false);

  const farmSummary = useMemo(() => {
    if (!profile) {
      return {
        totalRaised: 0,
        activeCampaigns: 0,
        averageProgress: 0,
        locationCount: 0,
      };
    }

    const projects = profile.investments || [];
    const totalRaised = projects.reduce((acc, project) => acc + Number(project.amount_raised || 0), 0);
    const activeCampaigns = projects.filter((project) => project.status !== "withdrawn").length;
    const averageProgress = projects.length
      ? projects.reduce((acc, project) => acc + (project.funding_progress || 0), 0) / projects.length
      : 0;
    const locationCount = new Set(projects.map((project) => project.location || "N/A")).size;

    return {
      totalRaised,
      activeCampaigns,
      averageProgress: Math.round(averageProgress),
      locationCount,
    };
  }, [profile]);

  const suggestedOpportunities = useMemo(() => {
    if (!opportunities || !Array.isArray(opportunities)) return [];
    return opportunities
      .filter((item) => item.category?.toLowerCase().includes("farm") || item.category === "Livestock")
      .slice(0, 3);
  }, [opportunities]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
          Loading your farm dashboard…
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-xl border border-rose-200 bg-rose-50 px-6 py-12 text-center text-sm text-rose-600">
          We couldn't load your farm data right now. Please refresh or try again later.
        </div>
      </div>
    );
  }

  const projects = profile.investments || [];
  const visibleProjects = showAllProjects ? projects : projects.slice(0, 3);

  return (
    <section className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6">
        <header className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-3">
            <p className="text-[13px] uppercase tracking-wide text-slate-500">Farm operations overview</p>
            <h1 className="text-3xl font-semibold text-slate-900">Grow your projects with real-time insights</h1>
            <p className="text-sm text-slate-600">
              Track funding progress, monitor crop performance, and keep on top of upcoming tasks across your farm portfolio.
            </p>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">Total raised</p>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-700">Capital</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900">${farmSummary.totalRaised.toLocaleString()}</p>
            <p className="mt-3 text-xs text-slate-500">Across {farmSummary.activeCampaigns} active funding campaigns</p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">Average funding progress</p>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-[11px] font-medium text-sky-700">Funding</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{farmSummary.averageProgress}%</p>
            <p className="mt-3 text-xs text-slate-500">Weighted average across open projects</p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">Locations managed</p>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-medium text-amber-700">Footprint</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{farmSummary.locationCount}</p>
            <p className="mt-3 text-xs text-slate-500">Including crop fields and livestock operations</p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">Tasks this week</p>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">Operations</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900">12</p>
            <p className="mt-3 text-xs text-slate-500">Irrigation, field inspections, logistics</p>
          </article>
        </div>

        <article className="space-y-5">
          <header className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-slate-900">Active farm projects</h2>
            <p className="text-sm text-slate-600">Monitor funding status, timelines, and key crop metrics.</p>
          </header>

          {projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
              You don't have any active funding campaigns yet. Launch a new project to begin raising capital.
            </div>
          ) : (
            <div className="space-y-4">
              {visibleProjects.map((project) => {
                const completion = project.funding_progress || 0;
                return (
                  <article
                    key={project.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-3 md:flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-700">
                            <Leaf className="h-3 w-3" />
                            {project.category}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
                            <MapPin className="h-3 w-3" />
                            {project.location || '—'}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
                            <Clock className="h-3 w-3" />
                            {project.duration_months} months
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
                          <p className="mt-1 text-sm text-slate-600">{project.description}</p>
                        </div>

                        <dl className="grid gap-3 sm:grid-cols-3 text-sm text-slate-600">
                          <div>
                            <dt className="text-[12px] uppercase tracking-wide text-slate-500">Funding goal</dt>
                            <dd className="mt-1 text-base font-semibold text-slate-900">
                              ${Number(project.funding_goal || 0).toLocaleString()}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[12px] uppercase tracking-wide text-slate-500">Amount raised</dt>
                            <dd className="mt-1 text-base font-semibold text-emerald-600">
                              ${Number(project.amount_raised || 0).toLocaleString()}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[12px] uppercase tracking-wide text-slate-500">Status</dt>
                            <dd className="mt-1 text-base font-semibold text-slate-900">{project.status || 'Pending'}</dd>
                          </div>
                        </dl>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Funding progress</span>
                            <span className="font-semibold text-slate-700">{Math.round(completion)}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${Math.min(completion, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-start gap-3 md:w-52">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                          <p className="mb-2 font-semibold text-slate-700">Next tasks</p>
                          <ul className="space-y-1">
                            <li className="flex items-center gap-2"><Tractor className="h-3.5 w-3.5" /> Field preparation</li>
                            <li className="flex items-center gap-2"><Droplet className="h-3.5 w-3.5" /> Irrigation check</li>
                            <li className="flex items-center gap-2"><ClipboardList className="h-3.5 w-3.5" /> Progress report</li>
                          </ul>
                        </div>
                        <button className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-600 transition hover:border-emerald-300 hover:text-emerald-700">
                          Update progress
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}

              {projects.length > 3 && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                    onClick={() => setShowAllProjects((prev) => !prev)}
                  >
                    {showAllProjects ? 'Show fewer projects' : 'View all projects'}
                  </button>
                </div>
              )}
            </div>
          )}
        </article>

        <article className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Upcoming schedule</h2>
                <p className="text-sm text-slate-500">Key activities and checkpoints for the next 7 days</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-4 w-4" />
                Week view
              </span>
            </header>

            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="mt-0.5 inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-slate-800">Irrigation cycle – North field</p>
                  <p className="text-xs text-slate-500">Monday, 08:00 AM • 12 acres</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="mt-0.5 inline-flex h-2 w-2 rounded-full bg-sky-500" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-slate-800">Soil nutrient assessment</p>
                  <p className="text-xs text-slate-500">Wednesday, 10:30 AM • South greenhouse</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="mt-0.5 inline-flex h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-slate-800">Livestock health inspection</p>
                  <p className="text-xs text-slate-500">Friday, 02:00 PM • West barn</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Suggested collaborations</h2>
                <p className="text-sm text-slate-500">Opportunities aligned with your portfolio</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                <BarChart3 className="h-4 w-4" />
                Marketplace
              </span>
            </header>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {suggestedOpportunities.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs text-slate-500">
                  No tailored suggestions at the moment. Check back soon for new collaboration offers.
                </p>
              ) : (
                suggestedOpportunities.map((item) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-800">{item.name || item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default FarmerDashboard;

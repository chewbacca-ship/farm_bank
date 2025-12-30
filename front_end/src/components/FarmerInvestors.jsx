import { useMemo } from "react";
import { Users, Wallet, BarChart3, PiggyBank, Tractor } from "lucide-react";
import useProfile from "../hooks/useProfile";
import useOpportunities from "../hooks/useOpportunities";

const FarmerInvestors = () => {
  const { data: profile, isLoading, error } = useProfile();
  const { data: opportunities } = useOpportunities();

  const opportunityMap = useMemo(() => {
    if (!opportunities || !Array.isArray(opportunities)) return new Map();
    return new Map(
      opportunities.map((item) => [
        item.id || item.opportunityId || item.opportunity_id,
        item,
      ]),
    );
  }, [opportunities]);

  const projects = profile?.investments || [];

  const investorSummary = useMemo(() => {
    if (!projects.length) {
      return {
        totalInvestors: 0,
        totalRaised: 0,
        averageContribution: 0,
      };
    }

    let investorCount = 0;
    let totalRaised = 0;

    projects.forEach((project) => {
      const matched = opportunityMap.get(project.opportunity_id);
      const count = matched?.investorCount ?? matched?.investors ?? 0;
      investorCount += Number(count) || 0;
      totalRaised += Number(project.amount_raised || 0);
    });

    const averageContribution = investorCount > 0 ? totalRaised / investorCount : 0;

    return {
      totalInvestors: investorCount,
      totalRaised,
      averageContribution,
    };
  }, [projects, opportunityMap]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
          Loading investor information…
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-xl border border-rose-200 bg-rose-50 px-6 py-12 text-center text-sm text-rose-600">
          We couldn't fetch investor data. Please refresh or try again later.
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6">
        <header className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-3">
            <p className="text-[13px] uppercase tracking-wide text-slate-500">Investor overview</p>
            <h1 className="text-3xl font-semibold text-slate-900">Backers supporting your farm projects</h1>
            <p className="text-sm text-slate-600">
              Review how many investors are contributing to each campaign, their funding levels, and average contributions.
            </p>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">Total active investors</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{investorSummary.totalInvestors}</p>
            <p className="mt-2 text-xs text-slate-500">Across all open funding campaigns</p>
            <Users className="mt-4 h-6 w-6 text-slate-400" />
          </article>
          <article className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">Capital raised</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">${investorSummary.totalRaised.toLocaleString()}</p>
            <p className="mt-2 text-xs text-slate-500">Funds contributed by current investors</p>
            <Wallet className="mt-4 h-6 w-6 text-slate-400" />
          </article>
          <article className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">Average contribution</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">${investorSummary.averageContribution.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            <p className="mt-2 text-xs text-slate-500">Per investor across your campaigns</p>
            <BarChart3 className="mt-4 h-6 w-6 text-slate-400" />
          </article>
          <article className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">New inquiries this month</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">4</p>
            <p className="mt-2 text-xs text-slate-500">Potential investors requesting project info</p>
            <PiggyBank className="mt-4 h-6 w-6 text-slate-400" />
          </article>
        </div>

        <article className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Investor breakdown by project</h2>
              <p className="text-sm text-slate-500">See how many people back each initiative and their funding progress.</p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs text-slate-500">
              <Tractor className="h-4 w-4" />
              Campaign overview
            </span>
          </header>
          <div className="mt-4 space-y-4">
            {projects.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                No active campaigns yet. Launch a funding round to begin attracting investors.
              </div>
            ) : (
              projects.map((project) => {
                const matched = opportunityMap.get(project.opportunity_id);
                const investorCount = Number(matched?.investorCount ?? matched?.investors ?? 0);
                const amountRaised = Number(project.amount_raised || 0);
                const fundingGoal = Number(project.funding_goal || 0);
                const progress = Math.min(100, project.funding_progress || (fundingGoal ? (amountRaised / fundingGoal) * 100 : 0));
                const averageTicket = investorCount > 0 ? amountRaised / investorCount : amountRaised;

                return (
                  <div key={project.id} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">{project.title}</h3>
                        <p className="text-xs text-slate-500">{project.location} • {project.duration_months} months</p>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          {investorCount} investors
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Wallet className="h-3.5 w-3.5 text-slate-400" />
                          ${amountRaised.toLocaleString()} raised
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <PiggyBank className="h-3.5 w-3.5 text-slate-400" />
                          Avg ${averageTicket.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Funding progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent investor activity</h2>
              <p className="text-sm text-slate-500">Latest contributions and messages from interested backers</p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs text-slate-500">
              <Users className="h-4 w-4" />
              Engagement log
            </span>
          </header>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-semibold text-slate-800">$12,500 committed</p>
              <p className="text-xs text-slate-500">Investor group "Harvest Partners" backed the dairy expansion.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-semibold text-slate-800">Message from GreenFields Fund</p>
              <p className="text-xs text-slate-500">Requesting crop rotation plan before confirming participation.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-semibold text-slate-800">$4,800 received</p>
              <p className="text-xs text-slate-500">Returning investor increased stake in the hydroponics greenhouse.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-semibold text-slate-800">Site visit scheduled</p>
              <p className="text-xs text-slate-500">Two investors will tour the north pasture next Tuesday.</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default FarmerInvestors;

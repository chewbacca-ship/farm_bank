import { useMemo, useState } from "react";
import {
  Sprout,
  PiggyBank,
  MapPin,
  TrendingUp,
  Users,
  Clock,
  Shield,
  ArrowBigDownDash
} from "lucide-react";
import InvestNow from "./InvestNow";
import useOpportunities from "../hooks/useOpportunities";

const Opportunities = () => {
  const [showInvestNowModal, setShowInvestNowModal] = useState(false);
  const [investmentOpportunity, setInvestmentOpportunity] = useState(null);
  const { data, isLoading, error } = useOpportunities();

  const formattedOpportunities = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      ...item,
      fundingProgress: Number(item.fundingProgress || 0),
      minInvestment: Number(item.minInvestment || 0),
      amountRaised: Number(item.amountRaised || 0),
      fundingGoal: Number(item.fundingGoal || 0),
      investors: Number(item.investors || 0),
      durationMonths: Number.isFinite(Number(item.durationMonths))
        ? `${item.durationMonths} months`
        : item.durationMonths,
    }));
  }, [data]);

  const openInvestModal = (opportunity) => {
    setInvestmentOpportunity(opportunity);
    setShowInvestNowModal(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getRiskBadge = (riskLevel) => {
    switch (riskLevel) {
      case "Low":
      case "Low-Medium":
        return "bg-emerald-100 text-emerald-700";
      case "Medium":
        return "bg-amber-100 text-amber-700";
      case "Medium-High":
        return "bg-orange-100 text-orange-700";
      case "High":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  if (isLoading) {
    return <div className="mx-auto max-w-4xl rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">Loading opportunities...</div>;
  }

  if (error) {
    return <div className="mx-auto max-w-4xl rounded-xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-600">Failed to load opportunities. Please try again.</div>;
  }

  console.log("see am o",typeof formattedOpportunities.min);

  return (
    <section className="relative min-h-screen bg-slate-100 py-10 w-screen">
      {showInvestNowModal && <div className="fixed inset-0 z-30 bg-slate-900/50" aria-hidden="true" />}

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6">
                  <h2 className="text-2xl font-bold tracking-wide text-green-900">Investment opportunities</h2>
                  
        <header className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm ">
          <div className="flex flex-col gap-3 ">
  
            <h1 className="text-2xl text-left lg:text-3xl font-semibold text-slate-900">Connect capital with farms</h1>
            <p className=" text-base lg:text-sm text-slate-600  leading-8">
              Browse curated agricultural projects with steady growth potential. Each opportunity includes on-the-ground insights, target returns, and funding progress.
              
            </p>
            
          </div>
          
        </header>
        <div className="flex justify-center items-center">
           <ArrowBigDownDash className="relative h-6 w-6 text-green-800" />

        </div>
       
        
      
        <div className="grid gap-5 lg:grid-cols-2 border">
          {formattedOpportunities.map((opportunity) => {
            const Icon = opportunity.icon || Sprout;

            return (
              <article
                key={opportunity.id}
                className="flex h-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-500">
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">{opportunity.name}</h2>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                          <span className="font-medium text-slate-600">{opportunity.category}</span>
                          <span aria-hidden="true">•</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {opportunity.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getRiskBadge(opportunity.riskLevel)}`}>
                      <Shield className="h-3.5 w-3.5" />
                      {opportunity.riskLevel || 'Risk'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">{opportunity.description}</p>
                </div>

                <dl className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-2">
                  <div>
                    <dt className="text-[12px] uppercase tracking-wide text-slate-500">Expected return</dt>
                    <p className="mt-1 text-base font-semibold text-emerald-600">{opportunity.expected_return}%</p>
                  </div>
                  <div>
                    <dt className="text-[12px] uppercase tracking-wide text-slate-500">Duration</dt>
                    <dd className="mt-1 text-base font-semibold text-slate-800">{opportunity.duration_months}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] uppercase tracking-wide text-slate-500">Min. investment </dt>
                    <p className="mt-1 text-base font-semibold text-slate-800">${Number(opportunity.min_investment).toLocaleString()}</p>
                  </div>
                  <div>
                    <dt className="text-[12px] uppercase tracking-wide text-slate-500">Investors</dt>
                    <dd className="mt-1 inline-flex items-center gap-1 text-base font-semibold text-slate-800">
                      <Users className="h-4 w-4 text-slate-400" />
                      {opportunity.investors}
                    </dd>
                  </div>
                </dl>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Funding progress</span>
                    <span className="font-semibold text-slate-700">{Math.round(opportunity.fundingProgress)}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${Math.min(opportunity.fundingProgress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>${opportunity.amount_raised.toLocaleString()} raised</span>
                    <span>${opportunity.funding_goal.toLocaleString()} goal</span>
                  </div>
                </div>

                {opportunity.highlights && opportunity.highlights.length > 0 && (
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="font-medium">Key highlights</p>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="">Projected to close in {opportunity.duration_months} months</span>
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-emerald-200 px-5 py-2 text-sm font-semibold text-emerald-600 transition hover:border-emerald-300 hover:text-emerald-700"
                    onClick={() => openInvestModal(opportunity)}
                  >
                    Invest now
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {showInvestNowModal && investmentOpportunity && (
        <div className="flex justify-center">
          <InvestNow
            showInvestNowModal={showInvestNowModal}
            setShowInvestNowModal={setShowInvestNowModal}
            investmentOpportunity={investmentOpportunity}
          />
        </div>
      )}
    </section>
  );
};

export default Opportunities;

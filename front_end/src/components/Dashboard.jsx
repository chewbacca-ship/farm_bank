import { useMemo, useState } from "react";
import {
    Wallet,
    TrendingUp,
    Sprout,
    PiggyBank,
    MapPin,
    Cog,
    BarChart3,
    Target,
    Calendar,
} from "lucide-react";
import useProfile from "../hooks/useProfile";
import useOpportunities from "../hooks/useOpportunities";
import ManageInvestment from "./ManageInvestment";


const Dashboard = () => {

    const { data: profile, isLoading: profileIsLoading, error: profileError} = useProfile()
    const { data: opportunities } = useOpportunities()
    const [showManageInvestment, setShowManageInvestment] = useState(false)
    const balance = profile?.account?.wallet_balance 
    const userInvestments = profile?.investments
    const [currentInvestment, setCurrentInvestment] = useState(null)

    const portfolioSummary = useMemo(() => {
        const investments = userInvestments || []
        const totalInvested = investments.reduce((acc, investment) => acc + Number(investment.amount_invested || 0), 0)
        const projectedReturns = investments.reduce((acc, investment) => {
            const amount = Number(investment.amount_invested || 0)
            const expected = Number(investment.expected_return || 0)
            return acc + amount * (expected / 100)
        }, 0)
        const activeCount = investments.filter((investment) => investment.status === 'active').length
        const averageReturn = totalInvested > 0 ? projectedReturns / totalInvested : 0
        const completionRate = investments.reduce((acc, investment) => {
            const goal = Number(investment.funding_goal || 0)
            const raised = Number(investment.amount_raised || 0)
            if (!goal) return acc
            return acc + Math.min((raised / goal) * 100, 100)
        }, 0) / (investments.length || 1)

        return {
            totalInvested,
            projectedReturns,
            activeCount,
            averageReturn,
            completionRate,
        }
    }, [userInvestments])

    const highlightCards = useMemo(() => (
        [
            {
                title: 'Wallet balance',
                value: balance ? `$${Number(balance).toLocaleString()}` : '—',
                caption: '+2.1% vs last month',
                icon: Wallet,
            },
            {
                title: 'Capital deployed',
                value: `$${portfolioSummary.totalInvested.toLocaleString()}`,
                caption: `${portfolioSummary.activeCount} active projects`,
                icon: PiggyBank,
            },
            {
                title: 'Projected returns',
                value: `$${portfolioSummary.projectedReturns.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                caption: `${(portfolioSummary.averageReturn * 100 || 0).toFixed(1)}% avg yield`,
                icon: TrendingUp,
            },
            {
                title: 'Funding progress',
                value: `${Math.round(portfolioSummary.completionRate || 0)}%`,
                caption: 'Average completion rate',
                icon: BarChart3,
            },
        ]
    ), [balance, portfolioSummary])

    const availableOpportunities = useMemo(() => {
        if (!opportunities) return 0
        if (Array.isArray(opportunities)) return opportunities.length
        if (Array.isArray(opportunities?.data)) return opportunities.data.length
        return 0
    }, [opportunities])

   
    return (
        <section className="relative min-h-screen w-screen bg-slate-100 py-10 overflow-hidden">
            {showManageInvestment && <div className="fixed inset-0 z-30 bg-slate-900/50" aria-hidden="true" />}
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6">
                <header className="rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-[13px] text-center uppercase tracking-wide text-slate-500">Portfolio overview</p>
                            <h1 className="mt-1 text-xl text-center lg:text-3xl font-semibold text-slate-900">
                                Welcome back to your farmland dashboard
                            </h1>
                            <p className="mt-2 max-w-2xl text-center text-sm text-slate-600">
                                Review current holdings, performance, and funding progress across your agricultural investments.
                            </p>
                        </div>
                        <div className="grid gap-3 text-sm text-slate-600">
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                                <Target className="h-4 w-4 text-emerald-600" />
                                <span>{portfolioSummary.activeCount || 0} active projects in your portfolio</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                                <Sprout className="h-4 w-4 text-sky-600" />
                                <span>{availableOpportunities} investment opportunities available</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                                <Calendar className="h-4 w-4 text-slate-500" />
                                <span>Figures updated on {new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid gap-4  md:grid-cols-2 xl:grid-cols-4">
                    {highlightCards.map((card) => {
                        const Icon = card.icon
                        return (
                            <article
                                key={card.title}
                                className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-[12px] uppercase tracking-wide text-slate-500">{card.title}</p>
                                        <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
                                    </div>
                                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                </div>
                                <p className="mt-3 text-xs text-slate-600">{card.caption}</p>
                            </article>
                        )
                    })}
                </div>

                <article className="space-y-5">
                    <header className="flex flex-col gap-1">
                        <h2 className="text-2xl font-semibold text-slate-900">Your investments</h2>
                        <p className="text-sm text-slate-600">Review capital deployed, progress, and next milestones.</p>
                    </header>

                    {profileIsLoading ? (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
                            Loading your portfolio...
                        </div>
                    ) : profileError ? (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-600">
                            We couldn’t fetch your investments right now. Please refresh or try again later.
                        </div>
                    ) : (userInvestments && userInvestments.length ? (
                        <div className="space-y-4">
                            {userInvestments.map((investment) => {
                                const fundingProgress = investment.funding_goal
                                    ? Math.min((investment.amount_raised / investment.funding_goal) * 100, 100)
                                    : 0
                                const projectedReturn = Number(investment.amount_invested || 0) * (Number(investment.expected_return || 0) / 100)

                                return (
                                    <article
                                        key={investment.id}
                                        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
                                            <div className="space-y-4 lg:flex-1">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-600">
                                                        {investment.category}
                                                    </span>
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                                                        {investment.status || 'Pending'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-slate-900">{investment.title}</h3>
                                                    <p className="mt-1 text-sm text-slate-600">{investment.description}</p>
                                                </div>
                                                <dl className="grid gap-4 sm:grid-cols-3 text-sm text-slate-600">
                                                    <div>
                                                        <dt className="text-[12px] uppercase tracking-wide text-slate-500">Capital invested</dt>
                                                        <dd className="mt-1 text-base font-semibold text-slate-900">
                                                            ${Number(investment.amount_invested || 0).toLocaleString()}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-[12px] uppercase tracking-wide text-slate-500">Projected return</dt>
                                                        <dd className="mt-1 text-base font-semibold text-emerald-600">
                                                            ${projectedReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-[12px] uppercase tracking-wide text-slate-500">Expected yield</dt>
                                                        <dd className="mt-1 text-base font-semibold text-emerald-500">
                                                            {investment.expected_return}%
                                                        </dd>
                                                    </div>
                                                </dl>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                                        <span>Funding progress</span>
                                                        <span>{Math.round(fundingProgress)}%</span>
                                                    </div>
                                                    <div className="h-2 w-full rounded-full bg-slate-200">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                                                            style={{ width: `${fundingProgress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 flex-col items-start gap-3 md:w-48">
                                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                                                    <p className="font-semibold text-slate-700">Project details</p>
                                                    <div className="mt-2 space-y-1">
                                                        <p className="flex items-center gap-2">
                                                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                            <span>{investment.location || '—'}</span>
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <Sprout className="h-3.5 w-3.5 text-slate-400" />
                                                            <span>{investment.duration_months} months</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-600 transition hover:border-emerald-300 hover:text-emerald-700"
                                                    onClick={() => {
                                                        setCurrentInvestment(investment)
                                                        setShowManageInvestment(true)
                                                    }}
                                                >
                                                    <Cog className="h-4 w-4" />
                                                    Manage investment
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
                            You don’t have active investments yet. Explore opportunities to start growing your portfolio.
                        </div>
                    ))}
                </article>

                {showManageInvestment && currentInvestment && (
                    <ManageInvestment
                        currentInvestment={currentInvestment}
                        setShowManageInvestment={setShowManageInvestment}
                    />
                )}
            </div>
        </section>
    )
}

export default Dashboard;

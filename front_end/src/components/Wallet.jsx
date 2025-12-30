import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react";
import { useState } from "react";
import useProfile from "../hooks/useProfile";
import MakePayment from "./MakePayment";

const Wallet = () => {
    const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
    const { data: profile } = useProfile();

    const balance = profile?.account?.wallet_balance || 0;
    const totalInvested = profile?.investments?.reduce(
        (acc, investment) => acc + Number(investment.amount_invested || 0),
        0,
    ) || 0;
    const avgReturn = profile?.investments && profile.investments.length > 0
        ? profile.investments.reduce((acc, investment) => acc + Number(investment.expected_return || 0), 0) /
          profile.investments.length
        : 0;
    const projectedYield = (totalInvested * (avgReturn / 100)) || 0;

    const fallbackTransactions = [
        { id: "tx-1", label: "Seed Purchase", date: "2024-08-02", amount: -320.45, method: "Mobile Money" },
        { id: "tx-2", label: "Harvest Payout", date: "2024-07-18", amount: 1250.0, method: "Bank Transfer" },
        { id: "tx-3", label: "Irrigation Setup", date: "2024-07-01", amount: -540.9, method: "Farm Wallet" },
        { id: "tx-4", label: "Investor Deposit", date: "2024-06-12", amount: 2000.0, method: "Card Payment" },
    ];

    const recentTransactions = profile?.account?.recent_transactions || fallbackTransactions;
    const hasTransactions = recentTransactions && recentTransactions.length > 0;

    const handleShowAddMoneyModal = () => {
        setShowAddMoneyModal((prev) => !prev);
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-12 px-6">
            <div className="mx-auto max-w-6xl space-y-10">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-emerald-700">
                            <WalletIcon className="h-4 w-4" />
                            <span className="text-sm font-semibold uppercase tracking-wide">Farm Wallet</span>
                        </div>
                        <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
                            Manage your funds with confidence
                        </h1>
                        <p className="mt-2 text-sm text-slate-600 sm:text-base">
                            Track balances, monitor growth, and stay on top of your recent activity all in one place.
                        </p>
                    </div>
                </header>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-8 text-white shadow-2xl">
                        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-emerald-400/20 blur-3xl lg:block" aria-hidden="true" />
                        <div className="relative flex flex-col gap-8">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-wide text-emerald-100">Available Balance</p>
                                    <p className="mt-2 text-4xl font-semibold sm:text-5xl">
                                        {`$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-widest">
                                    Active
                                </div>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                                    <p className="text-xs uppercase tracking-wide text-emerald-100">Total Invested</p>
                                    <p className="mt-2 text-2xl font-semibold">
                                        {`$${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                                    <p className="text-xs uppercase tracking-wide text-emerald-100">Projected Yield</p>
                                    <p className="mt-2 text-2xl font-semibold">
                                        {`$${projectedYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                        <button
                            type="button"
                            onClick={handleShowAddMoneyModal}
                            className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-white px-5 py-4 text-left shadow-lg transition hover:border-emerald-400 hover:shadow-xl"
                        >
                            <div>
                                <p className="text-xs uppercase tracking-wide text-emerald-500">Quick Action</p>
                                <p className="mt-1 text-base font-semibold text-slate-800">Add funds</p>
                                <p className="text-xs text-slate-500">Top up your wallet using bank, card, or mobile money.</p>
                            </div>
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                                <Plus className="h-5 w-5" />
                            </span>
                        </button>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Transfers Out</p>
                                    <p className="mt-2 text-lg font-semibold text-slate-900">
                                        {`$${Math.max(balance * 0.12, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    </p>
                                    <p className="text-xs text-slate-500">Across active withdrawal requests.</p>
                                </div>
                                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                                    <ArrowDownLeft className="h-5 w-5" />
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Incoming Returns</p>
                                    <p className="mt-2 text-lg font-semibold text-slate-900">
                                        {`$${Math.max(projectedYield * 0.35, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    </p>
                                    <p className="text-xs text-slate-500">Projected over the next quarter.</p>
                                </div>
                                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
                                    <ArrowUpRight className="h-5 w-5" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                    <section className="rounded-3xl bg-white/70 p-6 shadow-xl ring-1 ring-slate-100 backdrop-blur">
                        <header className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">Recent activity</h2>
                                <p className="text-sm text-slate-500">Your latest deposits, payouts, and transfers.</p>
                            </div>
                            <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-emerald-300 hover:text-emerald-500">
                                View all
                            </button>
                        </header>

                        <div className="mt-6 space-y-4">
                            {hasTransactions ? (
                                recentTransactions.map((transaction) => {
                                    const amount = Number(transaction.amount || 0);
                                    const isPositive = amount >= 0;
                                    const formattedAmount = `${isPositive ? "+" : "-"}$${Math.abs(amount).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`;

                                    return (
                                        <article
                                            key={transaction.id}
                                            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                                        isPositive ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-500"
                                                    }`}
                                                >
                                                    {isPositive ? (
                                                        <ArrowUpRight className="h-5 w-5" />
                                                    ) : (
                                                        <ArrowDownLeft className="h-5 w-5" />
                                                    )}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {transaction.label || transaction.description || "Wallet transaction"}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{transaction.date || transaction.created_at || "—"}</span>
                                                        {transaction.method ? (
                                                            <>
                                                                <span aria-hidden="true">•</span>
                                                                <span>{transaction.method}</span>
                                                            </>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className={`text-sm font-semibold ${isPositive ? "text-emerald-600" : "text-rose-500"}`}>
                                                {formattedAmount}
                                            </p>
                                        </article>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
                                    <WalletIcon className="h-8 w-8 text-slate-300" />
                                    <p className="mt-3 text-sm font-medium text-slate-600">No transactions yet</p>
                                    <p className="text-xs text-slate-400">Add funds or make a transfer to start seeing activity here.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="rounded-3xl bg-white/70 p-6 shadow-xl ring-1 ring-slate-100 backdrop-blur">
                        <h2 className="text-lg font-semibold text-slate-900">Account health</h2>
                        <p className="text-sm text-slate-500">Quick insights into how your wallet is performing.</p>

                        <dl className="mt-6 space-y-5 text-sm text-slate-600">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <dt className="font-medium text-slate-800">Average return rate</dt>
                                    <dd className="text-xs text-slate-500">Across all active investments.</dd>
                                </div>
                                <dd className="text-base font-semibold text-emerald-600">{avgReturn.toFixed(1)}%</dd>
                            </div>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <dt className="font-medium text-slate-800">Liquidity buffer</dt>
                                    <dd className="text-xs text-slate-500">Wallet balance vs. total investment size.</dd>
                                </div>
                                <dd className="text-base font-semibold text-slate-900">
                                    {totalInvested ? `${Math.round((balance / totalInvested) * 100)}%` : "—"}
                                </dd>
                            </div>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <dt className="font-medium text-slate-800">Upcoming returns</dt>
                                    <dd className="text-xs text-slate-500">Estimated payouts within 30 days.</dd>
                                </div>
                                <dd className="text-base font-semibold text-emerald-600">
                                    {`$${Math.max(projectedYield * 0.12, 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`}
                                </dd>
                            </div>
                        </dl>
                    </section>
                </div>

                {showAddMoneyModal && <MakePayment setShowAddMoneyModal={setShowAddMoneyModal} />}
            </div>
        </section>
    );
};

export default Wallet;

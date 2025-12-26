"use client";

import React, { useState } from "react";

type BillingPeriod = "monthly" | "yearly";
type PlanType = "fasting" | "meal" | "bundle";

interface Plan {
    id: string;
    name: string;
    type: PlanType;
    description: string;
    durationLabel: string;
    level?: "Beginner" | "Intermediate" | "Advanced";
    monthlyPrice: number;
    yearlyPrice: number;
    tag?: string;
}

interface ActivePlan {
    id: string;
    name: string;
    type: PlanType;
    progressText: string;
    monthlyPrice: number;
    yearlyPrice: number;
    includedInPro?: boolean;
}

function classNames(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function PlansPage() {
    const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

    const activePlan: ActivePlan = {
        id: "fasting-16-8-beginner",
        name: "16:8 – Beginner",
        type: "fasting",
        progressText: "Week 2 of 4 · 4/7 days done",
        monthlyPrice: 4.99,
        yearlyPrice: 39,
    };

    const fastingPlans: Plan[] = [
        {
            id: "16-8-beginner",
            name: "16:8 – Beginner",
            type: "fasting",
            description: "Gentle daily fasting to start your journey.",
            durationLabel: "4-week program",
            level: "Beginner",
            monthlyPrice: 4.99,
            yearlyPrice: 39,
            tag: "Gentle start",
        },
        {
            id: "18-6-weight-loss",
            name: "18:6 – Weight loss",
            type: "fasting",
            description: "Longer fasting window for faster results.",
            durationLabel: "6-week program",
            level: "Intermediate",
            monthlyPrice: 7.99,
            yearlyPrice: 69,
            tag: "Best for weight loss",
        },
    ];

    const mealPlans: Plan[] = [
        {
            id: "balanced-1600",
            name: "Balanced 1600 kcal",
            type: "meal",
            description: "Balanced macros for steady weight loss.",
            durationLabel: "4-week meal plan",
            monthlyPrice: 3.99,
            yearlyPrice: 29,
            tag: "Popular",
        },
        {
            id: "mediterranean-2000",
            name: "Mediterranean 2000 kcal",
            type: "meal",
            description: "Heart-friendly Mediterranean meals.",
            durationLabel: "4-week meal plan",
            monthlyPrice: 4.99,
            yearlyPrice: 39,
        },
    ];

    const bundlePlans: Plan[] = [
        {
            id: "health-pro",
            name: "Health Pro",
            type: "bundle",
            description: "All fasting & meal plans, insights, and priority support.",
            durationLabel: "Subscription",
            monthlyPrice: 7.99,
            yearlyPrice: 59,
            tag: "Best value",
        },
    ];

    function formatPlanPrice(plan: Plan | ActivePlan, period: BillingPeriod) {
        if (period === "monthly") return `${plan.monthlyPrice.toFixed(2)} €/mo`;
        return `${(plan.yearlyPrice || 0).toFixed(0)} €/yr`;
    }

    function computeDiscountPercent(plan: Plan) {
        if (!plan.monthlyPrice || !plan.yearlyPrice) return 0;
        const yearlyFromMonthly = plan.monthlyPrice * 12;
        const pct = Math.round(100 - (plan.yearlyPrice / yearlyFromMonthly) * 100);
        return pct > 0 ? pct : 0;
    }

    return (
        <div className="max-w-md mx-auto min-h-screen bg-slate-50 px-4 py-4 space-y-6">
            <header>
                <h1 className="text-xl font-semibold text-slate-900">Plans</h1>
                <p className="text-xs text-slate-500">Choose fasting and meal plans that fit your goals.</p>
            </header>

            {/* Billing toggle */}
            <section className="rounded-2xl border bg-white shadow-sm p-4">
                <h2 className="text-sm font-semibold text-slate-900">Billing period</h2>
                <div className="mt-3">
                    <div className="inline-flex items-center rounded-full bg-slate-100 p-1 text-xs">
                        <button
                            onClick={() => setBillingPeriod("monthly")}
                            className={classNames(
                                "px-3 py-1 rounded-full transition",
                                billingPeriod === "monthly" ? "bg-white text-slate-900 shadow" : "text-slate-500"
                            )}
                        >
                            Monthly
                        </button>

                        <button
                            onClick={() => setBillingPeriod("yearly")}
                            className={classNames(
                                "px-3 py-1 rounded-full transition flex items-center gap-2",
                                billingPeriod === "yearly" ? "bg-white text-slate-900 shadow" : "text-slate-500"
                            )}
                        >
                            Yearly
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                Save 30%
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Active plan */}
            <section className="rounded-2xl border bg-white shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Active plan</h3>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-sm font-medium">{activePlan.name}</span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">Fasting</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">{activePlan.progressText}</p>
                    </div>

                    <div className="text-right">
                        <div className="text-sm font-semibold text-slate-900">
                            {billingPeriod === "monthly" ? `${activePlan.monthlyPrice.toFixed(2)} €/mo` : `${activePlan.yearlyPrice.toFixed(0)} €/yr`}
                        </div>
                        <button
                            onClick={() => {
                                const el = document.getElementById("fasting-plans");
                                if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="mt-2 text-xs text-sky-600"
                        >
                            Change plan
                        </button>
                    </div>
                </div>
            </section>

            {/* Fasting plans */}
            <div id="fasting-plans">
                <CollapsibleSection title="Fasting plans" subtitle="Daily fasting routines for different levels." defaultOpen>
                    <div className="space-y-3">
                        {fastingPlans.map((p) => (
                            <PlanCard key={p.id} plan={p} billingPeriod={billingPeriod} />
                        ))}
                    </div>
                </CollapsibleSection>
            </div>

            {/* Meal plans */}
            <CollapsibleSection title="Meal plans" subtitle="Balanced food plans that pair with your fasting." defaultOpen={false}>
                <div className="space-y-3">
                    {mealPlans.map((p) => (
                        <PlanCard key={p.id} plan={p} billingPeriod={billingPeriod} />
                    ))}
                </div>
            </CollapsibleSection>

            {/* Bundles */}
            <CollapsibleSection title="Bundles & Pro" subtitle="Unlock everything with one subscription." defaultOpen={false}>
                <div className="space-y-3">
                    {bundlePlans.map((p) => (
                        <PlanCard key={p.id} plan={p} billingPeriod={billingPeriod} />
                    ))}
                </div>
            </CollapsibleSection>
        </div>
    );
}

function CollapsibleSection(props: {
    title: string;
    subtitle?: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const { title, subtitle, defaultOpen = true, children } = props;
    const [open, setOpen] = useState<boolean>(!!defaultOpen);

    return (
        <section className="rounded-2xl border bg-white shadow-sm p-4">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-2"
            >
                <div>
                    <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
                    {subtitle && <p className="mt-0.5 text-[11px] text-slate-500">{subtitle}</p>}
                </div>
                <span
                    className={classNames(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xs transition-transform",
                        open ? "rotate-180" : "rotate-0"
                    )}
                >
                    ˅
                </span>
            </button>

            {open && <div className="mt-3 space-y-3">{children}</div>}
        </section>
    );
}

function PlanCard({ plan, billingPeriod }: { plan: Plan; billingPeriod: BillingPeriod }) {
    const mainPrice = billingPeriod === "monthly" ? `${plan.monthlyPrice.toFixed(2)} €/mo` : `${plan.yearlyPrice.toFixed(0)} €/yr`;
    const discountPercent = computeDiscountPercent(plan);
    const showDiscountBadge = billingPeriod === "yearly" && discountPercent > 0;

    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-xs">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">{plan.name}</h3>
                        {plan.level && <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-[10px] text-slate-700">{plan.level}</span>}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600">{plan.description}</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">{plan.durationLabel}</p>
                </div>

                <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">{mainPrice}</div>
                    {billingPeriod === "monthly" ? (
                        <p className="mt-0.5 text-[10px] text-slate-500">Billed monthly</p>
                    ) : (
                        <p className="mt-0.5 text-[10px] text-slate-500">Billed yearly</p>
                    )}

                    {showDiscountBadge && (
                        <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Save {discountPercent}%</span>
                    )}
                </div>
            </div>

            {plan.tag && (
                <div className="mt-2">
                    <span className="inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700">{plan.tag}</span>
                </div>
            )}

            <button type="button" className="mt-3 w-full rounded-full bg-slate-900 px-3 py-1.5 text-center text-[11px] font-semibold text-white disabled:bg-slate-400" disabled>
                Select plan
            </button>
        </div>
    );
}

function computeDiscountPercent(plan: Plan) {
    if (!plan.monthlyPrice || !plan.yearlyPrice) return 0;
    const yearlyFromMonthly = plan.monthlyPrice * 12;
    const pct = Math.round(100 - (plan.yearlyPrice / yearlyFromMonthly) * 100);
    return pct > 0 ? pct : 0;
}


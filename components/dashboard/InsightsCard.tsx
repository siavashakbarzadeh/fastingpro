"use client";

import React from "react";
import { useInsights } from "@/hooks/useInsights";
import { Card } from "@/components/ui/Card";

export default function InsightsCard() {
  const { insights } = useInsights();
  if (!insights || insights.length === 0) return null;

  return (
    <Card className="rounded-2xl p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Your insights</h3>
        <span className="text-xs text-slate-500">Recent</span>
      </div>

      <div className="mt-3 space-y-3">
        {insights.slice(0, 3).map((ins) => (
          <div key={ins.id} className="">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-medium text-slate-800">{ins.title}</div>
                <div className="text-xs text-slate-500 mt-1">{ins.description}</div>
              </div>
              <div className="text-xs text-slate-400">{ins.strength}</div>
            </div>
            {ins.domainTags && (
              <div className="mt-2 flex gap-2">
                {ins.domainTags.map((t) => (
                  <span key={t} className="text-[10px] bg-slate-50 px-2 py-0.5 rounded-full text-slate-600">{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

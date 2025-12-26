"use client";

import React from "react";
import { useCoachingTips, TipDomain } from "@/hooks/useCoachingTips";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CoachTip({ domain, label }: { domain: TipDomain; label?: string }) {
  const { currentTip, nextTip } = useCoachingTips(domain);
  if (!currentTip) return null;

  return (
    <Card className="rounded-2xl p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-slate-500">{label ?? `Coach tip for ${domain}`}</div>
          <div className="text-sm font-semibold text-slate-900 mt-1">{currentTip.title}</div>
          <div className="text-xs text-slate-500 mt-1">{currentTip.body}</div>
          {currentTip.sourceLabel && (
            <div className="mt-2 inline-flex rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">{currentTip.sourceLabel}</div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button onClick={nextTip} variant="ghost" className="text-xs">Another tip</Button>
        </div>
      </div>
    </Card>
  );
}

"use client";

import React from "react";
import { useSmartReminders } from "@/hooks/useSmartReminders";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function SmartRemindersCard() {
  const { reminders } = useSmartReminders();
  const router = useRouter();

  if (!reminders || reminders.length === 0) return null;

  return (
    <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Smart reminders</h3>
        <span className="text-xs text-slate-500">Now</span>
      </div>

      <div className="space-y-2">
        {reminders.slice(0, 3).map((r) => (
          <div key={r.id} className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-slate-800">{r.title}</div>
              <div className="text-xs text-slate-500">{r.message}</div>
            </div>
            <div className="flex-shrink-0">
              <Button
                onClick={() => r.targetRoute && router.push(r.targetRoute)}
                className="text-xs px-3 py-1 rounded-full"
                variant="ghost"
              >
                {r.ctaLabel || "Open"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

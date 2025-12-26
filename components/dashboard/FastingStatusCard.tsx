"use client";

import React from 'react';
import Link from 'next/link';

export interface DashboardFastStatus {
  isActive: boolean;
  protocolName: string;
  elapsedMinutes: number;
  remainingMinutes?: number;
  endTimeLabel?: string;
}

export const MOCK_FAST_STATUS: DashboardFastStatus = {
  isActive: true,
  protocolName: '16:8',
  elapsedMinutes: 260,
  remainingMinutes: 220,
  endTimeLabel: 'Ends at 20:00',
};

function formatMinutes(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function FastingStatusCard({ status }: { status: DashboardFastStatus }) {
  const pct = status.remainingMinutes !== undefined
    ? Math.min(100, Math.round((status.elapsedMinutes / (status.elapsedMinutes + status.remainingMinutes)) * 100))
    : 0;

  return (
    <Link href="/fasting" className="block">
      <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-2 cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800">{status.isActive ? 'Fasting now' : 'No active fast'}</h3>
            <p className="text-xs font-bold text-slate-400">{status.isActive ? status.protocolName : `Next: ${status.protocolName} today`}</p>
          </div>
          <div className="text-xs text-slate-400 font-bold">{status.isActive ? status.endTimeLabel : ''}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[13px] font-black text-slate-800">
            {status.isActive ? `Elapsed: ${formatMinutes(status.elapsedMinutes)}` : '—'}
          </div>
          <div className="text-[12px] text-slate-500">{status.isActive && status.remainingMinutes ? `Remaining: ${formatMinutes(status.remainingMinutes)}` : ''}</div>
        </div>

        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full bg-emerald-400 rounded-full transition-all`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </Link>
  );
}

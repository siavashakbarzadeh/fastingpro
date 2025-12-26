"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { differenceInMinutes, format } from "date-fns";

const HistoryPage = () => {
  const [fasts, setFasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/fasts");
        setFasts(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const fastingLast7 = [
    { day: "Mon", hours: 16 },
    { day: "Tue", hours: 18 },
    { day: "Wed", hours: 14 },
    { day: "Thu", hours: 20 },
    { day: "Fri", hours: 16 },
    { day: "Sat", hours: 19 },
    { day: "Sun", hours: 17 },
  ];

  const weightHistory = [
    { date: "2025-12-01", weightKg: 69.2 },
    { date: "2025-12-08", weightKg: 68.9 },
    { date: "2025-12-15", weightKg: 68.6 },
    { date: "2025-12-22", weightKg: 68.4 },
  ];

  const netCalories7 = [
    { day: "Mon", net: -400 },
    { day: "Tue", net: -350 },
    { day: "Wed", net: -300 },
    { day: "Thu", net: -450 },
    { day: "Fri", net: -500 },
    { day: "Sat", net: -200 },
    { day: "Sun", net: -300 },
  ];

  const sleepLast7 = [
    { day: "Mon", hours: 7.5 },
    { day: "Tue", hours: 6.8 },
    { day: "Wed", hours: 8.0 },
    { day: "Thu", hours: 5.5 },
    { day: "Fri", hours: 7.2 },
    { day: "Sat", hours: 8.5 },
    { day: "Sun", hours: 6.9 },
  ];

  const habits7 = {
    water: [true, false, true, true, true, false, true],
    brushing: [true, true, true, true, true, true, true],
    meds: [true, true, false, true, true, true, false],
  };

  const cycles = [
    {
      id: 5,
      start: "2025-12-11",
      end: "2026-01-07",
      lengthDays: 28,
      periodDays: 5,
    },
    {
      id: 4,
      start: "2025-11-13",
      end: "2025-12-10",
      lengthDays: 27,
      periodDays: 5,
    },
  ];

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500">Loading history...</div>
    );

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-6 bg-slate-50 min-h-screen">
      <h1 className="text-xl font-bold">History & insights</h1>

      {/* Fasting Section */}
      <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
        <h2 className="text-lg font-semibold">Fasting · last 7 days</h2>
        <div className="flex items-end space-x-2">
          {fastingLast7.map((fast) => (
            <div key={fast.day} className="flex flex-col items-center">
              <div
                className="w-6 bg-blue-500"
                style={{ height: `${fast.hours * 10}px` }}
              ></div>
              <span className="text-sm mt-1">{fast.day}</span>
            </div>
          ))}
        </div>
        <div className="text-sm space-y-1">
          <p>Average: 16.5 h/day</p>
          <p>Longest fast: 20 h</p>
          <p>Current streak: 4 days</p>
        </div>
      </div>

      {/* Weight & Calories Section */}
      <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
        <h2 className="text-lg font-semibold">Weight & calories</h2>
        <div className="text-sm space-y-1">
          <p>Current: 68.4 kg</p>
          <p>Change in last 30 days: −1.2 kg</p>
          <p>Avg net: −350 kcal/day</p>
        </div>
      </div>

      {/* Sleep Section */}
      <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
        <h2 className="text-lg font-semibold">Sleep · last 7 nights</h2>
        <div className="flex items-end space-x-2">
          {sleepLast7.map((sleep) => (
            <div key={sleep.day} className="flex flex-col items-center">
              <div
                className="w-6 bg-green-500"
                style={{ height: `${sleep.hours * 10}px` }}
              ></div>
              <span className="text-sm mt-1">{sleep.day}</span>
            </div>
          ))}
        </div>
        <div className="text-sm space-y-1">
          <p>Average sleep: 7h 10m</p>
          <p>Best night: 8h 30m</p>
          <p>Nights &lt; 6h: 2</p>
        </div>
      </div>

      {/* Habits Section */}
      <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
        <h2 className="text-lg font-semibold">Habits · last 7 days</h2>
        <div className="text-sm space-y-1">
          <p>Water – 5/7 days goal reached</p>
          <p>Brushing – 7/7 days</p>
          <p>Medications – 18/21 doses taken</p>
        </div>
      </div>

      {/* Cycle Summary Section */}
      <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
        <h2 className="text-lg font-semibold">Cycle summary</h2>
        <div className="text-sm space-y-1">
          <p>Average cycle length: 28 days</p>
          <p>Average period length: 5 days</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        These insights are for informational purposes only and do not constitute
        medical advice.
      </p>

      <div className="space-y-4">
        {fasts.length === 0 ? (
          <div className="text-center p-8 bg-slate-900 rounded-xl border border-slate-800">
            <p className="text-slate-500">No fasts recorded yet.</p>
          </div>
        ) : (
          fasts.map((fast: any) => {
            const start = new Date(fast.start_time);
            const end = fast.end_time ? new Date(fast.end_time) : null;
            const duration = end ? differenceInMinutes(end, start) / 60 : 0;

            return (
              <div
                key={fast.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center transition-colors hover:border-slate-700"
              >
                <div>
                  <div className="text-sm text-slate-400 mb-1">
                    {format(start, "MMM d, yyyy")}
                  </div>
                  <div className="text-white font-medium">
                    {fast.plan?.name || "Custom Fast"}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {format(start, "HH:mm")} -{" "}
                    {end ? format(end, "HH:mm") : "Ongoing"}
                  </div>
                </div>

                <div className="text-right">
                  {fast.status === "completed" ? (
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-bold text-orange-500">
                        {duration.toFixed(1)}h
                      </span>
                      <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full mt-1">
                        Completed
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm px-3 py-1 bg-green-900/30 text-green-400 rounded-full">
                      Active
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HistoryPage;

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ModulesState = {
  pregnancy: boolean;
  medications: boolean;
  dental: boolean;
  mental: boolean;
};

export default function DashboardSettingsPage() {
  const router = useRouter();

  // Units & general preferences
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [heightUnit, setHeightUnit] = useState<"cm" | "imperial">("cm");
  const [timeFormat, setTimeFormat] = useState<"24h" | "12h">("24h");
  const [showCalories, setShowCalories] = useState(true);

  // Modules
  const [modules, setModules] = useState<ModulesState>({
    pregnancy: true,
    medications: true,
    dental: true,
    mental: true,
  });

  // Notifications
  const [notifyFasting, setNotifyFasting] = useState(true);
  const [notifyWater, setNotifyWater] = useState(false);
  const [notifyBrushing, setNotifyBrushing] = useState(true);
  const [notifyMeds, setNotifyMeds] = useState(true);

  const [saved, setSaved] = useState(false);

  // localStorage key
  const STORAGE_KEY = "dashboard_settings_v1";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.weightUnit) setWeightUnit(parsed.weightUnit);
        if (parsed.heightUnit) setHeightUnit(parsed.heightUnit);
        if (parsed.timeFormat) setTimeFormat(parsed.timeFormat);
        if (typeof parsed.showCalories === "boolean") setShowCalories(parsed.showCalories);
        if (parsed.modules) setModules(parsed.modules);
        if (typeof parsed.notifyFasting === "boolean") setNotifyFasting(parsed.notifyFasting);
        if (typeof parsed.notifyWater === "boolean") setNotifyWater(parsed.notifyWater);
        if (typeof parsed.notifyBrushing === "boolean") setNotifyBrushing(parsed.notifyBrushing);
        if (typeof parsed.notifyMeds === "boolean") setNotifyMeds(parsed.notifyMeds);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  function handleSave() {
    const payload = {
      weightUnit,
      heightUnit,
      timeFormat,
      showCalories,
      modules,
      notifyFasting,
      notifyWater,
      notifyBrushing,
      notifyMeds,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
        <p className="text-xs text-slate-500">
          Adjust units, modules, and reminders for your health dashboard.
        </p>
      </div>

      {/* Units & general preferences */}
      <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
        <h2 className="text-sm font-semibold">Units & general preferences</h2>

        <div className="space-y-2">
          <div className="text-xs text-slate-600">Weight unit</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setWeightUnit("kg")}
              className={classNames(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs",
                weightUnit === "kg"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700"
              )}
            >
              kg
            </button>
            <button
              type="button"
              onClick={() => setWeightUnit("lb")}
              className={classNames(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs",
                weightUnit === "lb"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700"
              )}
            >
              lb
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-slate-600">Height unit</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setHeightUnit("cm")}
              className={classNames(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs",
                heightUnit === "cm"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700"
              )}
            >
              cm
            </button>
            <button
              type="button"
              onClick={() => setHeightUnit("imperial")}
              className={classNames(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs",
                heightUnit === "imperial"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700"
              )}
            >
              ft & in
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-slate-600">Time format</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTimeFormat("24h")}
              className={classNames(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs",
                timeFormat === "24h"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700"
              )}
            >
              24‑hour
            </button>
            <button
              type="button"
              onClick={() => setTimeFormat("12h")}
              className={classNames(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs",
                timeFormat === "12h"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700"
              )}
            >
              12‑hour
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-600">Show calorie information</div>
            <div className="text-xs text-slate-400">Display calories in body & dashboard cards</div>
          </div>
          <button
            onClick={() => setShowCalories((s) => !s)}
            className={classNames(
              "relative inline-flex h-5 w-9 items-center rounded-full transition",
              showCalories ? "bg-emerald-500" : "bg-slate-300"
            )}
          >
            <span
              className={classNames(
                "inline-block h-4 w-4 transform rounded-full bg-white transition",
                showCalories ? "translate-x-4" : "translate-x-1"
              )}
            />
          </button>
        </div>
      </div>

      {/* Modules Card */}
      <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
        <h2 className="text-sm font-semibold">Modules</h2>

        <div className="space-y-3">
          {/* Pregnancy */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Pregnancy & cycle insights</div>
              <div className="text-xs text-slate-500">Show fertility & cycle cards</div>
            </div>
            <button
              onClick={() => setModules((m) => ({ ...m, pregnancy: !m.pregnancy }))}
              className={classNames(
                "relative inline-flex h-5 w-9 items-center rounded-full transition",
                modules.pregnancy ? "bg-emerald-500" : "bg-slate-300"
              )}
            >
              <span
                className={classNames(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition",
                  modules.pregnancy ? "translate-x-4" : "translate-x-1"
                )}
              />
            </button>
          </div>

          {/* Medications */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Medications</div>
              <div className="text-xs text-slate-500">Enable medication tracking & Today's doses</div>
            </div>
            <button
              onClick={() => setModules((m) => ({ ...m, medications: !m.medications }))}
              className={classNames(
                "relative inline-flex h-5 w-9 items-center rounded-full transition",
                modules.medications ? "bg-emerald-500" : "bg-slate-300"
              )}
            >
              <span
                className={classNames(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition",
                  modules.medications ? "translate-x-4" : "translate-x-1"
                )}
              />
            </button>
          </div>

          {/* Dental */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Dental health</div>
              <div className="text-xs text-slate-500">Show tooth brushing tracker</div>
            </div>
            <button
              onClick={() => setModules((m) => ({ ...m, dental: !m.dental }))}
              className={classNames(
                "relative inline-flex h-5 w-9 items-center rounded-full transition",
                modules.dental ? "bg-emerald-500" : "bg-slate-300"
              )}
            >
              <span
                className={classNames(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition",
                  modules.dental ? "translate-x-4" : "translate-x-1"
                )}
              />
            </button>
          </div>

          {/* Mental */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Mental health</div>
              <div className="text-xs text-slate-500">Show mood & self-care widgets</div>
            </div>
            <button
              onClick={() => setModules((m) => ({ ...m, mental: !m.mental }))}
              className={classNames(
                "relative inline-flex h-5 w-9 items-center rounded-full transition",
                modules.mental ? "bg-emerald-500" : "bg-slate-300"
              )}
            >
              <span
                className={classNames(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition",
                  modules.mental ? "translate-x-4" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications & reminders */}
      <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
        <h2 className="text-sm font-semibold">Notifications & reminders</h2>

        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="max-w-[70%]">
              <div className="text-sm font-medium">Fasting reminders</div>
              <div className="text-xs text-slate-500">Remind me near the end of a fast (default)</div>
            </div>
            <button
              onClick={() => setNotifyFasting((s) => !s)}
              className={classNames(
                "relative inline-flex h-5 w-9 items-center rounded-full transition",
                notifyFasting ? "bg-emerald-500" : "bg-slate-300"
              )}
            >
              <span
                className={classNames(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition",
                  notifyFasting ? "translate-x-4" : "translate-x-1"
                )}
              />
            </button>
          </div>

          <div className="flex items-start justify-between">
            <div className="max-w-[70%]">
              <div className="text-sm font-medium">Water reminders</div>
              <div className="text-xs text-slate-500">Simple reminders during the day to drink water</div>
            </div>
            <button
              onClick={() => setNotifyWater((s) => !s)}
              className={classNames(
                "relative inline-flex h-5 w-9 items-center rounded-full transition",
                notifyWater ? "bg-emerald-500" : "bg-slate-300"
              )}
            >
              <span
                className={classNames(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition",
                  notifyWater ? "translate-x-4" : "translate-x-1"
                )}
              />
            </button>
          </div>

          <div className="flex items-start justify-between">
            <div className="max-w-[70%]">
              <div className="text-sm font-medium">Brushing reminders</div>
              <div className="text-xs text-slate-500">Morning & night toothbrush reminders</div>
            </div>
            <button
              onClick={() => setNotifyBrushing((s) => !s)}
              className={classNames(
                "relative inline-flex h-5 w-9 items-center rounded-full transition",
                notifyBrushing ? "bg-emerald-500" : "bg-slate-300"
              )}
            >
              <span
                className={classNames(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition",
                  notifyBrushing ? "translate-x-4" : "translate-x-1"
                )}
              />
            </button>
          </div>

          <div className="flex items-start justify-between">
            <div className="max-w-[70%]">
              <div className="text-sm font-medium">Medications</div>
              <div className="text-xs text-slate-500">Use times from your Medications schedule</div>
            </div>
            <button
              onClick={() => setNotifyMeds((s) => !s)}
              className={classNames(
                "relative inline-flex h-5 w-9 items-center rounded-full transition",
                notifyMeds ? "bg-emerald-500" : "bg-slate-300"
              )}
            >
              <span
                className={classNames(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition",
                  notifyMeds ? "translate-x-4" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Links Card */}
      <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
        <h2 className="text-sm font-semibold">Links</h2>
        <div className="space-y-2">
          <button
            onClick={() => router.push("/me")}
            className="w-full text-left flex items-center justify-between text-sm"
          >
            <span>Profile & health data</span>
            <span className="text-slate-400">→</span>
          </button>

          <button
            onClick={() => router.push("/period-tracker")}
            className="w-full text-left flex items-center justify-between text-sm"
          >
            <span>Period Tracker settings</span>
            <span className="text-slate-400">→</span>
          </button>
        </div>
      </div>

      {/* Save button */}
      <div>
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white"
        >
          Save settings
        </button>
        {saved && (
          <p className="mt-2 text-center text-xs text-emerald-600">
            Settings saved. They will be used across your dashboard.
          </p>
        )}
      </div>
    </div>
  );
}
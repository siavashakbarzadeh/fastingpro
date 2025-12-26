"use client";

import React from "react";

const ProfilePage = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-6 bg-slate-50 min-h-screen">
      <h1 className="text-xl font-bold">Profile</h1>

      {/* Health Profile Card */}
      <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-2">
        <h2 className="text-lg font-semibold">Health Profile</h2>
        <p className="text-sm text-gray-600">Sex: Female</p>
        <p className="text-sm text-gray-600">Age: 30</p>
        <p className="text-sm text-gray-600">Height: 165 cm</p>
        <p className="text-sm text-gray-600">Weight: 68.4 kg</p>
        <p className="text-sm text-gray-600">Goal: 65 kg</p>
        <p className="text-sm text-gray-600">BMI: 22.5 (Normal)</p>
      </div>

      {/* Goals Card */}
      <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-2">
        <h2 className="text-lg font-semibold">Goals</h2>
        <p className="text-sm text-gray-600">Primary Goal: Lose weight</p>
        <p className="text-sm text-gray-600">Improve sleep quality</p>
      </div>

      {/* Fasting Summary Card */}
      <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-2">
        <h2 className="text-lg font-semibold">Fasting Summary</h2>
        <p className="text-sm text-gray-600">Total fasting minutes: 10,000</p>
        <p className="text-sm text-gray-600">Fasting days: 50</p>
        <p className="text-sm text-gray-600">Longest fast: 20 hours</p>
      </div>

      {/* Connected Modules Card */}
      <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-2">
        <h2 className="text-lg font-semibold">Connected Modules</h2>
        <p className="text-sm text-gray-600">
          Your profile data feeds into fasting, calories, women’s health, and other modules.
        </p>
        <p className="text-xs text-gray-500">
          Privacy: Your data is stored locally and not shared with third parties.
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
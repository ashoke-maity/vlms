import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <p className="text-neutral-400">Users</p>
            <p className="text-3xl font-semibold">-</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <p className="text-neutral-400">Videos</p>
            <p className="text-3xl font-semibold">-</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <p className="text-neutral-400">Watchlists</p>
            <p className="text-3xl font-semibold">-</p>
          </div>
        </div>
      </div>
    </div>
  );
}



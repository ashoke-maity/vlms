import React from 'react';
import { Link } from 'react-router-dom';

export default function NotAuthorized() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <div className="bg-neutral-900 rounded-lg p-8 border border-neutral-800 text-center max-w-md w-full">
        <h2 className="text-xl font-semibold mb-2">Not authorized</h2>
        <p className="text-neutral-400 mb-6">You do not have access to this page.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors">Go Home</Link>
        </div>
      </div>
    </div>
  );
}



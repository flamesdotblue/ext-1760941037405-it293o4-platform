import React from 'react';
import { Info } from 'lucide-react';

export default function SettingsScreen({ adFrequency, onAdFrequency, persistent, onPersistent }) {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-black/10 dark:border-white/10 p-4">
        <h2 className="text-sm font-semibold mb-3">Ads</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Ad Frequency</span>
            <select
              className="rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
              value={adFrequency}
              onChange={(e) => onAdFrequency(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 p-4">
        <h2 className="text-sm font-semibold mb-3">Preferences</h2>
        <label className="flex items-center justify-between gap-4">
          <span className="text-sm">Remember last configuration</span>
          <input type="checkbox" checked={persistent} onChange={(e) => onPersistent(e.target.checked)} />
        </label>
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 p-4">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2"><Info className="w-4 h-4"/> About</h2>
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <p>LED Scroller App</p>
          <p>Version 1.0.0</p>
          <p>Developer: OpenAI Assistant</p>
        </div>
      </section>
    </div>
  );
}

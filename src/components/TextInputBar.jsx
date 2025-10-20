import React from 'react';

export default function TextInputBar({ value, onChange }) {
  return (
    <div className="w-full">
      <label htmlFor="led-input" className="sr-only">LED Text</label>
      <input
        id="led-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter message to scroll (single line)"
        className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-neutral-800/80 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition shadow-sm"
        type="text"
        inputMode="text"
        aria-label="LED text input"
      />
    </div>
  );
}

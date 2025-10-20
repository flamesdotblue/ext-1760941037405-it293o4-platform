import React from 'react';

function Segment({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-black/10 dark:border-white/10 p-0.5 bg-white/70 dark:bg-neutral-800/70">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            value === opt.value
              ? 'bg-blue-600 text-white shadow'
              : 'text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ColorPicker({ label, color, onColor, recent }) {
  const [hex, setHex] = React.useState(color);
  React.useEffect(() => setHex(color), [color]);

  const applyHex = (v) => {
    const formatted = v.startsWith('#') ? v : `#${v}`;
    if (/^#([0-9A-Fa-f]{6})$/.test(formatted)) {
      onColor(formatted);
    }
    setHex(formatted);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={color}
          onChange={(e) => onColor(e.target.value)}
          className="h-10 w-10 rounded-md border border-black/10 dark:border-white/10 overflow-hidden"
          aria-label={`${label} color picker`}
        />
        <input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          onBlur={() => applyHex(hex)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') applyHex(hex);
          }}
          placeholder="#RRGGBB"
          className="flex-1 rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/60"
        />
      </div>
      {!!recent?.length && (
        <div className="flex items-center gap-2 flex-wrap">
          {recent.map((c) => (
            <button
              key={c}
              className="h-7 w-7 rounded-full border border-black/10 dark:border-white/10"
              style={{ backgroundColor: c }}
              title={c}
              onClick={() => onColor(c)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ControlPanel({
  textSize,
  onTextSize,
  textColor,
  onTextColor,
  bgColor,
  onBgColor,
  recentColors,
  speed,
  onSpeed,
  direction,
  onDirection,
  flashing,
  onFlashing,
  flashFrequency,
  onFlashFrequency,
}) {
  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Text Size: {textSize} pt</label>
          <input
            type="range"
            min={12}
            max={72}
            value={textSize}
            onChange={(e) => onTextSize(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Scrolling Speed</span>
          <Segment
            value={speed}
            onChange={onSpeed}
            options={[
              { label: 'Slow', value: 'slow' },
              { label: 'Medium', value: 'medium' },
              { label: 'Fast', value: 'fast' },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <ColorPicker label="Text Color" color={textColor} onColor={onTextColor} recent={recentColors?.text || []} />
        <ColorPicker label="Background" color={bgColor} onColor={onBgColor} recent={recentColors?.bg || []} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Scrolling Direction</span>
          <Segment
            value={direction}
            onChange={onDirection}
            options={[
              { label: 'Left→Right', value: 'ltr' },
              { label: 'Right→Left', value: 'rtl' },
              { label: 'Up→Down', value: 'utd' },
              { label: 'Down→Up', value: 'dtu' },
            ]}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Flashing</span>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={flashing}
                onChange={(e) => onFlashing(e.target.checked)}
              />
              <span className="text-sm">Enable</span>
            </label>
            <Segment
              value={flashFrequency}
              onChange={onFlashFrequency}
              options={[
                { label: 'Slow', value: 'slow' },
                { label: 'Medium', value: 'medium' },
                { label: 'Fast', value: 'fast' },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

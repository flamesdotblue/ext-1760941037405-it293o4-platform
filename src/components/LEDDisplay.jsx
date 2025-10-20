import React, { useEffect, useMemo, useRef, useState } from 'react';

function useDoubleTap(onSingle, onDouble, delay = 250) {
  const timer = useRef(null);
  return {
    onClick: () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
        onDouble?.();
      } else {
        timer.current = setTimeout(() => {
          onSingle?.();
          timer.current = null;
        }, delay);
      }
    },
  };
}

function speedToDuration(speed) {
  switch (speed) {
    case 'slow':
      return 18;
    case 'fast':
      return 6;
    case 'medium':
    default:
      return 12;
  }
}

function flashToDuration(freq) {
  switch (freq) {
    case 'slow':
      return 1.5;
    case 'fast':
      return 0.5;
    case 'medium':
    default:
      return 1.0;
  }
}

export default function LEDDisplay({
  text,
  textSize,
  textColor,
  bgColor,
  speed,
  direction,
  flashing,
  flashFrequency,
  paused,
  onTogglePause,
  onReset,
}) {
  const containerRef = useRef(null);
  const [textWidth, setTextWidth] = useState(300);

  const duration = useMemo(() => speedToDuration(speed), [speed]);
  const flashDuration = useMemo(() => flashToDuration(flashFrequency), [flashFrequency]);

  useEffect(() => {
    if (!containerRef.current) return;
    const measure = () => {
      const el = containerRef.current.querySelector('#led-text');
      if (el) setTextWidth(el.getBoundingClientRect().width);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [text, textSize]);

  const gestureHandlers = useDoubleTap(onTogglePause, onReset);

  const isHorizontal = direction === 'rtl' || direction === 'ltr';
  const isVertical = !isHorizontal;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none"
      style={{ backgroundColor: bgColor }}
      {...gestureHandlers}
      onDoubleClick={onReset}
      title="Tap to pause/resume. Double tap to reset."
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={
            `will-change-transform ${
              isHorizontal ? 'whitespace-nowrap' : 'whitespace-pre'
            }`
          }
          style={{
            color: textColor,
            fontSize: `${textSize}px`,
            lineHeight: 1.1,
            animationPlayState: paused ? 'paused' : 'running',
            animationDuration: `${duration}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationName: isHorizontal ? (direction === 'rtl' ? 'led-rtl' : 'led-ltr') : (direction === 'dtu' ? 'led-dtu' : 'led-utd'),
            display: 'inline-block',
          }}
        >
          <span id="led-text" className={flashing ? 'led-flash' : ''} style={{ animationDuration: flashing ? `${flashDuration}s` : undefined }}>
            {renderContent(text, isVertical)}
          </span>
          {isHorizontal && (
            <span aria-hidden="true" className={flashing ? 'led-flash' : ''} style={{ marginLeft: textWidth / 2, animationDuration: flashing ? `${flashDuration}s` : undefined }}>
              {renderContent(text, isVertical)}
            </span>
          )}
          {isVertical && (
            <span aria-hidden="true" className={flashing ? 'led-flash' : ''} style={{ display: 'block', marginTop: 60, animationDuration: flashing ? `${flashDuration}s` : undefined }}>
              {renderContent(text, isVertical)}
            </span>
          )}
        </div>
      </div>
      <style>
        {`
        @keyframes led-rtl {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes led-ltr {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes led-dtu {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
        @keyframes led-utd {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .led-flash { animation-name: led-flash-key; animation-iteration-count: infinite; }
        @keyframes led-flash-key {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        `}
      </style>
    </div>
  );
}

function renderContent(text, vertical) {
  if (!vertical) return text;
  // Insert line breaks between characters for vertical scroll effect
  return text.split('').join('\n');
}

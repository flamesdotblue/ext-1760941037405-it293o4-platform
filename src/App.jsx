import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Home, Settings as SettingsIcon } from 'lucide-react';
import TextInputBar from './components/TextInputBar';
import ControlPanel from './components/ControlPanel';
import LEDDisplay from './components/LEDDisplay';
import SettingsScreen from './components/SettingsScreen';

const DEFAULTS = {
  text: 'HELLO',
  textSize: 36,
  textColor: '#00FF46',
  bgColor: '#000000',
  speed: 'medium',
  direction: 'rtl',
  flashing: false,
  flashFrequency: 'medium',
  persistent: true,
  adFrequency: 'medium',
};

const INTERSTITIAL_KEY = 'led_scroller_uses';
const SETTINGS_KEY = 'led_scroller_settings';
const HISTORY_KEY = 'led_scroller_color_history';

function vibrate(pattern = 10) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {}
    return { ...DEFAULTS };
  });
  const [paused, setPaused] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [recentColors, setRecentColors] = useState(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { text: ['#00FF46', '#FFFFFF', '#FF0000'], bg: ['#000000', '#111827', '#101010'] };
  });

  const interstitialTimerRef = useRef(null);

  const adInterval = useMemo(() => {
    switch (settings.adFrequency) {
      case 'low':
        return 5;
      case 'high':
        return 2;
      case 'medium':
      default:
        return 3;
    }
  }, [settings.adFrequency]);

  useEffect(() => {
    if (settings.persistent) {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      } catch {}
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(recentColors));
    } catch {}
  }, [recentColors]);

  useEffect(() => {
    // Show interstitial on app launch
    triggerInterstitial();
    // Increment uses counter
    incrementUses();
    // Cleanup timer if any
    return () => {
      if (interstitialTimerRef.current) clearTimeout(interstitialTimerRef.current);
    };
  }, []);

  function incrementUses() {
    try {
      const count = Number(localStorage.getItem(INTERSTITIAL_KEY) || '0') + 1;
      localStorage.setItem(INTERSTITIAL_KEY, String(count));
    } catch {}
  }

  function triggerInterstitial(force = true) {
    // Simulate interstitial behavior based on frequency
    try {
      const count = Number(localStorage.getItem(INTERSTITIAL_KEY) || '0');
      if (force || count % adInterval === 0) {
        setShowInterstitial(true);
      }
    } catch {
      if (force) setShowInterstitial(true);
    }
  }

  function closeInterstitial() {
    setShowInterstitial(false);
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    vibrate(5);
    if (tab === 'home') {
      incrementUses();
      triggerInterstitial(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const addRecentColor = (type, color) => {
    setRecentColors((prev) => {
      const list = [color, ...prev[type].filter((c) => c.toLowerCase() !== color.toLowerCase())];
      return { ...prev, [type]: list.slice(0, 8) };
    });
  };

  const resetToDefaults = () => {
    vibrate([10, 30, 10]);
    setSettings((prev) => ({ ...prev, ...DEFAULTS }));
    setPaused(false);
  };

  const bannerHeight = 60; // px simulated adaptive banner height

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-50 transition-colors">
      <div className="max-w-screen-sm mx-auto flex flex-col min-h-screen">
        {activeTab === 'home' ? (
          <>
            <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-900/60 bg-white/90 dark:bg-neutral-900/80 border-b border-black/5 dark:border-white/10">
              <div className="px-4 py-3">
                <TextInputBar
                  value={settings.text}
                  onChange={(v) => updateSetting('text', v)}
                />
              </div>
            </header>

            <main className="flex-1 flex flex-col gap-4 px-4 pt-4 pb-2">
              <ControlPanel
                textSize={settings.textSize}
                onTextSize={(v) => updateSetting('textSize', v)}
                textColor={settings.textColor}
                onTextColor={(c) => {
                  updateSetting('textColor', c);
                  addRecentColor('text', c);
                }}
                bgColor={settings.bgColor}
                onBgColor={(c) => {
                  updateSetting('bgColor', c);
                  addRecentColor('bg', c);
                }}
                recentColors={recentColors}
                speed={settings.speed}
                onSpeed={(s) => updateSetting('speed', s)}
                direction={settings.direction}
                onDirection={(d) => updateSetting('direction', d)}
                flashing={settings.flashing}
                onFlashing={(f) => updateSetting('flashing', f)}
                flashFrequency={settings.flashFrequency}
                onFlashFrequency={(f) => updateSetting('flashFrequency', f)}
              />

              <div className="relative rounded-xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-sm" style={{ minHeight: 220 }}>
                <LEDDisplay
                  text={settings.text}
                  textSize={settings.textSize}
                  textColor={settings.textColor}
                  bgColor={settings.bgColor}
                  speed={settings.speed}
                  direction={settings.direction}
                  flashing={settings.flashing}
                  flashFrequency={settings.flashFrequency}
                  paused={paused}
                  onTogglePause={() => {
                    setPaused((p) => !p);
                    vibrate(10);
                  }}
                  onReset={resetToDefaults}
                />
              </div>

              <div style={{ height: bannerHeight }} />
            </main>

            <div className="sticky bottom-14 z-20 w-full">
              <BannerAd height={bannerHeight} />
            </div>
          </>
        ) : (
          <main className="flex-1 px-4 py-4">
            <SettingsScreen
              adFrequency={settings.adFrequency}
              onAdFrequency={(v) => updateSetting('adFrequency', v)}
              persistent={settings.persistent}
              onPersistent={(v) => updateSetting('persistent', v)}
            />
            <div style={{ height: bannerHeight }} />
            <div className="sticky bottom-14 z-20 w-full">
              <BannerAd height={bannerHeight} />
            </div>
          </main>
        )}

        <nav className="sticky bottom-0 z-30 border-t border-black/5 dark:border-white/10 bg-white/90 dark:bg-neutral-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-900/60">
          <div className="max-w-screen-sm mx-auto grid grid-cols-2">
            <TabButton
              active={activeTab === 'home'}
              icon={<Home className="w-5 h-5" />}
              label="Home"
              onClick={() => handleTabChange('home')}
            />
            <TabButton
              active={activeTab === 'settings'}
              icon={<SettingsIcon className="w-5 h-5" />}
              label="Settings"
              onClick={() => handleTabChange('settings')}
            />
          </div>
        </nav>
      </div>

      {showInterstitial && (
        <Interstitial onClose={closeInterstitial} />
      )}
    </div>
  );
}

function TabButton({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
        active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function BannerAd({ height = 60 }) {
  return (
    <div
      className="mx-4 rounded-xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-neutral-800 dark:to-neutral-700 shadow-inner flex items-center justify-center text-zinc-700 dark:text-zinc-200"
      style={{ height }}
      role="complementary"
      aria-label="Ad banner placeholder"
    >
      <span className="text-xs">AdMob Adaptive Banner (placeholder)</span>
    </div>
  );
}

function Interstitial({ onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2600);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-neutral-900 shadow-xl ring-1 ring-black/10 dark:ring-white/10 p-5">
        <div className="text-sm font-semibold mb-2">Sponsored</div>
        <div className="h-48 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
          Interstitial Ad
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2 text-sm font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Settings, FlaskConical, Search } from 'lucide-react';
import type { Section } from '@/components/navTypes';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface TestItem {
  key: string;
  name: string;
  subtitle: string;
  /** Primary group/category label in English and Malayalam, e.g. 'Cognitive'. */
  group?: { en: string; ml: string };
}

interface MobileBottomNavProps {
  section: Section;
  onSectionChange: (s: Section) => void;
  /** List of tests/assessments shown in the Tests quick-picker. */
  tests?: TestItem[];
  /** Called when a test is picked from the Tests quick-picker. */
  onTestSelect?: (key: string) => void;
}

const ITEMS: { key: Section; en: string; ml: string; icon: React.ElementType }[] = [
  { key: 'settings', en: 'Settings', ml: 'ക്രമീകരണം', icon: Settings },
];

/** iPhone-style fixed bottom tab bar. Hidden from md and up. */
export const MobileBottomNav = ({
  section,
  onSectionChange,
  tests = [],
  onTestSelect,
}: MobileBottomNavProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isMl = language === 'ml';
  const [testsOpen, setTestsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close the picker when tapping outside it.
  useEffect(() => {
    if (!testsOpen) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setTestsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [testsOpen]);

  const handleClick = (key: Section) => {
    onSectionChange(key);
    if (key === 'settings') navigate('/settings');
    // scroll to top when changing section
    window.scrollTo(0, 0);
  };

  const pick = (key: string) => {
    onTestSelect?.(key);
    setTestsOpen(false);
    setQuery('');
  };

  const filtered = query.trim()
    ? tests.filter((t) => `${t.name} ${t.subtitle} ${t.group?.en ?? ''}`.toLowerCase().includes(query.toLowerCase()))
    : tests;

  // Group tests by their primary category so group names are clearly visible.
  const grouped = filtered.reduce<{ label: { en: string; ml: string } | undefined; items: TestItem[] }[]>((acc, t) => {
    const last = acc[acc.length - 1];
    if (last && (last.label?.en ?? '') === (t.group?.en ?? '')) {
      last.items.push(t);
    } else {
      acc.push({ label: t.group, items: [t] });
    }
    return acc;
  }, []);

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] print:hidden"
    >
      <div ref={pickerRef} className="relative">
        <ul className="grid grid-cols-2">
          <li>
            <button
              type="button"
              onClick={() => setTestsOpen((o) => !o)}
              aria-expanded={testsOpen}
              aria-haspopup="listbox"
              className={`w-full min-h-[56px] flex flex-col items-center justify-center gap-0.5 px-1 py-2 transition-colors ${
                testsOpen ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <span className="relative">
                <FlaskConical className="h-5 w-5" />
              </span>
              <span className="text-[11px] font-medium leading-none">{isMl ? 'ടെസ്റ്റുകൾ' : 'Tests'}</span>
            </button>
          </li>
          {ITEMS.map(({ key, en, ml, icon: Icon }) => {
            const active = section === key;
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => handleClick(key)}
                  aria-current={active ? 'page' : undefined}
                  className={`w-full min-h-[56px] flex flex-col items-center justify-center gap-0.5 px-1 py-2 transition-colors ${
                    active ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <span className="relative">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-medium leading-none">{isMl ? ml : en}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Tests dropdown — rises above the bottom bar */}
        {testsOpen && (
          <div className="absolute left-2 right-2 bottom-[calc(100%+0.5rem)] z-50 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2">
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={isMl ? 'ടെസ്റ്റ് തിരയുക...' : 'Search tests...'}
                  className="h-9 w-full rounded-lg pl-8 pr-3 text-sm bg-muted/50 outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
            <ul role="listbox" className="max-h-64 overflow-y-auto p-1">
              {grouped.length === 0 && (
                <li className="px-3 py-4 text-center text-xs text-muted-foreground italic">
                  {isMl ? 'ഒന്നും കണ്ടെത്തിയില്ല' : 'No tests found'}
                </li>
              )}
              {grouped.map((group, gi) => (
                <li key={gi}>
                  {group.label && (
                    <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {isMl ? group.label.ml : group.label.en}
                    </div>
                  )}
                  <ul>
                    {group.items.map((t) => (
                      <li key={t.key}>
                        <button
                          type="button"
                          role="option"
                          onClick={() => pick(t.key)}
                          className="w-full flex flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left hover:bg-accent transition-colors"
                        >
                          <span className="text-[13px] font-medium text-foreground">{t.name}</span>
                          {t.subtitle && (
                            <span className="text-[11px] text-muted-foreground truncate w-full">{t.subtitle}</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

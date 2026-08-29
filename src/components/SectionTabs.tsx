import { useState, useRef, useEffect } from 'react';
import { Settings, ArrowLeft, FlaskConical, Search } from 'lucide-react';
import type { Section } from '@/components/navTypes';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface TestItem {
  key: string;
  name: string;
  subtitle: string;
  /** Primary group/category label in English and Malayalam, e.g. 'Cognitive'. */
  group?: { en: string; ml: string };
}

interface SectionTabsProps {
  section: Section;
  onSectionChange: (s: Section) => void;
  showBack?: boolean;
  onBack?: () => void;
  /** List of tests/assessments shown in the Tests quick-picker. */
  tests?: TestItem[];
  /** Called when a test is picked from the Tests quick-picker. */
  onTestSelect?: (key: string) => void;
}

const TABS: { key: Section; en: string; ml: string; icon: React.ElementType }[] = [
  { key: 'settings', en: 'Settings', ml: 'ക്രമീകരണങ്ങൾ', icon: Settings },
];

/**
 * Top tab bar: a "Tests" quick-picker that lists every individual test for
 * jumping straight to any test from any page, plus the Settings tab.
 */
export const SectionTabs = ({
  section,
  onSectionChange,
  showBack,
  onBack,
  tests = [],
  onTestSelect,
}: SectionTabsProps) => {
  const { language } = useLanguage();
  const isMl = language === 'ml';
  const [testsOpen, setTestsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close the picker when clicking outside it.
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

  const pick = (key: string) => {
    onTestSelect?.(key);
    setTestsOpen(false);
    setQuery('');
  };

  return (
    <div ref={pickerRef} className="flex items-center gap-2 overflow-x-auto scrollbar-none relative">
      {showBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          title={isMl ? 'മുമ്പത്തെ ടാബിലേക്ക്' : 'Back to previous tab'}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 min-h-[36px] text-[13px] font-medium text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{isMl ? 'തിരികെ' : 'Back'}</span>
        </button>
      )}

      <div className="flex items-center gap-1 p-1 rounded-full border border-border bg-card/60 backdrop-blur-sm shadow-sm shrink-0">
        {TABS.map(({ key, en, ml, icon: Icon }) => {
          const active = section === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSectionChange(key)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 sm:px-4 min-h-[32px] text-[13px] font-medium transition-all active:scale-95',
                active
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">{isMl ? ml : en}</span>
            </button>
          );
        })}

        {/* Tests quick-picker tab */}
        <button
          type="button"
          onClick={() => setTestsOpen((o) => !o)}
          aria-expanded={testsOpen}
          aria-haspopup="listbox"
          title={isMl ? 'ടെസ്റ്റുകൾ തിരഞ്ഞെടുക്കുക' : 'Pick a test'}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 sm:px-4 min-h-[32px] text-[13px] font-medium transition-all active:scale-95',
            testsOpen
              ? 'bg-primary text-primary-foreground shadow'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          )}
        >
          <FlaskConical className="h-4 w-4 shrink-0" />
          <span className="whitespace-nowrap">{isMl ? 'ടെസ്റ്റുകൾ' : 'Tests'}</span>
        </button>
      </div>

      {/* Tests dropdown */}
      {testsOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-80 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl animate-in fade-in zoom-in-95 slide-in-from-top-2">
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
          <ul role="listbox" className="max-h-72 overflow-y-auto p-1">
            {grouped.length === 0 && (
              <li className="px-3 py-4 text-center text-xs text-muted-foreground italic">
                {isMl ? 'ഒന്നും കണ്ടെത്തിയില്ല' : 'No tests found'}
              </li>
            )}
            {grouped.map((group, gi) => (
              <li key={gi}>
                {group.label && (
                  <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-primary truncate w-full max-w-full">
                    {isMl ? group.label.ml : group.label.en}
                  </div>
                )}
                <ul>
                  {group.items.map((t) => (
                    <li key={t.key} className="w-full">
                      <button
                        type="button"
                        role="option"
                        onClick={() => pick(t.key)}
                        className="w-full flex flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left hover:bg-accent transition-colors min-w-0"
                      >
                        <span className="text-[13px] font-medium text-foreground break-words w-full">{t.name}</span>
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
  );
};

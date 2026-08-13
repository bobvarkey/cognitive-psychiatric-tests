import { ClipboardList, FileBarChart, Settings } from 'lucide-react';
import type { Section } from '@/components/MainSidebar';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface MobileBottomNavProps {
  section: Section;
  onSectionChange: (s: Section) => void;
  resultsCount?: number;
}

const ITEMS: { key: Section; en: string; ml: string; icon: React.ElementType }[] = [
  { key: 'assessments', en: 'Tests', ml: 'ടെസ്റ്റുകൾ', icon: ClipboardList },
  { key: 'results', en: 'Results', ml: 'ഫലങ്ങൾ', icon: FileBarChart },
  { key: 'settings', en: 'Settings', ml: 'ക്രമീകരണം', icon: Settings },
];

/** iPhone-style fixed tab bar. Hidden from md and up (sidebar takes over). */
export const MobileBottomNav = ({ section, onSectionChange, resultsCount = 0 }: MobileBottomNavProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isMl = language === 'ml';

  const handleClick = (key: Section) => {
    onSectionChange(key);
    if (key === 'results') navigate('/history');
    else if (key === 'settings') navigate('/settings');
    else if (key === 'assessments') navigate('/');
    // scroll to top when changing section
    window.scrollTo(0, 0);
  };

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] print:hidden"
    >
      <ul className="grid grid-cols-3">
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
                  {key === 'results' && resultsCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold leading-4 text-center tabular-nums">
                      {resultsCount}
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-medium leading-none">{isMl ? ml : en}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

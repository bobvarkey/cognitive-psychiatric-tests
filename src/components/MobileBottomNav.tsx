import { Settings } from 'lucide-react';
import type { Section } from '@/components/navTypes';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface MobileBottomNavProps {
  section: Section;
  onSectionChange: (s: Section) => void;
}

const ITEMS: { key: Section; en: string; ml: string; icon: React.ElementType }[] = [
  { key: 'settings', en: 'Settings', ml: 'ക്രമീകരണം', icon: Settings },
];

/** iPhone-style fixed tab bar. Hidden from md and up (sidebar takes over). */
export const MobileBottomNav = ({ section, onSectionChange }: MobileBottomNavProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isMl = language === 'ml';

  const handleClick = (key: Section) => {
    onSectionChange(key);
    if (key === 'settings') navigate('/settings');
    // scroll to top when changing section
    window.scrollTo(0, 0);
  };

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] print:hidden"
    >
      <ul className="grid grid-cols-1">
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
    </nav>
  );
};

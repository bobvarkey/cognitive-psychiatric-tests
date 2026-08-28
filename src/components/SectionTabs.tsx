import { ClipboardList, FileBarChart, Settings, ArrowLeft } from 'lucide-react';
import type { Section } from '@/components/navTypes';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface SectionTabsProps {
  section: Section;
  onSectionChange: (s: Section) => void;
  showBack?: boolean;
  onBack?: () => void;
}

const TABS: { key: Section; en: string; ml: string; icon: React.ElementType }[] = [
  { key: 'assessments', en: 'Assessments', ml: 'വിലയിരുത്തലുകൾ', icon: ClipboardList },
  { key: 'results', en: 'Results', ml: 'ഫലങ്ങൾ', icon: FileBarChart },
  { key: 'settings', en: 'Settings', ml: 'ക്രമീകരണങ്ങൾ', icon: Settings },
];

/**
 * Top tab bar for the three primary sections (Assessments / Results / Settings).
 * Replaces the section navigation that used to live in the desktop sidebar.
 * Optionally renders a "Back to previous tab" button before the tabs.
 */
export const SectionTabs = ({ section, onSectionChange, showBack, onBack }: SectionTabsProps) => {
  const { language } = useLanguage();
  const isMl = language === 'ml';

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
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
      </div>
    </div>
  );
};

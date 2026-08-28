import type { Category, CategoryDef } from '@/components/navTypes';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryChipsProps {
  categories: CategoryDef[];
  activeCategory: Category;
  onSelect: (cat: Category) => void;
}

/** Horizontally scrollable category filter — the primary category control on phones/tablets. */
export const CategoryChips = ({ categories, activeCategory, onSelect }: CategoryChipsProps) => {
  const { language } = useLanguage();
  const isMl = language === 'ml';

  return (
    <div className="lg:hidden -mx-4 px-4 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-2 w-max pb-0.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const active = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => onSelect(cat.key)}
              aria-pressed={active}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 min-h-[36px] text-[13px] font-medium transition-all shadow-sm active:scale-95 ${
                active
                  ? 'bg-primary text-primary-foreground border-primary shadow-primary/20'
                  : 'bg-card/50 backdrop-blur-sm text-foreground border-border hover:border-primary/50'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap max-w-[11rem] truncate">{isMl ? cat.label.ml : cat.label.en}</span>
              <span className={`text-[11px] tabular-nums ${active ? 'opacity-80' : 'text-muted-foreground'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

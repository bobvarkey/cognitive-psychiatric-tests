import { ClipboardList, FileBarChart, Settings, Brain, Lightbulb, Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export type Section = 'assessments' | 'results' | 'settings' | 'suggestions';
export type Category = 'all' | 'cognitive' | 'mood' | 'personality' | 'adverse' | 'movement' | 'epilepsy' | 'substance' | 'sleep' | 'psychosis' | 'fibromyalgia' | 'brainfog';

export interface CategoryDef {
  key: Category;
  label: { en: string; ml: string };
  icon: React.ElementType;
  count: number;
}

interface MainSidebarProps {
  section: Section;
  onSectionChange: (s: Section) => void;
  categories: CategoryDef[];
  activeCategory: Category;
  onCategorySelect: (cat: Category) => void;
  resultsCount: number;
  /** Sections currently being interacted with — show pulse indicator */
  pulseSections?: Set<Section>;
}

const SECTION_LABELS: Record<Section, { en: string; ml: string; icon: React.ElementType }> = {
  assessments: { en: 'Assessments', ml: 'വിലയിരുത്തലുകൾ', icon: ClipboardList },
  results: { en: 'Results', ml: 'ഫലങ്ങൾ', icon: FileBarChart },
  settings: { en: 'Settings', ml: 'ക്രമീകരണങ്ങൾ', icon: Settings },
  suggestions: { en: 'Suggestions', ml: 'നിർദ്ദേശങ്ങൾ', icon: Lightbulb },
};

export const MainSidebar = ({
  section,
  onSectionChange,
  categories,
  activeCategory,
  onCategorySelect,
  resultsCount,
  pulseSections,
}: MainSidebarProps) => {
  const { state, setOpen, setOpenMobile } = useSidebar();
  const collapsed = state === 'collapsed';
  const { language } = useLanguage();
  const isMl = language === 'ml';
  const [catSearch, setCatSearch] = useState('');

  // Persist sidebar state
  useEffect(() => {
    const saved = localStorage.getItem('sidebar_expanded');
    if (saved !== null) {
      const isExpanded = saved === 'true';
      setOpen(isExpanded);
      setOpenMobile(isExpanded);
    }
  }, [setOpen, setOpenMobile]);

  const handleToggle = (open: boolean) => {
    localStorage.setItem('sidebar_expanded', String(open));
  };

  const filteredCategories = categories.filter(cat => 
    cat.label.en.toLowerCase().includes(catSearch.toLowerCase()) ||
    cat.label.ml.toLowerCase().includes(catSearch.toLowerCase())
  );

  const renderSectionRow = (key: Section, badge?: number | string) => {
    const def = SECTION_LABELS[key];
    const Icon = def.icon;
    const isActive = section === key;
    const pulse = pulseSections?.has(key);
    return (
      <SidebarMenuButton
        onClick={() => onSectionChange(key)}
        isActive={isActive}
        tooltip={isMl ? def.ml : def.en}
        size="lg"
        className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold relative gap-3 text-[15px] py-2.5"
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left leading-tight truncate">{isMl ? def.ml : def.en}</span>
            {badge !== undefined && badge !== 0 && (
              <span className="ml-auto mr-3 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary tabular-nums">
                {badge}
              </span>
            )}
            {pulse && (
              <span
                aria-hidden
                className="h-2 w-2 rounded-full bg-primary animate-pulse ring-2 ring-sidebar-background shrink-0"
              />
            )}
          </>
        )}
      </SidebarMenuButton>
    );
  };

  return (
    <Sidebar collapsible="icon" onOpenChange={handleToggle}>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-2.5">
          <Brain className="h-6 w-6 text-primary shrink-0" />
          {!collapsed && (
            <span className="text-base font-bold text-sidebar-foreground truncate tracking-tight">
              {isMl ? 'കോഗ്നിറ്റോ' : 'Cognito'}
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* ───── Assessments (with category sub-items) ───── */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    {renderSectionRow('assessments')}
                  </CollapsibleTrigger>
                  {!collapsed && section === 'assessments' && (
                    <CollapsibleContent className="animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3 py-2">
                        <div className="relative group">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            placeholder="Filter categories..."
                            value={catSearch}
                            onChange={(e) => setCatSearch(e.target.value)}
                            className="h-8 pl-7 pr-7 text-xs bg-sidebar-accent/50 border-transparent focus:bg-sidebar-background transition-all"
                          />
                          {catSearch && (
                            <button 
                              onClick={() => setCatSearch('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      <SidebarMenuSub className="border-l-0 ml-0 px-1.5">
                        {filteredCategories.map((cat) => {
                          const CatIcon = cat.icon;
                          const isActive = activeCategory === cat.key;
                          const isHighlighted = catSearch && (
                            cat.label.en.toLowerCase().includes(catSearch.toLowerCase()) ||
                            cat.label.ml.toLowerCase().includes(catSearch.toLowerCase())
                          );

                          return (
                            <SidebarMenuSubItem key={cat.key}>
                              <SidebarMenuSubButton
                                onClick={() => onCategorySelect(cat.key)}
                                isActive={isActive}
                                size="md"
                                className={`data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-bold gap-2.5 h-9 text-[14px] rounded-lg transition-all ${
                                  isHighlighted ? 'ring-1 ring-primary/50 bg-primary/5' : ''
                                } ${!isActive && catSearch && !isHighlighted ? 'opacity-40 blur-[0.5px]' : ''}`}
                              >
                                <CatIcon className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className="flex-1 text-left truncate">{isMl ? cat.label.ml : cat.label.en}</span>
                                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-sidebar-accent/80 text-sidebar-foreground tabular-nums shrink-0">
                                  {cat.count}
                                </span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                        {filteredCategories.length === 0 && (
                          <div className="px-4 py-3 text-[11px] text-muted-foreground italic text-center">
                            No categories found
                          </div>
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>

              <SidebarMenuItem>{renderSectionRow('results', resultsCount)}</SidebarMenuItem>
              <SidebarMenuItem>{renderSectionRow('settings')}</SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

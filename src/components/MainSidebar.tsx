import { ClipboardList, FileBarChart, Settings, Brain, Lightbulb } from 'lucide-react';
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
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { language } = useLanguage();
  const isMl = language === 'ml';

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
    <Sidebar collapsible="icon">
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
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {categories.map((cat) => {
                          const CatIcon = cat.icon;
                          const isActive = activeCategory === cat.key;
                          return (
                            <SidebarMenuSubItem key={cat.key}>
                              <SidebarMenuSubButton
                                onClick={() => onCategorySelect(cat.key)}
                                isActive={isActive}
                                size="md"
                                className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold gap-2.5 h-9 text-[14px]"
                              >
                                <CatIcon className="h-4 w-4 shrink-0" />
                                <span className="flex-1 text-left truncate">{isMl ? cat.label.ml : cat.label.en}</span>
                                <span className="ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sidebar-accent text-sidebar-accent-foreground tabular-nums shrink-0">
                                  {cat.count}
                                </span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
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

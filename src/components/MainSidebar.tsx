import { ClipboardList, FileBarChart, Settings, Brain, Lightbulb, Search, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

export type Section = 'assessments' | 'results' | 'settings';
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
  pulseSections?: Set<Section>;
  assessments: any[];
  onAssessmentSelect: (key: string) => void;
  selectedAssessmentId?: string | null;
}

const SECTION_LABELS: Record<Section, { en: string; ml: string; icon: React.ElementType }> = {
  assessments: { en: 'Assessments', ml: 'വിലയിരുത്തലുകൾ', icon: ClipboardList },
  results: { en: 'Results', ml: 'ഫലങ്ങൾ', icon: FileBarChart },
  settings: { en: 'Settings', ml: 'ക്രമീകരണങ്ങൾ', icon: Settings },
};

export const MainSidebar = ({
  section,
  onSectionChange,
  categories,
  activeCategory,
  onCategorySelect,
  resultsCount,
  pulseSections,
  assessments,
  onAssessmentSelect,
  selectedAssessmentId,
}: MainSidebarProps) => {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = state === 'collapsed';
  const { language } = useLanguage();
  const isMl = language === 'ml';
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const activeItemRef = useRef<HTMLElement | null>(null);

  // Automatically expand category and scroll to active assessment
  useEffect(() => {
    if (selectedAssessmentId) {
      const assessment = assessments.find(a => a.key === selectedAssessmentId);
      if (assessment) {
        setExpandedCategories(prev => {
          const next = new Set(prev);
          assessment.category.forEach((catKey: string) => next.add(catKey));
          return next;
        });

        // Small delay to allow Collapsible to animate/render before scrolling
        setTimeout(() => {
          activeItemRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }, 300);
      }
    }
  }, [selectedAssessmentId]);

  const filteredCategories = categories.filter(cat => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    // Match category itself
    if (cat.label.en.toLowerCase().includes(query) || cat.label.ml.toLowerCase().includes(query)) return true;
    
    // Match any assessment within this category
    return assessments.some(a => 
      a.category.includes(cat.key) && 
      (a.name.toLowerCase().includes(query) || a.description?.toLowerCase().includes(query))
    );
  });

  // Automatically expand categories when searching
  useEffect(() => {
    if (searchQuery) {
      const newExpanded = new Set(filteredCategories.map(c => c.key));
      setExpandedCategories(newExpanded);
    } else {
      setExpandedCategories(new Set());
    }
  }, [searchQuery]);

  const toggleCategory = (key: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const renderSectionRow = (key: Section, badge?: number | string) => {
    const def = SECTION_LABELS[key];
    const Icon = def.icon;
    const isActive = section === key;
    const pulse = pulseSections?.has(key);
    
    const handleClick = () => {
      onSectionChange(key);
      if (key === 'results') navigate('/history');
      else if (key === 'settings') navigate('/settings');
      else if (key === 'assessments') navigate('/');
    };

    return (
      <SidebarMenuButton
        onClick={handleClick}
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
    <Sidebar collapsible="icon" className="transition-all duration-300">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-2.5">
          <Brain className="h-6 w-6 text-primary shrink-0 transition-transform group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
          {!collapsed && (
            <span className="text-base font-bold text-sidebar-foreground truncate tracking-tight">
              {isMl ? 'കോഗ്നിറ്റോ' : 'Cognito'}
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col min-h-0">
        {/* ───── Assessments (with category sub-items) ───── */}
        <SidebarGroup className="flex flex-col min-h-0 py-0">
          <SidebarGroupContent className="flex flex-col min-h-0">
            <SidebarMenu className="flex flex-col min-h-0">
              <Collapsible open className="group/collapsible flex flex-col min-h-0 grow">
                <SidebarMenuItem className="flex flex-col min-h-0 grow">
                  <CollapsibleTrigger asChild>
                    {renderSectionRow('assessments')}
                  </CollapsibleTrigger>
                  {true && (
                    <CollapsibleContent forceMount className={cn("animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col min-h-0 grow overflow-hidden", (collapsed || section !== 'assessments') && "hidden-manually")}>

                      <div className="px-3 py-2">
                        <div className="relative group">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            placeholder={isMl ? "തിരയുക..." : "Search assessments..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-8 pl-7 pr-7 text-xs bg-sidebar-accent/50 border-transparent focus:bg-sidebar-background transition-all"
                          />
                          {searchQuery && (
                            <button 
                              onClick={() => setSearchQuery('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      <SidebarMenuSub className="border-l-0 ml-0 px-1.5 flex-1 overflow-y-auto">
                        {filteredCategories.map((cat) => {
                          const CatIcon = cat.icon;
                          const isActive = activeCategory === cat.key;
                          const isOpen = expandedCategories.has(cat.key);
                          const isCategoryOfActiveAssessment = selectedAssessmentId && assessments.find(a => a.key === selectedAssessmentId)?.category.includes(cat.key);

                          
                          const filteredAssessments = assessments.filter(a => 
                            a.category.includes(cat.key) && 
                            (!searchQuery || 
                             a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (a.description && a.description.toLowerCase().includes(searchQuery.toLowerCase())))
                          );

                          if (searchQuery && filteredAssessments.length === 0) return null;

                          return (
                            <Collapsible 
                              key={cat.key} 
                              open={isOpen}
                              onOpenChange={() => toggleCategory(cat.key)}
                              className="group/cat-collapsible"
                            >
                              <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuSubButton
                                    isActive={isActive}
                                    size="md"
                                    className={`data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-bold gap-2.5 h-9 text-[14px] rounded-lg transition-all hover:bg-sidebar-accent/50 group/item ${
                                      searchQuery || isCategoryOfActiveAssessment ? 'ring-1 ring-primary/20 bg-primary/5' : ''
                                    }`}

                                  >
                                    <CatIcon className={`h-4 w-4 shrink-0 transition-transform group-hover/item:scale-110 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover/item:text-foreground'}`} />
                                    <span className="flex-1 text-left truncate">{isMl ? cat.label.ml : cat.label.en}</span>
                                    <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-sidebar-accent/80 text-sidebar-foreground tabular-nums shrink-0">
                                      {cat.count}
                                    </span>
                                  </SidebarMenuSubButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="animate-in fade-in slide-in-from-top-1 duration-200">
                                  <SidebarMenuSub className="border-l border-sidebar-border/30 ml-4 pl-2 mt-1 space-y-0.5">
                                    {filteredAssessments.map(a => {
                                      const isAssessmentActive = selectedAssessmentId === a.key;
                                      return (
                                        <SidebarMenuSubItem key={a.key}>
                                          <SidebarMenuSubButton
                                            size="sm"
                                            ref={(el: any) => { if (isAssessmentActive) activeItemRef.current = el; }}
                                            isActive={isAssessmentActive}
                                            className={cn(
                                              "text-[12px] h-8 transition-colors",
                                              isAssessmentActive 
                                                ? "text-primary font-bold bg-primary/5 ring-1 ring-primary/20" 
                                                : "text-muted-foreground hover:text-foreground"
                                            )}
                                            onClick={() => {
                                              onAssessmentSelect(a.key);
                                              onCategorySelect(cat.key);
                                              if (location.pathname !== '/') navigate('/');
                                            }}
                                          >
                                            {a.name}
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      );
                                    })
                                    }
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </SidebarMenuItem>
                            </Collapsible>
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

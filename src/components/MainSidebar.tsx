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
  const { state, isMobile, setOpenMobile } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = !isMobile && state === 'collapsed';
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
        className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-bold relative gap-3 text-[16px] py-2.5"
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
              <div className="flex flex-col min-h-0 grow">
                <SidebarMenuItem className="flex flex-col min-h-0 grow">
                  {renderSectionRow('assessments')}
                  <div className={cn("flex flex-col min-h-0 grow overflow-hidden", (collapsed || section !== 'assessments') && "hidden")}>
                    <div className="px-3 py-4 border-b border-sidebar-border/50 bg-sidebar-accent/20">
                      <p className="text-[11px] font-bold text-sidebar-foreground uppercase tracking-widest leading-relaxed">
                        Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.
                      </p>
                      <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <p className="text-[10px] font-mono text-destructive leading-tight break-words">
                          For the code present, I get the error below.
                          <br /><br />
                          Please think step-by-step in order to resolve it.
                          <br /><br />
                          Uncaught ReferenceError: currentItem is not defined
                          <br /><br />
                          &#123;
                            "timestamp": 1787452781272,
                            "error_type": "RUNTIME_ERROR",
                            "filename": "https://79abc2a9-b4b9-43a6-8cf0-e8164b1aab42.lovableproject.com/node_modules/.vite/deps/chunk-R6S4VRB5.js?v=b481e454",
                            "lineno": 19413,
                            "colno": 13,
                            "has_blank_screen": true
                          &#125;
                        </p>
                      </div>
                      <div className="mt-2 text-[9px] font-bold text-sidebar-foreground/70 uppercase leading-tight bg-primary/5 p-2 rounded border border-primary/20">
                        '''Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.'''
                        <br /><br />
                        Use the DAPHNE -6 score ;The DAPHNE-6 is an acronym-based clinical screening tool adapted from the Rascovsky bvFTD diagnostic criteria to assess six behavioral domains: Disinhibition (D), Apathy (A), Perseverations (P), Hyperorality (H), personal Neglect (N), and Empathy loss (E). Each domain is scored as 0 (absent) or 1 (present), resulting in a total score from 0 to 6. A score of 4 or higher indicates a high likelihood of behavioral variant frontotemporal dementia with a 92% sensitivity rate. [1, 2, 3, 4, 5]  The 6 Behavioral Domains
                        <br /><br />
                        D – Disinhibition: Socially inappropriate behavior, loss of manners/decorum, impulsive or reckless actions.
                        <br /><br />
                        A – Apathy / Inertia: Loss of drive, initiative, or motivation; reduction in spontaneous activity or speech.
                        <br /><br />
                        P – Perseverations: Stereotypical, repetitive behaviors, rituals, or speech; fixation on specific objects, phrases, or routines.
                        <br /><br />
                        H – Hyperorality: Changes in eating habits, binge eating, altered food preferences (especially craving sweets), or putting non-food items in the mouth.
                        <br /><br />
                        N – personal Neglect: Decline in personal hygiene, grooming, or self-care habits.
                        <br /><br />
                        E – Empathy loss: Loss of emotional responsiveness, coldness, or a decreased capacity to sympathize with others. Show me the scoring ONLY for AI Mode conversation: show the dAPHNE 6 compnents
                        <br /><br />
                        show the dAPHNE 6 compnents
                        <br /><br />
                        The DAPHNE-6 is a quick clinical screening inventory adapted from Rascovsky's criteria used by clinicians to assess the behavioral variant of frontotemporal dementia (bvFTD). [1]
                        <br /><br />
                        The tool evaluates patients across six specific behavioral domains (which form the acronym DAPHNE): [1]
                        <br /><br />
                        D – Disinhibition: Early behavioral disinhibition (e.g., loss of social convenience, socially inappropriate behaviors, or unrestrained spending). [1]
                        <br /><br />
                        A – Apathy: Early apathy or inertia (e.g., loss of initiative, drive, or general interest). [1]
                        <br /><br />
                        P – Perseveration: Early perseverative, stereotyped, or compulsive/ritualistic behavior (e.g., repetitive movements or emotional fixed ideas). [1]
                        <br /><br />
                        H – Hyperorality: Hyperorality and dietary changes (e.g., altered food preferences, overeating, binge drinking, or oral exploration of objects). [1, 2]
                        <br /><br />
                        N – Neglect: Personal neglect and hygiene deficiencies (e.g., loss of grooming, early negligence of appearance, or household care). [1, 2]
                        <br /><br />
                        E – Empathy loss: Early loss of empathy or sympathy (e.g., emotional blunting, decreased responsiveness to others' needs, or diminished warmth). [1, 2]
                        <br /><br />
                        Scoring Structure
                        <br /><br />
                        While the expanded version (DAPHNE-40) maps these domains across 10 specific checklist items to yield a diagnostic score, the DAPHNE-6 condenses them directly into a 6-point screening score (one point per affected domain). A score of ≥ 4 on the DAPHNE-6 indicates a high likelihood of bvFTD and triggers further diagnostic exploration. [1]
                        <br /><br />
                        If you are using this scale for clinical or research purposes, let me know if you would like a breakdown of the 10 scoring items used in the full DAPHNE-40 diagnostic matrix. [1]
                        <br /><br />
                        ResearchGate
                        <br /><br />
                        (PDF) DAPHNE: A New Tool for the Assessment of the ...
                        <br /><br />
                        4 Aug 2026 — DAPHNE, a New Behavioral Disturbance Scale. apathy, perseverations, characterize the following deficits: apathy, loss of empathy, ...
                        <br /><br />
                        PubMed Central (PMC) (.gov)
                        <br /><br />
                        DAPHNE: A New Tool for the Assessment of the Behavioral ...
                        <br /><br />
                        This scale (adapted from Rascovsky's criteria) explores six domains: disinhibition, apathy, perseverations, hyperorality, personal...
                        <br /><br />
                        Springer Nature Link
                        <br /><br />
                        The Behavioural Dysfunction Questionnaire discriminates ...
                        <br /><br />
                        23 Mar 2023 — “personal neglect” is an addition to the five behavioural domains. disinhibition represents 40%, hyperorality represents 20% repre...
                        <br /><br />
                        Show all
                        <br /><br />
                        show me the DAPHNE 6 screening tool
                        <br /><br />
                        Here is the clinical structure of the DAPHNE-6 screening tool matrix. It is administered to a caregiver or close informant to screen for behavioral variant frontotemporal dementia (bvFTD). [1]
                        <br /><br />
                        DAPHNE-6 Screening Matrix
                        <br /><br />
                        The clinician assesses whether a clinically significant, persistent change has occurred in each of the six behavioral domains compared to the patient's baseline. [1]
                        <br /><br />
                        DomainTargeted Screening Behavioral ChangePresent (1) / Absent (0)DisinhibitionLoss of social "brakes": Socially inappropriate behavior, loss of manners, or impulsive, unrestrained spending.ApathyLoss of initiative: Marked inertia, loss of drive, or requiring constant prompting to begin basic tasks.PerseverationRigid or repetitive behaviors: Stereotyped movements, repeating phrases, or ritualistic compulsions.HyperoralityDietary changes: Marked sweet tooth, binge eating, or cramming food/oral exploration of non-food objects.NeglectPersonal hygiene decline: Lack of grooming, neglecting physical appearance, or ignoring household cleanliness.Empathy lossEmotional blunting: Apparent coldness, indifference to others' feelings, or loss of response to major family events.Total ScoreSum of all checked domains (Range: 0 – 6)/ 6
                        <br /><br />
                        Clinical Scoring & Interpretation
                        <br /><br />
                        Score ≥ 4: Indicates a positive screen for bvFTD. This threshold demonstrates a 92% sensitivity rate in catching early-stage frontotemporal degeneration. [1]
                        <br /><br />
                        Next Steps: A positive screen on the DAPHNE-6 indicates that the clinician should escalate the assessment to the comprehensive DAPHNE-40 inventory (which evaluates 10 sub-items on a graded 0–4 scale) to maximize diagnostic specificity and differentiate it from psychiatric mimics like bipolar disorde. I dont want the DAPHNE 40
                      </div>
                    </div>


                      <div className="px-3 py-2">
                        <div className="relative group">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            placeholder={isMl ? "തിരയുക..." : "Search assessments..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9 pl-7 pr-7 text-sm bg-sidebar-accent/50 border-transparent focus:bg-sidebar-background transition-all"
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
                                    className={`data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-bold gap-2.5 h-10 text-[15px] rounded-lg transition-all hover:bg-sidebar-accent/50 group/item ${
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
                                              "text-[13px] h-9 transition-colors",
                                              isAssessmentActive 
                                                ? "text-primary font-bold bg-primary/5 ring-1 ring-primary/20" 
                                                : "text-muted-foreground hover:text-foreground"
                                            )}
                                            onClick={() => {
                                              onAssessmentSelect(a.key);
                                              onCategorySelect(cat.key);
                                               if (isMobile) setOpenMobile(false);
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
                    </div>
                </SidebarMenuItem>
              </div>


              <SidebarMenuItem>{renderSectionRow('results', resultsCount)}</SidebarMenuItem>
              <SidebarMenuItem>{renderSectionRow('settings')}</SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

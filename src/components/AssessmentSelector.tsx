import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { DaphneAssessment } from '@/components/DaphneAssessment';
import { MocaAssessment } from '@/components/MocaAssessment';
import { HareAssessment } from '@/components/HareAssessment';
import { AdhdAssessment } from '@/components/AdhdAssessment';
import { TuliaAssessment } from '@/components/TuliaAssessment';
import { MsiBpdAssessment } from '@/components/MsiBpdAssessment';
import { HamdAssessment } from '@/components/HamdAssessment';
import { DelusionsAssessment } from '@/components/DelusionsAssessment';
import { FabAssessment } from '@/components/FabAssessment';
import { DpdrAssessment } from '@/components/DpdrAssessment';
import { MiniCogAssessment } from '@/components/MiniCogAssessment';
import { Pcl5Assessment } from '@/components/Pcl5Assessment';
import { PssAssessment } from '@/components/PssAssessment';
import { PhysicalFindingsAssessment } from '@/components/PhysicalFindingsAssessment';
import { DementiaAssessment } from '@/components/DementiaAssessment';
import { CatatoniaAssessment } from '@/components/CatatoniaAssessment';
import { StressScreeningAssessment } from '@/components/StressScreeningAssessment';
import { FallRiskAssessment } from '@/components/FallRiskAssessment';
import { MiniAceAssessment } from '@/components/MiniAceAssessment';
import { NmsAssessment } from '@/components/NmsAssessment';
import { MmpiAssessment } from '@/components/MmpiAssessment';
import { AdamAssessment } from '@/components/AdamAssessment';
import {
  Brain, Calculator, Home, AlertTriangle, Focus, Hand, Heart, Frown, Eye, Zap,
  Shield, Gauge, Activity, Stethoscope, Pause, Scale, Footprints, ClipboardCheck,
  ThermometerSun, ClipboardList, Search, X,
} from 'lucide-react';
import { usePatientInfo } from '@/contexts/PatientInfoContext';
import { LanguageToggle } from './LanguageToggle';

type AssessmentKey =
  | 'daphne' | 'moca' | 'minicog' | 'hare' | 'adhd' | 'tulia' | 'msibpd'
  | 'hamd' | 'delusions' | 'fab' | 'dpdr' | 'pcl5' | 'pss' | 'physical'
  | 'dementia' | 'catatonia' | 'stressScreening' | 'fallRisk' | 'miniace'
  | 'nms' | 'mmpi' | 'adam';

type Category = 'all' | 'cognitive' | 'mood' | 'personality' | 'medical';

interface AssessmentInfo {
  key: AssessmentKey;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  gradient: string;
  category: Category[];
}

const assessments: AssessmentInfo[] = [
  { key: 'daphne', name: 'DAPHNE', subtitle: 'bvFTD Assessment', icon: Brain, gradient: 'from-purple-500 to-pink-600', category: ['cognitive'] },
  { key: 'moca', name: 'MoCA', subtitle: 'Cognitive Assessment', icon: Calculator, gradient: 'from-green-500 to-teal-600', category: ['cognitive'] },
  { key: 'minicog', name: 'Mini-Cog™', subtitle: 'Brief Screening', icon: Brain, gradient: 'from-blue-500 to-cyan-600', category: ['cognitive'] },
  { key: 'miniace', name: 'Mini-ACE', subtitle: "Addenbrooke's", icon: ClipboardCheck, gradient: 'from-emerald-500 to-green-600', category: ['cognitive'] },
  { key: 'fab', name: 'FAB', subtitle: 'Frontal Battery', icon: Zap, gradient: 'from-amber-500 to-yellow-600', category: ['cognitive'] },
  { key: 'tulia', name: 'TULIA', subtitle: 'Apraxia Screen', icon: Hand, gradient: 'from-teal-500 to-cyan-600', category: ['cognitive'] },
  { key: 'hamd', name: 'HAM-D', subtitle: 'Depression Scale', icon: Frown, gradient: 'from-blue-500 to-indigo-600', category: ['mood'] },
  { key: 'pss', name: 'PSS-10', subtitle: 'Perceived Stress', icon: Gauge, gradient: 'from-emerald-500 to-teal-600', category: ['mood'] },
  { key: 'pcl5', name: 'PC-PTSD-5', subtitle: 'PTSD Screen', icon: Shield, gradient: 'from-red-500 to-rose-600', category: ['mood'] },
  { key: 'dpdr', name: 'DPDR', subtitle: 'Depersonalization', icon: Eye, gradient: 'from-cyan-500 to-blue-600', category: ['mood'] },
  { key: 'stressScreening', name: 'Stress vs Disorder', subtitle: 'Differentiation', icon: Scale, gradient: 'from-violet-500 to-purple-600', category: ['mood'] },
  { key: 'adam', name: 'ADAM', subtitle: 'Apathy-Depression', icon: ClipboardList, gradient: 'from-teal-500 to-blue-600', category: ['mood'] },
  { key: 'hare', name: 'Hare PCL-R', subtitle: 'Psychopathy', icon: AlertTriangle, gradient: 'from-orange-500 to-red-600', category: ['personality'] },
  { key: 'adhd', name: 'ADHD ASRS', subtitle: 'DSM-5-TR', icon: Focus, gradient: 'from-indigo-500 to-blue-600', category: ['personality'] },
  { key: 'msibpd', name: 'MSI-BPD', subtitle: 'BPD Screening', icon: Heart, gradient: 'from-rose-500 to-pink-600', category: ['personality'] },
  { key: 'mmpi', name: 'MMPI', subtitle: 'OPD Screener', icon: ClipboardList, gradient: 'from-violet-600 to-indigo-600', category: ['personality'] },
  { key: 'delusions', name: 'Delusions', subtitle: 'Hallucinations', icon: Eye, gradient: 'from-violet-500 to-purple-700', category: ['personality'] },
  { key: 'dementia', name: 'Dementia', subtitle: 'BEHAV5+ & Signs', icon: Stethoscope, gradient: 'from-violet-600 to-purple-600', category: ['medical'] },
  { key: 'catatonia', name: 'BFCRS', subtitle: 'Catatonia Scale', icon: Pause, gradient: 'from-cyan-500 to-teal-600', category: ['medical'] },
  { key: 'nms', name: 'NMS', subtitle: 'Malignant Syndrome', icon: ThermometerSun, gradient: 'from-red-600 to-rose-700', category: ['medical'] },
  { key: 'physical', name: 'Physical', subtitle: 'Metabolic Risk', icon: Activity, gradient: 'from-orange-500 to-amber-500', category: ['medical'] },
  { key: 'fallRisk', name: 'Fall Risk', subtitle: 'STEADI & Morse', icon: Footprints, gradient: 'from-orange-500 to-red-600', category: ['medical'] },
];

const categoryLabels: Record<Category, { en: string; ml: string; icon: React.ElementType }> = {
  all: { en: 'All', ml: 'എല്ലാം', icon: ClipboardList },
  cognitive: { en: 'Cognitive', ml: 'കോഗ്നിറ്റീവ്', icon: Brain },
  mood: { en: 'Mood', ml: 'മൂഡ്', icon: Frown },
  personality: { en: 'Personality', ml: 'വ്യക്തിത്വം', icon: Heart },
  medical: { en: 'Medical', ml: 'മെഡിക്കൽ', icon: Stethoscope },
};

export const AssessmentSelector = () => {
  const { t, language } = useLanguage();
  const { clearPatientInfo } = usePatientInfo();
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentKey | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleBackToMenu = () => {
    clearPatientInfo();
    setSelectedAssessment(null);
  };

  const filteredAssessments = useMemo(() => {
    let filtered = assessments;
    if (activeCategory !== 'all') {
      filtered = filtered.filter(a => a.category.includes(activeCategory));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [activeCategory, searchQuery]);

  // Render selected assessment
  if (selectedAssessment) {
    const wrapWithBack = (component: React.ReactNode) => (
      <div>
        <div className="fixed top-4 left-4 z-10 print:hidden">
          <Button
            variant="outline"
            onClick={handleBackToMenu}
            className="flex items-center gap-2 bg-background/80 backdrop-blur-sm shadow-md"
            size="sm"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">{t('backToMenu')}</span>
          </Button>
        </div>
        {component}
      </div>
    );

    const withOnBack: Record<string, boolean> = {
      adhd: true, msibpd: true, hamd: true, dpdr: true, pss: true,
      physical: true, dementia: true, catatonia: true, stressScreening: true,
      fallRisk: true, miniace: true, nms: true, mmpi: true, adam: true,
    };

    if (withOnBack[selectedAssessment]) {
      const ComponentMap: Record<string, React.ComponentType<{ onBack: () => void }>> = {
        adhd: AdhdAssessment,
        msibpd: MsiBpdAssessment,
        hamd: HamdAssessment,
        dpdr: DpdrAssessment,
        pss: PssAssessment,
        physical: PhysicalFindingsAssessment,
        dementia: DementiaAssessment,
        catatonia: CatatoniaAssessment,
        stressScreening: StressScreeningAssessment,
        fallRisk: FallRiskAssessment,
        miniace: MiniAceAssessment,
        nms: NmsAssessment,
        mmpi: MmpiAssessment,
        adam: AdamAssessment,
      };
      const Comp = ComponentMap[selectedAssessment];
      return <Comp onBack={handleBackToMenu} />;
    }

    const wrapMap: Record<string, React.ReactNode> = {
      daphne: <DaphneAssessment />,
      moca: <MocaAssessment />,
      minicog: <MiniCogAssessment />,
      hare: <HareAssessment />,
      tulia: <TuliaAssessment />,
      fab: <FabAssessment />,
      pcl5: <Pcl5Assessment />,
      delusions: <DelusionsAssessment />,
    };

    return wrapWithBack(wrapMap[selectedAssessment]);
  }

  // Main menu
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary pb-24 md:pb-8">
      <LanguageToggle />

      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-4 pt-4 pb-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-6 w-6 text-primary shrink-0" />
            <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">
              {t('cognitiveAssessments')}
            </h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? 'Search assessments…' : 'അസെസ്മെന്റുകൾ തിരയുക…'}
              className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Tabs — horizontal scroll on mobile */}
          <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {(Object.keys(categoryLabels) as Category[]).map((cat) => {
              const label = categoryLabels[cat];
              const Icon = label.icon;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {language === 'en' ? label.en : label.ml}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assessment Grid */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredAssessments.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.key}
                onClick={() => setSelectedAssessment(a.key)}
                className="group flex flex-col items-center text-center p-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-200 active:scale-[0.97]"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center mb-2.5 shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-foreground leading-tight">
                  {a.name}
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                  {a.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {filteredAssessments.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">
              {language === 'en' ? 'No assessments found' : 'അസെസ്മെന്റുകൾ കണ്ടെത്തിയില്ല'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation — mobile only */}
      <nav className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-card/95 backdrop-blur-md border-t border-border safe-area-pb">
        <div className="flex justify-around items-center h-16 px-2">
          {(Object.keys(categoryLabels) as Category[]).map((cat) => {
            const label = categoryLabels[cat];
            const Icon = label.icon;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors min-w-0 ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-[10px] font-medium truncate max-w-[56px]">
                  {language === 'en' ? label.en : label.ml}
                </span>
                {isActive && (
                  <div className="w-4 h-0.5 rounded-full bg-primary mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

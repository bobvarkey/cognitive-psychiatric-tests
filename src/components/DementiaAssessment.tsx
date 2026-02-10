import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { DementiaResults } from './DementiaResults';
import { BEHAV5_ITEMS, SOFT_SIGN_ITEMS, VAT_ITEMS, CLINICAL_EXAM_ITEMS, HISTORY_ITEMS, TEST_ITEMS, VITAMINS_MNEMONIC, IQCODE_ITEMS, IQCODE_RESPONSE_OPTIONS, CDR_DOMAINS, CDR_GLOBAL_INTERPRETATIONS } from '@/data/dementiaScale';
import { DementiaResponse, DementiaResults as DementiaResultsType } from '@/types/dementia';
import { ArrowLeft, Brain, AlertTriangle, Stethoscope, ClipboardList, FlaskConical, Eye, Activity, ChevronDown, Users, Gauge } from 'lucide-react';
import neurosyphilisFlowchart from '@/assets/neurosyphilis-flowchart.png';

interface DementiaAssessmentProps {
  onBack?: () => void;
}

export const DementiaAssessment: React.FC<DementiaAssessmentProps> = ({ onBack }) => {
  const { language, t } = useLanguage();
  const [responses, setResponses] = useState<DementiaResponse>({
    behav5: {},
    softSigns: { mhd: null, sts: null, hts: null, applause: null, glabellar: null, palmomental: null, snout: null },
    vat: {},
    clinicalExam: {},
    history: {},
    tests: {},
    iqcode: {},
    cdr: {}
  });
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<DementiaResultsType | null>(null);
  const [vatPhase, setVatPhase] = useState<'learning' | 'recall'>('learning');
  const [currentVatIndex, setCurrentVatIndex] = useState(0);

  const handleBehav5Change = (itemId: string, checked: boolean) => {
    setResponses(prev => ({
      ...prev,
      behav5: { ...prev.behav5, [itemId]: checked }
    }));
  };

  const handleSoftSignChange = (signId: 'mhd' | 'sts' | 'hts' | 'applause' | 'glabellar' | 'palmomental' | 'snout', value: 'positive' | 'negative') => {
    setResponses(prev => ({
      ...prev,
      softSigns: { ...prev.softSigns, [signId]: value }
    }));
  };

  const handleHistoryChange = (itemId: string, checked: boolean) => {
    setResponses(prev => ({
      ...prev,
      history: { ...prev.history, [itemId]: checked }
    }));
  };

  const handleClinicalExamChange = (itemId: string, checked: boolean) => {
    setResponses(prev => ({
      ...prev,
      clinicalExam: { ...prev.clinicalExam, [itemId]: checked }
    }));
  };

  const handleTestChange = (itemId: string, checked: boolean) => {
    setResponses(prev => ({
      ...prev,
      tests: { ...prev.tests, [itemId]: checked }
    }));
  };

  const handleVatChange = (itemId: string, correct: boolean) => {
    setResponses(prev => ({
      ...prev,
      vat: { ...prev.vat, [itemId]: correct }
    }));
  };

  const handleIqcodeChange = (itemId: string, value: number) => {
    setResponses(prev => ({
      ...prev,
      iqcode: { ...prev.iqcode, [itemId]: value }
    }));
  };

  const handleCdrChange = (domainId: string, score: number) => {
    setResponses(prev => ({
      ...prev,
      cdr: { ...prev.cdr, [domainId]: score }
    }));
  };

  // CDR Global Score Calculation using Washington University algorithm
  const calculateCdrGlobalScore = (cdrResponses: Record<string, number>): number => {
    const domains = ['memory', 'orientation', 'judgment', 'community', 'home', 'personalCare'];
    const scores = domains.map(d => cdrResponses[d]);
    
    // If no scores, return 0
    if (scores.every(s => s === undefined)) return 0;
    
    const memory = cdrResponses['memory'] ?? 0;
    const secondary = ['orientation', 'judgment', 'community', 'home', 'personalCare']
      .map(d => cdrResponses[d] ?? 0);
    
    // If memory is 0, CDR = 0 only if all secondary are 0 or 0.5
    if (memory === 0) {
      if (secondary.every(s => s === 0 || s === 0.5)) return 0;
      // If at least one secondary is ≥ 1, CDR = 0.5
      if (secondary.some(s => s >= 1)) return 0.5;
    }
    
    // If memory is 0.5, CDR is based on secondary scores
    if (memory === 0.5) {
      const atLeast1Count = secondary.filter(s => s >= 1).length;
      if (atLeast1Count >= 3) return 1;
      return 0.5;
    }
    
    // If memory is 1, 2, or 3
    if (memory >= 1) {
      // Count how many secondary are equal to, above, or below memory
      const above = secondary.filter(s => s > memory).length;
      const below = secondary.filter(s => s < memory).length;
      const equal = secondary.filter(s => s === memory).length;
      
      // If majority (3+) are on one side, CDR moves toward that
      if (above >= 3) return Math.min(memory + 0.5, 3);
      if (below >= 3) return Math.max(memory - 0.5, 0);
      
      // Otherwise CDR = Memory
      return memory;
    }
    
    return 0;
  };

  const calculateResults = (): DementiaResultsType => {
    const behav5Score = Object.values(responses.behav5).filter(Boolean).length;
    const behav5Positive = BEHAV5_ITEMS.filter(item => responses.behav5[item.id])
      .map(item => language === 'ml' ? item.titleMl : item.title);

    const vatScore = Object.values(responses.vat).filter(Boolean).length;
    const vatMaxScore = VAT_ITEMS.length;

    const historyFindings = HISTORY_ITEMS.filter(item => responses.history[item.id])
      .map(item => language === 'ml' ? item.labelMl : item.label);

    const clinicalExamFindings = {
      frontal: CLINICAL_EXAM_ITEMS.filter(item => item.category === 'frontal' && responses.clinicalExam[item.id])
        .map(item => language === 'ml' ? item.labelMl : item.label),
      temporal: CLINICAL_EXAM_ITEMS.filter(item => item.category === 'temporal' && responses.clinicalExam[item.id])
        .map(item => language === 'ml' ? item.labelMl : item.label),
      parietal: CLINICAL_EXAM_ITEMS.filter(item => item.category === 'parietal' && responses.clinicalExam[item.id])
        .map(item => language === 'ml' ? item.labelMl : item.label),
      occipital: CLINICAL_EXAM_ITEMS.filter(item => item.category === 'occipital' && responses.clinicalExam[item.id])
        .map(item => language === 'ml' ? item.labelMl : item.label),
      general: CLINICAL_EXAM_ITEMS.filter(item => item.category === 'general' && responses.clinicalExam[item.id])
        .map(item => language === 'ml' ? item.labelMl : item.label)
    };

    const testsOrdered = TEST_ITEMS.filter(item => responses.tests[item.id])
      .map(item => language === 'ml' ? item.labelMl : item.label);

    // Calculate IQCODE score (average of all responses)
    const iqcodeResponses = Object.values(responses.iqcode);
    const iqcodeScore = iqcodeResponses.length > 0 
      ? iqcodeResponses.reduce((sum, val) => sum + val, 0) / iqcodeResponses.length 
      : 0;
    
    let iqcodeInterpretation: string;
    let iqcodeInterpretationMl: string;
    if (iqcodeResponses.length === 0) {
      iqcodeInterpretation = 'Short IQCODE not completed';
      iqcodeInterpretationMl = 'ഷോർട്ട് IQCODE പൂർത്തിയാക്കിയിട്ടില്ല';
    } else if (iqcodeScore <= 3.0) {
      iqcodeInterpretation = 'No significant cognitive decline reported by informant';
      iqcodeInterpretationMl = 'വിവരദാതാവ് റിപ്പോർട്ട് ചെയ്ത കാര്യമായ വൈജ്ഞാനിക തകർച്ചയില്ല';
    } else if (iqcodeScore <= 3.5) {
      iqcodeInterpretation = 'Mild cognitive decline suggested by informant';
      iqcodeInterpretationMl = 'വിവരദാതാവ് സൂചിപ്പിച്ച നേരിയ വൈജ്ഞാനിക തകർച്ച';
    } else {
      iqcodeInterpretation = 'Significant cognitive decline reported by informant (score > 3.5 suggests dementia)';
      iqcodeInterpretationMl = 'വിവരദാതാവ് റിപ്പോർട്ട് ചെയ്ത കാര്യമായ വൈജ്ഞാനിക തകർച്ച (സ്കോർ > 3.5 ഡിമെൻഷ്യ സൂചിപ്പിക്കുന്നു)';
    }

    // Calculate CDR Global Score
    const cdrGlobalScore = calculateCdrGlobalScore(responses.cdr);
    const cdrDomainScores = { ...responses.cdr };
    
    let cdrInterpretation: string;
    let cdrInterpretationMl: string;
    const cdrInterp = CDR_GLOBAL_INTERPRETATIONS[cdrGlobalScore as keyof typeof CDR_GLOBAL_INTERPRETATIONS];
    if (cdrInterp) {
      cdrInterpretation = `${cdrInterp.label}: ${cdrInterp.description}`;
      cdrInterpretationMl = `${cdrInterp.labelMl}: ${cdrInterp.descriptionMl}`;
    } else if (Object.keys(responses.cdr).length === 0) {
      cdrInterpretation = 'CDR not completed';
      cdrInterpretationMl = 'CDR പൂർത്തിയാക്കിയിട്ടില്ല';
    } else {
      cdrInterpretation = `CDR Global Score: ${cdrGlobalScore}`;
      cdrInterpretationMl = `CDR ഗ്ലോബൽ സ്കോർ: ${cdrGlobalScore}`;
    }

    // Risk calculation
    let riskScore = 0;
    riskScore += behav5Score;
    if (responses.softSigns.mhd === 'positive') riskScore += 2;
    if (responses.softSigns.sts === 'positive') riskScore += 2;
    if (responses.softSigns.hts === 'positive') riskScore += 2;
    if (responses.softSigns.applause === 'positive') riskScore += 2;
    // Primitive reflexes indicate frontal lobe dysfunction
    if (responses.softSigns.glabellar === 'positive') riskScore += 1;
    if (responses.softSigns.palmomental === 'positive') riskScore += 1;
    if (responses.softSigns.snout === 'positive') riskScore += 1;
    // VAT score < 5 indicates memory impairment
    if (vatScore < 5) riskScore += 2;
    if (vatScore < 3) riskScore += 2;
    if (responses.history['family_history']) riskScore += 1;
    if (responses.history['hypertension']) riskScore += 1;
    if (responses.history['diabetes']) riskScore += 1;
    // Add CDR to risk calculation
    if (cdrGlobalScore >= 1) riskScore += 3;
    else if (cdrGlobalScore >= 0.5) riskScore += 1;

    let riskLevel: 'low' | 'moderate' | 'high';
    let interpretation: string;
    let interpretationMl: string;
    let recommendations: string[];
    let recommendationsMl: string[];

    if (riskScore <= 2) {
      riskLevel = 'low';
      interpretation = 'Low risk indicators. Cognitive symptoms may be related to other causes. Routine monitoring recommended.';
      interpretationMl = 'കുറഞ്ഞ അപകട സൂചകങ്ങൾ. വൈജ്ഞാനിക ലക്ഷണങ്ങൾ മറ്റ് കാരണങ്ങളുമായി ബന്ധപ്പെട്ടതാകാം. പതിവ് നിരീക്ഷണം ശുപാർശ ചെയ്യുന്നു.';
      recommendations = [
        'Continue routine health monitoring',
        'Encourage cognitive and physical activities',
        'Reassess if symptoms progress'
      ];
      recommendationsMl = [
        'പതിവ് ആരോഗ്യ നിരീക്ഷണം തുടരുക',
        'വൈജ്ഞാനികവും ശാരീരികവുമായ പ്രവർത്തനങ്ങൾ പ്രോത്സാഹിപ്പിക്കുക',
        'ലക്ഷണങ്ങൾ പുരോഗമിച്ചാൽ വീണ്ടും വിലയിരുത്തുക'
      ];
    } else if (riskScore <= 5) {
      riskLevel = 'moderate';
      interpretation = 'Moderate risk indicators present. Further evaluation recommended to rule out reversible causes and establish diagnosis.';
      interpretationMl = 'മിതമായ അപകട സൂചകങ്ങൾ ഉണ്ട്. പഴയപടിയാക്കാവുന്ന കാരണങ്ങൾ ഒഴിവാക്കാനും രോഗനിർണയം സ്ഥാപിക്കാനും കൂടുതൽ വിലയിരുത്തൽ ശുപാർശ ചെയ്യുന്നു.';
      recommendations = [
        'Complete routine laboratory workup',
        'Consider MRI brain imaging',
        'Formal cognitive assessment (MoCA/Mini-Cog)',
        'Review medications for cognitive effects',
        'Screen for depression'
      ];
      recommendationsMl = [
        'പതിവ് ലബോറട്ടറി പരിശോധനകൾ പൂർത്തിയാക്കുക',
        'എംആർഐ ബ്രെയിൻ ഇമേജിംഗ് പരിഗണിക്കുക',
        'ഔപചാരിക വൈജ്ഞാനിക വിലയിരുത്തൽ (MoCA/Mini-Cog)',
        'വൈജ്ഞാനിക പ്രഭാവങ്ങൾക്കായി മരുന്നുകൾ അവലോകനം ചെയ്യുക',
        'വിഷാദത്തിനായി സ്ക്രീൻ ചെയ്യുക'
      ];
    } else {
      riskLevel = 'high';
      interpretation = 'High risk indicators. Comprehensive evaluation strongly recommended. Consider referral to neurology or memory clinic.';
      interpretationMl = 'ഉയർന്ന അപകട സൂചകങ്ങൾ. സമഗ്രമായ വിലയിരുത്തൽ ശക്തമായി ശുപാർശ ചെയ്യുന്നു. ന്യൂറോളജി അല്ലെങ്കിൽ മെമ്മറി ക്ലിനിക്കിലേക്ക് റഫറൽ പരിഗണിക്കുക.';
      recommendations = [
        'Urgent comprehensive laboratory workup',
        'MRI brain with contrast recommended',
        'Formal neuropsychological evaluation',
        'Consider lumbar puncture if infection suspected',
        'Referral to neurology/memory specialist',
        'Assess for reversible causes (VITAMINS mnemonic)',
        'Caregiver support and education'
      ];
      recommendationsMl = [
        'അടിയന്തര സമഗ്ര ലബോറട്ടറി പരിശോധനകൾ',
        'കോൺട്രാസ്റ്റ് ഉള്ള എംആർഐ ബ്രെയിൻ ശുപാർശ ചെയ്യുന്നു',
        'ഔപചാരിക ന്യൂറോസൈക്കോളജിക്കൽ മൂല്യനിർണ്ണയം',
        'അണുബാധ സംശയിക്കുന്നുവെങ്കിൽ ലമ്പാർ പങ്ചർ പരിഗണിക്കുക',
        'ന്യൂറോളജി/മെമ്മറി സ്പെഷ്യലിസ്റ്റിലേക്ക് റഫറൽ',
        'പഴയപടിയാക്കാവുന്ന കാരണങ്ങൾ വിലയിരുത്തുക (VITAMINS mnemonic)',
        'പരിചാരക പിന്തുണയും വിദ്യാഭ്യാസവും'
      ];
    }

    return {
      behav5Score,
      behav5Positive,
      softSignsFindings: responses.softSigns,
      vatScore,
      vatMaxScore,
      clinicalExamFindings,
      historyFindings,
      testsOrdered,
      iqcodeScore: Math.round(iqcodeScore * 100) / 100,
      iqcodeInterpretation,
      iqcodeInterpretationMl,
      cdrGlobalScore,
      cdrDomainScores,
      cdrInterpretation,
      cdrInterpretationMl,
      riskLevel,
      interpretation,
      interpretationMl,
      recommendations,
      recommendationsMl
    };
  };

  const handleSubmit = () => {
    const calculatedResults = calculateResults();
    setResults(calculatedResults);
    setShowResults(true);
  };

  const handleReset = () => {
    setResponses({
      behav5: {},
      softSigns: { mhd: null, sts: null, hts: null, applause: null, glabellar: null, palmomental: null, snout: null },
      vat: {},
      clinicalExam: {},
      history: {},
      tests: {},
      iqcode: {},
      cdr: {}
    });
    setShowResults(false);
    setResults(null);
    setVatPhase('learning');
    setCurrentVatIndex(0);
  };

  if (showResults && results) {
    return (
      <DementiaResults
        results={results}
        onBack={() => setShowResults(false)}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 p-4 md:p-8">
      <LanguageToggle />
      <div className="max-w-5xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === 'ml' ? 'തിരികെ' : 'Back'}
          </Button>
        )}

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Brain className="h-8 w-8 text-violet-600" />
              <CardTitle className="text-2xl md:text-3xl font-bold text-violet-800">
                {language === 'ml' ? 'ഡിമെൻഷ്യ മൂല്യനിർണ്ണയം' : 'Dementia Evaluation'}
              </CardTitle>
            </div>
            <CardDescription className="text-base">
              {language === 'ml' 
                ? 'സമഗ്ര ഡിമെൻഷ്യ സ്ക്രീനിംഗ്: BEHAV5+, സോഫ്റ്റ് സൈൻസ്, VAT, ക്ലിനിക്കൽ പരിശോധന, ഹിസ്റ്ററി & ടെസ്റ്റുകൾ'
                : 'Comprehensive dementia screening: BEHAV5+, Soft Signs, VAT, Clinical Exam, History & Tests'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="behav5" className="w-full">
              <TabsList className="grid w-full grid-cols-8 mb-6">
                <TabsTrigger value="behav5" className="text-xs md:text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1 hidden md:inline" />
                  BEHAV5+
                </TabsTrigger>
                <TabsTrigger value="cdr" className="text-xs md:text-sm">
                  <Gauge className="h-4 w-4 mr-1 hidden md:inline" />
                  CDR
                </TabsTrigger>
                <TabsTrigger value="iqcode" className="text-xs md:text-sm">
                  <Users className="h-4 w-4 mr-1 hidden md:inline" />
                  IQCODE
                </TabsTrigger>
                <TabsTrigger value="softsigns" className="text-xs md:text-sm">
                  <Stethoscope className="h-4 w-4 mr-1 hidden md:inline" />
                  {language === 'ml' ? 'സോഫ്റ്റ്' : 'Soft Signs'}
                </TabsTrigger>
                <TabsTrigger value="vat" className="text-xs md:text-sm">
                  <Eye className="h-4 w-4 mr-1 hidden md:inline" />
                  VAT
                </TabsTrigger>
                <TabsTrigger value="clinical" className="text-xs md:text-sm">
                  <Activity className="h-4 w-4 mr-1 hidden md:inline" />
                  {language === 'ml' ? 'പരിശോധന' : 'Clinical'}
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs md:text-sm">
                  <ClipboardList className="h-4 w-4 mr-1 hidden md:inline" />
                  {language === 'ml' ? 'ഹിസ്റ്ററി' : 'History'}
                </TabsTrigger>
                <TabsTrigger value="tests" className="text-xs md:text-sm">
                  <FlaskConical className="h-4 w-4 mr-1 hidden md:inline" />
                  {language === 'ml' ? 'ടെസ്റ്റുകൾ' : 'Tests'}
                </TabsTrigger>
              </TabsList>

              {/* BEHAV5+ Tab */}
              <TabsContent value="behav5" className="space-y-4">
                <div className="bg-violet-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-violet-800 mb-2">
                    {language === 'ml' ? 'BEHAV5+ ബിഹേവിയറൽ അസെസ്മെന്റ്' : 'BEHAV5+ Behavioral Assessment'}
                  </h3>
                  <p className="text-sm text-violet-600">
                    {language === 'ml' 
                      ? 'കഴിഞ്ഞ ഒരു മാസത്തിൽ നിരീക്ഷിച്ച പെരുമാറ്റങ്ങൾ പരിശോധിക്കുക'
                      : 'Check behaviors observed in the past month'}
                  </p>
                </div>
                <div className="space-y-3">
                  {BEHAV5_ITEMS.map((item) => (
                    <Card key={item.id} className="border border-violet-100">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id={item.id}
                            checked={responses.behav5[item.id] || false}
                            onCheckedChange={(checked) => handleBehav5Change(item.id, checked as boolean)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label htmlFor={item.id} className="font-medium text-violet-800 cursor-pointer">
                              {language === 'ml' ? item.titleMl : item.title}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {language === 'ml' ? item.descriptionMl : item.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* CDR Tab */}
              <TabsContent value="cdr" className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-indigo-800 mb-2">
                    {language === 'ml' ? 'ക്ലിനിക്കൽ ഡിമെൻഷ്യ റേറ്റിംഗ് (CDR)' : 'Clinical Dementia Rating (CDR)'}
                  </h3>
                  <p className="text-sm text-indigo-600">
                    {language === 'ml' 
                      ? 'വൈജ്ഞാനിക നഷ്ടം മൂലമുള്ള മുൻ സാധാരണ നിലയിൽ നിന്നുള്ള കുറവ് മാത്രം സ്കോർ ചെയ്യുക.'
                      : 'Score only as decline from previous usual level due to cognitive loss, not impairment due to other factors.'}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-indigo-100">
                        <th className="border p-2 text-left font-semibold">{language === 'ml' ? 'ഡൊമെയ്ൻ' : 'Domain'}</th>
                        <th className="border p-2 text-center w-16">0</th>
                        <th className="border p-2 text-center w-16">0.5</th>
                        <th className="border p-2 text-center w-16">1</th>
                        <th className="border p-2 text-center w-16">2</th>
                        <th className="border p-2 text-center w-16">3</th>
                      </tr>
                      <tr className="bg-indigo-50 text-xs">
                        <th className="border p-1"></th>
                        <th className="border p-1">{language === 'ml' ? 'ഒന്നുമില്ല' : 'None'}</th>
                        <th className="border p-1">{language === 'ml' ? 'സംശയാസ്പദം' : 'Questionable'}</th>
                        <th className="border p-1">{language === 'ml' ? 'നേരിയത്' : 'Mild'}</th>
                        <th className="border p-1">{language === 'ml' ? 'മിതമായത്' : 'Moderate'}</th>
                        <th className="border p-1">{language === 'ml' ? 'കഠിനം' : 'Severe'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CDR_DOMAINS.map((domain) => (
                        <tr key={domain.id} className="hover:bg-indigo-50/50">
                          <td className="border p-2">
                            <div className="font-medium text-indigo-800">
                              {language === 'ml' ? domain.nameMl : domain.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {language === 'ml' ? domain.descriptionMl : domain.description}
                            </div>
                          </td>
                          {domain.ratings.map((rating) => (
                            <td key={rating.score} className="border p-1 text-center">
                              <button
                                onClick={() => handleCdrChange(domain.id, rating.score)}
                                className={`w-full h-full min-h-[3rem] p-1 rounded text-xs transition-colors ${
                                  responses.cdr[domain.id] === rating.score
                                    ? 'bg-indigo-600 text-white'
                                    : 'hover:bg-indigo-100'
                                }`}
                                title={language === 'ml' ? rating.descriptionMl : rating.description}
                              >
                                {rating.score}
                              </button>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-4 bg-indigo-100 rounded-lg text-center">
                  <p className="text-sm text-indigo-700">
                    {language === 'ml' ? 'CDR ഗ്ലോബൽ സ്കോർ' : 'CDR Global Score'}
                  </p>
                  <p className="text-3xl font-bold text-indigo-800">
                    {calculateCdrGlobalScore(responses.cdr)}
                  </p>
                </div>
              </TabsContent>

              {/* Short IQCODE Tab */}
              <TabsContent value="iqcode" className="space-y-4">
                <div className="bg-teal-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-teal-800 mb-2">
                    {language === 'ml' ? 'ഷോർട്ട് IQCODE (വിവരദാതാവിന്റെ ചോദ്യാവലി)' : 'Short IQCODE (Informant Questionnaire)'}
                  </h3>
                  <p className="text-sm text-teal-600 mb-3">
                    {language === 'ml' 
                      ? '10 വർഷം മുമ്പുമായി താരതമ്യം ചെയ്യുക. ഓരോ കാര്യത്തിലും ഈ വ്യക്തി എങ്ങനെയാണെന്ന് വിലയിരുത്തുക.'
                      : 'Compare with 10 years ago. Rate how this person is at each activity.'}
                  </p>
                  <p className="text-xs text-teal-500 italic">
                    {language === 'ml' 
                      ? 'ശ്രദ്ധിക്കുക: 10 വർഷം മുമ്പ് ഈ വ്യക്തി എപ്പോഴും കാര്യങ്ങൾ മറന്നിരുന്നെങ്കിൽ, ഇപ്പോഴും അങ്ങനെയാണെങ്കിൽ, "കാര്യമായ മാറ്റമില്ല" എന്ന് തിരഞ്ഞെടുക്കുക.'
                      : 'Note: If 10 years ago this person always forgot things, and still does, select "Not much change".'}
                  </p>
                </div>
                <div className="space-y-4">
                  {IQCODE_ITEMS.map((item, index) => (
                    <Card key={item.id} className="border border-teal-100">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-teal-700 text-sm">{index + 1}.</span>
                            <p className="font-medium text-teal-800 text-sm">
                              {language === 'ml' ? item.questionMl : item.question}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {IQCODE_RESPONSE_OPTIONS.map((option) => (
                              <Button
                                key={option.value}
                                variant={responses.iqcode[item.id] === option.value ? 'default' : 'outline'}
                                size="sm"
                                className={`text-xs ${
                                  responses.iqcode[item.id] === option.value 
                                    ? option.value <= 2 
                                      ? 'bg-green-600 hover:bg-green-700' 
                                      : option.value === 3 
                                        ? 'bg-gray-600 hover:bg-gray-700' 
                                        : 'bg-red-600 hover:bg-red-700'
                                    : ''
                                }`}
                                onClick={() => handleIqcodeChange(item.id, option.value)}
                              >
                                {language === 'ml' ? option.labelMl : option.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-teal-50 rounded-lg">
                  <p className="text-sm text-teal-700">
                    <strong>{language === 'ml' ? 'സ്കോറിംഗ്:' : 'Scoring:'}</strong>{' '}
                    {language === 'ml' 
                      ? 'ശരാശരി സ്കോർ > 3.5 ഡിമെൻഷ്യ സൂചിപ്പിക്കുന്നു. ഓർമ്മക്കുറവ് പോലെയുള്ള ബുദ്ധിമുട്ടുകൾ എത്ര മോശമായി എന്ന് കൂടുതൽ സ്കോറുകൾ സൂചിപ്പിക്കുന്നു.'
                      : 'Average score > 3.5 suggests dementia. Higher scores indicate worse decline in cognitive function.'}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="softsigns" className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-indigo-800 mb-2">
                    {language === 'ml' ? 'ന്യൂറോളജിക്കൽ സോഫ്റ്റ് സൈൻസ്' : 'Neurological Soft Signs'}
                  </h3>
                  <p className="text-sm text-indigo-600">
                    {language === 'ml' 
                      ? 'ഈ ക്ലിനിക്കൽ കണ്ടെത്തലുകൾ ന്യൂറോകോഗ്നിറ്റീവ് ഡിസോർഡർ സൂചിപ്പിക്കാം'
                      : 'These clinical findings may indicate underlying neurocognitive disorder'}
                  </p>
                </div>
                <div className="space-y-6">
                  {SOFT_SIGN_ITEMS.map((item) => (
                    <Card key={item.id} className="border-2 border-indigo-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-indigo-800">
                          {language === 'ml' ? item.titleMl : item.title}
                        </CardTitle>
                        <CardDescription>
                          {language === 'ml' ? item.descriptionMl : item.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            {language === 'ml' ? 'നിർദ്ദേശങ്ങൾ:' : 'Instructions:'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {language === 'ml' ? item.instructionsMl : item.instructions}
                          </p>
                        </div>
                        <RadioGroup
                          value={responses.softSigns[item.id as 'mhd' | 'sts' | 'hts' | 'applause' | 'glabellar' | 'palmomental' | 'snout'] || ''}
                          onValueChange={(value) => handleSoftSignChange(item.id as 'mhd' | 'sts' | 'hts' | 'applause' | 'glabellar' | 'palmomental' | 'snout', value as 'positive' | 'negative')}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="positive" id={`${item.id}-positive`} />
                            <Label htmlFor={`${item.id}-positive`} className="text-red-600 font-medium cursor-pointer">
                              {language === 'ml' ? 'പോസിറ്റീവ്' : 'Positive'}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="negative" id={`${item.id}-negative`} />
                            <Label htmlFor={`${item.id}-negative`} className="text-green-600 font-medium cursor-pointer">
                              {language === 'ml' ? 'നെഗറ്റീവ്' : 'Negative'}
                            </Label>
                          </div>
                        </RadioGroup>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* VAT Tab */}
              <TabsContent value="vat" className="space-y-4">
                <div className="bg-cyan-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-cyan-800 mb-2">
                    {language === 'ml' ? 'വിഷ്വൽ അസോസിയേഷൻ ടെസ്റ്റ് (VAT)' : 'Visual Association Test (VAT)'}
                  </h3>
                  <p className="text-sm text-cyan-600">
                    {vatPhase === 'learning' 
                      ? (language === 'ml' 
                        ? 'ആദ്യം, ഓരോ ചിത്രത്തിലെയും രണ്ട് വസ്തുക്കളെയും പേരിടുക. എല്ലാ ചിത്രങ്ങളും കാണിച്ചതിന് ശേഷം, ഓർമ്മ പരിശോധിക്കും.'
                        : 'First, name both objects in each image. After viewing all images, recall will be tested.')
                      : (language === 'ml' 
                        ? 'ക്യൂ ചിത്രം നോക്കി, അസോസിയേഷൻ ചിത്രത്തിൽ ഉണ്ടായിരുന്ന മറ്റ് വസ്തു ഓർമ്മിക്കാൻ ശ്രമിക്കുക.'
                        : 'Look at the cue image and try to recall the other object from the association image.')}
                  </p>
                </div>

                {vatPhase === 'learning' ? (
                  <div className="space-y-6">
                    <Card className="border-2 border-cyan-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-cyan-800">
                          {language === 'ml' ? `ചിത്രം ${currentVatIndex + 1} / ${VAT_ITEMS.length}` : `Image ${currentVatIndex + 1} of ${VAT_ITEMS.length}`}
                        </CardTitle>
                        <CardDescription>
                          {language === 'ml' 
                            ? 'ഈ രണ്ട് വസ്തുക്കളെയും പേരിടുക'
                            : 'Name both objects in this image'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-center">
                          <img 
                            src={VAT_ITEMS[currentVatIndex].associationImage} 
                            alt="Association" 
                            className="max-h-64 rounded-lg shadow-md"
                          />
                        </div>
                        <p className="text-center text-cyan-700 font-medium">
                          {language === 'ml' 
                            ? `${VAT_ITEMS[currentVatIndex].cueObjectMl} + ${VAT_ITEMS[currentVatIndex].targetObjectMl}`
                            : `${VAT_ITEMS[currentVatIndex].cueObject} + ${VAT_ITEMS[currentVatIndex].targetObject}`}
                        </p>
                        <div className="flex justify-center gap-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setCurrentVatIndex(Math.max(0, currentVatIndex - 1))}
                            disabled={currentVatIndex === 0}
                          >
                            {language === 'ml' ? 'മുമ്പത്തേത്' : 'Previous'}
                          </Button>
                          {currentVatIndex < VAT_ITEMS.length - 1 ? (
                            <Button onClick={() => setCurrentVatIndex(currentVatIndex + 1)}>
                              {language === 'ml' ? 'അടുത്തത്' : 'Next'}
                            </Button>
                          ) : (
                            <Button onClick={() => { setVatPhase('recall'); setCurrentVatIndex(0); }}>
                              {language === 'ml' ? 'റീകാൾ ടെസ്റ്റ് ആരംഭിക്കുക' : 'Start Recall Test'}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {VAT_ITEMS.map((item, index) => (
                      <Card key={item.id} className="border border-cyan-100">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row items-center gap-4">
                            <img 
                              src={item.cueImage} 
                              alt="Cue" 
                              className="w-24 h-24 object-contain rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-cyan-800 mb-2">
                                {language === 'ml' ? item.questionMl : item.question}
                              </p>
                              <p className="text-sm text-muted-foreground mb-2">
                                {language === 'ml' 
                                  ? `ശരിയായ ഉത്തരം: ${item.targetObjectMl}`
                                  : `Correct answer: ${item.targetObject}`}
                              </p>
                              <div className="flex gap-4">
                                <Button 
                                  variant={responses.vat[item.id] === true ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleVatChange(item.id, true)}
                                  className={responses.vat[item.id] === true ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                  {language === 'ml' ? 'ശരി' : 'Correct'}
                                </Button>
                                <Button 
                                  variant={responses.vat[item.id] === false ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleVatChange(item.id, false)}
                                  className={responses.vat[item.id] === false ? "bg-red-600 hover:bg-red-700" : ""}
                                >
                                  {language === 'ml' ? 'തെറ്റ്' : 'Incorrect'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <p className="text-center text-cyan-700 font-medium">
                      {language === 'ml' 
                        ? `VAT സ്കോർ: ${Object.values(responses.vat).filter(Boolean).length} / ${VAT_ITEMS.length}`
                        : `VAT Score: ${Object.values(responses.vat).filter(Boolean).length} / ${VAT_ITEMS.length}`}
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Clinical Exam Tab */}
              <TabsContent value="clinical" className="space-y-4">
                <div className="bg-rose-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-rose-800 mb-2">
                    {language === 'ml' ? 'ക്ലിനിക്കൽ പരിശോധന - ലോബാർ ഡിസ്ഫങ്ഷൻ' : 'Clinical Examination - Lobar Dysfunction'}
                  </h3>
                  <p className="text-sm text-rose-600">
                    {language === 'ml' 
                      ? 'നിരീക്ഷിച്ച ക്ലിനിക്കൽ കണ്ടെത്തലുകൾ പരിശോധിക്കുക'
                      : 'Check observed clinical findings'}
                  </p>
                </div>
                {(['frontal', 'temporal', 'parietal', 'occipital', 'general'] as const).map((category) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-semibold text-gray-700">
                      {language === 'ml' 
                        ? category === 'frontal' ? 'ഫ്രണ്ടൽ ലോബ് ലക്ഷണങ്ങൾ' 
                        : category === 'temporal' ? 'ടെമ്പോറൽ ലോബ് ലക്ഷണങ്ങൾ' 
                        : category === 'parietal' ? 'പറൈറ്റൽ ലോബ് ലക്ഷണങ്ങൾ' 
                        : category === 'occipital' ? 'ഓക്സിപിറ്റൽ ലോബ് ലക്ഷണങ്ങൾ' 
                        : 'പൊതു ലക്ഷണങ്ങൾ'
                        : category === 'frontal' ? 'Frontal Lobe Features' 
                        : category === 'temporal' ? 'Temporal Lobe Features' 
                        : category === 'parietal' ? 'Parietal Lobe Features' 
                        : category === 'occipital' ? 'Occipital Lobe Features' 
                        : 'General Features'}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {CLINICAL_EXAM_ITEMS.filter(item => item.category === category).map((item) => (
                        <div key={item.id} className="flex items-center space-x-2 p-2 rounded hover:bg-rose-50">
                          <Checkbox
                            id={`clinical-${item.id}`}
                            checked={responses.clinicalExam[item.id] || false}
                            onCheckedChange={(checked) => handleClinicalExamChange(item.id, checked as boolean)}
                          />
                          <Label htmlFor={`clinical-${item.id}`} className="cursor-pointer text-sm">
                            {language === 'ml' ? item.labelMl : item.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-amber-800 mb-2">
                    {language === 'ml' ? 'മെഡിക്കൽ ഹിസ്റ്ററി & എറ്റിയോളജിക്കൽ ഹിസ്റ്ററി' : 'Medical & Aetiological History'}
                  </h3>
                  <p className="text-sm text-amber-600">
                    {language === 'ml' 
                      ? 'ബാധകമായ എല്ലാ ഇനങ്ങളും പരിശോധിക്കുക'
                      : 'Check all applicable items'}
                  </p>
                </div>
                {['medical', 'lifestyle', 'family', 'aetiological'].map((category) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-semibold text-gray-700 capitalize">
                      {language === 'ml' 
                        ? category === 'medical' ? 'മെഡിക്കൽ ഹിസ്റ്ററി' : category === 'lifestyle' ? 'ജീവിതശൈലി' : category === 'family' ? 'കുടുംബ ചരിത്രം' : 'എറ്റിയോളജിക്കൽ ഹിസ്റ്ററി'
                        : category === 'medical' ? 'Medical History' : category === 'lifestyle' ? 'Lifestyle' : category === 'family' ? 'Family History' : 'Aetiological History'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {HISTORY_ITEMS.filter(item => item.category === category).map((item) => (
                        <div key={item.id} className="flex items-center space-x-2 p-2 rounded hover:bg-amber-50">
                          <Checkbox
                            id={`history-${item.id}`}
                            checked={responses.history[item.id] || false}
                            onCheckedChange={(checked) => handleHistoryChange(item.id, checked as boolean)}
                          />
                          <Label htmlFor={`history-${item.id}`} className="cursor-pointer">
                            {language === 'ml' ? item.labelMl : item.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Tests Tab */}
              <TabsContent value="tests" className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-emerald-800 mb-2">
                    {language === 'ml' ? 'ശുപാർശ ചെയ്ത ടെസ്റ്റുകൾ' : 'Recommended Tests'}
                  </h3>
                  <p className="text-sm text-emerald-600">
                    {language === 'ml' 
                      ? 'ഓർഡർ ചെയ്യേണ്ട ടെസ്റ്റുകൾ തിരഞ്ഞെടുക്കുക'
                      : 'Select tests to order'}
                  </p>
                </div>
                {['routine', 'special', 'imaging'].map((category) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-semibold text-gray-700">
                      {language === 'ml' 
                        ? category === 'routine' ? 'പതിവ് ടെസ്റ്റുകൾ' : category === 'special' ? 'പ്രത്യേക ടെസ്റ്റുകൾ' : 'ഇമേജിംഗ് & മൂല്യനിർണ്ണയം'
                        : category === 'routine' ? 'Routine Tests' : category === 'special' ? 'Special Tests' : 'Imaging & Evaluation'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {TEST_ITEMS.filter(item => item.category === category).map((item) => (
                        <div key={item.id} className="flex items-center space-x-2 p-2 rounded hover:bg-emerald-50">
                          <Checkbox
                            id={`test-${item.id}`}
                            checked={responses.tests[item.id] || false}
                            onCheckedChange={(checked) => handleTestChange(item.id, checked as boolean)}
                          />
                          <Label htmlFor={`test-${item.id}`} className="cursor-pointer">
                            {language === 'ml' ? item.labelMl : item.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Neurosyphilis Workup Flowchart */}
                <Collapsible className="mt-6">
                  <Card className="border-2 border-amber-200 bg-amber-50/50">
                    <CollapsibleTrigger className="w-full">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg text-amber-800">
                          {language === 'ml' ? 'ന്യൂറോസിഫിലിസ് വർക്കപ്പ് ഫ്ലോചാർട്ട്' : 'Neurosyphilis Workup Flowchart'}
                        </CardTitle>
                        <ChevronDown className="h-5 w-5 text-amber-700" />
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent>
                        <img 
                          src={neurosyphilisFlowchart} 
                          alt="Neurosyphilis workup flowchart" 
                          className="w-full max-w-2xl mx-auto rounded-lg border border-amber-200"
                        />
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* VITAMINS Mnemonic */}
                <Card className="mt-6 border-2 border-emerald-200 bg-emerald-50/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-emerald-800">
                      {language === 'ml' ? 'VITAMINS - വേഗത്തിൽ പുരോഗമിക്കുന്ന ഡിമെൻഷ്യകൾക്കുള്ള മെമ്മോണിക്' : 'VITAMINS - Mnemonic for Rapidly Progressive Dementias'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      {Object.entries(VITAMINS_MNEMONIC).map(([key, value]) => (
                        <div key={key} className="bg-white p-2 rounded border">
                          <span className="font-bold text-emerald-700">{key.replace('2', '')}</span>
                          <span className="text-gray-600"> - {language === 'ml' ? value.ml : value.en}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
              <Button 
                onClick={handleSubmit} 
                className="flex-1 bg-violet-600 hover:bg-violet-700"
                size="lg"
              >
                {language === 'ml' ? 'ഫലങ്ങൾ കാണുക' : 'View Results'}
              </Button>
              <Button 
                onClick={handleReset} 
                variant="outline" 
                size="lg"
              >
                {language === 'ml' ? 'റീസെറ്റ്' : 'Reset'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

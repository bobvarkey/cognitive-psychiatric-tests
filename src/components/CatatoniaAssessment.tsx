import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { CatatoniaResponse, CatatoniaResults as CatatoniaResultsType } from '@/types/catatonia';
import { CATATONIA_ITEMS } from '@/data/catatoniaScale';
import { CatatoniaItemCard } from './CatatoniaItemCard';
import { CatatoniaResults } from './CatatoniaResults';
import { Activity, ClipboardCheck, RotateCcw, Home, AlertCircle } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { PatientInfoForm } from '@/components/PatientInfoForm';

interface CatatoniaAssessmentProps {
  onBack?: () => void;
}

export const CatatoniaAssessment = ({ onBack }: CatatoniaAssessmentProps) => {
  const { language, t } = useLanguage();
  const [responses, setResponses] = useState<CatatoniaResponse>({ scores: {} });
  const [results, setResults] = useState<CatatoniaResultsType | null>(null);

  const screeningItems = CATATONIA_ITEMS.filter(item => item.isScreening);
  const fullScaleItems = CATATONIA_ITEMS.filter(item => !item.isScreening);

  const handleScoreChange = (itemId: string, score: number) => {
    setResponses(prev => ({
      scores: { ...prev.scores, [itemId]: score }
    }));
  };

  const calculateResults = (): CatatoniaResultsType => {
    // Calculate screening score (items 1-14)
    let screeningScore = 0;
    const positiveItems: string[] = [];
    
    screeningItems.forEach(item => {
      const score = responses.scores[item.id] || 0;
      if (score > 0) {
        screeningScore++;
        positiveItems.push(language === 'ml' ? item.nameMl : item.name);
      }
    });

    // Calculate total score (all 23 items, sum of severity ratings)
    let totalScore = 0;
    CATATONIA_ITEMS.forEach(item => {
      totalScore += responses.scores[item.id] || 0;
    });

    // Add full scale positive items
    fullScaleItems.forEach(item => {
      const score = responses.scores[item.id] || 0;
      if (score > 0 && !positiveItems.includes(language === 'ml' ? item.nameMl : item.name)) {
        positiveItems.push(language === 'ml' ? item.nameMl : item.name);
      }
    });

    const screeningPositive = screeningScore >= 2;

    // Determine severity based on total score
    let severity: 'none' | 'mild' | 'moderate' | 'severe';
    if (totalScore === 0) {
      severity = 'none';
    } else if (totalScore <= 10) {
      severity = 'mild';
    } else if (totalScore <= 20) {
      severity = 'moderate';
    } else {
      severity = 'severe';
    }

    // Generate interpretation
    let interpretation: string;
    let interpretationMl: string;

    if (!screeningPositive) {
      interpretation = `Screening score of ${screeningScore}/14 is below the threshold (≥2) for catatonia. However, if clinical suspicion remains high, consider repeat assessment or trial of lorazepam.`;
      interpretationMl = `${screeningScore}/14 സ്ക്രീനിംഗ് സ്കോർ കാറ്ററ്റോണിയയുടെ പരിധിക്ക് (≥2) താഴെയാണ്. എന്നിരുന്നാലും, ക്ലിനിക്കൽ സംശയം ഉയർന്നതായി തുടർന്നാൽ, ആവർത്തിച്ചുള്ള വിലയിരുത്തൽ അല്ലെങ്കിൽ ലൊറാസെപാം ട്രയൽ പരിഗണിക്കുക.`;
    } else if (severity === 'mild') {
      interpretation = `Screening positive for catatonia (${screeningScore}/14 items). Total severity score of ${totalScore}/69 indicates mild catatonia. Consider benzodiazepine trial (lorazepam) and investigate underlying etiology.`;
      interpretationMl = `കാറ്ററ്റോണിയയ്ക്ക് സ്ക്രീനിംഗ് പോസിറ്റീവ് (${screeningScore}/14 ഇനങ്ങൾ). ${totalScore}/69 മൊത്തം തീവ്രത സ്കോർ നേരിയ കാറ്ററ്റോണിയ സൂചിപ്പിക്കുന്നു. ബെൻസോഡയസെപൈൻ ട്രയൽ (ലൊറാസെപാം) പരിഗണിക്കുക, അടിസ്ഥാന കാരണം അന്വേഷിക്കുക.`;
    } else if (severity === 'moderate') {
      interpretation = `Screening positive for catatonia (${screeningScore}/14 items). Total severity score of ${totalScore}/69 indicates moderate catatonia. Urgent treatment with benzodiazepines recommended. Monitor for malignant catatonia signs.`;
      interpretationMl = `കാറ്ററ്റോണിയയ്ക്ക് സ്ക്രീനിംഗ് പോസിറ്റീവ് (${screeningScore}/14 ഇനങ്ങൾ). ${totalScore}/69 മൊത്തം തീവ്രത സ്കോർ മിതമായ കാറ്ററ്റോണിയ സൂചിപ്പിക്കുന്നു. ബെൻസോഡയസെപൈനുകൾ ഉപയോഗിച്ച് അടിയന്തര ചികിത്സ ശുപാർശ ചെയ്യുന്നു. മാലിഗ്നന്റ് കാറ്ററ്റോണിയ ലക്ഷണങ്ങൾ നിരീക്ഷിക്കുക.`;
    } else {
      interpretation = `Screening positive for catatonia (${screeningScore}/14 items). Total severity score of ${totalScore}/69 indicates severe catatonia. This is a medical emergency. Immediate intervention required. Consider ECT if benzodiazepines ineffective. Rule out malignant catatonia/NMS.`;
      interpretationMl = `കാറ്ററ്റോണിയയ്ക്ക് സ്ക്രീനിംഗ് പോസിറ്റീവ് (${screeningScore}/14 ഇനങ്ങൾ). ${totalScore}/69 മൊത്തം തീവ്രത സ്കോർ കടുത്ത കാറ്ററ്റോണിയ സൂചിപ്പിക്കുന്നു. ഇത് ഒരു മെഡിക്കൽ അടിയന്തരാവസ്ഥയാണ്. ഉടനടി ഇടപെടൽ ആവശ്യമാണ്. ബെൻസോഡയസെപൈനുകൾ ഫലപ്രദമല്ലെങ്കിൽ ECT പരിഗണിക്കുക. മാലിഗ്നന്റ് കാറ്ററ്റോണിയ/NMS ഒഴിവാക്കുക.`;
    }

    // Generate recommendations
    const recommendations: string[] = [];
    const recommendationsMl: string[] = [];

    if (screeningPositive) {
      recommendations.push('Confirm diagnosis with lorazepam challenge test (1-2mg IV/IM)');
      recommendationsMl.push('ലൊറാസെപാം ചാലഞ്ച് ടെസ്റ്റ് (1-2mg IV/IM) ഉപയോഗിച്ച് രോഗനിർണ്ണയം സ്ഥിരീകരിക്കുക');
      
      recommendations.push('Investigate underlying etiology (medical, psychiatric, substance-related)');
      recommendationsMl.push('അടിസ്ഥാന കാരണം അന്വേഷിക്കുക (മെഡിക്കൽ, സൈക്യാട്രിക്, വസ്തു-ബന്ധപ്പെട്ടത്)');
      
      recommendations.push('Order baseline labs: CBC, CMP, CK, LFTs, TFTs, ammonia, UA, toxicology');
      recommendationsMl.push('ബേസ്‌ലൈൻ ലാബുകൾ ഓർഡർ ചെയ്യുക: CBC, CMP, CK, LFTs, TFTs, അമോണിയ, UA, ടോക്സിക്കോളജി');
    }

    if (severity === 'moderate' || severity === 'severe') {
      recommendations.push('Monitor vital signs closely for autonomic instability');
      recommendationsMl.push('ഓട്ടോണോമിക് അസ്ഥിരതയ്ക്കായി വൈറ്റൽ സൈനുകൾ അടുത്ത് നിരീക്ഷിക്കുക');
      
      recommendations.push('Consider ICU level care if autonomic abnormalities present');
      recommendationsMl.push('ഓട്ടോണോമിക് അസാധാരണതകൾ ഉണ്ടെങ്കിൽ ICU തല പരിചരണം പരിഗണിക്കുക');
    }

    if (severity === 'severe') {
      recommendations.push('ECT consultation if no response to benzodiazepines within 48-72 hours');
      recommendationsMl.push('48-72 മണിക്കൂറിനുള്ളിൽ ബെൻസോഡയസെപൈനുകളോട് പ്രതികരണമില്ലെങ്കിൽ ECT കൺസൾട്ടേഷൻ');
      
      recommendations.push('Discontinue antipsychotics if malignant catatonia/NMS suspected');
      recommendationsMl.push('മാലിഗ്നന്റ് കാറ്ററ്റോണിയ/NMS സംശയിക്കുന്നുവെങ്കിൽ ആന്റിസൈക്കോട്ടിക്കുകൾ നിർത്തുക');
    }

    if (!screeningPositive) {
      recommendations.push('Clinical correlation required - consider repeat assessment if symptoms persist');
      recommendationsMl.push('ക്ലിനിക്കൽ കോറിലേഷൻ ആവശ്യമാണ് - ലക്ഷണങ്ങൾ തുടർന്നാൽ ആവർത്തിച്ചുള്ള വിലയിരുത്തൽ പരിഗണിക്കുക');
    }

    return {
      screeningScore,
      totalScore,
      positiveItems,
      screeningPositive,
      severity,
      interpretation,
      interpretationMl,
      recommendations,
      recommendationsMl
    };
  };

  const handleSubmit = () => {
    const calculatedResults = calculateResults();
    setResults(calculatedResults);
  };

  const handleReset = () => {
    setResponses({ scores: {} });
    setResults(null);
  };

  const getCompletionStatus = () => {
    const screeningAnswered = screeningItems.filter(item => responses.scores[item.id] !== undefined).length;
    const fullAnswered = fullScaleItems.filter(item => responses.scores[item.id] !== undefined).length;
    return { screeningAnswered, fullAnswered };
  };

  const { screeningAnswered, fullAnswered } = getCompletionStatus();

  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 p-4">
        <LanguageToggle />
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-cyan-600" />
              <h1 className="text-2xl font-bold text-slate-800">
                {language === 'ml' ? 'BFCRS ഫലങ്ങൾ' : 'BFCRS Results'}
              </h1>
            </div>
            <div className="flex gap-2">
              {onBack && (
                <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  {t('backToMenu')}
                </Button>
              )}
              <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                {language === 'ml' ? 'പുനഃക്രമീകരിക്കുക' : 'Reset'}
              </Button>
            </div>
          </div>
          <CatatoniaResults results={results} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 p-4">
      <LanguageToggle />
      <div className="max-w-4xl mx-auto">
        <PatientInfoForm />
        <Card className="shadow-xl border-0 mb-6">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8" />
                <div>
                  <CardTitle className="text-2xl">
                    {language === 'ml' ? 'ബുഷ് ഫ്രാൻസിസ് കാറ്ററ്റോണിയ റേറ്റിംഗ് സ്കെയിൽ' : 'Bush Francis Catatonia Rating Scale'}
                  </CardTitle>
                  <p className="text-cyan-100 text-sm mt-1">BFCRS</p>
                </div>
              </div>
              {onBack && (
                <Button 
                  variant="secondary" 
                  onClick={onBack}
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <Home className="h-4 w-4 mr-2" />
                  {t('backToMenu')}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200 mb-4">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                {language === 'ml' 
                  ? 'സ്ക്രീനിംഗ് ഇനങ്ങളിൽ (1-14) 2 അല്ലെങ്കിൽ അതിലധികം പോസിറ്റീവ് ആണെങ്കിൽ കാറ്ററ്റോണിയ സൂചിപ്പിക്കുന്നു. തീവ്രതയ്ക്കായി എല്ലാ 23 ഇനങ്ങളും റേറ്റ് ചെയ്യുക.'
                  : 'A positive screen for catatonia is indicated by ≥2 of the first 14 items. Rate all 23 items for severity scoring.'}
              </p>
            </div>
            
            <Tabs defaultValue="screening" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="screening" className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  {language === 'ml' ? 'സ്ക്രീനിംഗ്' : 'Screening'} ({screeningAnswered}/14)
                </TabsTrigger>
                <TabsTrigger value="fullscale" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  {language === 'ml' ? 'അധിക ഇനങ്ങൾ' : 'Additional Items'} ({fullAnswered}/9)
                </TabsTrigger>
              </TabsList>

              <TabsContent value="screening">
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-4 pr-4">
                    {screeningItems.map(item => (
                      <CatatoniaItemCard
                        key={item.id}
                        item={item}
                        selectedScore={responses.scores[item.id]}
                        onScoreChange={handleScoreChange}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="fullscale">
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-4 pr-4">
                    {fullScaleItems.map(item => (
                      <CatatoniaItemCard
                        key={item.id}
                        item={item}
                        selectedScore={responses.scores[item.id]}
                        onScoreChange={handleScoreChange}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="text-sm text-slate-600">
                {language === 'ml' 
                  ? `${screeningAnswered + fullAnswered}/23 ഇനങ്ങൾ പൂർത്തിയാക്കി`
                  : `${screeningAnswered + fullAnswered}/23 items completed`}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {language === 'ml' ? 'പുനഃക്രമീകരിക്കുക' : 'Reset'}
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
                >
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  {language === 'ml' ? 'ഫലങ്ങൾ കാണുക' : 'View Results'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

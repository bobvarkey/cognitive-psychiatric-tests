import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { StressScreeningResponse, StressScreeningResult } from '@/types/stressScreening';
import { STRESS_SCREENING_ITEMS, CATEGORY_LABELS, CLINICAL_GUIDANCE } from '@/data/stressScreeningScale';
import { StressScreeningItemCard } from './StressScreeningItemCard';
import { StressScreeningResults } from './StressScreeningResults';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { ArrowLeft, Info, CheckCircle, AlertCircle, Stethoscope } from 'lucide-react';
import { PatientInfoForm } from '@/components/PatientInfoForm';

interface StressScreeningAssessmentProps {
  onBack?: () => void;
}

export const StressScreeningAssessment = ({ onBack }: StressScreeningAssessmentProps) => {
  const { language, t } = useLanguage();
  const [responses, setResponses] = useState<StressScreeningResponse>({});
  const [showResults, setShowResults] = useState(false);

  const handleResponse = (itemId: string, value: boolean) => {
    setResponses(prev => ({ ...prev, [itemId]: value }));
  };

  const calculateResults = (): StressScreeningResult => {
    const redFlagsByCategory: Record<string, string[]> = {
      stressor: [],
      duration: [],
      severity: [],
      impairment: [],
      qualitative: [],
      mse: [],
    };

    let totalRedFlags = 0;

    STRESS_SCREENING_ITEMS.forEach(item => {
      if (responses[item.id] === true && item.redFlag) {
        totalRedFlags++;
        const question = language === 'ml' ? item.questionMl : item.question;
        redFlagsByCategory[item.category].push(question);
      }
    });

    let likelihood: 'low' | 'moderate' | 'high';
    let interpretation: string;
    let interpretationMl: string;
    let recommendations: string[];
    let recommendationsMl: string[];

    if (totalRedFlags <= 2) {
      likelihood = 'low';
      interpretation = 'Findings are consistent with a normal stress reaction. Symptoms appear proportionate to identified stressors and are not causing significant functional impairment.';
      interpretationMl = 'കണ്ടെത്തലുകൾ സാധാരണ സ്ട്രെസ് പ്രതികരണത്തിന് അനുയോജ്യമാണ്. ലക്ഷണങ്ങൾ തിരിച്ചറിഞ്ഞ സ്ട്രെസറുകൾക്ക് ആനുപാതികമായി കാണപ്പെടുന്നു, കാര്യമായ പ്രവർത്തന വൈകല്യം ഉണ്ടാക്കുന്നില്ല.';
      recommendations = [
        'Continue supportive counseling and stress management techniques',
        'Monitor for worsening or persistence of symptoms',
        'Encourage healthy coping strategies',
        'Schedule follow-up if symptoms persist beyond 3 months',
      ];
      recommendationsMl = [
        'പിന്തുണയുള്ള കൗൺസിലിംഗും സ്ട്രെസ് മാനേജ്മെന്റ് ടെക്നിക്കുകളും തുടരുക',
        'ലക്ഷണങ്ങൾ വഷളാകുന്നതിനോ തുടരുന്നതിനോ നിരീക്ഷിക്കുക',
        'ആരോഗ്യകരമായ കോപ്പിംഗ് തന്ത്രങ്ങൾ പ്രോത്സാഹിപ്പിക്കുക',
        'ലക്ഷണങ്ങൾ 3 മാസത്തിലധികം നിലനിൽക്കുകയാണെങ്കിൽ ഫോളോ-അപ്പ് ഷെഡ്യൂൾ ചെയ്യുക',
      ];
    } else if (totalRedFlags <= 5) {
      likelihood = 'moderate';
      interpretation = 'Some findings suggest possible adjustment difficulties or emerging mental health concerns. Further evaluation is recommended to clarify the clinical picture.';
      interpretationMl = 'ചില കണ്ടെത്തലുകൾ സാധ്യമായ ക്രമീകരണ ബുദ്ധിമുട്ടുകളോ ഉയർന്നുവരുന്ന മാനസികാരോഗ്യ ആശങ്കകളോ സൂചിപ്പിക്കുന്നു. ക്ലിനിക്കൽ ചിത്രം വ്യക്തമാക്കാൻ കൂടുതൽ വിലയിരുത്തൽ ശുപാർശ ചെയ്യുന്നു.';
      recommendations = [
        'Consider structured diagnostic interview',
        'Administer syndrome-specific screening tools (PHQ-9, GAD-7, PCL-5)',
        'Assess safety if suicidal ideation present',
        'Consider referral to mental health specialist',
        'Schedule closer follow-up within 2-4 weeks',
      ];
      recommendationsMl = [
        'ഘടനാപരമായ ഡയഗ്നോസ്റ്റിക് അഭിമുഖം പരിഗണിക്കുക',
        'സിൻഡ്രോം-നിർദ്ദിഷ്ട സ്ക്രീനിംഗ് ടൂളുകൾ നടപ്പിലാക്കുക (PHQ-9, GAD-7, PCL-5)',
        'ആത്മഹത്യാ ചിന്തകൾ ഉണ്ടെങ്കിൽ സുരക്ഷ വിലയിരുത്തുക',
        'മാനസികാരോഗ്യ വിദഗ്ധനിലേക്ക് റഫർ ചെയ്യുന്നത് പരിഗണിക്കുക',
        '2-4 ആഴ്ചകൾക്കുള്ളിൽ കൂടുതൽ അടുത്ത ഫോളോ-അപ്പ് ഷെഡ്യൂൾ ചെയ്യുക',
      ];
    } else {
      likelihood = 'high';
      interpretation = 'Multiple red flags are present, strongly suggesting an underlying mental health condition rather than ordinary stress. Comprehensive psychiatric evaluation is indicated.';
      interpretationMl = 'ഒന്നിലധികം റെഡ് ഫ്ലാഗുകൾ ഉണ്ട്, ഇത് സാധാരണ സ്ട്രെസിനേക്കാൾ അടിസ്ഥാന മാനസികാരോഗ്യ അവസ്ഥയെ ശക്തമായി സൂചിപ്പിക്കുന്നു. സമഗ്ര മനോരോഗ വിലയിരുത്തൽ സൂചിപ്പിക്കുന്നു.';
      recommendations = [
        'Urgent psychiatric evaluation recommended',
        'Comprehensive diagnostic assessment needed',
        'Safety assessment is priority if suicidality/self-harm present',
        'Consider pharmacological and psychotherapeutic interventions',
        'Develop a structured treatment plan',
        'Engage family/support system if appropriate',
      ];
      recommendationsMl = [
        'അടിയന്തര മനോരോഗ വിലയിരുത്തൽ ശുപാർശ ചെയ്യുന്നു',
        'സമഗ്ര ഡയഗ്നോസ്റ്റിക് വിലയിരുത്തൽ ആവശ്യമാണ്',
        'ആത്മഹത്യ/സ്വയം ഉപദ്രവം ഉണ്ടെങ്കിൽ സുരക്ഷാ വിലയിരുത്തൽ മുൻഗണനയാണ്',
        'ഫാർമക്കോളജിക്കൽ, സൈക്കോതെറാപ്യൂട്ടിക് ഇടപെടലുകൾ പരിഗണിക്കുക',
        'ഘടനാപരമായ ചികിത്സാ പദ്ധതി വികസിപ്പിക്കുക',
        'ഉചിതമെങ്കിൽ കുടുംബം/പിന്തുണാ സംവിധാനം ഉൾപ്പെടുത്തുക',
      ];
    }

    return {
      totalRedFlags,
      redFlagsByCategory,
      likelihood,
      interpretation,
      interpretationMl,
      recommendations,
      recommendationsMl,
    };
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setResponses({});
    setShowResults(false);
  };

  const answeredCount = Object.keys(responses).length;
  const totalItems = STRESS_SCREENING_ITEMS.length;
  const progress = (answeredCount / totalItems) * 100;
  const allAnswered = answeredCount === totalItems;

  if (showResults) {
    return <StressScreeningResults result={calculateResults()} onReset={handleReset} onBack={onBack} />;
  }

  // Group items by category
  const itemsByCategory = STRESS_SCREENING_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof STRESS_SCREENING_ITEMS>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-4 md:p-8">
      <LanguageToggle />
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToMenu')}
          </Button>
        )}

        <PatientInfoForm />

        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
            <CardTitle className="text-2xl">
              {language === 'ml' ? 'സ്ട്രെസ് vs മാനസിക വൈകല്യം സ്ക്രീനിംഗ്' : 'Stress vs Mental Disorder Screening'}
            </CardTitle>
            <p className="text-violet-100 mt-2">
              {language === 'ml' 
                ? 'സാധാരണ സ്ട്രെസിനെ അടിസ്ഥാന മാനസികാരോഗ്യ അവസ്ഥയിൽ നിന്ന് വ്യത്യാസപ്പെടുത്താൻ സഹായിക്കുന്ന റെഡ് ഫ്ലാഗുകൾ തിരിച്ചറിയുക'
                : 'Identify red flags that help differentiate ordinary stress from underlying mental health conditions'}
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Clinical Guidance Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="guidance" className="border rounded-lg bg-slate-50">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-2 text-violet-700">
                    <Info className="h-5 w-5" />
                    <span className="font-semibold">
                      {language === 'ml' ? 'ക്ലിനിക്കൽ മാർഗ്ഗനിർദ്ദേശം' : 'Clinical Guidance: Stress vs Mental Disorder'}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h4 className="font-bold text-green-800">
                          {language === 'ml' ? 'സാധാരണ സ്ട്രെസ്' : 'Ordinary Stress'}
                        </h4>
                      </div>
                      <ul className="space-y-2 text-sm text-green-700">
                        {(language === 'ml' ? CLINICAL_GUIDANCE.ordinaryStress.ml : CLINICAL_GUIDANCE.ordinaryStress.en).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <h4 className="font-bold text-red-800">
                          {language === 'ml' ? 'മാനസിക വൈകല്യം' : 'Mental Disorder'}
                        </h4>
                      </div>
                      <ul className="space-y-2 text-sm text-red-700">
                        {(language === 'ml' ? CLINICAL_GUIDANCE.mentalDisorder.ml : CLINICAL_GUIDANCE.mentalDisorder.en).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Stethoscope className="h-5 w-5 text-blue-600" />
                      <h4 className="font-bold text-blue-800">
                        {language === 'ml' ? 'ശുപാർശിത സ്ക്രീനിംഗ് ടൂളുകൾ' : 'Recommended Screening Tools'}
                      </h4>
                    </div>
                    <ul className="space-y-1 text-sm text-blue-700">
                      {(language === 'ml' ? CLINICAL_GUIDANCE.screeningTools.ml : CLINICAL_GUIDANCE.screeningTools.en).map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{t('progress')}</span>
                <span>{answeredCount}/{totalItems}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {Object.entries(itemsByCategory).map(([category, items]) => {
              const label = CATEGORY_LABELS[category];
              return (
                <div key={category} className="space-y-3">
                  <h3 className="font-bold text-lg text-violet-800 border-b border-violet-200 pb-2">
                    {language === 'ml' ? label.ml : label.en}
                  </h3>
                  {items.map(item => (
                    <StressScreeningItemCard
                      key={item.id}
                      item={item}
                      response={responses[item.id] ?? null}
                      onResponse={handleResponse}
                    />
                  ))}
                </div>
              );
            })}

            <Button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
              size="lg"
            >
              {allAnswered ? t('viewResults') : `${t('answer')} ${totalItems - answeredCount} ${t('moreQuestions')}`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

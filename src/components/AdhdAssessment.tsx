import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AdhdItemCard } from './AdhdItemCard';
import { AdhdCriterionCard } from './AdhdCriterionCard';
import { AdhdResults } from './AdhdResults';
import { 
  ADHD_INATTENTION_SYMPTOMS, 
  ADHD_HYPERACTIVITY_SYMPTOMS, 
  ADHD_CRITERIA,
  getPresentation 
} from '@/data/adhdScale';
import { AdhdSymptomResponse, AdhdCriterionResponse, AdhdResults as AdhdResultsType } from '@/types/adhd';
import { useLanguage } from '@/contexts/LanguageContext';
import { Brain, ArrowRight, RotateCcw, ArrowLeft } from 'lucide-react';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';

interface AdhdAssessmentProps {
  onBack?: () => void;
}

export const AdhdAssessment = ({ onBack }: AdhdAssessmentProps) => {
  const { t, language } = useLanguage();
  const [symptomResponses, setSymptomResponses] = useState<Map<string, boolean>>(new Map());
  const [criterionResponses, setCriterionResponses] = useState<Map<string, boolean>>(new Map());
  const [age17Plus, setAge17Plus] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const allSymptoms = [...ADHD_INATTENTION_SYMPTOMS, ...ADHD_HYPERACTIVITY_SYMPTOMS];
  const totalItems = allSymptoms.length + ADHD_CRITERIA.length;
  const answeredItems = symptomResponses.size + criterionResponses.size;

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    const newResponses = new Map(symptomResponses);
    if (checked) {
      newResponses.set(symptomId, true);
    } else {
      newResponses.delete(symptomId);
    }
    setSymptomResponses(newResponses);
  };

  const handleCriterionChange = (criterionId: string, met: boolean) => {
    const newResponses = new Map(criterionResponses);
    newResponses.set(criterionId, met);
    setCriterionResponses(newResponses);
  };

  const calculateResults = (): AdhdResultsType => {
    const symptomResponsesArray: AdhdSymptomResponse[] = allSymptoms.map(s => ({
      symptomId: s.id,
      present: symptomResponses.get(s.id) || false
    }));

    const criterionResponsesArray: AdhdCriterionResponse[] = ADHD_CRITERIA.map(c => ({
      criterionId: c.id,
      met: criterionResponses.get(c.id) || false
    }));

    const inattentionCount = ADHD_INATTENTION_SYMPTOMS.filter(s => symptomResponses.get(s.id)).length;
    const hyperactivityCount = ADHD_HYPERACTIVITY_SYMPTOMS.filter(s => symptomResponses.get(s.id)).length;
    const allCriteriaMet = ADHD_CRITERIA.every(c => criterionResponses.get(c.id));
    const presentation = getPresentation(inattentionCount, hyperactivityCount, age17Plus);

    return {
      symptomResponses: symptomResponsesArray,
      criterionResponses: criterionResponsesArray,
      inattentionCount,
      hyperactivityCount,
      totalSymptoms: inattentionCount + hyperactivityCount,
      allCriteriaMet,
      presentation,
      age17Plus
    };
  };

  const handleSubmit = () => {
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSymptomResponses(new Map());
    setCriterionResponses(new Map());
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progress = (answeredItems / totalItems) * 100;
  const criteriaAnswered = criterionResponses.size === ADHD_CRITERIA.length;

  if (showResults) {
    return <AdhdResults results={calculateResults()} onReset={handleReset} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToMenu')}
          </Button>
        )}

        <PatientInfoForm />

        <Card className="mb-8 shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <div className="flex items-center gap-3">
              <Brain className="h-10 w-10" />
              <div>
                <CardTitle className="text-2xl md:text-3xl">
                  {language === 'ml' ? 'DSM-5-TR ADHD മാനദണ്ഡങ്ങൾ' : 'DSM-5-TR ADHD Criteria'}
                </CardTitle>
                <p className="text-indigo-100 mt-1 text-sm">
                  {language === 'ml' 
                    ? 'ശ്രദ്ധക്കുറവ്/അമിത സജീവത വൈകല്യം - രോഗനിർണയ മാനദണ്ഡങ്ങൾ' 
                    : 'Attention-Deficit/Hyperactivity Disorder - Diagnostic Criteria'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>{language === 'ml' ? 'പുരോഗതി' : 'Progress'}: {answeredItems}/{totalItems}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              {/* Age Selection */}
              <div className="bg-muted/50 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="age-toggle" className="flex-1">
                    <p className="font-semibold text-foreground">
                      {language === 'ml' ? 'പ്രായം 17 വയസ്സോ അതിൽ കൂടുതലോ?' : 'Age 17 years or older?'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ml' 
                        ? '≥17 വയസ്സിന്, ഓരോ ഡൊമെയ്‌നിലും ≥5 ലക്ഷണങ്ങൾ ആവശ്യമാണ്' 
                        : 'For age ≥17, only ≥5 symptoms in each domain are required'}
                    </p>
                  </Label>
                  <Switch
                    id="age-toggle"
                    checked={age17Plus}
                    onCheckedChange={setAge17Plus}
                  />
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold text-primary mb-2">
                  {language === 'ml' ? 'നിർദ്ദേശങ്ങൾ:' : 'Instructions:'}
                </h3>
                <p className="text-sm text-foreground">
                  {language === 'ml' 
                    ? 'കഴിഞ്ഞ 6 മാസത്തിനുള്ളിൽ വികസന നിലവാരവുമായി പൊരുത്തപ്പെടാത്തതും സാമൂഹിക/അക്കാദമിക്/തൊഴിൽ പ്രവർത്തനങ്ങളെ നേരിട്ട് പ്രതികൂലമായി ബാധിക്കുന്നതുമായ ലക്ഷണങ്ങൾ തിരഞ്ഞെടുക്കുക.'
                    : 'Select symptoms persisting ≥6 months that are inconsistent with developmental level and negatively impact directly on social and academic/occupational activities.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Criterion A.1: Inattention */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg p-4 mb-4">
            <h2 className="text-xl font-bold">
              {language === 'ml' ? 'A.1 ശ്രദ്ധക്കുറവ്' : 'A.1 Inattention'}
            </h2>
            <p className="text-indigo-100 mt-1 text-sm">
              {language === 'ml' 
                ? `≥${age17Plus ? '5' : '6'} ലക്ഷണങ്ങൾ ആവശ്യമാണ് (${ADHD_INATTENTION_SYMPTOMS.filter(s => symptomResponses.get(s.id)).length}/9 തിരഞ്ഞെടുത്തു)` 
                : `≥${age17Plus ? '5' : '6'} symptoms required (${ADHD_INATTENTION_SYMPTOMS.filter(s => symptomResponses.get(s.id)).length}/9 selected)`}
            </p>
          </div>
          <div className="colorful-questions space-y-3">
            {ADHD_INATTENTION_SYMPTOMS.map((symptom) => (
              <AdhdItemCard
                key={symptom.id}
                symptom={symptom}
                checked={symptomResponses.get(symptom.id) || false}
                onChange={(checked) => handleSymptomChange(symptom.id, checked)}
              />
            ))}
          </div>
        </div>

        {/* Criterion A.2: Hyperactivity-Impulsivity */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg p-4 mb-4">
            <h2 className="text-xl font-bold">
              {language === 'ml' ? 'A.2 അമിത സജീവതയും ആവേഗവും' : 'A.2 Hyperactivity and Impulsivity'}
            </h2>
            <p className="text-amber-100 mt-1 text-sm">
              {language === 'ml' 
                ? `≥${age17Plus ? '5' : '6'} ലക്ഷണങ്ങൾ ആവശ്യമാണ് (${ADHD_HYPERACTIVITY_SYMPTOMS.filter(s => symptomResponses.get(s.id)).length}/9 തിരഞ്ഞെടുത്തു)` 
                : `≥${age17Plus ? '5' : '6'} symptoms required (${ADHD_HYPERACTIVITY_SYMPTOMS.filter(s => symptomResponses.get(s.id)).length}/9 selected)`}
            </p>
          </div>
          <div className="colorful-questions space-y-3">
            {ADHD_HYPERACTIVITY_SYMPTOMS.map((symptom) => (
              <AdhdItemCard
                key={symptom.id}
                symptom={symptom}
                checked={symptomResponses.get(symptom.id) || false}
                onChange={(checked) => handleSymptomChange(symptom.id, checked)}
              />
            ))}
          </div>
        </div>

        {/* Criteria B, C, D, E */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-t-lg p-4 mb-4">
            <h2 className="text-xl font-bold">
              {language === 'ml' ? 'മാനദണ്ഡങ്ങൾ B-E' : 'Criteria B-E'}
            </h2>
            <p className="text-slate-300 mt-1 text-sm">
              {language === 'ml' 
                ? 'രോഗനിർണയത്തിന് എല്ലാ മാനദണ്ഡങ്ങളും പാലിക്കണം' 
                : 'All criteria must be met for diagnosis'}
            </p>
          </div>
          <div className="colorful-questions space-y-3">
            {ADHD_CRITERIA.map((criterion) => (
              <AdhdCriterionCard
                key={criterion.id}
                criterion={criterion}
                met={criterionResponses.get(criterion.id) || false}
                onChange={(met) => handleCriterionChange(criterion.id, met)}
              />
            ))}
          </div>
        </div>

        <Card className="sticky bottom-4 shadow-xl border-0 print:hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                  {criteriaAnswered 
                    ? (language === 'ml' ? 'എല്ലാ മാനദണ്ഡങ്ങളും ഉത്തരം നൽകി!' : 'All criteria answered!') 
                    : (language === 'ml' 
                        ? `${ADHD_CRITERIA.length - criterionResponses.size} മാനദണ്ഡങ്ങൾ ബാക്കി` 
                        : `${ADHD_CRITERIA.length - criterionResponses.size} criteria remaining`)}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  {language === 'ml' ? 'പുനഃസജ്ജമാക്കുക' : 'Reset'}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!criteriaAnswered}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 flex items-center gap-2"
                >
                  {t('calculateResults')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <AssessmentReference assessmentKey="adhd" />

    </div>
  );
};

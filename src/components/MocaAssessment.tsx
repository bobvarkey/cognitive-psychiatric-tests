import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { mocaScaleEnglish, mocaScaleMalayalam } from '@/data/mocaScale';
import { MocaItemCard } from '@/components/MocaItemCard';
import { MocaResults } from '@/components/MocaResults';
import { MocaResponse, MocaResults as MocaResultsType } from '@/types/moca';
import { Calculator, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';

interface PatientInfo {
  name: string;
  sex: string;
  education: string;
}

export const MocaAssessment = () => {
  const { language, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<'info' | 'assessment' | 'results'>('info');
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    sex: '',
    education: ''
  });
  const [responses, setResponses] = useState<MocaResponse[]>([]);
  const [results, setResults] = useState<MocaResultsType | null>(null);

  const mocaItems = language === 'ml' ? mocaScaleMalayalam : mocaScaleEnglish;

  const handlePatientInfoChange = (field: keyof PatientInfo, value: string) => {
    setPatientInfo(prev => ({ ...prev, [field]: value }));
  };

  const startAssessment = () => {
    setCurrentStep('assessment');
  };

  const handleScoreChange = (itemId: string, score: number) => {
    setResponses(prev => {
      const existing = prev.find(r => r.itemId === itemId);
      if (existing) {
        return prev.map(r => r.itemId === itemId ? { ...r, score } : r);
      }
      return [...prev, { itemId, score }];
    });
  };

  const getCurrentScore = (itemId: string): number => {
    return responses.find(r => r.itemId === itemId)?.score || 0;
  };

  const goToNext = () => {
    if (currentItemIndex < mocaItems.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const goToPrevious = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    const totalScore = responses.reduce((sum, response) => sum + response.score, 0);
    const domainScores: Record<string, number> = {};
    
    mocaItems.forEach(item => {
      const response = responses.find(r => r.itemId === item.id);
      const score = response?.score || 0;
      domainScores[item.domain] = (domainScores[item.domain] || 0) + score;
    });

    const educationYears = parseInt(patientInfo.education) || 0;
    const educationAdjusted = educationYears <= 12;
    const finalScore = totalScore + (educationAdjusted ? 1 : 0);

    let interpretation = '';
    if (finalScore >= 26) {
      interpretation = t('mocaNormal');
    } else if (finalScore >= 18) {
      interpretation = t('mocaMildImpairment');
    } else {
      interpretation = t('mocaModerateImpairment');
    }

    const calculatedResults: MocaResultsType = {
      responses,
      totalScore,
      domainScores,
      interpretation,
      educationAdjusted,
      finalScore
    };

    setResults(calculatedResults);
    setCurrentStep('results');
  };

  const restartAssessment = () => {
    setCurrentStep('info');
    setCurrentItemIndex(0);
    setResponses([]);
    setResults(null);
    setPatientInfo({
      name: '',
      sex: '',
      education: ''
    });
  };

  if (currentStep === 'results' && results) {
    return (
      <MocaResults 
        results={results} 
        patientInfo={patientInfo}
        onRestart={restartAssessment}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-800">
              Montreal Cognitive Assessment (MoCA)
            </h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {t('mocaDescription')}
          </p>
        </div>

        {currentStep === 'info' && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-xl">{t('patientInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('patientName')} <span className="text-muted-foreground text-sm">(optional)</span></Label>
                  <Input
                    id="name"
                    value={patientInfo.name}
                    onChange={(e) => handlePatientInfoChange('name', e.target.value)}
                    placeholder={t('enterPatientName')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sex">{t('sex')} <span className="text-muted-foreground text-sm">(optional)</span></Label>
                  <Input
                    id="sex"
                    value={patientInfo.sex}
                    onChange={(e) => handlePatientInfoChange('sex', e.target.value)}
                    placeholder={t('enterSex')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">{t('yearsOfEducation')} <span className="text-muted-foreground text-sm">(optional)</span></Label>
                  <Input
                    id="education"
                    type="number"
                    value={patientInfo.education}
                    onChange={(e) => handlePatientInfoChange('education', e.target.value)}
                    placeholder={t('enterEducation')}
                  />
                </div>
              </div>
              
              <div className="flex justify-center gap-3 pt-4">
                <Button variant="outline" onClick={startAssessment} className="flex items-center gap-2">
                  Skip
                </Button>
                <Button onClick={startAssessment} className="flex items-center gap-2">
                  {t('startAssessment')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'assessment' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                {t('item')} {currentItemIndex + 1} {t('of')} {mocaItems.length}
              </h2>
              <div className="text-sm text-slate-600">
                {Math.round(((currentItemIndex + 1) / mocaItems.length) * 100)}% {t('complete')}
              </div>
            </div>
            
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentItemIndex + 1) / mocaItems.length) * 100}%` }}
              />
            </div>

            <MocaItemCard
              item={mocaItems[currentItemIndex]}
              currentScore={getCurrentScore(mocaItems[currentItemIndex].id)}
              onScoreChange={handleScoreChange}
            />

            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={goToPrevious}
                disabled={currentItemIndex === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('previous')}
              </Button>
              
              <Button 
                onClick={goToNext}
                className="flex items-center gap-2"
              >
                {currentItemIndex === mocaItems.length - 1 ? t('calculateResults') : t('next')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, FileText, User } from 'lucide-react';
import { getDaphneScaleItems } from '@/data/daphneScale';
import { DaphneResponse, DaphneResults } from '@/types/daphne';
import { DaphneItemCard } from './DaphneItemCard';
import { DaphneResults as DaphneResultsComponent } from './DaphneResults';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { AssessmentReference } from '@/components/AssessmentReference';
import { ProgressIndicator } from './ProgressIndicator';

export const DaphneAssessment = () => {
  const { language, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<DaphneResponse[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    assessorName: ''
  });
  const [showPatientForm, setShowPatientForm] = useState(true);

  const DAPHNE_SCALE_ITEMS = getDaphneScaleItems(language);
  const totalSteps = DAPHNE_SCALE_ITEMS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentItem = DAPHNE_SCALE_ITEMS[currentStep];

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
    return responses.find(r => r.itemId === itemId)?.score ?? 0;
  };

  const canProceed = () => {
    return responses.some(r => r.itemId === currentItem.id);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    // Calculate DAPHNE-40 (sum of all items)
    const daphne40Score = responses.reduce((sum, response) => sum + response.score, 0);

    // Calculate DAPHNE-6 (binary domain scoring)
    const domainScores: Record<string, number> = {};
    const domains = ['disinhibition', 'apathy', 'empathy', 'perseverations', 'hyperorality', 'neglect'];
    
    domains.forEach(domain => {
      const domainItems = getDaphneScaleItems('en').filter(item => item.domain === domain);
      const domainResponses = responses.filter(r => 
        domainItems.some(item => item.id === r.itemId)
      );
      const hasSymptom = domainResponses.some(r => r.score > 0);
      domainScores[domain] = hasSymptom ? 1 : 0;
    });

    const daphne6Score = Object.values(domainScores).reduce((sum, score) => sum + score, 0);

    const results: DaphneResults = {
      responses,
      daphne6Score,
      daphne40Score,
      domainScores
    };

    setShowResults(true);
  };

  const handleStartAssessment = () => {
    setShowPatientForm(false);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setResponses([]);
    setShowResults(false);
    setShowPatientForm(true);
    setPatientInfo({ name: '', age: '', assessorName: '' });
  };

  if (showPatientForm) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <LanguageToggle />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto shadow-medical">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-medical-primary mr-3" />
                <CardTitle className="text-3xl font-bold text-medical-primary">
                  {t('assessment.title')}
                </CardTitle>
              </div>
              <p className="text-muted-foreground text-lg">
                {t('assessment.subtitle')}
              </p>
              <Badge variant="secondary" className="mx-auto mt-2">
                {t('assessment.badge')}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('form.patient.name')} <span className="text-muted-foreground">(optional)</span></label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('form.patient.name.placeholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('form.patient.age')} <span className="text-muted-foreground">(optional)</span></label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                    placeholder={t('form.patient.age.placeholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('form.assessor.name')} <span className="text-muted-foreground">(optional)</span></label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                    value={patientInfo.assessorName}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, assessorName: e.target.value }))}
                    placeholder={t('form.assessor.name.placeholder')}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleStartAssessment}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Skip
                </Button>
                <Button 
                  onClick={handleStartAssessment}
                  className="flex-1 bg-medical-primary hover:bg-medical-primary/90"
                  size="lg"
                >
                  <User className="h-4 w-4 mr-2" />
                  {t('form.begin')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results: DaphneResults = {
      responses,
      daphne6Score: Object.values(responses.reduce((acc, response) => {
        const item = getDaphneScaleItems('en').find(i => i.id === response.itemId);
        if (item && response.score > 0) {
          acc[item.domain] = 1;
        }
        return acc;
      }, {} as Record<string, number>)).reduce((sum, score) => sum + score, 0),
      daphne40Score: responses.reduce((sum, response) => sum + response.score, 0),
      domainScores: responses.reduce((acc, response) => {
        const item = getDaphneScaleItems('en').find(i => i.id === response.itemId);
        if (item) {
          acc[item.domain] = (acc[item.domain] || 0) + (response.score > 0 ? 1 : 0);
        }
        return acc;
      }, {} as Record<string, number>)
    };

    return (
      <DaphneResultsComponent 
        results={results} 
        patientInfo={patientInfo}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle pt-16">
      <ProgressIndicator 
        sections={[
          { id: 'disinhibition', label: language === 'ml' ? 'അനിയന്ത്രണം' : 'Disinhibition' },
          { id: 'apathy', label: language === 'ml' ? 'നിസ്സംഗത' : 'Apathy' },
          { id: 'empathy', label: language === 'ml' ? 'സഹാനുഭൂതി' : 'Empathy' },
          { id: 'perseverations', label: language === 'ml' ? 'ആവർത്തനം' : 'Perseverations' },
          { id: 'hyperorality', label: language === 'ml' ? 'അമിത വായ്ക്കോളിത്തം' : 'Hyperorality' },
          { id: 'neglect', label: language === 'ml' ? 'അവഗണന' : 'Neglect' }
        ]} 
      />

      <LanguageToggle />
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-medical-primary">{t('assessment.header')}</h1>
            <Badge variant="outline" className="text-medical-primary border-medical-primary">
              {currentStep + 1} / {totalSteps}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t('nav.patient')}: {patientInfo.name || 'Not provided'}</span>
              <span>{t('nav.assessor')}: {patientInfo.assessorName || 'Not provided'}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Assessment Item */}
        <div className="max-w-4xl mx-auto">
          <DaphneItemCard
            item={currentItem}
            currentScore={getCurrentScore(currentItem.id)}
            onScoreChange={handleScoreChange}
          />

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t('nav.previous')}
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-medical-primary hover:bg-medical-primary/90"
            >
              {currentStep === totalSteps - 1 ? t('nav.complete') : t('nav.next')}
              {currentStep !== totalSteps - 1 && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
      <AssessmentReference assessmentKey="daphne" />

    </div>
  );
};

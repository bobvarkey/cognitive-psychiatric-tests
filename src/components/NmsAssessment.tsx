import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ThermometerSun, Stethoscope, Activity, Brain, Move, FlaskConical, Info, Clock, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';
import { NmsItem, NmsResponse, NmsResults } from '@/types/nms';
import { NMS_ITEMS, NMS_CATEGORIES, NMS_SEVERITY_LEVELS, NMS_REFERENCE, NMS_DIAGNOSTIC_CRITERIA, NMS_CLINICAL_NOTES } from '@/data/nmsScale';
import { NmsItemCard } from '@/components/NmsItemCard';
import { NmsResultsComponent } from '@/components/NmsResults';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

interface NmsAssessmentProps {
  onBack: () => void;
}

export const NmsAssessment: React.FC<NmsAssessmentProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isMalayalam = language === 'ml';
  const [response, setResponse] = useState<NmsResponse>({
    scores: {},
    ratingPeriod: 'wholeDay'
  });
  const [showResults, setShowResults] = useState(false);

  const getItemsByCategory = (category: string): NmsItem[] => {
    return NMS_ITEMS.filter(item => item.category === category);
  };

  const handleScoreChange = (itemId: string, score: number) => {
    setResponse(prev => ({
      ...prev,
      scores: { ...prev.scores, [itemId]: score }
    }));
  };

  const calculateResults = (): NmsResults => {
    const categoryScores = {
      temperature: 0,
      extrapyramidal: 0,
      autonomic: 0,
      consciousness: 0,
      catatonia: 0,
      laboratory: 0
    };

    NMS_ITEMS.forEach(item => {
      const score = response.scores[item.id] || 0;
      categoryScores[item.category] += score;
    });

    const totalScore = Object.values(categoryScores).reduce((a, b) => a + b, 0);
    const maxScore = 36;

    // Count domains with score >= 2
    const domainsWithScore2OrMore = Object.values(categoryScores).filter(score => score >= 2).length;

    // Determine diagnostic category based on total score
    let diagnosticCategory: 'noNms' | 'possibleNms' | 'definiteNms';
    if (totalScore <= 4) {
      diagnosticCategory = 'noNms';
    } else if (totalScore <= 8) {
      diagnosticCategory = 'possibleNms';
    } else {
      diagnosticCategory = 'definiteNms';
    }

    // Check if meets strong diagnostic criteria (score >8 AND >=2 in at least 3 domains)
    const meetsStrongDiagnosticCriteria = totalScore > 8 && domainsWithScore2OrMore >= 3;

    let severity: 'mild' | 'moderate' | 'severe' | 'critical';
    let interpretation: string;
    let interpretationMl: string;

    if (totalScore <= 12) {
      severity = 'mild';
      interpretation = NMS_SEVERITY_LEVELS.mild.description;
      interpretationMl = NMS_SEVERITY_LEVELS.mild.descriptionMl;
    } else if (totalScore <= 24) {
      severity = 'moderate';
      interpretation = NMS_SEVERITY_LEVELS.moderate.description;
      interpretationMl = NMS_SEVERITY_LEVELS.moderate.descriptionMl;
    } else if (totalScore <= 30) {
      severity = 'severe';
      interpretation = NMS_SEVERITY_LEVELS.severe.description;
      interpretationMl = NMS_SEVERITY_LEVELS.severe.descriptionMl;
    } else {
      severity = 'critical';
      interpretation = NMS_SEVERITY_LEVELS.critical.description;
      interpretationMl = NMS_SEVERITY_LEVELS.critical.descriptionMl;
    }

    return {
      totalScore,
      maxScore,
      categoryScores,
      severity,
      diagnosticCategory,
      domainsWithScore2OrMore,
      meetsStrongDiagnosticCriteria,
      interpretation,
      interpretationMl,
      recommendations: [],
      recommendationsMl: []
    };
  };

  const results = useMemo(() => calculateResults(), [response.scores]);
  
  const isComplete = NMS_ITEMS.every(item => response.scores[item.id] !== undefined);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'temperature': return <ThermometerSun className="h-4 w-4" />;
      case 'extrapyramidal': return <Stethoscope className="h-4 w-4" />;
      case 'autonomic': return <Activity className="h-4 w-4" />;
      case 'consciousness': return <Brain className="h-4 w-4" />;
      case 'catatonia': return <Move className="h-4 w-4" />;
      case 'laboratory': return <FlaskConical className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {isMalayalam ? 'തിരികെ' : 'Back'}
          </Button>
          <LanguageToggle />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">
              {isMalayalam ? 'NMS റേറ്റിംഗ് സ്കെയിൽ' : 'NMS Rating Scale'}
            </CardTitle>
            <CardDescription>
              {isMalayalam 
                ? 'ന്യൂറോലെപ്റ്റിക് മാലിഗ്നന്റ് സിൻഡ്രോം വിലയിരുത്തൽ' 
                : 'Neuroleptic Malignant Syndrome Assessment'}
            </CardDescription>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              <span>{isMalayalam ? NMS_REFERENCE.citationMl : NMS_REFERENCE.citation}</span>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                {isMalayalam 
                  ? 'സംശയിക്കപ്പെടുന്ന അല്ലെങ്കിൽ രോഗനിർണയം നടത്തിയ NMS-നുള്ള രോഗികളിൽ ഉപയോഗിക്കാൻ രൂപകൽപ്പന ചെയ്തിരിക്കുന്നു. മാലിഗ്നന്റ് (ലീതൽ) കാറ്റടോണിയ ഉൾപ്പെടെയുള്ള NMS പോലുള്ള സിൻഡ്രോമുകൾക്കും ഉപയോഗിക്കാം.'
                  : 'Designed for patients with suspected or diagnosed NMS. May also be used for NMS-like syndromes including malignant (lethal) catatonia.'}
              </AlertDescription>
            </Alert>

            {/* Clinical Notes */}
            <div className="mb-6 space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>{isMalayalam ? 'ഉദ്ദേശ്യം:' : 'Purpose:'}</strong>{' '}
                  {isMalayalam ? NMS_CLINICAL_NOTES.purpose.ml : NMS_CLINICAL_NOTES.purpose.en}
                </AlertDescription>
              </Alert>
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>{isMalayalam ? 'തുടർച്ചയായ നിരീക്ഷണം:' : 'Serial Monitoring:'}</strong>{' '}
                  {isMalayalam ? NMS_CLINICAL_NOTES.serialMonitoring.ml : NMS_CLINICAL_NOTES.serialMonitoring.en}
                </AlertDescription>
              </Alert>
            </div>

            {/* Diagnostic Criteria Summary */}
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                {isMalayalam ? 'രോഗനിർണയ മാനദണ്ഡങ്ങൾ' : 'Diagnostic Criteria'}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-green-600 dark:text-green-400">0-4:</span>
                  <span>{isMalayalam ? NMS_DIAGNOSTIC_CRITERIA.noNms.labelMl : NMS_DIAGNOSTIC_CRITERIA.noNms.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-yellow-600 dark:text-yellow-400">5-8:</span>
                  <span>{isMalayalam ? NMS_DIAGNOSTIC_CRITERIA.possibleNms.labelMl : NMS_DIAGNOSTIC_CRITERIA.possibleNms.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-red-600 dark:text-red-400">&gt;8:</span>
                  <span>{isMalayalam ? NMS_DIAGNOSTIC_CRITERIA.definiteNms.labelMl : NMS_DIAGNOSTIC_CRITERIA.definiteNms.label}</span>
                </div>
              </div>
            </div>

            {/* Rating Period Selection */}
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4" />
                <span className="font-medium">
                  {isMalayalam ? 'റേറ്റിംഗ് കാലാവധി' : 'Rating Period'}
                </span>
              </div>
              <RadioGroup
                value={response.ratingPeriod}
                onValueChange={(value) => setResponse(prev => ({ 
                  ...prev, 
                  ratingPeriod: value as 'wholeDay' | 'oneTimePoint' 
                }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wholeDay" id="wholeDay" />
                  <Label htmlFor="wholeDay">
                    {isMalayalam ? 'മുഴുവൻ ദിവസം' : 'Whole Day'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oneTimePoint" id="oneTimePoint" />
                  <Label htmlFor="oneTimePoint">
                    {isMalayalam ? 'ഒരു സമയ പോയിന്റ്' : 'One Time Point'}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {!showResults ? (
          <>
            <Tabs defaultValue="temperature" className="mb-6">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto">
                {Object.entries(NMS_CATEGORIES).map(([key, category]) => (
                  <TabsTrigger key={key} value={key} className="flex flex-col gap-1 py-2">
                    {getCategoryIcon(key)}
                    <span className="text-xs">
                      {isMalayalam ? category.nameMl.split(' ')[0] : category.name.split(' ')[0]}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.keys(NMS_CATEGORIES).map(category => (
                <TabsContent key={category} value={category} className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        {isMalayalam 
                          ? NMS_CATEGORIES[category as keyof typeof NMS_CATEGORIES].nameMl 
                          : NMS_CATEGORIES[category as keyof typeof NMS_CATEGORIES].name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {getItemsByCategory(category).map(item => (
                        <NmsItemCard
                          key={item.id}
                          item={item}
                          score={response.scores[item.id]}
                          onChange={(score) => handleScoreChange(item.id, score)}
                          isMalayalam={isMalayalam}
                        />
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            {/* Current Score Display */}
            <Card className="mb-6">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {isMalayalam ? 'നിലവിലെ സ്കോർ' : 'Current Score'}
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {results.totalScore}/{results.maxScore}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => setShowResults(true)}
              className="w-full"
              size="lg"
              disabled={!isComplete}
            >
              {isMalayalam ? 'ഫലങ്ങൾ കാണുക' : 'View Results'}
            </Button>

            {!isComplete && (
              <p className="text-center text-muted-foreground mt-2 text-sm">
                {isMalayalam 
                  ? 'ഫലങ്ങൾ കാണാൻ എല്ലാ ഇനങ്ങളും പൂർത്തിയാക്കുക' 
                  : 'Complete all items to view results'}
              </p>
            )}
          </>
        ) : (
          <>
            <NmsResultsComponent results={results} isMalayalam={isMalayalam} />
            <Button
              onClick={() => setShowResults(false)}
              variant="outline"
              className="w-full mt-6"
            >
              {isMalayalam ? 'വിലയിരുത്തലിലേക്ക് മടങ്ങുക' : 'Back to Assessment'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

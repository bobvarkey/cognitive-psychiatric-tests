import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  RotateCcw, 
  Download, 
  User, 
  Calendar,
  Target,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { DaphneResults as DaphneResultsType } from '@/types/daphne';
import { getDaphneScaleItems } from '@/data/daphneScale';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface DaphneResultsProps {
  results: DaphneResultsType;
  patientInfo: {
    name: string;
    age: string;
    assessorName: string;
  };
  onRestart: () => void;
}

export const DaphneResults: React.FC<DaphneResultsProps> = ({
  results,
  patientInfo,
  onRestart
}) => {
  const { t } = useLanguage();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getDaphne6Interpretation = (score: number): { level: string; color: string; description: string } => {
    if (score === 0) return { 
      level: t('interp.no.behavioral'), 
      color: 'text-medical-success', 
      description: t('interp.no.domains') 
    };
    if (score <= 2) return { 
      level: t('interp.mild.behavioral'), 
      color: 'text-medical-warning', 
      description: `${score} ${score > 1 ? t('interp.domains.affected') : t('interp.domain.affected')}` 
    };
    if (score <= 4) return { 
      level: t('interp.moderate.behavioral'), 
      color: 'text-orange-600', 
      description: `${score} ${t('interp.domains.affected')}` 
    };
    return { 
      level: t('interp.severe.behavioral'), 
      color: 'text-destructive', 
      description: `${score} ${t('interp.domains.affected')}` 
    };
  };

  const getDaphne40Interpretation = (score: number): { level: string; color: string; description: string } => {
    if (score === 0) return { 
      level: t('interp.no.symptoms'), 
      color: 'text-medical-success', 
      description: t('interp.all.normal') 
    };
    if (score <= 10) return { 
      level: t('interp.mild.severity'), 
      color: 'text-medical-warning', 
      description: t('interp.low.severity') 
    };
    if (score <= 20) return { 
      level: t('interp.moderate.severity'), 
      color: 'text-orange-600', 
      description: t('interp.moderate.overall') 
    };
    return { 
      level: t('interp.high.severity'), 
      color: 'text-destructive', 
      description: t('interp.high.overall') 
    };
  };

  const daphne6Interp = getDaphne6Interpretation(results.daphne6Score);
  const daphne40Interp = getDaphne40Interpretation(results.daphne40Score);

  const domainDetails = [
    { name: t('domain.disinhibition'), key: 'disinhibition', items: 4 },
    { name: t('domain.apathy'), key: 'apathy', items: 1 },
    { name: t('domain.empathy'), key: 'empathy', items: 1 },
    { name: t('domain.perseverations'), key: 'perseverations', items: 1 },
    { name: t('domain.hyperorality'), key: 'hyperorality', items: 2 },
    { name: t('domain.neglect'), key: 'neglect', items: 1 }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <LanguageToggle />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card className="shadow-medical">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-medical-primary mr-3" />
                <CardTitle className="text-3xl font-bold text-medical-primary">
                  {t('assessment.results.title')}
                </CardTitle>
              </div>
              <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{t('nav.patient')}: {patientInfo.name}</span>
                </div>
                {patientInfo.age && (
                  <div className="flex items-center">
                    <span>{t('nav.age')}: {patientInfo.age}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{currentDate}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {t('results.assessed.by')}: {patientInfo.assessorName}
              </p>
            </CardHeader>
          </Card>

          {/* Primary Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Target className="h-5 w-5 mr-2 text-medical-primary" />
                  {t('results.screening')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-medical-primary mb-2">
                    {results.daphne6Score}/6
                  </div>
                  <div className={`text-lg font-medium ${daphne6Interp.color}`}>
                    {daphne6Interp.level}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {daphne6Interp.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="h-5 w-5 mr-2 text-medical-primary" />
                  {t('results.diagnostic')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-medical-primary mb-2">
                    {results.daphne40Score}/40
                  </div>
                  <div className={`text-lg font-medium ${daphne40Interp.color}`}>
                    {daphne40Interp.level}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {daphne40Interp.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Domain Breakdown */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-medical-primary" />
                {t('results.domain.analysis')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {domainDetails.map((domain) => {
                  const domainResponses = results.responses.filter(r => {
                    const item = getDaphneScaleItems('en').find(i => i.id === r.itemId);
                    return item?.domain === domain.key;
                  });
                  
                  const domainScore = domainResponses.reduce((sum, r) => sum + r.score, 0);
                  const hasSymptoms = domainResponses.some(r => r.score > 0);
                  
                  return (
                    <div key={domain.key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{domain.name}</h4>
                        <Badge variant={hasSymptoms ? "destructive" : "secondary"}>
                          {hasSymptoms ? t('results.present') : t('results.absent')}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-medical-primary">
                        {domainScore}/{domain.items * 4}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {domain.items} {domain.items > 1 ? t('clinical.items') : t('clinical.item')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Diagnostic Suggestion */}
          <Card className="shadow-card border-2 border-medical-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-medical-primary" />
                bvFTD Diagnostic Suggestion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  const daphne6Positive = results.daphne6Score >= 4;
                  const daphne40Positive = results.daphne40Score >= 15;
                  
                  if (daphne6Positive && daphne40Positive) {
                    return (
                      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                        <h4 className="font-semibold text-destructive mb-2 flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          High Likelihood of bvFTD
                        </h4>
                        <p className="text-sm text-foreground">
                          Both screening (DAPHNE-6: {results.daphne6Score} ≥4) and diagnostic (DAPHNE-40: {results.daphne40Score} ≥15) thresholds are met. This suggests a <strong>high likelihood of behavioral variant frontotemporal dementia (bvFTD)</strong>. Clinical correlation and further neurological evaluation are recommended.
                        </p>
                      </div>
                    );
                  } else if (daphne6Positive && !daphne40Positive) {
                    return (
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          Moderate Likelihood of bvFTD
                        </h4>
                        <p className="text-sm text-foreground">
                          The screening threshold is met (DAPHNE-6: {results.daphne6Score} ≥4, 92% sensitivity), but the diagnostic threshold is not reached (DAPHNE-40: {results.daphne40Score} &lt;15). This suggests <strong>moderate likelihood</strong> of bvFTD. Further assessment and clinical evaluation are recommended.
                        </p>
                      </div>
                    );
                  } else if (!daphne6Positive && daphne40Positive) {
                    return (
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          Atypical Presentation
                        </h4>
                        <p className="text-sm text-foreground">
                          The diagnostic threshold is met (DAPHNE-40: {results.daphne40Score} ≥15, 92% specificity), but the screening threshold is not (DAPHNE-6: {results.daphne6Score} &lt;4). This is an <strong>atypical presentation</strong> that warrants comprehensive clinical evaluation to rule out other conditions.
                        </p>
                      </div>
                    );
                  } else {
                    return (
                      <div className="bg-medical-success/10 border border-medical-success/30 rounded-lg p-4">
                        <h4 className="font-semibold text-medical-success mb-2 flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          Low Likelihood of bvFTD
                        </h4>
                        <p className="text-sm text-foreground">
                          Neither diagnostic threshold is met (DAPHNE-6: {results.daphne6Score} &lt;4, DAPHNE-40: {results.daphne40Score} &lt;15). This suggests a <strong>low likelihood of bvFTD</strong>. However, clinical judgment should be used in conjunction with these results.
                        </p>
                      </div>
                    );
                  }
                })()}
                <p className="text-xs text-muted-foreground italic">
                  Note: This is a screening tool suggestion based on validated thresholds. Final diagnosis must be made by a qualified healthcare professional considering the full clinical picture, neuroimaging, and other diagnostic criteria.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Notes */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>{t('results.clinical.notes')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">{t('results.scoring.method')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>{t('results.screening')}:</strong> {t('clinical.scoring.daphne6')}</li>
                    <li><strong>{t('results.diagnostic')}:</strong> {t('clinical.scoring.daphne40')}</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">{t('results.assessment.domains')}</h4>
                  <p className="text-muted-foreground">
                    {t('clinical.domains.description')}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Diagnostic Thresholds</h4>
                  <p className="text-muted-foreground">
                    DAPHNE-6 allowed bvFTD diagnosis (score ≥4) with a sensitivity of 92%, while DAPHNE-40 (score ≥15) had a specificity of 92%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handlePrint} variant="outline" size="lg">
              <Download className="h-4 w-4 mr-2" />
              {t('results.print')}
            </Button>
            <Button onClick={onRestart} size="lg" className="bg-medical-primary hover:bg-medical-primary/90">
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('results.new')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
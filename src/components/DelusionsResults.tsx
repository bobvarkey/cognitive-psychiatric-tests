import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DelusionResults } from '@/types/delusions';
import { AlertCircle, Brain, CheckCircle2, FileText, FileDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ClinicalContextTable } from './ClinicalContextTable';
import { delusionsScale } from '@/data/delusionsScale';
import { generatePdfReport } from '@/utils/reportGenerator';

interface DelusionsResultsProps {
  results: DelusionResults;
  onReset: () => void;
}

export const DelusionsResults = ({ results, onReset }: DelusionsResultsProps) => {
  const getSeverityLevel = () => {
    if (results.totalPresent === 0) return 'None';
    if (results.totalPresent <= 2) return 'Minimal';
    if (results.totalPresent <= 5) return 'Moderate';
    return 'Severe';
  };

  const getClinicalInterpretation = () => {
    const severity = getSeverityLevel();
    
    if (severity === 'None') {
      return 'No delusional symptoms were identified in this assessment.';
    }
    
    if (results.categoriesAffected.includes('Misidentification Syndromes')) {
      return 'Delusional misidentification syndromes detected. These rare conditions may suggest underlying neurological or psychiatric conditions requiring comprehensive evaluation.';
    }
    
    if (results.categoriesAffected.includes('Control & Influence Delusions')) {
      return 'Control and influence delusions (first-rank symptoms) detected. These symptoms are particularly significant in psychotic disorders and warrant immediate psychiatric evaluation.';
    }
    
    if (results.totalPresent >= 3 && results.categoriesAffected.length >= 2) {
      return 'Multiple delusional symptoms across different categories detected. Comprehensive psychiatric evaluation is strongly recommended.';
    }
    
    return 'Delusional symptoms detected. Clinical correlation and psychiatric evaluation are recommended to determine significance and appropriate intervention.';
  };

  const generateDisorderSummary = () => {
    const presentSymptoms = results.responses.filter(r => r.present);
    const delusionSymptoms = presentSymptoms.filter(r => {
      const item = delusionsScale.find(i => i.id === r.itemId);
      return item?.section === 'Delusions';
    });
    const hallucinationSymptoms = presentSymptoms.filter(r => {
      const item = delusionsScale.find(i => i.id === r.itemId);
      return item?.section === 'Hallucinations';
    });

    const getSeverityLabel = (severity?: number) => {
      if (!severity) return 'Unspecified';
      if (severity === 1) return 'Mild';
      if (severity === 2) return 'Moderate';
      return 'Severe';
    };

    return {
      delusionSymptoms,
      hallucinationSymptoms,
      getSeverityLabel
    };
  };

  const summary = generateDisorderSummary();

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Delusional Syndromes and Hallucinations Assessment Results
          </CardTitle>
          <CardDescription>Comprehensive evaluation summary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Symptoms Present</div>
              <div className="text-3xl font-bold">{results.totalPresent}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Severity Score</div>
              <div className="text-3xl font-bold">{results.severityScore}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Categories Affected</div>
              <div className="text-3xl font-bold">{results.categoriesAffected.length}</div>
            </div>
          </div>

          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">Overall Severity</div>
              <Badge variant={
                getSeverityLevel() === 'Severe' ? 'severe' :
                getSeverityLevel() === 'Moderate' ? 'moderate' :
                getSeverityLevel() === 'Minimal' ? 'mild' :
                'secondary'
              }>
                {getSeverityLevel()}
              </Badge>
            </div>
            <Progress 
              value={results.totalPresent > 0 ? Math.min((results.severityScore / (results.totalPresent * 3)) * 100, 100) : 0}
              className="h-2"
            />
            <div className="text-xs text-muted-foreground mt-2">
              Severity Score: {results.severityScore} / {results.totalPresent * 3}
            </div>
          </div>
        </CardContent>
      </Card>

      {results.totalPresent > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Patient Disorder Summary
              </CardTitle>
              <CardDescription>Comprehensive breakdown of identified symptoms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {summary.delusionSymptoms.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Delusions ({summary.delusionSymptoms.length})
                  </h3>
                  <div className="space-y-3">
                    {summary.delusionSymptoms.map((response) => {
                      const item = delusionsScale.find(i => i.id === response.itemId);
                      if (!item) return null;
                      return (
                        <div key={response.itemId} className="p-4 border rounded-lg bg-muted/30">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="font-medium text-foreground">{item.type}</div>
                              <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Category: {item.category}
                              </div>
                            </div>
                            <Badge variant={
                              response.severity === 3 ? 'severe' :
                              response.severity === 2 ? 'moderate' :
                              'mild'
                            }>
                              {summary.getSeverityLabel(response.severity)}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {summary.hallucinationSymptoms.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Hallucinations ({summary.hallucinationSymptoms.length})
                  </h3>
                  <div className="space-y-3">
                    {summary.hallucinationSymptoms.map((response) => {
                      const item = delusionsScale.find(i => i.id === response.itemId);
                      if (!item) return null;
                      return (
                        <div key={response.itemId} className="p-4 border rounded-lg bg-muted/30">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="font-medium text-foreground">{item.type}</div>
                              <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Category: {item.category}
                              </div>
                            </div>
                            <Badge variant={
                              response.severity === 3 ? 'severe' :
                              response.severity === 2 ? 'moderate' :
                              'mild'
                            }>
                              {summary.getSeverityLabel(response.severity)}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories Affected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.categoriesAffected.map((category, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-muted/30">
                    {category}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Clinical Interpretation</AlertTitle>
        <AlertDescription>
          {getClinicalInterpretation()}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Clinical Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <strong className="text-foreground">Assessment Scope:</strong>
            <p>This assessment evaluates presence and severity of delusional syndromes including misidentification syndromes, content-based delusions, control and influence delusions, grandiose and religious themes, somatic manifestations, and visual hallucinations in neurological and ophthalmological contexts.</p>
          </div>
          
          <div>
            <strong className="text-foreground">Clinical Significance:</strong>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Misidentification syndromes (Capgras, Fregoli) may indicate neurodegenerative or psychiatric conditions</li>
              <li>First-rank symptoms (thought broadcasting, insertion, withdrawal, control) are particularly significant in schizophrenia spectrum disorders</li>
              <li>Multiple delusions across categories suggest more severe psychotic presentation</li>
              <li>Severity ratings (mild, moderate, severe) reflect impact on functioning and conviction strength</li>
            </ul>
          </div>
          
          <div>
            <strong className="text-foreground">Important Considerations:</strong>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Delusional content should be evaluated in cultural and developmental context</li>
              <li>Distinguish between delusions, overvalued ideas, and culturally sanctioned beliefs</li>
              <li>Consider mood congruence in affective disorders</li>
              <li>Assess for bizarre versus non-bizarre content</li>
              <li>Evaluate degree of conviction, pervasiveness, and behavioral impact</li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <p className="text-destructive font-semibold">
              ⚠️ This assessment is a screening tool only. Comprehensive psychiatric evaluation, including mental status examination, detailed history, and medical workup, is essential for accurate diagnosis and treatment planning.
            </p>
          </div>
        </CardContent>
      </Card>

      <ClinicalContextTable />

      <div className="flex justify-center gap-4">
        <Button onClick={onReset} size="lg">
          Start New Assessment
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            const positiveFindings: string[] = [];
            const negativeFindings: string[] = [];
            const notAssessed: string[] = [];
            const getSevLabel = (s?: number) => s === 1 ? 'Mild' : s === 2 ? 'Moderate' : s === 3 ? 'Severe' : '';
            delusionsScale.forEach(item => {
              const response = results.responses.find(r => r.itemId === item.id);
              if (!response) {
                notAssessed.push(`${item.type} (${item.section} — ${item.category})`);
              } else if (response.present) {
                positiveFindings.push(`${item.type} — ${getSevLabel(response.severity)} (${item.section}, ${item.category})`);
              } else {
                negativeFindings.push(`${item.type} (${item.section} — ${item.category})`);
              }
            });
            generatePdfReport({
              assessmentName: 'Delusional Syndromes & Hallucinations Assessment',
              date: new Date().toLocaleDateString(),
              totalScore: `${results.totalPresent} symptoms present`,
              severity: getSeverityLevel(),
              interpretation: getClinicalInterpretation(),
              sections: [
                { title: 'Positive Findings (Symptoms Present)', items: positiveFindings, type: 'positive' },
                { title: 'Negative Findings (Symptoms Absent)', items: negativeFindings, type: 'negative' },
                { title: 'Items Not Assessed / Not Entered', items: notAssessed, type: 'not-assessed' },
              ],
              disclaimer: 'This assessment is a screening tool only. Comprehensive psychiatric evaluation is essential for accurate diagnosis and treatment planning.',
            });
          }}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>
    </div>
  );
};

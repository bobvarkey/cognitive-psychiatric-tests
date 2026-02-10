import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pcl5Result } from '@/types/pcl5';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertCircle, CheckCircle2, FileDown } from 'lucide-react';
import { generatePdfReport } from '@/utils/reportGenerator';

interface Pcl5ResultsProps {
  results: Pcl5Result;
  onReset: () => void;
}

export const Pcl5Results = ({ results, onReset }: Pcl5ResultsProps) => {
  const { language } = useLanguage();

  const getScoreColor = (score: number) => {
    if (score >= 3) return 'text-red-600';
    if (score >= 1) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'PCL-5 Results' : 'PCL-5 ഫലങ്ങൾ'}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              generatePdfReport({
                assessmentName: 'PCL-5 PTSD Screening',
                date: new Date().toLocaleDateString(),
                totalScore: `${results.totalScore}/5`,
                severity: results.probablePTSD ? 'Probable PTSD' : 'Below Clinical Threshold',
                interpretation: language === 'en' ? results.interpretation : results.interpretationMl,
                sections: [
                  { title: 'Screening Result', items: [
                    `Trauma Exposure: ${results.hasTraumaExposure ? 'Yes' : 'No'}`,
                    `Score: ${results.totalScore}/5 (cutoff: 3)`,
                    results.probablePTSD ? 'Screen positive for PTSD — further assessment recommended' : 'Below clinical threshold',
                  ], type: results.probablePTSD ? 'positive' : 'negative' },
                ],
                disclaimer: 'This is a screening tool, not a diagnostic instrument. Positive screens should be followed by a structured clinical interview.',
              });
            }}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={onReset} variant="outline">
            {language === 'en' ? 'New Assessment' : 'പുതിയ വിലയിരുത്തൽ'}
          </Button>
        </div>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>{language === 'en' ? 'Total Score' : 'മൊത്തം സ്കോർ'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`text-6xl font-bold ${getScoreColor(results.totalScore)}`}>
              {results.totalScore}
            </div>
            <div className="text-2xl text-muted-foreground mt-2">
              {language === 'en' ? 'out of 5' : '5-ൽ'}
            </div>
            {results.hasTraumaExposure && (
              <div className="mt-4">
                <span className={`text-xl font-semibold ${getScoreColor(results.totalScore)}`}>
                  {results.probablePTSD 
                    ? (language === 'en' ? 'Probable PTSD' : 'PTSD സാധ്യത')
                    : (language === 'en' ? 'Below Clinical Threshold' : 'ക്ലിനിക്കൽ പരിധിക്ക് താഴെ')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{language === 'en' ? 'Interpretation' : 'വ്യാഖ്യാനം'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {language === 'en' ? results.interpretation : results.interpretationMl}
          </p>
          
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">
              {language === 'en' ? 'Scoring Guidelines:' : 'സ്കോറിംഗ് മാർഗ്ഗനിർദ്ദേശങ്ങൾ:'}
            </p>
            <ul className="text-sm space-y-2 list-disc list-inside">
              <li>
                {language === 'en' 
                  ? 'Score range: 0-5 (count of "Yes" responses)'
                  : 'സ്കോർ പരിധി: 0-5 ("ഉണ്ട്" എന്ന പ്രതികരണങ്ങളുടെ എണ്ണം)'}
              </li>
              <li>
                {language === 'en'
                  ? 'Score of 3 or higher: Suggests probable PTSD, further assessment recommended'
                  : '3 അല്ലെങ്കിൽ അതിൽ കൂടുതൽ സ്കോർ: PTSD സാധ്യത സൂചിപ്പിക്കുന്നു, കൂടുതൽ വിലയിരുത്തൽ ശുപാർശ ചെയ്യുന്നു'}
              </li>
              <li>
                {language === 'en'
                  ? 'This is a screening tool, not a diagnostic instrument'
                  : 'ഇത് ഒരു സ്ക്രീനിംഗ് ഉപകരണമാണ്, രോഗനിർണയ ഉപകരണമല്ല'}
              </li>
              <li>
                {language === 'en'
                  ? 'Positive screens should be followed by a structured clinical interview'
                  : 'പോസിറ്റീവ് സ്ക്രീനുകൾക്ക് ശേഷം ക്രമീകൃത ക്ലിനിക്കൽ അഭിമുഖം നടത്തണം'}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

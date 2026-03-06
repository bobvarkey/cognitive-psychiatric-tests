import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { MMPI_ITEMS, getRiskLevel, SOMATIZATION_SCALES } from '@/data/mmpiScale';
import { MmpiResponse, MmpiResults } from '@/types/mmpi';
import { MmpiResults as MmpiResultsComponent } from '@/components/MmpiResults';
import { Brain, ArrowLeft, ArrowRight, Info, CheckCircle2, XCircle } from 'lucide-react';

interface MmpiAssessmentProps {
  onBack?: () => void;
}

export const MmpiAssessment = ({ onBack }: MmpiAssessmentProps) => {
  const { language } = useLanguage();
  const [responses, setResponses] = useState<MmpiResponse[]>(
    MMPI_ITEMS.map(item => ({ itemId: item.id, answer: null }))
  );
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<MmpiResults | null>(null);

  const handleAnswer = (itemId: string, answer: boolean) => {
    setResponses(prev => prev.map(r => r.itemId === itemId ? { ...r, answer } : r));
  };

  const handleSubmit = () => {
    const trueCount = responses.filter(r => r.answer === true).length;
    const risk = getRiskLevel(trueCount);
    const flaggedScales = responses
      .filter(r => r.answer === true)
      .map(r => {
        const item = MMPI_ITEMS.find(i => i.id === r.itemId);
        return item ? `${item.scaleAbbr} (${item.scale})` : r.itemId;
      });

    setResults({
      responses,
      trueCount,
      riskLevel: risk.level,
      actionRecommendation: language === 'ml' ? risk.actionMl : risk.action,
      flaggedScales,
    });
    setShowResults(true);
  };

  const handleReset = () => {
    setResponses(MMPI_ITEMS.map(item => ({ itemId: item.id, answer: null })));
    setShowResults(false);
    setResults(null);
  };

  if (showResults && results) {
    return <MmpiResultsComponent results={results} onReset={handleReset} onBack={onBack} />;
  }

  const answeredCount = responses.filter(r => r.answer !== null).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === 'ml' ? 'മെനുവിലേക്ക്' : 'Back to Menu'}
          </Button>
        )}

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
            <div className="flex items-center gap-3">
              <Brain className="h-10 w-10" />
              <div>
                <CardTitle className="text-2xl">MMPI Ultra-Short OPD Screener</CardTitle>
                <p className="text-violet-100 mt-1 text-sm">
                  {language === 'ml' ? '10 ശരി/തെറ്റ് ഇനങ്ങൾ (~5 മിനിറ്റ്) • കഴിഞ്ഞ 2 ആഴ്ചകളെ അടിസ്ഥാനമാക്കി' : '10 True/False items (~5 min) • Based on past 2 weeks'}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm">
            {language === 'ml'
              ? 'നിർദ്ദേശങ്ങൾ: കഴിഞ്ഞ 2 ആഴ്ചകളെ അടിസ്ഥാനമാക്കി ഓരോ പ്രസ്താവനയും ശരിയോ തെറ്റോ എന്ന് ഉത്തരം നൽകുക. ≥4 "ശരി" ഫ്ലാഗുകൾ → പൂർണ്ണ MMPI-2-RF റഫറൽ.'
              : 'Instructions: Answer each statement as True or False based on the past 2 weeks. Score ≥4 "True" flags → full MMPI-2-RF referral.'}
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {MMPI_ITEMS.map((item, index) => {
            const response = responses.find(r => r.itemId === item.id);
            return (
              <Card key={item.id} className="shadow-md border-0">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                          {item.scaleAbbr}
                        </span>
                        <span className="text-xs text-muted-foreground">{item.scale}</span>
                      </div>
                      <p className="text-foreground font-medium mb-3">
                        {language === 'ml' ? item.statementMl : item.statement}
                      </p>
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          variant={response?.answer === true ? 'default' : 'outline'}
                          className={response?.answer === true ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
                          onClick={() => handleAnswer(item.id, true)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          {language === 'ml' ? 'ശരി' : 'True'}
                        </Button>
                        <Button
                          size="sm"
                          variant={response?.answer === false ? 'default' : 'outline'}
                          className={response?.answer === false ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
                          onClick={() => handleAnswer(item.id, false)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          {language === 'ml' ? 'തെറ്റ്' : 'False'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="shadow-lg border-0 print:hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                {language === 'ml' ? `${answeredCount}/10 ഉത്തരം നൽകി` : `${answeredCount}/10 answered`}
              </span>
              <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 transition-all" style={{ width: `${(answeredCount / 10) * 100}%` }} />
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              {language === 'ml' ? 'ഫലങ്ങൾ കാണുക' : 'View Results'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

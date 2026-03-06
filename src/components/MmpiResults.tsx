import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { MmpiResults as MmpiResultsType } from '@/types/mmpi';
import { MMPI_ITEMS, getRiskLevel, SOMATIZATION_SCALES } from '@/data/mmpiScale';
import { generatePdfReport } from '@/utils/reportGenerator';
import { Brain, RotateCcw, Printer, AlertTriangle, CheckCircle2, Info, ArrowLeft, FileDown } from 'lucide-react';

interface MmpiResultsProps {
  results: MmpiResultsType;
  onReset: () => void;
  onBack?: () => void;
}

export const MmpiResults = ({ results, onReset, onBack }: MmpiResultsProps) => {
  const { language } = useLanguage();
  const risk = getRiskLevel(results.trueCount);

  const trueItems = results.responses.filter(r => r.answer === true).map(r => {
    const item = MMPI_ITEMS.find(i => i.id === r.itemId)!;
    return item;
  });

  const falseItems = results.responses.filter(r => r.answer === false).map(r => {
    const item = MMPI_ITEMS.find(i => i.id === r.itemId)!;
    return item;
  });

  const notAnswered = results.responses.filter(r => r.answer === null).map(r => {
    const item = MMPI_ITEMS.find(i => i.id === r.itemId)!;
    return item;
  });

  // Somatization flag
  const somatizationCount = trueItems.filter(i => SOMATIZATION_SCALES.includes(i.id)).length;
  const somatizationFlag = somatizationCount >= 2;

  const riskColor = risk.level === 'high' ? 'text-red-600' : risk.level === 'mild' ? 'text-orange-600' : 'text-green-600';
  const riskBg = risk.level === 'high' ? 'bg-red-50 border-red-200' : risk.level === 'mild' ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200';

  const handleExportPdf = () => {
    const positive = trueItems.map(i => `[${i.scaleAbbr}] ${language === 'ml' ? i.statementMl : i.statement}`);
    const negative = falseItems.map(i => `[${i.scaleAbbr}] ${language === 'ml' ? i.statementMl : i.statement}`);
    const notAssessed = notAnswered.map(i => `[${i.scaleAbbr}] ${language === 'ml' ? i.statementMl : i.statement}`);

    generatePdfReport({
      assessmentName: 'MMPI Ultra-Short OPD Screener',
      date: new Date().toLocaleDateString(),
      totalScore: `${results.trueCount}/10 True`,
      severity: language === 'ml' ? risk.labelMl : risk.label,
      interpretation: language === 'ml' ? risk.actionMl : risk.action,
      sections: [
        { title: 'Positive Findings (Endorsed as True)', items: positive.length > 0 ? positive : ['None endorsed'], type: 'positive' },
        { title: 'Negative Findings (Endorsed as False)', items: negative.length > 0 ? negative : ['None'], type: 'negative' },
        ...(notAssessed.length > 0 ? [{ title: 'Not Assessed (Unanswered)', items: notAssessed, type: 'not-assessed' as const }] : []),
        ...(somatizationFlag ? [{ title: 'Targeted Flag: Somatization Pattern', items: [`Hs + D + Hy somatization cluster: ${somatizationCount}/3 scales endorsed`], type: 'info' as const }] : []),
      ],
      disclaimer: 'Clinician use only; not diagnostic. Tally per scale for targeted flags (e.g., Hs+D+Hy = somatization).',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-4 print:hidden">
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
                <p className="text-violet-100 mt-1">{language === 'ml' ? 'ഫലങ്ങൾ' : 'Results'}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Score & Risk */}
        <Card className={`shadow-lg border-2 ${riskBg}`}>
          <CardContent className="p-6 text-center">
            <p className="text-5xl font-bold text-foreground">{results.trueCount}<span className="text-2xl text-muted-foreground">/10</span></p>
            <p className={`text-xl font-semibold mt-2 ${riskColor}`}>{language === 'ml' ? risk.labelMl : risk.label}</p>
            <p className="text-muted-foreground mt-1">{language === 'ml' ? risk.actionMl : risk.action}</p>
          </CardContent>
        </Card>

        {/* Somatization flag */}
        {somatizationFlag && (
          <Alert className="border-2 border-amber-300 bg-amber-50">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertDescription>
              <strong className="text-amber-800">{language === 'ml' ? 'സോമാറ്റൈസേഷൻ പാറ്റേൺ:' : 'Somatization Pattern:'}</strong>{' '}
              {language === 'ml'
                ? `Hs + D + Hy ക്ലസ്റ്റർ: ${somatizationCount}/3 സ്കെയിലുകൾ എൻഡോഴ്സ് ചെയ്തു.`
                : `Hs + D + Hy cluster: ${somatizationCount}/3 scales endorsed. Consider somatization workup.`}
            </AlertDescription>
          </Alert>
        )}

        {/* Positive Findings */}
        {trueItems.length > 0 && (
          <Card className="shadow-lg border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="text-red-600 text-lg">
                {language === 'ml' ? 'പോസിറ്റീവ് കണ്ടെത്തലുകൾ (ശരി)' : 'Positive Findings (Endorsed True)'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {trueItems.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-2 bg-red-50 rounded-lg">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 flex-shrink-0">{item.scaleAbbr}</span>
                  <span className="text-sm">{language === 'ml' ? item.statementMl : item.statement}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Negative Findings */}
        {falseItems.length > 0 && (
          <Card className="shadow-lg border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-green-600 text-lg">
                {language === 'ml' ? 'നെഗറ്റീവ് കണ്ടെത്തലുകൾ (തെറ്റ്)' : 'Negative Findings (Endorsed False)'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {falseItems.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-2 bg-green-50 rounded-lg">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-100 text-green-700 flex-shrink-0">{item.scaleAbbr}</span>
                  <span className="text-sm">{language === 'ml' ? item.statementMl : item.statement}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Not Assessed */}
        {notAnswered.length > 0 && (
          <Card className="shadow-lg border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="text-amber-600 text-lg">
                {language === 'ml' ? 'വിലയിരുത്തിയിട്ടില്ല (ഉത്തരം നൽകിയിട്ടില്ല)' : 'Not Assessed (Unanswered)'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {notAnswered.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-2 bg-amber-50 rounded-lg">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700 flex-shrink-0">{item.scaleAbbr}</span>
                  <span className="text-sm">{language === 'ml' ? item.statementMl : item.statement}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Scoring Table Reference */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">{language === 'ml' ? 'സ്കോറിംഗ് പട്ടിക' : 'Scoring Reference'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <p className="font-bold text-green-700">0–1</p>
                <p className="text-green-600 text-xs">{language === 'ml' ? 'കുറഞ്ഞ അപകടം' : 'Low Risk'}</p>
                <p className="text-muted-foreground text-xs">{language === 'ml' ? 'പതിവ് പരിശോധന' : 'Routine check'}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg text-center">
                <p className="font-bold text-orange-700">2–3</p>
                <p className="text-orange-600 text-xs">{language === 'ml' ? 'മിതമായ അപകടം' : 'Mild Risk'}</p>
                <p className="text-muted-foreground text-xs">{language === 'ml' ? 'നിരീക്ഷണം' : 'Monitor'}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg text-center">
                <p className="font-bold text-red-700">≥4</p>
                <p className="text-red-600 text-xs">{language === 'ml' ? 'ഉയർന്ന അപകടം' : 'High Risk'}</p>
                <p className="text-muted-foreground text-xs">{language === 'ml' ? 'അടിയന്തര റഫറൽ' : 'Urgent referral'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Alert className="border-2 border-amber-300 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription>
            <strong className="text-amber-800">{language === 'ml' ? 'പ്രധാനം:' : 'Important:'}</strong>{' '}
            {language === 'ml'
              ? 'ക്ലിനിഷ്യൻ ഉപയോഗത്തിന് മാത്രം; ഡയഗ്നോസ്റ്റിക് അല്ല. ടാർഗെറ്റഡ് ഫ്ലാഗുകൾക്കായി ഓരോ സ്കെയിലും കണക്കാക്കുക.'
              : 'Clinician use only; not diagnostic. Tally per scale for targeted flags (e.g., Hs+D+Hy = somatization).'}
          </AlertDescription>
        </Alert>

        {/* Actions */}
        <Card className="shadow-lg border-0 print:hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                {language === 'ml' ? 'പ്രിന്റ്' : 'Print'}
              </Button>
              <Button variant="outline" onClick={handleExportPdf} className="flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                Export PDF
              </Button>
              <Button onClick={onReset} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                {language === 'ml' ? 'പുതിയ വിലയിരുത്തൽ' : 'New Assessment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

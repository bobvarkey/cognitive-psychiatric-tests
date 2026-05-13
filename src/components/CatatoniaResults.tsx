import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { CatatoniaResults as CatatoniaResultsType } from '@/types/catatonia';
import { AlertTriangle, CheckCircle, Activity, ClipboardList } from 'lucide-react';
import { ExportButtons } from '@/components/ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface CatatoniaResultsProps {
  results: CatatoniaResultsType;
}

export const CatatoniaResults = ({ results }: CatatoniaResultsProps) => {
  const { language } = useLanguage();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'none': return 'bg-green-100 text-green-800 border-green-300';
      case 'mild': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'moderate': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'severe': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getSeverityLabel = (severity: string) => {
    const labels: Record<string, { en: string; ml: string }> = {
      none: { en: 'No Catatonia', ml: 'കാറ്ററ്റോണിയ ഇല്ല' },
      mild: { en: 'Mild Catatonia', ml: 'നേരിയ കാറ്ററ്റോണിയ' },
      moderate: { en: 'Moderate Catatonia', ml: 'മിതമായ കാറ്ററ്റോണിയ' },
      severe: { en: 'Severe Catatonia', ml: 'കടുത്ത കാറ്ററ്റോണിയ' }
    };
    return language === 'ml' ? labels[severity]?.ml : labels[severity]?.en;
  };

  const reportData: ReportData = useMemo(() => ({
    assessmentName: 'Bush Francis Catatonia Rating Scale',
    date: new Date().toLocaleDateString(),
    totalScore: `${results.totalScore}/69`,
    severity: results.severity.charAt(0).toUpperCase() + results.severity.slice(1),
    interpretation: results.interpretation,
    sections: [
      { title: 'Screening', items: [`Screening Score: ${results.screeningScore}/14 (${results.screeningPositive ? 'Screen Positive (≥2)' : 'Screen Negative'})`], type: 'info' },
      { title: 'Positive Findings', items: results.positiveItems.length > 0 ? results.positiveItems : ['None'], type: results.positiveItems.length > 0 ? 'positive' : 'info' },
      { title: 'Scoring Guide', items: ['Screening: ≥2 positive = Screen positive for catatonia', 'Severity: 0 = No catatonia, 1-10 = Mild, 11-20 = Moderate, >20 = Severe'], type: 'info' },
      { title: 'Recommendations', items: results.recommendations.length > 0 ? results.recommendations : ['None'], type: 'info' },
    ],
    disclaimer: 'This assessment is a screening tool only and not a diagnostic instrument.',
  }), [results]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Card */}
      <Card className="border-2 border-cyan-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            {language === 'ml' ? 'ബുഷ് ഫ്രാൻസിസ് കാറ്ററ്റോണിയ ഫലങ്ങൾ' : 'Bush Francis Catatonia Results'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Screening Score */}
            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-3xl font-bold text-amber-700">{results.screeningScore}</div>
              <div className="text-sm text-amber-600 mt-1">
                {language === 'ml' ? 'സ്ക്രീനിംഗ് സ്കോർ (14 ഇനങ്ങൾ)' : 'Screening Score (14 items)'}
              </div>
              <div className="flex items-center justify-center gap-1 mt-2">
                {results.screeningPositive ? (
                  <>
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-xs text-amber-600">
                      {language === 'ml' ? 'സ്ക്രീൻ പോസിറ്റീവ് (≥2)' : 'Screen Positive (≥2)'}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-green-600">
                      {language === 'ml' ? 'സ്ക്രീൻ നെഗറ്റീവ്' : 'Screen Negative'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Total Score */}
            <div className="text-center p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <div className="text-3xl font-bold text-cyan-700">{results.totalScore}</div>
              <div className="text-sm text-cyan-600 mt-1">
                {language === 'ml' ? 'മൊത്തം സ്കോർ (23 ഇനങ്ങൾ)' : 'Total Score (23 items)'}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                {language === 'ml' ? 'പരമാവധി: 69' : 'Maximum: 69'}
              </div>
            </div>

            {/* Severity */}
            <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
              <Badge className={`text-lg px-4 py-2 ${getSeverityColor(results.severity)}`}>
                {getSeverityLabel(results.severity)}
              </Badge>
              <div className="text-sm text-slate-600 mt-3">
                {language === 'ml' ? 'തീവ്രത' : 'Severity'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Positive Items */}
      {results.positiveItems.length > 0 && (
        <Card className="shadow-md">
          <CardHeader className="bg-slate-50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList className="h-5 w-5 text-cyan-600" />
              {language === 'ml' ? 'പോസിറ്റീവ് കണ്ടെത്തലുകൾ' : 'Positive Findings'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {results.positiveItems.map((item, index) => (
                <Badge key={index} variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interpretation */}
      <Card className="shadow-md">
        <CardHeader className="bg-slate-50">
          <CardTitle className="text-lg">
            {language === 'ml' ? 'വ്യാഖ്യാനം' : 'Interpretation'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-slate-700 leading-relaxed">
            {language === 'ml' ? results.interpretationMl : results.interpretation}
          </p>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="shadow-md">
        <CardHeader className="bg-slate-50">
          <CardTitle className="text-lg">
            {language === 'ml' ? 'ശുപാർശകൾ' : 'Recommendations'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ul className="space-y-2">
            {(language === 'ml' ? results.recommendationsMl : results.recommendations).map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <span className="text-slate-700">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Scoring Guide */}
      <Card className="shadow-md border-slate-200">
        <CardHeader className="bg-slate-100">
          <CardTitle className="text-lg text-slate-700">
            {language === 'ml' ? 'സ്കോറിംഗ് ഗൈഡ്' : 'Scoring Guide'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-sm text-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">
                {language === 'ml' ? 'സ്ക്രീനിംഗ് (14 ഇനങ്ങൾ):' : 'Screening (14 items):'}
              </h4>
              <ul className="space-y-1">
                <li>• {language === 'ml' ? '≥2 പോസിറ്റീവ് = കാറ്ററ്റോണിയയ്ക്ക് സ്ക്രീൻ പോസിറ്റീവ്' : '≥2 positive = Screen positive for catatonia'}</li>
                <li>• {language === 'ml' ? 'പൂർണ്ണ വിലയിരുത്തലിലേക്ക് പോകുക' : 'Proceed to full assessment'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">
                {language === 'ml' ? 'തീവ്രത (മൊത്തം സ്കോർ):' : 'Severity (Total Score):'}
              </h4>
              <ul className="space-y-1">
                <li>• {language === 'ml' ? '0: കാറ്ററ്റോണിയ ഇല്ല' : '0: No catatonia'}</li>
                <li>• {language === 'ml' ? '1-10: നേരിയ' : '1-10: Mild'}</li>
                <li>• {language === 'ml' ? '11-20: മിതമായ' : '11-20: Moderate'}</li>
                <li>• {language === 'ml' ? '>20: കടുത്ത' : '>20: Severe'}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Buttons */}
      <ExportButtons data={reportData} className="mt-4" />
    </div>
  );
};

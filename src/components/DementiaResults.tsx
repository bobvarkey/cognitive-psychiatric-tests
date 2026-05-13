import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { DementiaResults as DementiaResultsType } from '@/types/dementia';
import {
  ArrowLeft,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Brain,
  Hand,
  Activity,
  ClipboardList,
  FlaskConical,
  Lightbulb,
  Eye
} from 'lucide-react';
import { ExportButtons } from '@/components/ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface DementiaResultsProps {
  results: DementiaResultsType;
  onBack: () => void;
  onReset: () => void;
}

export const DementiaResults: React.FC<DementiaResultsProps> = ({ results, onBack, onReset }) => {
  const { language } = useLanguage();

  const getRiskBadge = () => {
    switch (results.riskLevel) {
      case 'low':
        return (
          <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
            <CheckCircle className="h-5 w-5 mr-2" />
            {language === 'ml' ? 'കുറഞ്ഞ അപകടസാധ്യത' : 'Low Risk'}
          </Badge>
        );
      case 'moderate':
        return (
          <Badge className="bg-amber-100 text-amber-800 text-lg px-4 py-2">
            <AlertCircle className="h-5 w-5 mr-2" />
            {language === 'ml' ? 'മിതമായ അപകടസാധ്യത' : 'Moderate Risk'}
          </Badge>
        );
      case 'high':
        return (
          <Badge className="bg-red-100 text-red-800 text-lg px-4 py-2">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {language === 'ml' ? 'ഉയർന്ന അപകടസാധ്യത' : 'High Risk'}
          </Badge>
        );
    }
  };

  const reportData: ReportData = useMemo(() => {
    const sections: ReportData['sections'] = [];

    if (results.behav5Score !== undefined) {
      sections.push({
        title: 'BEHAV5+ Score',
        items: [
          `Score: ${results.behav5Score}/6`,
          ...(results.behav5Positive.length > 0
            ? [`Positive findings: ${results.behav5Positive.join(', ')}`]
            : []),
        ],
        type: results.behav5Score >= 2 ? 'positive' : 'negative',
      });
    }

    if (results.iqcodeScore > 0) {
      sections.push({
        title: 'Short IQCODE Score',
        items: [
          `Score: ${results.iqcodeScore.toFixed(2)}`,
          `Interpretation: ${results.iqcodeInterpretation}`,
        ],
        type: 'info',
      });
    }

    if (results.vatScore !== undefined) {
      sections.push({
        title: 'VAT Score',
        items: [
          `Score: ${results.vatScore}/${results.vatMaxScore}`,
          results.vatScore >= 5
            ? 'Normal memory performance'
            : results.vatScore >= 3
              ? 'Mild memory impairment'
              : 'Significant memory impairment',
        ],
        type: results.vatScore >= 5 ? 'negative' : 'positive',
      });
    }

    const softSignItems: string[] = [];
    const sf = results.softSignsFindings;
    if (sf.mhd !== null) softSignItems.push(`Midline Hand Drift (MHD): ${sf.mhd}`);
    if (sf.sts !== null) softSignItems.push(`Shoulder Tapping Sign (STS): ${sf.sts}`);
    if (sf.hts !== null) softSignItems.push(`Head Turning Sign (HTS): ${sf.hts}`);
    if (sf.applause !== null) softSignItems.push(`Applause Sign: ${sf.applause}`);
    if (sf.glabellar !== null) softSignItems.push(`Glabellar Tap: ${sf.glabellar}`);
    if (sf.palmomental !== null) softSignItems.push(`Palmomental: ${sf.palmomental}`);
    if (sf.snout !== null) softSignItems.push(`Snout: ${sf.snout}`);
    if (softSignItems.length > 0) {
      sections.push({
        title: 'Soft Signs Findings',
        items: softSignItems,
        type: 'info',
      });
    }

    const examItems: string[] = [];
    const ce = results.clinicalExamFindings;
    if (ce.frontal.length > 0) examItems.push(`Frontal Lobe: ${ce.frontal.join(', ')}`);
    if (ce.temporal.length > 0) examItems.push(`Temporal Lobe: ${ce.temporal.join(', ')}`);
    if (ce.parietal.length > 0) examItems.push(`Parietal Lobe: ${ce.parietal.join(', ')}`);
    if (ce.occipital.length > 0) examItems.push(`Occipital Lobe: ${ce.occipital.join(', ')}`);
    if (ce.general.length > 0) examItems.push(`General: ${ce.general.join(', ')}`);
    if (examItems.length > 0) {
      sections.push({
        title: 'Clinical Examination Findings',
        items: examItems,
        type: 'positive',
      });
    }

    if (results.historyFindings.length > 0) {
      sections.push({
        title: 'History Findings',
        items: results.historyFindings,
        type: 'info',
      });
    }

    if (results.testsOrdered.length > 0) {
      sections.push({
        title: 'Tests Ordered',
        items: results.testsOrdered,
        type: 'info',
      });
    }

    if (results.recommendations.length > 0) {
      sections.push({
        title: 'Recommendations',
        items: results.recommendations,
        type: 'info',
      });
    }

    return {
      assessmentName: 'Dementia Evaluation',
      date: new Date().toLocaleDateString(),
      interpretation: results.interpretation,
      severity: results.riskLevel.charAt(0).toUpperCase() + results.riskLevel.slice(1),
      sections,
      disclaimer:
        'This assessment is a screening tool only and not a diagnostic instrument. Results should be interpreted in the context of a comprehensive clinical evaluation.',
    };
  }, [results]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 p-4 md:p-8">
      <LanguageToggle />
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === 'ml' ? 'തിരികെ' : 'Back'}
          </Button>
          <Button variant="outline" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {language === 'ml' ? 'പുതിയ വിലയിരുത്തൽ' : 'New Assessment'}
          </Button>
          <ExportButtons data={reportData} />
        </div>

        {/* Main Results Card */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="h-8 w-8 text-violet-600" />
              <CardTitle className="text-2xl font-bold text-violet-800">
                {language === 'ml' ? 'ഡിമെൻഷ്യ മൂല്യനിർണ്ണയ ഫലങ്ങൾ' : 'Dementia Evaluation Results'}
              </CardTitle>
            </div>
            {getRiskBadge()}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Interpretation */}
            <div className="bg-violet-50 p-4 rounded-lg">
              <p className="text-violet-800 font-medium">
                {language === 'ml' ? results.interpretationMl : results.interpretation}
              </p>
            </div>

            {/* BEHAV5+ Score */}
            <Card className="border border-violet-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-violet-600" />
                  {language === 'ml' ? 'BEHAV5+ സ്കോർ' : 'BEHAV5+ Score'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-violet-700 mb-2">
                  {results.behav5Score} / 6
                </div>
                {results.behav5Positive.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      {language === 'ml' ? 'പോസിറ്റീവ് കണ്ടെത്തലുകൾ:' : 'Positive findings:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {results.behav5Positive.map((item, index) => (
                        <Badge key={index} variant="secondary" className="bg-violet-100">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Short IQCODE Score */}
            <Card className="border border-teal-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-teal-600" />
                  {language === 'ml' ? 'ഷോർട്ട് IQCODE സ്കോർ' : 'Short IQCODE Score'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-teal-700 mb-2">
                  {results.iqcodeScore > 0 ? results.iqcodeScore.toFixed(2) : 'N/A'}
                </div>
                <p className="text-sm text-gray-600">
                  {language === 'ml' ? results.iqcodeInterpretationMl : results.iqcodeInterpretation}
                </p>
              </CardContent>
            </Card>

            {/* VAT Score */}
            <Card className="border border-cyan-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5 text-cyan-600" />
                  {language === 'ml' ? 'VAT സ്കോർ' : 'VAT Score'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-cyan-700 mb-2">
                  {results.vatScore} / {results.vatMaxScore}
                </div>
                <p className="text-sm text-gray-600">
                  {results.vatScore >= 5 
                    ? (language === 'ml' ? 'സാധാരണ ഓർമ്മ പ്രകടനം' : 'Normal memory performance')
                    : results.vatScore >= 3 
                      ? (language === 'ml' ? 'മിതമായ ഓർമ്മ പ്രശ്നം' : 'Mild memory impairment')
                      : (language === 'ml' ? 'ഗുരുതരമായ ഓർമ്മ പ്രശ്നം' : 'Significant memory impairment')}
                </p>
              </CardContent>
            </Card>

            {/* Soft Signs */}
            <Card className="border border-indigo-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hand className="h-5 w-5 text-indigo-600" />
                  {language === 'ml' ? 'സോഫ്റ്റ് സൈൻസ് കണ്ടെത്തലുകൾ' : 'Soft Signs Findings'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <Activity className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="font-medium">Midline Hand Drift (MHD)</p>
                      <Badge 
                        variant={results.softSignsFindings.mhd === 'positive' ? 'destructive' : 'secondary'}
                        className={results.softSignsFindings.mhd === null ? 'bg-gray-200' : ''}
                      >
                        {results.softSignsFindings.mhd === null 
                          ? (language === 'ml' ? 'വിലയിരുത്തിയിട്ടില്ല' : 'Not assessed')
                          : results.softSignsFindings.mhd === 'positive' 
                            ? (language === 'ml' ? 'പോസിറ്റീവ്' : 'Positive')
                            : (language === 'ml' ? 'നെഗറ്റീവ്' : 'Negative')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <Activity className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="font-medium">Shoulder Tapping Sign (STS)</p>
                      <Badge 
                        variant={results.softSignsFindings.sts === 'positive' ? 'destructive' : 'secondary'}
                        className={results.softSignsFindings.sts === null ? 'bg-gray-200' : ''}
                      >
                        {results.softSignsFindings.sts === null 
                          ? (language === 'ml' ? 'വിലയിരുത്തിയിട്ടില്ല' : 'Not assessed')
                          : results.softSignsFindings.sts === 'positive' 
                            ? (language === 'ml' ? 'പോസിറ്റീവ്' : 'Positive')
                            : (language === 'ml' ? 'നെഗറ്റീവ്' : 'Negative')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <Activity className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="font-medium">Head Turning Sign (HTS)</p>
                      <Badge 
                        variant={results.softSignsFindings.hts === 'positive' ? 'destructive' : 'secondary'}
                        className={results.softSignsFindings.hts === null ? 'bg-gray-200' : ''}
                      >
                        {results.softSignsFindings.hts === null 
                          ? (language === 'ml' ? 'വിലയിരുത്തിയിട്ടില്ല' : 'Not assessed')
                          : results.softSignsFindings.hts === 'positive' 
                            ? (language === 'ml' ? 'പോസിറ്റീവ്' : 'Positive')
                            : (language === 'ml' ? 'നെഗറ്റീവ്' : 'Negative')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <Activity className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="font-medium">{language === 'ml' ? 'അപ്ലോസ് സൈൻ' : 'Applause Sign'}</p>
                      <Badge 
                        variant={results.softSignsFindings.applause === 'positive' ? 'destructive' : 'secondary'}
                        className={results.softSignsFindings.applause === null ? 'bg-gray-200' : ''}
                      >
                        {results.softSignsFindings.applause === null 
                          ? (language === 'ml' ? 'വിലയിരുത്തിയിട്ടില്ല' : 'Not assessed')
                          : results.softSignsFindings.applause === 'positive' 
                            ? (language === 'ml' ? 'പോസിറ്റീവ്' : 'Positive')
                            : (language === 'ml' ? 'നെഗറ്റീവ്' : 'Negative')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <Activity className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="font-medium">{language === 'ml' ? 'ഗ്ലാബെല്ലാർ ടാപ്പ്' : 'Glabellar Tap'}</p>
                      <Badge 
                        variant={results.softSignsFindings.glabellar === 'positive' ? 'destructive' : 'secondary'}
                        className={results.softSignsFindings.glabellar === null ? 'bg-gray-200' : ''}
                      >
                        {results.softSignsFindings.glabellar === null 
                          ? (language === 'ml' ? 'വിലയിരുത്തിയിട്ടില്ല' : 'Not assessed')
                          : results.softSignsFindings.glabellar === 'positive' 
                            ? (language === 'ml' ? 'പോസിറ്റീവ്' : 'Positive')
                            : (language === 'ml' ? 'നെഗറ്റീവ്' : 'Negative')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <Activity className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="font-medium">{language === 'ml' ? 'പാൽമോമെന്റൽ' : 'Palmomental'}</p>
                      <Badge 
                        variant={results.softSignsFindings.palmomental === 'positive' ? 'destructive' : 'secondary'}
                        className={results.softSignsFindings.palmomental === null ? 'bg-gray-200' : ''}
                      >
                        {results.softSignsFindings.palmomental === null 
                          ? (language === 'ml' ? 'വിലയിരുത്തിയിട്ടില്ല' : 'Not assessed')
                          : results.softSignsFindings.palmomental === 'positive' 
                            ? (language === 'ml' ? 'പോസിറ്റീവ്' : 'Positive')
                            : (language === 'ml' ? 'നെഗറ്റീവ്' : 'Negative')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <Activity className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="font-medium">{language === 'ml' ? 'സ്നൗട്ട്' : 'Snout'}</p>
                      <Badge 
                        variant={results.softSignsFindings.snout === 'positive' ? 'destructive' : 'secondary'}
                        className={results.softSignsFindings.snout === null ? 'bg-gray-200' : ''}
                      >
                        {results.softSignsFindings.snout === null 
                          ? (language === 'ml' ? 'വിലയിരുത്തിയിട്ടില്ല' : 'Not assessed')
                          : results.softSignsFindings.snout === 'positive' 
                            ? (language === 'ml' ? 'പോസിറ്റീവ്' : 'Positive')
                            : (language === 'ml' ? 'നെഗറ്റീവ്' : 'Negative')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clinical Exam Findings */}
            {(results.clinicalExamFindings.frontal.length > 0 || 
              results.clinicalExamFindings.temporal.length > 0 ||
              results.clinicalExamFindings.parietal.length > 0 ||
              results.clinicalExamFindings.occipital.length > 0 ||
              results.clinicalExamFindings.general.length > 0) && (
              <Card className="border border-rose-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-rose-600" />
                    {language === 'ml' ? 'ക്ലിനിക്കൽ പരിശോധന കണ്ടെത്തലുകൾ' : 'Clinical Examination Findings'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.clinicalExamFindings.frontal.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-rose-700 mb-2">
                        {language === 'ml' ? 'ഫ്രണ്ടൽ ലോബ് സവിശേഷതകൾ:' : 'Frontal Lobe Features:'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {results.clinicalExamFindings.frontal.map((item, index) => (
                          <Badge key={index} variant="secondary" className="bg-rose-100">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {results.clinicalExamFindings.temporal.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-rose-700 mb-2">
                        {language === 'ml' ? 'ടെമ്പറൽ ലോബ് സവിശേഷതകൾ:' : 'Temporal Lobe Features:'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {results.clinicalExamFindings.temporal.map((item, index) => (
                          <Badge key={index} variant="secondary" className="bg-rose-100">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {results.clinicalExamFindings.parietal.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-rose-700 mb-2">
                        {language === 'ml' ? 'പാരൈറ്റൽ ലോബ് സവിശേഷതകൾ:' : 'Parietal Lobe Features:'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {results.clinicalExamFindings.parietal.map((item, index) => (
                          <Badge key={index} variant="secondary" className="bg-rose-100">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {results.clinicalExamFindings.occipital.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-rose-700 mb-2">
                        {language === 'ml' ? 'ഒക്‌സിപിറ്റൽ ലോബ് സവിശേഷതകൾ:' : 'Occipital Lobe Features:'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {results.clinicalExamFindings.occipital.map((item, index) => (
                          <Badge key={index} variant="secondary" className="bg-rose-100">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {results.clinicalExamFindings.general.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-rose-700 mb-2">
                        {language === 'ml' ? 'പൊതുവായ സവിശേഷതകൾ:' : 'General Features:'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {results.clinicalExamFindings.general.map((item, index) => (
                          <Badge key={index} variant="secondary" className="bg-rose-100">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* History Findings */}
            {results.historyFindings.length > 0 && (
              <Card className="border border-amber-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-amber-600" />
                    {language === 'ml' ? 'ഹിസ്റ്ററി കണ്ടെത്തലുകൾ' : 'History Findings'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {results.historyFindings.map((item, index) => (
                      <Badge key={index} variant="secondary" className="bg-amber-100">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tests Ordered */}
            {results.testsOrdered.length > 0 && (
              <Card className="border border-emerald-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FlaskConical className="h-5 w-5 text-emerald-600" />
                    {language === 'ml' ? 'ഓർഡർ ചെയ്ത ടെസ്റ്റുകൾ' : 'Tests Ordered'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {results.testsOrdered.map((test, index) => (
                      <Badge key={index} variant="secondary" className="bg-emerald-100">
                        {test}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            <Card className="border-2 border-violet-300 bg-violet-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-violet-600" />
                  {language === 'ml' ? 'ശുപാർശകൾ' : 'Recommendations'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(language === 'ml' ? results.recommendationsMl : results.recommendations).map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-violet-600 mt-1 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600">
              <p className="font-medium mb-1">
                {language === 'ml' ? 'ഡിസ്ക്ലെയിമർ:' : 'Disclaimer:'}
              </p>
              <p>
                {language === 'ml' 
                  ? 'ഈ വിലയിരുത്തൽ ഒരു സ്ക്രീനിംഗ് ടൂൾ മാത്രമാണ്, രോഗനിർണ്ണയ ഉപകരണമല്ല. ഫലങ്ങൾ സമഗ്രമായ ക്ലിനിക്കൽ വിലയിരുത്തലിന്റെ പശ്ചാത്തലത്തിൽ വ്യാഖ്യാനിക്കണം.'
                  : 'This assessment is a screening tool only and not a diagnostic instrument. Results should be interpreted in the context of a comprehensive clinical evaluation.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

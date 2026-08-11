import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdamResult, AdamDemographics } from '@/types/adam';
import { adamItems } from '@/data/adamScale';
import { useLanguage } from '@/contexts/LanguageContext';
import { Copy, Check, FileDown, Download } from 'lucide-react';
import { generatePdfReport, generateTextReport, downloadTextReport } from '@/utils/reportGenerator';
import { usePatientInfo } from '@/contexts/PatientInfoContext';
import { DomainRadarChart } from './DomainRadarChart';

interface AdamResultsProps {
  results: AdamResult;
  demographics: AdamDemographics;
  onReset: () => void;
}

export const AdamResults = ({ results, demographics, onReset }: AdamResultsProps) => {
  const { language } = useLanguage();
  const { getPatientInfoForReport } = usePatientInfo();
  const [copied, setCopied] = useState(false);

  const getSeverityColor = (severity: AdamResult['severity']) => {
    switch (severity) {
      case 'minimal': return 'text-green-600 dark:text-green-400';
      case 'mild': return 'text-yellow-600 dark:text-yellow-400';
      case 'moderate': return 'text-orange-600 dark:text-orange-400';
      case 'severe': return 'text-red-600 dark:text-red-400';
    }
  };

  const getSeverityLabel = (severity: AdamResult['severity']) => {
    const labels = {
      minimal: language === 'en' ? 'Minimal' : 'ഏറ്റവും കുറവ്',
      mild: language === 'en' ? 'Mild' : 'നേരിയ',
      moderate: language === 'en' ? 'Moderate' : 'മിതമായ',
      severe: language === 'en' ? 'Severe' : 'ഗുരുതരമായ',
    };
    return labels[severity];
  };

  const radarData = [
    { domain: language === 'en' ? 'Behavioural Apathy' : 'പെരുമാറ്റ അപാത്തി', score: results.domainScores.apathyBehavioural, maxScore: 3, fullMark: 100 },
    { domain: language === 'en' ? 'Social Apathy' : 'സാമൂഹിക അപാത്തി', score: results.domainScores.apathySocial, maxScore: 3, fullMark: 100 },
    { domain: language === 'en' ? 'Emotional Apathy' : 'വൈകാരിക അപാത്തി', score: results.domainScores.apathyEmotional, maxScore: 3, fullMark: 100 },
    { domain: language === 'en' ? 'Anhedonia' : 'അൻഹെഡോണിയ', score: results.domainScores.anhedonia, maxScore: 9, fullMark: 100 },
    { domain: language === 'en' ? 'Depression' : 'വിഷാദം', score: results.domainScores.depression, maxScore: 12, fullMark: 100 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'ADAM Assessment Results' : 'ADAM വിലയിരുത്തൽ ഫലങ്ങൾ'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Score */}
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">{results.totalScore}/30</div>
            <div className={`text-xl font-semibold ${getSeverityColor(results.severity)}`}>
              {getSeverityLabel(results.severity)}
            </div>
          </div>

          {/* Domain Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{results.apathyScore}/9</div>
              <div className="text-sm font-medium text-orange-700 dark:text-orange-300">
                {language === 'en' ? 'Apathy' : 'അപാത്തി'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                B:{results.domainScores.apathyBehavioural} S:{results.domainScores.apathySocial} E:{results.domainScores.apathyEmotional}
              </div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{results.anhedoniaScore}/9</div>
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {language === 'en' ? 'Anhedonia' : 'അൻഹെഡോണിയ'}
              </div>
            </div>
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-lg text-center">
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{results.depressionScore}/12</div>
              <div className="text-sm font-medium text-rose-700 dark:text-rose-300">
                {language === 'en' ? 'Depression' : 'വിഷാദം'}
              </div>
            </div>
          </div>

          {/* Interpretation */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              {language === 'en' ? 'Interpretation' : 'വ്യാഖ്യാനം'}
            </h3>
            <p className="text-sm">{results.interpretation}</p>
          </div>

          {/* Radar Chart */}
          <DomainRadarChart
            title={language === 'en' ? 'Domain Profile' : 'ഡൊമെയ്ൻ പ്രൊഫൈൽ'}
            data={radarData}
          />

          {/* Demographics Summary */}
          {(demographics.age || demographics.gender) && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">
                {language === 'en' ? 'Demographics' : 'ജനസംഖ്യാ വിവരങ്ങൾ'}
              </h3>
              <div className="text-sm space-y-1">
                {demographics.age && <p>{language === 'en' ? 'Age' : 'വയസ്സ്'}: {demographics.age}</p>}
                {demographics.gender && <p>{language === 'en' ? 'Gender' : 'ലിംഗം'}: {demographics.gender}</p>}
                {demographics.educationLevel && <p>{language === 'en' ? 'Education' : 'വിദ്യാഭ്യാസം'}: {demographics.educationLevel}</p>}
                {demographics.takingAntidepressants && <p>{language === 'en' ? 'Antidepressants' : 'ആന്റീഡിപ്രസന്റ്'}: {demographics.takingAntidepressants}</p>}
              </div>
            </div>
          )}

          {/* Item Breakdown */}
          <div>
            <h3 className="font-semibold mb-3">
              {language === 'en' ? 'Item Breakdown' : 'ഇനം വിശദാംശങ്ങൾ'}
            </h3>
            <div className="space-y-2">
              {results.responses.map((response) => {
                const item = adamItems.find((i) => i.id === response.itemId);
                if (!item) return null;
                const maxForItem = item.type === 'bdi' ? 3 : 3;
                return (
                  <div key={response.itemId} className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="text-sm flex-1">
                      <span className="font-medium">{item.id}.</span> {language === 'en' ? item.text : item.textMl}
                    </span>
                    <span className="font-bold ml-2">{response.score}/{maxForItem}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinical Note */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              {language === 'en' ? 'Clinical Note' : 'ക്ലിനിക്കൽ കുറിപ്പ്'}
            </h3>
            <p className="text-sm">
              {language === 'en'
                ? 'The ADAM dissociates apathy, depression, and anhedonia with high accuracy (AUC >0.90). Emotional apathy is uniquely negatively correlated with depression and is associated with reduced affective empathy. The domain profile should guide targeted intervention strategies.'
                : 'ADAM അപാത്തി, വിഷാദം, അൻഹെഡോണിയ എന്നിവയെ ഉയർന്ന കൃത്യതയോടെ (AUC >0.90) വേർതിരിക്കുന്നു. ഡൊമെയ്ൻ പ്രൊഫൈൽ ലക്ഷ്യബോധമുള്ള ചികിത്സാ തന്ത്രങ്ങളെ നയിക്കണം.'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={onReset} className="flex-1">
              {language === 'en' ? 'New Assessment' : 'പുതിയ വിലയിരുത്തൽ'}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                const positiveFindings: string[] = [];
                const negativeFindings: string[] = [];
                results.responses.forEach(r => {
                  const item = adamItems.find(i => i.id === r.itemId);
                  if (!item) return;
                  const label = language === 'en' ? item.text : item.textMl;
                  if (r.score >= 2) {
                    positiveFindings.push(`${label} (Score: ${r.score}/3)`);
                  } else {
                    negativeFindings.push(`${label} (Score: ${r.score}/3)`);
                  }
                });
                generatePdfReport({
                  assessmentName: 'Apathy, Depression and Anhedonia Measure (ADAM)',
                  date: new Date().toLocaleDateString(),
                  totalScore: `${results.totalScore}/30`,
                  severity: getSeverityLabel(results.severity),
                  interpretation: results.interpretation,
                  sections: [
                    { title: 'Elevated Items', items: positiveFindings, type: 'positive' },
                    { title: 'Low/Normal Items', items: negativeFindings, type: 'negative' },
                  ],
                  disclaimer: 'The ADAM is a screening instrument derived from machine learning. It does not substitute for a comprehensive clinical evaluation. Zhao et al. (2026) JNNP.',
                  patientInfo: getPatientInfoForReport(),
                });
              }}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const positiveFindings: string[] = [];
                  const negativeFindings: string[] = [];
                  results.responses.forEach(r => {
                    const item = adamItems.find(i => i.id === r.itemId);
                    if (!item) return;
                    const label = language === 'en' ? item.text : item.textMl;
                    if (r.score >= 2) {
                      positiveFindings.push(`${label} (Score: ${r.score}/3)`);
                    } else {
                      negativeFindings.push(`${label} (Score: ${r.score}/3)`);
                    }
                  });
                  const text = generateTextReport({
                    assessmentName: 'Apathy, Depression and Anhedonia Measure (ADAM)',
                    date: new Date().toLocaleDateString(),
                    totalScore: `${results.totalScore}/30`,
                    severity: getSeverityLabel(results.severity),
                    interpretation: results.interpretation,
                    sections: [
                      { title: 'Elevated Items', items: positiveFindings, type: 'positive' },
                      { title: 'Low/Normal Items', items: negativeFindings, type: 'negative' },
                    ],
                    disclaimer: 'The ADAM is a screening instrument derived from machine learning. It does not substitute for a comprehensive clinical evaluation. Zhao et al. (2026) JNNP.',
                    patientInfo: getPatientInfoForReport(),
                  });
                  await navigator.clipboard.writeText(text);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {}
              }}
              className="flex items-center gap-1.5"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy Text'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const positiveFindings: string[] = [];
                const negativeFindings: string[] = [];
                results.responses.forEach(r => {
                  const item = adamItems.find(i => i.id === r.itemId);
                  if (!item) return;
                  const label = language === 'en' ? item.text : item.textMl;
                  if (r.score >= 2) positiveFindings.push(`${label} (Score: ${r.score}/3)`);
                  else negativeFindings.push(`${label} (Score: ${r.score}/3)`);
                });
                downloadTextReport({
                  assessmentName: 'Apathy, Depression and Anhedonia Measure (ADAM)',
                  date: new Date().toLocaleDateString(),
                  totalScore: `${results.totalScore}/30`,
                  severity: getSeverityLabel(results.severity),
                  interpretation: results.interpretation,
                  sections: [
                    { title: 'Elevated Items', items: positiveFindings, type: 'positive' },
                    { title: 'Low/Normal Items', items: negativeFindings, type: 'negative' },
                  ],
                  disclaimer: 'The ADAM is a screening instrument derived from machine learning. It does not substitute for a comprehensive clinical evaluation. Zhao et al. (2026) JNNP.',
                  patientInfo: getPatientInfoForReport(),
                });
              }}
              className="flex items-center gap-1.5"
            >
              <Download className="h-4 w-4" />
              Download .txt
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* References */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'en' ? 'References' : 'റഫറൻസുകൾ'}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            Zhao, S.; Ye, R.; Sen, A.; Scholl, J.; Lockwood, P.; Li, M.; et al. On the relationships between apathy, depression and anhedonia. <em>Journal of Neurology, Neurosurgery & Psychiatry</em>. 2026. doi:10.1136/jnnp-2025-337245
          </p>
          <p className="text-xs text-muted-foreground">
            The ADAM was developed using data from seven datasets (N=4,578) and machine-learning feature selection to identify 10 core symptoms that maximally dissociate apathy, depression, and anhedonia (AUC &gt;0.90).
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

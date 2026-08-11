import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Pcl5ItemCard } from './Pcl5ItemCard';
import { Pcl5Results } from './Pcl5Results';
import { pcl5Items } from '@/data/pcl5Scale';
import { Pcl5Result } from '@/types/pcl5';
import { useLanguage } from '@/contexts/LanguageContext';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';
import { ProgressIndicator } from './ProgressIndicator';


const SYMPTOM_ITEMS = pcl5Items.filter(i => i.type === 'question');

export const Pcl5Assessment = () => {
  const [responses, setResponses] = useState<Map<number, number>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const { language } = useLanguage();

  const handleScoreChange = (itemId: number, score: number) => {
    const next = new Map(responses);
    next.set(itemId, score);
    setResponses(next);
  };

  const emptyResult = (): Pcl5Result => ({
    totalScore: 0,
    hasTraumaExposure: false,
    probablePTSD: false,
    clusterB: 0,
    clusterC: 0,
    clusterD: 0,
    clusterE: 0,
    meetsDsm5Pattern: false,
    interpretation: 'No trauma exposure reported. Assessment complete.',
    interpretationMl: 'ആഘാതകരമായ അനുഭവം റിപ്പോർട്ട് ചെയ്തിട്ടില്ല. വിലയിരുത്തൽ പൂർത്തിയായി.',
  });

  const calculateResults = (): Pcl5Result => {
    const hasTraumaExposure = responses.get(0) === 1;
    if (!hasTraumaExposure) return emptyResult();

    const sumIds = (ids: number[]) =>
      ids.reduce((s, id) => s + (responses.get(id) ?? 0), 0);
    const countIds = (ids: number[]) =>
      ids.reduce((s, id) => s + ((responses.get(id) ?? 0) >= 2 ? 1 : 0), 0);

    const B_IDS = [1, 2, 3, 4, 5];
    const C_IDS = [6, 7];
    const D_IDS = [8, 9, 10, 11, 12, 13, 14];
    const E_IDS = [15, 16, 17, 18, 19, 20];

    const clusterB = sumIds(B_IDS);
    const clusterC = sumIds(C_IDS);
    const clusterD = sumIds(D_IDS);
    const clusterE = sumIds(E_IDS);
    const totalScore = clusterB + clusterC + clusterD + clusterE;

    const meetsDsm5Pattern =
      countIds(B_IDS) >= 1 &&
      countIds(C_IDS) >= 1 &&
      countIds(D_IDS) >= 2 &&
      countIds(E_IDS) >= 2;

    const probablePTSD = totalScore >= 33 || meetsDsm5Pattern;

    let interpretation = '';
    let interpretationMl = '';
    if (totalScore < 20) {
      interpretation = 'Low symptom burden — PTSD unlikely at this time. Reassess if symptoms change.';
      interpretationMl = 'ലക്ഷണഭാരം കുറവാണ് — നിലവിൽ PTSD സാധ്യത കുറവാണ്. ലക്ഷണങ്ങൾ മാറിയാൽ വീണ്ടും വിലയിരുത്തുക.';
    } else if (totalScore < 33) {
      interpretation = 'Subthreshold PTSD symptoms. Clinical monitoring advised; consider full diagnostic interview if functional impairment is present.';
      interpretationMl = 'ഉപപരിധി PTSD ലക്ഷണങ്ങൾ. ക്ലിനിക്കൽ നിരീക്ഷണം ശുപാർശ ചെയ്യുന്നു; പ്രവർത്തന തകരാർ ഉണ്ടെങ്കിൽ പൂർണ്ണ രോഗനിർണയ അഭിമുഖം പരിഗണിക്കുക.';
    } else {
      interpretation = 'Score at or above the PCL-5 provisional cut-off (≥33). Probable PTSD — refer for a structured clinical interview (e.g., CAPS-5) and evidence-based treatment planning.';
      interpretationMl = 'PCL-5 പ്രൊവിഷണൽ കട്ട്-ഓഫിന് (≥33) മുകളിലാണ് സ്കോർ. PTSD സാധ്യത — ക്രമീകൃത ക്ലിനിക്കൽ അഭിമുഖത്തിനും ചികിത്സാ ആസൂത്രണത്തിനും റഫർ ചെയ്യുക.';
    }
    if (meetsDsm5Pattern) {
      interpretation += ' DSM-5 symptom cluster pattern is met (≥1 B, ≥1 C, ≥2 D, ≥2 E items rated ≥2).';
      interpretationMl += ' DSM-5 ലക്ഷണ ക്ലസ്റ്റർ പാറ്റേൺ പൂർത്തിയായി.';
    }

    return {
      totalScore,
      hasTraumaExposure: true,
      probablePTSD,
      clusterB,
      clusterC,
      clusterD,
      clusterE,
      meetsDsm5Pattern,
      interpretation,
      interpretationMl,
    };
  };

  const handleSubmit = () => setShowResults(true);
  const handleReset = () => {
    setResponses(new Map());
    setShowResults(false);
  };

  const traumaExposureAnswered = responses.has(0);
  const hasTraumaExposure = responses.get(0) === 1;
  const symptomAnswered = SYMPTOM_ITEMS.filter(i => responses.has(i.id)).length;
  const allItemsAnswered =
    traumaExposureAnswered && (!hasTraumaExposure || symptomAnswered === SYMPTOM_ITEMS.length);

  const answered = responses.size;
  const total = hasTraumaExposure ? 1 + SYMPTOM_ITEMS.length : 1;
  const progress = (answered / total) * 100;

  if (showResults) {
    return <Pcl5Results results={calculateResults()} onReset={handleReset} responses={responses} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 pt-16">
      <ProgressIndicator sections={[]} />
      <PatientInfoForm />

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {language === 'en'
              ? 'PTSD Checklist for DSM-5 (PCL-5)'
              : 'DSM-5-നുള്ള PTSD ചെക്ക്‌ലിസ്റ്റ് (PCL-5)'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {language === 'en'
              ? 'A 20-item self-report measure of DSM-5 PTSD symptoms. Rate how bothered you have been by each problem in the past month (0 = Not at all, 4 = Extremely). Item 0 screens for lifetime trauma exposure.'
              : 'DSM-5 PTSD ലക്ഷണങ്ങളുടെ 20-ഇനങ്ങളുള്ള സ്വയം റിപ്പോർട്ട് അളവ്. കഴിഞ്ഞ മാസത്തിൽ ഓരോ പ്രശ്നവും എത്രത്തോളം ബാധിച്ചു എന്ന് റേറ്റ് ചെയ്യുക (0 = ഒട്ടും ഇല്ല, 4 = അതികഠിനമായി).'}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{language === 'en' ? 'Progress' : 'പുരോഗതി'}</span>
              <span>{answered} / {total}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 colorful-questions">
        {pcl5Items.map((item) => {
          if (item.type === 'screening') {
            return (
              <Pcl5ItemCard
                key={item.id}
                item={item}
                value={responses.get(item.id)}
                onChange={(score) => handleScoreChange(item.id, score)}
              />
            );
          }
          if (hasTraumaExposure) {
            return (
              <Pcl5ItemCard
                key={item.id}
                item={item}
                value={responses.get(item.id)}
                onChange={(score) => handleScoreChange(item.id, score)}
              />
            );
          }
          return null;
        })}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Button onClick={handleSubmit} disabled={!allItemsAnswered} className="flex-1">
              {language === 'en' ? 'Calculate Results' : 'ഫലങ്ങൾ കണക്കാക്കുക'}
            </Button>
            <Button onClick={handleReset} variant="outline">
              {language === 'en' ? 'Reset' : 'പുനഃസജ്ജമാക്കുക'}
            </Button>
          </div>
          {!allItemsAnswered && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              {language === 'en'
                ? 'Please answer all applicable items to calculate results.'
                : 'ഫലങ്ങൾ കണക്കാക്കാൻ ബാധകമായ എല്ലാ ഇനങ്ങൾക്കും ഉത്തരം നൽകുക.'}
            </p>
          )}
        </CardContent>
      </Card>
      <AssessmentReference assessmentKey="pcl5" />
    </div>
  );
};

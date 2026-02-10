import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DpdrItemCard } from "./DpdrItemCard";
import { DpdrResults } from "./DpdrResults";
import { dpdrScale } from "@/data/dpdrScale";
import { DpdrResponse, DpdrResult } from "@/types/dpdr";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";

interface DpdrAssessmentProps {
  onBack: () => void;
}

export const DpdrAssessment = ({ onBack }: DpdrAssessmentProps) => {
  const [responses, setResponses] = useState<DpdrResponse[]>([]);
  const [results, setResults] = useState<DpdrResult | null>(null);
  const { language } = useLanguage();

  const handleScoreSelect = (itemId: number, score: number) => {
    setResponses(prev => {
      const existing = prev.find(r => r.itemId === itemId);
      if (existing) {
        return prev.map(r => r.itemId === itemId ? { ...r, score } : r);
      }
      return [...prev, { itemId, score }];
    });
  };

  const calculateResults = (): DpdrResult => {
    const totalScore = responses.reduce((sum, r) => sum + r.score, 0);
    
    const depersonalizationScore = responses
      .filter(r => {
        const item = dpdrScale.find(i => i.id === r.itemId);
        return item?.domain === 'depersonalization';
      })
      .reduce((sum, r) => sum + r.score, 0);
    
    const derealizationScore = responses
      .filter(r => {
        const item = dpdrScale.find(i => i.id === r.itemId);
        return item?.domain === 'derealization';
      })
      .reduce((sum, r) => sum + r.score, 0);
    
    const distressScore = responses
      .filter(r => {
        const item = dpdrScale.find(i => i.id === r.itemId);
        return item?.domain === 'distress';
      })
      .reduce((sum, r) => sum + r.score, 0);

    let severity: 'minimal' | 'mild' | 'moderate' | 'severe';
    let interpretation: string;
    let interpretationMl: string;

    if (totalScore <= 20) {
      severity = 'minimal';
      interpretation = 'Minimal symptoms of depersonalization-derealization. These experiences are within the normal range.';
      interpretationMl = 'വ്യക്തിത്വനഷ്ടം-യാഥാർത്ഥ്യനഷ്ടത്തിന്റെ ഏറ്റവും കുറഞ്ഞ ലക്ഷണങ്ങൾ. ഈ അനുഭവങ്ങൾ സാധാരണ പരിധിക്കുള്ളിലാണ്.';
    } else if (totalScore <= 40) {
      severity = 'mild';
      interpretation = 'Mild symptoms present. Some dissociative experiences that may warrant monitoring or discussion with a mental health professional.';
      interpretationMl = 'നേരിയ ലക്ഷണങ്ങൾ ഉണ്ട്. നിരീക്ഷണമോ മാനസികാരോഗ്യ വിദഗ്ധനുമായി ചർച്ച ചെയ്യലോ ആവശ്യമായേക്കാവുന്ന ചില വിഘടിത അനുഭവങ്ങൾ.';
    } else if (totalScore <= 60) {
      severity = 'moderate';
      interpretation = 'Moderate symptoms of depersonalization-derealization. Professional evaluation is recommended to assess impact on daily functioning.';
      interpretationMl = 'മദ്ധ്യമതലത്തിലുള്ള വ്യക്തിത്വനഷ്ടം-യാഥാർത്ഥ്യനഷ്ടത്തിന്റെ ലക്ഷണങ്ങൾ. ദൈനംദിന പ്രവർത്തനത്തിലുള്ള ആഘാതം വിലയിരുത്താൻ പ്രൊഫഷണൽ വിലയിരുത്തൽ ശുപാർശ ചെയ്യുന്നു.';
    } else {
      severity = 'severe';
      interpretation = 'Severe symptoms indicating significant distress. Immediate consultation with a mental health professional is strongly recommended.';
      interpretationMl = 'കാര്യമായ ദുരിതം സൂചിപ്പിക്കുന്ന ഗുരുതരമായ ലക്ഷണങ്ങൾ. ഒരു മാനസികാരോഗ്യ വിദഗ്ധനുമായി ഉടൻ കൂടിയാലോചിക്കുന്നത് ശക്തമായി ശുപാർശ ചെയ്യുന്നു.';
    }

    return {
      totalScore,
      depersonalizationScore,
      derealizationScore,
      distressScore,
      interpretation,
      interpretationMl,
      severity
    };
  };

  const handleSubmit = () => {
    if (responses.length === dpdrScale.length) {
      const calculatedResults = calculateResults();
      setResults(calculatedResults);
    }
  };

  const handleReset = () => {
    setResponses([]);
    setResults(null);
  };

  const isComplete = responses.length === dpdrScale.length;
  const progress = (responses.length / dpdrScale.length) * 100;

  if (results) {
    return <DpdrResults results={results} onReset={handleReset} onBack={onBack} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold">
            {language === 'en' 
              ? 'Depersonalization-Derealization Assessment' 
              : 'വ്യക്തിത്വനഷ്ടം-യാഥാർത്ഥ്യനഷ്ടം വിലയിരുത്തൽ'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {language === 'en'
              ? 'Based on DSM-5 diagnostic criteria for Depersonalization-Derealization Disorder'
              : 'വ്യക്തിത്വനഷ്ടം-യാഥാർത്ഥ്യനഷ്ടം ഡിസോർഡറിനുള്ള DSM-5 ഡയഗ്നോസ്റ്റിക് മാനദണ്ഡങ്ങളെ അടിസ്ഥാനമാക്കി'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Assessment Purpose' : 'വിലയിരുത്തലിന്റെ ഉദ്ദേശ്യം'}
          </CardTitle>
          <CardDescription>
            {language === 'en'
              ? 'This assessment screens for symptoms of depersonalization (feeling detached from self) and derealization (feeling that surroundings are unreal). Rate how frequently you experience each symptom over the past month.'
              : 'ഈ വിലയിരുത്തൽ വ്യക്തിത്വനഷ്ടം (സ്വയം വേർപിരിഞ്ഞു എന്ന് തോന്നൽ) യാഥാർത്ഥ്യനഷ്ടം (ചുറ്റുപാടുകൾ അയഥാർത്ഥമാണെന്ന് തോന്നൽ) എന്നിവയുടെ ലക്ഷണങ്ങൾ പരിശോധിക്കുന്നു. കഴിഞ്ഞ മാസത്തിൽ നിങ്ങൾ ഓരോ ലക്ഷണവും എത്ര തവണ അനുഭവിക്കുന്നുവെന്ന് വിലയിരുത്തുക.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                {language === 'en' ? 'Progress' : 'പുരോഗതി'}
              </span>
              <span className="text-muted-foreground">
                {responses.length} / {dpdrScale.length}
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {dpdrScale.map((item) => (
          <DpdrItemCard
            key={item.id}
            item={item}
            selectedScore={responses.find(r => r.itemId === item.id)?.score}
            onScoreSelect={handleScoreSelect}
          />
        ))}
      </div>

      <div className="flex gap-4 justify-end sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
        <Button variant="outline" onClick={handleReset} disabled={responses.length === 0}>
          {language === 'en' ? 'Reset' : 'പുനഃക്രമീകരിക്കുക'}
        </Button>
        <Button onClick={handleSubmit} disabled={!isComplete}>
          {language === 'en' ? 'Calculate Results' : 'ഫലങ്ങൾ കണക്കാക്കുക'}
        </Button>
      </div>
    </div>
  );
};

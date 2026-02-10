import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pcl5ItemCard } from './Pcl5ItemCard';
import { Pcl5Results } from './Pcl5Results';
import { pcl5Items } from '@/data/pcl5Scale';
import { Pcl5Result } from '@/types/pcl5';
import { useLanguage } from '@/contexts/LanguageContext';

export const Pcl5Assessment = () => {
  const [responses, setResponses] = useState<Map<number, number>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const { language } = useLanguage();

  const handleScoreChange = (itemId: number, score: number) => {
    const newResponses = new Map(responses);
    newResponses.set(itemId, score);
    setResponses(newResponses);
  };

  const calculateResults = (): Pcl5Result => {
    const traumaExposure = responses.get(0) === 1;
    
    if (!traumaExposure) {
      return {
        totalScore: 0,
        hasTraumaExposure: false,
        probablePTSD: false,
        interpretation: 'No trauma exposure reported. Assessment complete.',
        interpretationMl: 'ആഘാതകരമായ അനുഭവം റിപ്പോർട്ട് ചെയ്തിട്ടില്ല. വിലയിരുത്തൽ പൂർത്തിയായി.'
      };
    }

    let totalScore = 0;
    for (let i = 1; i <= 5; i++) {
      if (responses.get(i) === 1) {
        totalScore++;
      }
    }

    const probablePTSD = totalScore >= 3;

    let interpretation = '';
    let interpretationMl = '';

    if (totalScore === 0) {
      interpretation = 'Score indicates minimal PTSD symptoms. However, if symptoms are causing distress, further evaluation is recommended.';
      interpretationMl = 'സ്കോർ കുറഞ്ഞ PTSD ലക്ഷണങ്ങൾ സൂചിപ്പിക്കുന്നു. എന്നിരുന്നാലും, ലക്ഷണങ്ങൾ വിഷമം ഉണ്ടാക്കുന്നുണ്ടെങ്കിൽ, കൂടുതൽ വിലയിരുത്തൽ ശുപാർശ ചെയ്യുന്നു.';
    } else if (totalScore === 1 || totalScore === 2) {
      interpretation = 'Score indicates some PTSD symptoms. While below the clinical threshold, symptoms may still warrant clinical attention if causing distress or impairment.';
      interpretationMl = 'സ്കോർ ചില PTSD ലക്ഷണങ്ങൾ സൂചിപ്പിക്കുന്നു. ക്ലിനിക്കൽ പരിധിക്ക് താഴെയാണെങ്കിലും, വിഷമമോ തകരാറോ ഉണ്ടാക്കുന്നുണ്ടെങ്കിൽ ക്ലിനിക്കൽ ശ്രദ്ധ ആവശ്യമായി വന്നേക്കാം.';
    } else {
      interpretation = 'Score suggests probable PTSD. This screening result indicates that the individual should receive further assessment with a structured clinical interview. A score of 3-5 warrants professional evaluation for PTSD diagnosis and treatment planning.';
      interpretationMl = 'സ്കോർ PTSD സാധ്യത സൂചിപ്പിക്കുന്നു. ഈ സ്ക്രീനിംഗ് ഫലം വ്യക്തിക്ക് ക്രമീകൃത ക്ലിനിക്കൽ അഭിമുഖത്തോടെ കൂടുതൽ വിലയിരുത്തൽ ലഭിക്കേണ്ടതുണ്ടെന്ന് സൂചിപ്പിക്കുന്നു. 3-5 സ്കോർ PTSD രോഗനിർണയത്തിനും ചികിത്സാ ആസൂത്രണത്തിനും പ്രൊഫഷണൽ വിലയിരുത്തൽ ആവശ്യപ്പെടുന്നു.';
    }

    return {
      totalScore,
      hasTraumaExposure: true,
      probablePTSD,
      interpretation,
      interpretationMl
    };
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setResponses(new Map());
    setShowResults(false);
  };

  const traumaExposureAnswered = responses.has(0);
  const hasTraumaExposure = responses.get(0) === 1;
  const allItemsAnswered = traumaExposureAnswered && (
    !hasTraumaExposure || 
    (responses.has(1) && responses.has(2) && responses.has(3) && responses.has(4) && responses.has(5))
  );

  if (showResults) {
    return <Pcl5Results results={calculateResults()} onReset={handleReset} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {language === 'en' 
              ? 'Primary Care PTSD Screen for DSM-5 (PC-PTSD-5)' 
              : 'DSM-5-നുള്ള പ്രൈമറി കെയർ PTSD സ്ക്രീൻ (PC-PTSD-5)'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <p className="text-muted-foreground">
              {language === 'en'
                ? 'The PC-PTSD-5 is a 5-item screen designed to identify individuals with probable PTSD. This tool helps determine if further assessment is needed.'
                : 'PC-PTSD-5 എന്നത് PTSD ഉള്ള വ്യക്തികളെ തിരിച്ചറിയാൻ രൂപകൽപ്പന ചെയ്ത 5-ഇനങ്ങളുള്ള ഒരു സ്ക്രീനാണ്. കൂടുതൽ വിലയിരുത്തൽ ആവശ്യമുണ്ടോ എന്ന് നിർണ്ണയിക്കാൻ ഈ ഉപകരണം സഹായിക്കുന്നു.'}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {language === 'en' ? 'Progress:' : 'പുരോഗതി:'} {responses.size} / {hasTraumaExposure ? '6' : '1'}
            </span>
          </div>
        </CardContent>
      </Card>

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
        
        if (hasTraumaExposure && item.type === 'question') {
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

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={!allItemsAnswered}
              className="flex-1"
            >
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
    </div>
  );
};

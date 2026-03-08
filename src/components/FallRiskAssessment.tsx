import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { FallRiskResponse, FallRiskResult } from "@/types/fallRisk";
import { STEADI_ITEMS, MORSE_ITEMS, PHYSICAL_ASSESSMENTS, CATEGORY_LABELS, THREE_KEY_QUESTIONS } from "@/data/fallRiskScale";
import { SteadiItemCard, MorseItemCard, PhysicalAssessmentInput, BalanceTestCard } from "@/components/FallRiskItemCard";
import { FallRiskResults } from "@/components/FallRiskResults";
import { RotateCcw, Activity, Footprints, Stethoscope, HelpCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PatientInfoForm } from '@/components/PatientInfoForm';

interface FallRiskAssessmentProps {
  onBack: () => void;
}

export function FallRiskAssessment({ onBack }: FallRiskAssessmentProps) {
  const { language } = useLanguage();
  
  const [responses, setResponses] = useState<FallRiskResponse>({
    steadi: {},
    morse: {},
    tug: null,
    chairStand: null,
    balanceTest: { stage1: false, stage2: false, stage3: false, stage4: false },
    fallHistory: { fellPastYear: false, numberOfFalls: 0, wasInjured: false },
    threeKeyQuestions: { unsteady: false, worriedAboutFalling: false, fallenPastYear: false }
  });
  
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<FallRiskResult | null>(null);

  const handleSteadiChange = (id: string, value: boolean) => {
    setResponses(prev => ({
      ...prev,
      steadi: { ...prev.steadi, [id]: value }
    }));
  };

  const handleMorseChange = (id: string, value: number) => {
    setResponses(prev => ({
      ...prev,
      morse: { ...prev.morse, [id]: value }
    }));
  };

  const handleBalanceChange = (stage: string, value: boolean) => {
    setResponses(prev => ({
      ...prev,
      balanceTest: { ...prev.balanceTest, [stage]: value }
    }));
  };

  const handleThreeKeyChange = (key: keyof typeof responses.threeKeyQuestions, value: boolean) => {
    setResponses(prev => ({
      ...prev,
      threeKeyQuestions: { ...prev.threeKeyQuestions, [key]: value }
    }));
  };

  const calculateResults = (): FallRiskResult => {
    // STEADI Score
    let steadiScore = 0;
    STEADI_ITEMS.forEach(item => {
      if (responses.steadi[item.id]) {
        steadiScore += item.points;
      }
    });
    const steadiAtRisk = steadiScore >= 4;

    // Morse Score
    let morseScore = 0;
    MORSE_ITEMS.forEach(item => {
      if (responses.morse[item.id] !== undefined) {
        morseScore += responses.morse[item.id];
      }
    });
    
    let morseRiskLevel: 'no_risk' | 'low_risk' | 'high_risk';
    if (morseScore <= 24) {
      morseRiskLevel = 'no_risk';
    } else if (morseScore <= 50) {
      morseRiskLevel = 'low_risk';
    } else {
      morseRiskLevel = 'high_risk';
    }

    // TUG Assessment
    const tugAtRisk = responses.tug !== null && responses.tug >= 12;

    // Chair Stand (simplified - at risk if less than 8)
    const chairStandAtRisk = responses.chairStand !== null && responses.chairStand < 8;

    // Balance Test - at risk if can't complete all 4 stages
    const balanceAtRisk = !responses.balanceTest.stage1 || !responses.balanceTest.stage2 || 
                          !responses.balanceTest.stage3 || !responses.balanceTest.stage4;

    // Three Key Questions check
    const threeKeyPositive = responses.threeKeyQuestions.unsteady || 
                             responses.threeKeyQuestions.worriedAboutFalling || 
                             responses.threeKeyQuestions.fallenPastYear;

    // Overall Risk Level
    let overallRiskLevel: 'low' | 'moderate' | 'high';
    const riskFactors = [
      steadiAtRisk,
      morseRiskLevel === 'high_risk',
      tugAtRisk,
      chairStandAtRisk,
      balanceAtRisk,
      threeKeyPositive
    ].filter(Boolean).length;

    if (riskFactors >= 3 || morseRiskLevel === 'high_risk') {
      overallRiskLevel = 'high';
    } else if (riskFactors >= 1) {
      overallRiskLevel = 'moderate';
    } else {
      overallRiskLevel = 'low';
    }

    // Generate recommendations
    const recommendations: string[] = [];
    const recommendationsMl: string[] = [];

    if (steadiAtRisk || tugAtRisk || chairStandAtRisk || balanceAtRisk) {
      recommendations.push('Refer for physical therapy for gait and balance training');
      recommendationsMl.push('നടത്തവും ബാലൻസ് പരിശീലനത്തിനും ഫിസിക്കൽ തെറാപ്പിക്ക് റഫർ ചെയ്യുക');
      
      recommendations.push('Consider evidence-based exercise program (e.g., Tai Chi, Otago)');
      recommendationsMl.push('തെളിവ് അടിസ്ഥാനമാക്കിയ വ്യായാമ പരിപാടി പരിഗണിക്കുക (ഉദാ: തായ് ചി, ഒട്ടാഗോ)');
    }

    if (responses.steadi['medicine_lightheaded'] || responses.steadi['medicine_sleep_mood']) {
      recommendations.push('Review and optimize medications that may increase fall risk');
      recommendationsMl.push('വീഴ്ച അപകടസാധ്യത വർദ്ധിപ്പിക്കുന്ന മരുന്നുകൾ അവലോകനം ചെയ്ത് ഒപ്റ്റിമൈസ് ചെയ്യുക');
    }

    if (responses.steadi['lost_feeling_feet']) {
      recommendations.push('Assess for peripheral neuropathy; refer to podiatrist');
      recommendationsMl.push('പെരിഫറൽ ന്യൂറോപ്പതി വിലയിരുത്തുക; പോഡിയാട്രിസ്റ്റിലേക്ക് റഫർ ചെയ്യുക');
    }

    recommendations.push('Assess home environment for fall hazards');
    recommendationsMl.push('വീഴ്ച അപകടങ്ങൾക്കായി വീട്ടിലെ അന്തരീക്ഷം വിലയിരുത്തുക');

    recommendations.push('Recommend vitamin D supplementation (800-1000 IU daily)');
    recommendationsMl.push('വിറ്റാമിൻ D സപ്ലിമെന്റേഷൻ ശുപാർശ ചെയ്യുക (ദിവസേന 800-1000 IU)');

    recommendations.push('Schedule follow-up in 30-90 days');
    recommendationsMl.push('30-90 ദിവസത്തിനുള്ളിൽ ഫോളോ-അപ്പ് ഷെഡ്യൂൾ ചെയ്യുക');

    // Interpretation
    let interpretation: string;
    let interpretationMl: string;

    if (overallRiskLevel === 'high') {
      interpretation = 'Patient is at HIGH RISK for falls. Multiple risk factors identified. Implement comprehensive fall prevention interventions immediately. Consider multidisciplinary approach including PT, OT, medication review, and home safety assessment.';
      interpretationMl = 'രോഗി വീഴ്ചയ്ക്ക് ഉയർന്ന അപകടസാധ്യതയിലാണ്. ഒന്നിലധികം അപകട ഘടകങ്ങൾ കണ്ടെത്തി. സമഗ്രമായ വീഴ്ച പ്രതിരോധ ഇടപെടലുകൾ ഉടൻ നടപ്പിലാക്കുക. PT, OT, മരുന്ന് അവലോകനം, വീട്ടിലെ സുരക്ഷാ വിലയിരുത്തൽ എന്നിവ ഉൾപ്പെടെ മൾട്ടിഡിസിപ്ലിനറി സമീപനം പരിഗണിക്കുക.';
    } else if (overallRiskLevel === 'moderate') {
      interpretation = 'Patient is at MODERATE RISK for falls. Some risk factors identified. Implement standard fall prevention interventions and address specific risk factors. Monitor closely and reassess.';
      interpretationMl = 'രോഗി വീഴ്ചയ്ക്ക് മിതമായ അപകടസാധ്യതയിലാണ്. ചില അപകട ഘടകങ്ങൾ കണ്ടെത്തി. സ്റ്റാൻഡേർഡ് വീഴ്ച പ്രതിരോധ ഇടപെടലുകൾ നടപ്പിലാക്കുകയും പ്രത്യേക അപകട ഘടകങ്ങളെ അഭിസംബോധന ചെയ്യുകയും ചെയ്യുക. സൂക്ഷ്മമായി നിരീക്ഷിച്ച് വീണ്ടും വിലയിരുത്തുക.';
    } else {
      interpretation = 'Patient is at LOW RISK for falls. Continue routine care with education on fall prevention. Reassess annually or if clinical status changes.';
      interpretationMl = 'രോഗി വീഴ്ചയ്ക്ക് കുറഞ്ഞ അപകടസാധ്യതയിലാണ്. വീഴ്ച പ്രതിരോധത്തെക്കുറിച്ചുള്ള വിദ്യാഭ്യാസത്തോടെ പതിവ് പരിചരണം തുടരുക. വർഷത്തിലൊരിക്കൽ അല്ലെങ്കിൽ ക്ലിനിക്കൽ നില മാറിയാൽ വീണ്ടും വിലയിരുത്തുക.';
    }

    return {
      steadiScore,
      steadiAtRisk,
      morseScore,
      morseRiskLevel,
      tugAtRisk,
      chairStandAtRisk,
      balanceAtRisk,
      overallRiskLevel,
      recommendations,
      recommendationsMl,
      interpretation,
      interpretationMl
    };
  };

  const handleSubmit = () => {
    const calculatedResult = calculateResults();
    setResult(calculatedResult);
    setShowResults(true);
  };

  const handleReset = () => {
    setResponses({
      steadi: {},
      morse: {},
      tug: null,
      chairStand: null,
      balanceTest: { stage1: false, stage2: false, stage3: false, stage4: false },
      fallHistory: { fellPastYear: false, numberOfFalls: 0, wasInjured: false },
      threeKeyQuestions: { unsteady: false, worriedAboutFalling: false, fallenPastYear: false }
    });
    setShowResults(false);
    setResult(null);
  };

  if (showResults && result) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {language === 'ml' ? 'വീഴ്ച അപകട വിലയിരുത്തൽ ഫലങ്ങൾ' : 'Fall Risk Assessment Results'}
          </h2>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            {language === 'ml' ? 'പുനരാരംഭിക്കുക' : 'Start Over'}
          </Button>
        </div>
        <FallRiskResults result={result} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PatientInfoForm />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {language === 'ml' ? 'വീഴ്ച അപകട വിലയിരുത്തൽ' : 'Fall Risk Assessment'}
          </CardTitle>
          <CardDescription>
            {language === 'ml' 
              ? 'CDC STEADI അൽഗോരിതവും മോഴ്സ് ഫാൾ സ്കെയിലും ഉപയോഗിച്ചുള്ള സമഗ്ര വീഴ്ച അപകട വിലയിരുത്തൽ'
              : 'Comprehensive fall risk evaluation using CDC STEADI Algorithm and Morse Fall Scale'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Screening */}
      <Accordion type="single" collapsible className="mb-4">
        <AccordionItem value="quick-screen">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              {language === 'ml' ? 'ദ്രുത സ്ക്രീനിംഗ് (3 പ്രധാന ചോദ്യങ്ങൾ)' : 'Quick Screening (3 Key Questions)'}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-4 space-y-3">
                <p className="text-xs text-muted-foreground mb-3">
                  {language === 'ml' 
                    ? 'ഏതെങ്കിലും ചോദ്യത്തിന് "അതെ" എന്ന് ഉത്തരം നൽകിയാൽ രോഗി അപകടത്തിലാണ്'
                    : 'Patient is at risk if YES to any question'}
                </p>
                {Object.entries(THREE_KEY_QUESTIONS).map(([key, q]) => (
                  <div key={key} className="flex items-center gap-3">
                    <Checkbox
                      id={`three-key-${key}`}
                      checked={responses.threeKeyQuestions[key as keyof typeof responses.threeKeyQuestions]}
                      onCheckedChange={(checked) => 
                        handleThreeKeyChange(key as keyof typeof responses.threeKeyQuestions, checked === true)
                      }
                    />
                    <Label htmlFor={`three-key-${key}`} className="text-sm cursor-pointer">
                      {language === 'ml' ? q.questionMl : q.question}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Tabs defaultValue="steadi" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="steadi" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">STEADI</span>
          </TabsTrigger>
          <TabsTrigger value="morse" className="flex items-center gap-1">
            <Footprints className="h-4 w-4" />
            <span className="hidden sm:inline">Morse</span>
          </TabsTrigger>
          <TabsTrigger value="physical" className="flex items-center gap-1">
            <Stethoscope className="h-4 w-4" />
            <span className="hidden sm:inline">{language === 'ml' ? 'ശാരീരിക' : 'Physical'}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="steadi" className="mt-4">
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {language === 'ml' ? CATEGORY_LABELS.steadi.ml : CATEGORY_LABELS.steadi.en}
              </CardTitle>
              <CardDescription>
                {language === 'ml' 
                  ? 'സ്കോർ ≥4 ആണെങ്കിൽ അപകടത്തിലാണ്. ബാധകമായ എല്ലാ ഇനങ്ങളും ടിക്ക് ചെയ്യുക.'
                  : 'At risk if score ≥4. Check all items that apply.'}
              </CardDescription>
            </CardHeader>
          </Card>
          {STEADI_ITEMS.map((item, index) => (
            <SteadiItemCard
              key={item.id}
              item={item}
              value={responses.steadi[item.id]}
              onChange={(value) => handleSteadiChange(item.id, value)}
              index={index}
            />
          ))}
        </TabsContent>

        <TabsContent value="morse" className="mt-4">
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {language === 'ml' ? CATEGORY_LABELS.morse.ml : CATEGORY_LABELS.morse.en}
              </CardTitle>
              <CardDescription>
                {language === 'ml' 
                  ? '0-24: അപകടസാധ്യത ഇല്ല | 25-50: കുറഞ്ഞ അപകടസാധ്യത | 51+: ഉയർന്ന അപകടസാധ്യത'
                  : '0-24: No Risk | 25-50: Low Risk | 51+: High Risk'}
              </CardDescription>
            </CardHeader>
          </Card>
          {MORSE_ITEMS.map((item) => (
            <MorseItemCard
              key={item.id}
              item={item}
              value={responses.morse[item.id]}
              onChange={(value) => handleMorseChange(item.id, value)}
            />
          ))}
        </TabsContent>

        <TabsContent value="physical" className="mt-4">
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {language === 'ml' ? CATEGORY_LABELS.physical.ml : CATEGORY_LABELS.physical.en}
              </CardTitle>
              <CardDescription>
                {language === 'ml' 
                  ? 'നടത്തം, ശക്തി, ബാലൻസ് എന്നിവയുടെ ഒബ്ജക്റ്റീവ് വിലയിരുത്തലുകൾ'
                  : 'Objective assessments of gait, strength, and balance'}
              </CardDescription>
            </CardHeader>
          </Card>

          <PhysicalAssessmentInput
            label={PHYSICAL_ASSESSMENTS.tug.name}
            labelMl={PHYSICAL_ASSESSMENTS.tug.nameMl}
            description={PHYSICAL_ASSESSMENTS.tug.description}
            descriptionMl={PHYSICAL_ASSESSMENTS.tug.descriptionMl}
            value={responses.tug}
            onChange={(value) => setResponses(prev => ({ ...prev, tug: value }))}
            unit={language === 'ml' ? 'സെക്കന്റ്' : 'seconds'}
            placeholder="≥12 = at risk"
          />

          <PhysicalAssessmentInput
            label={PHYSICAL_ASSESSMENTS.chairStand.name}
            labelMl={PHYSICAL_ASSESSMENTS.chairStand.nameMl}
            description={PHYSICAL_ASSESSMENTS.chairStand.description}
            descriptionMl={PHYSICAL_ASSESSMENTS.chairStand.descriptionMl}
            value={responses.chairStand}
            onChange={(value) => setResponses(prev => ({ ...prev, chairStand: value }))}
            unit={language === 'ml' ? 'തവണ' : 'times'}
            placeholder="<8 = at risk"
          />

          <BalanceTestCard
            stages={PHYSICAL_ASSESSMENTS.balanceTest.stages}
            values={responses.balanceTest}
            onChange={handleBalanceChange}
          />
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack}>
          {language === 'ml' ? 'മെനുവിലേക്ക് മടങ്ങുക' : 'Back to Menu'}
        </Button>
        <Button onClick={handleSubmit} className="flex-1">
          {language === 'ml' ? 'ഫലങ്ങൾ കണക്കാക്കുക' : 'Calculate Results'}
        </Button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { AdamItemCard } from './AdamItemCard';
import { AdamResults } from './AdamResults';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adamItems } from '@/data/adamScale';
import { AdamDemographics, AdamResponse, AdamResult } from '@/types/adam';
import { useLanguage } from '@/contexts/LanguageContext';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { ClipboardList } from 'lucide-react';
import { AssessmentReference } from '@/components/AssessmentReference';

interface AdamAssessmentProps {
  onBack?: () => void;
}

export const AdamAssessment = ({ onBack: _onBack }: AdamAssessmentProps) => {
  const [responses, setResponses] = useState<Map<number, number>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const [demographics, setDemographics] = useState<AdamDemographics>({
    age: '', gender: '', educationLevel: '', yearsOfEducation: '', takingAntidepressants: '',
  });
  const { language } = useLanguage();

  const handleScoreChange = (itemId: number, score: number) => {
    setResponses(new Map(responses.set(itemId, score)));
  };

  const calculateResults = (): AdamResult => {
    const formattedResponses: AdamResponse[] = Array.from(responses.entries()).map(
      ([itemId, score]) => ({ itemId, score })
    );

    const totalScore = formattedResponses.reduce((sum, r) => sum + r.score, 0);

    const domainScores = {
      apathyBehavioural: responses.get(1) ?? 0,
      apathySocial: responses.get(2) ?? 0,
      apathyEmotional: responses.get(3) ?? 0,
      anhedonia: (responses.get(4) ?? 0) + (responses.get(5) ?? 0) + (responses.get(6) ?? 0),
      depression: (responses.get(7) ?? 0) + (responses.get(8) ?? 0) + (responses.get(9) ?? 0) + (responses.get(10) ?? 0),
    };

    const apathyScore = domainScores.apathyBehavioural + domainScores.apathySocial + domainScores.apathyEmotional;
    const anhedoniaScore = domainScores.anhedonia;
    const depressionScore = domainScores.depression;

    let severity: AdamResult['severity'];
    let interpretation: string;

    if (totalScore <= 5) {
      severity = 'minimal';
      interpretation = 'Minimal symptoms across apathy, depression, and anhedonia domains. No significant clinical concern.';
    } else if (totalScore <= 12) {
      severity = 'mild';
      interpretation = 'Mild symptom burden. Consider monitoring over time and exploring individual domain profiles for targeted assessment.';
    } else if (totalScore <= 20) {
      severity = 'moderate';
      interpretation = 'Moderate symptom levels. Domain-level analysis recommended to distinguish between apathy, depression, and anhedonia for appropriate intervention.';
    } else {
      severity = 'severe';
      interpretation = 'Elevated symptom levels across multiple domains. Comprehensive clinical evaluation recommended. The ADAM domain profile can guide targeted treatment planning.';
    }

    return {
      responses: formattedResponses,
      totalScore,
      apathyScore,
      depressionScore,
      anhedoniaScore,
      domainScores,
      interpretation,
      severity,
    };
  };

  const handleSubmit = () => {
    if (responses.size === adamItems.length) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setResponses(new Map());
    setShowResults(false);
    setDemographics({ age: '', gender: '', educationLevel: '', yearsOfEducation: '', takingAntidepressants: '' });
  };

  const allItemsAnswered = responses.size === adamItems.length;

  if (showResults) {
    return <AdamResults results={calculateResults()} demographics={demographics} onReset={handleReset} />;
  }

  const likertItems = adamItems.filter(i => i.type === 'likert');
  const bdiItems = adamItems.filter(i => i.type === 'bdi');

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold">
            {language === 'en' ? 'ADAM' : 'ADAM'}
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          {language === 'en'
            ? 'Apathy, Depression and Anhedonia Measure'
            : 'അപാത്തി, വിഷാദം, അൻഹെഡോണിയ അളവ്'}
        </p>
        <div className="mt-4 p-4 bg-muted rounded-lg text-sm space-y-1">
          <p><strong>{language === 'en' ? 'Purpose:' : 'ഉദ്ദേശ്യം:'}</strong> {language === 'en' ? 'Brief 10-item instrument to dissociate apathy, depression, and anhedonia using machine-learning-derived core symptoms.' : 'മെഷീൻ ലേണിംഗ് ഉപയോഗിച്ച് അപാത്തി, വിഷാദം, അൻഹെഡോണിയ എന്നിവ വേർതിരിക്കുന്ന 10-ഇനം ഉപകരണം.'}</p>
          <p><strong>{language === 'en' ? 'Scoring:' : 'സ്കോറിംഗ്:'}</strong> {language === 'en' ? 'Total score 0–30. Items 1–8 use a 4-point Likert scale; Items 9–10 use BDI-style descriptors.' : 'ആകെ സ്കോർ 0–30. ഇനങ്ങൾ 1–8 ലിക്കർട്ട് സ്കെയിൽ; ഇനങ്ങൾ 9–10 BDI ശൈലി.'}</p>
        </div>
      </div>

      <PatientInfoForm />

      {/* Demographics */}
      <Card className="mb-6 mt-4">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            {language === 'en' ? 'Demographics (Optional)' : 'ജനസംഖ്യാ വിവരങ്ങൾ (ഓപ്ഷണൽ)'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">{language === 'en' ? 'Age' : 'വയസ്സ്'}</Label>
              <Input
                type="number"
                placeholder={language === 'en' ? 'Age' : 'വയസ്സ്'}
                value={demographics.age}
                onChange={(e) => setDemographics({ ...demographics, age: e.target.value })}
                className="h-9 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">{language === 'en' ? 'Gender' : 'ലിംഗം'}</Label>
              <Select value={demographics.gender} onValueChange={(v) => setDemographics({ ...demographics, gender: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder={language === 'en' ? 'Select' : 'തിരഞ്ഞെടുക്കുക'} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{language === 'en' ? 'Male' : 'പുരുഷൻ'}</SelectItem>
                  <SelectItem value="female">{language === 'en' ? 'Female' : 'സ്ത്രീ'}</SelectItem>
                  <SelectItem value="other">{language === 'en' ? 'Other' : 'മറ്റ്'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">{language === 'en' ? 'Education Level' : 'വിദ്യാഭ്യാസ നിലവാരം'}</Label>
              <Select value={demographics.educationLevel} onValueChange={(v) => setDemographics({ ...demographics, educationLevel: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder={language === 'en' ? 'Select' : 'തിരഞ്ഞെടുക്കുക'} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{language === 'en' ? 'No formal education' : 'ഔപചാരിക വിദ്യാഭ്യാസമില്ല'}</SelectItem>
                  <SelectItem value="primary">{language === 'en' ? 'Primary school' : 'പ്രൈമറി സ്കൂൾ'}</SelectItem>
                  <SelectItem value="secondary">{language === 'en' ? 'Secondary school' : 'സെക്കൻഡറി സ്കൂൾ'}</SelectItem>
                  <SelectItem value="college">{language === 'en' ? 'College/University' : 'കോളേജ്/യൂണിവേഴ്സിറ്റി'}</SelectItem>
                  <SelectItem value="postgraduate">{language === 'en' ? 'Postgraduate' : 'ബിരുദാനന്തര'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">{language === 'en' ? 'Years of Education' : 'വിദ്യാഭ്യാസ വർഷങ്ങൾ'}</Label>
              <Input
                type="number"
                placeholder={language === 'en' ? 'Years' : 'വർഷങ്ങൾ'}
                value={demographics.yearsOfEducation}
                onChange={(e) => setDemographics({ ...demographics, yearsOfEducation: e.target.value })}
                className="h-9 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">{language === 'en' ? 'Taking Antidepressants?' : 'ആന്റീഡിപ്രസന്റ് കഴിക്കുന്നുണ്ടോ?'}</Label>
              <Select value={demographics.takingAntidepressants} onValueChange={(v) => setDemographics({ ...demographics, takingAntidepressants: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder={language === 'en' ? 'Select' : 'തിരഞ്ഞെടുക്കുക'} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">{language === 'en' ? 'Yes' : 'അതെ'}</SelectItem>
                  <SelectItem value="no">{language === 'en' ? 'No' : 'ഇല്ല'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 1: Likert items */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">
          {language === 'en'
            ? 'Which option best describes you over the last two weeks, including today?'
            : 'കഴിഞ്ഞ രണ്ടാഴ്ചയിൽ, ഇന്ന് ഉൾപ്പെടെ, നിങ്ങളെ ഏറ്റവും നന്നായി വിവരിക്കുന്ന ഓപ്ഷൻ ഏതാണ്?'}
        </h2>
      </div>

      <div className="space-y-4 colorful-questions">
        {likertItems.map((item) => (
          <AdamItemCard
            key={item.id}
            item={item}
            value={responses.get(item.id)}
            onChange={(score) => handleScoreChange(item.id, score)}
          />
        ))}
      </div>

      {/* Section 2: BDI-style items */}
      <div className="mb-4 mt-8">
        <h2 className="text-lg font-semibold mb-1">
          {language === 'en'
            ? 'Please pick the statement that best describes how you have been feeling during the past two weeks, including today.'
            : 'കഴിഞ്ഞ രണ്ടാഴ്ചയിൽ, ഇന്ന് ഉൾപ്പെടെ, നിങ്ങൾ എങ്ങനെ അനുഭവിക്കുന്നു എന്ന് ഏറ്റവും നന്നായി വിവരിക്കുന്ന പ്രസ്താവന തിരഞ്ഞെടുക്കുക.'}
        </h2>
      </div>

      <div className="space-y-4 colorful-questions">
        {bdiItems.map((item) => (
          <AdamItemCard
            key={item.id}
            item={item}
            value={responses.get(item.id)}
            onChange={(score) => handleScoreChange(item.id, score)}
          />
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        <Button
          onClick={handleSubmit}
          disabled={!allItemsAnswered}
          className="flex-1"
        >
          {language === 'en' ? 'Calculate Results' : 'ഫലങ്ങൾ കണക്കാക്കുക'}
        </Button>
        <Button onClick={handleReset} variant="outline">
          {language === 'en' ? 'Reset' : 'പുനഃക്രമീകരിക്കുക'}
        </Button>
      </div>

      {!allItemsAnswered && (
        <p className="text-sm text-muted-foreground text-center mt-4">
          {language === 'en'
            ? `Please answer all 10 items (${responses.size}/10 completed)`
            : `എല്ലാ 10 ഇനങ്ങൾക്കും ഉത്തരം നൽകുക (${responses.size}/10 പൂർത്തിയായി)`}
        </p>
      )}
      <AssessmentReference assessmentKey="adam" />

    </div>
  );
};

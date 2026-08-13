import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { miniCogScaleEnglish, miniCogScaleMalayalam } from '@/data/miniCogScale';
import { MiniCogItemCard } from '@/components/MiniCogItemCard';
import { MiniCogResults } from '@/components/MiniCogResults';
import { MiniCogResponse, MiniCogResults as MiniCogResultsType, MINI_COG_WORD_LISTS } from '@/types/minicog';
import { Brain, ArrowRight, ArrowLeft } from 'lucide-react';
import { AssessmentReference } from '@/components/AssessmentReference';

interface PatientInfo {
  name: string;
  age: string;
  date: string;
}

export const MiniCogAssessment = () => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState<'info' | 'assessment' | 'results'>('info');
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [selectedWordListVersion, setSelectedWordListVersion] = useState<number>(1);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    age: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [responses, setResponses] = useState<MiniCogResponse[]>([]);
  const [results, setResults] = useState<MiniCogResultsType | null>(null);

  const miniCogItems = language === 'ml' ? miniCogScaleMalayalam : miniCogScaleEnglish;

  const handlePatientInfoChange = (field: keyof PatientInfo, value: string) => {
    setPatientInfo(prev => ({ ...prev, [field]: value }));
  };

  const startAssessment = () => {
    setCurrentStep('assessment');
  };

  const handleScoreChange = (itemId: string, score: number) => {
    setResponses(prev => {
      const existing = prev.find(r => r.itemId === itemId);
      if (existing) {
        return prev.map(r => r.itemId === itemId ? { ...r, score } : r);
      }
      return [...prev, { itemId, score, wordListVersion: selectedWordListVersion }];
    });
  };

  const getCurrentScore = (itemId: string): number => {
    return responses.find(r => r.itemId === itemId)?.score || 0;
  };

  const goToNext = () => {
    if (currentItemIndex < miniCogItems.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const goToPrevious = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    const wordRecallScore = responses.find(r => r.itemId === 'recall')?.score || 0;
    const clockDrawScore = responses.find(r => r.itemId === 'clock')?.score || 0;
    const totalScore = wordRecallScore + clockDrawScore;

    let interpretation = '';
    if (totalScore >= 4) {
      interpretation = language === 'en'
        ? 'Score of 4-5: Lower likelihood of dementia. However, further evaluation may still be warranted based on clinical judgment and other presenting symptoms.'
        : '4-5 സ്കോർ: ഡിമെൻഷ്യയുടെ കുറഞ്ഞ സാധ്യത. എന്നിരുന്നാലും, ക്ലിനിക്കൽ വിധിയും മറ്റ് അവതരിപ്പിക്കുന്ന ലക്ഷണങ്ങളും അടിസ്ഥാനമാക്കി കൂടുതൽ വിലയിരുത്തൽ ആവശ്യമായേക്കാം.';
    } else if (totalScore === 3) {
      interpretation = language === 'en'
        ? 'Score of 3: Borderline result. Consider further evaluation of cognitive status, especially if clinical concerns exist or greater sensitivity is desired.'
        : '3 സ്കോർ: അതിർത്തി ഫലം. വൈജ്ഞാനിക നിലയുടെ കൂടുതൽ വിലയിരുത്തൽ പരിഗണിക്കുക, പ്രത്യേകിച്ച് ക്ലിനിക്കൽ ആശങ്കകൾ നിലവിലുണ്ടെങ്കിൽ അല്ലെങ്കിൽ കൂടുതൽ സംവേദനക്ഷമത ആവശ്യമാണെങ്കിൽ.';
    } else {
      interpretation = language === 'en'
        ? 'Score of 0-2: Positive screen for cognitive impairment. Further comprehensive evaluation is strongly recommended to assess for dementia and determine appropriate management.'
        : '0-2 സ്കോർ: വൈജ്ഞാനിക വൈകല്യത്തിനുള്ള പോസിറ്റീവ് സ്ക്രീൻ. ഡിമെൻഷ്യ വിലയിരുത്താനും ഉചിതമായ മാനേജ്മെന്റ് നിർണ്ണയിക്കാനും സമഗ്രമായ വിലയിരുത്തൽ ശക്തമായി ശുപാർശ ചെയ്യുന്നു.';
    }

    const calculatedResults: MiniCogResultsType = {
      responses,
      wordRecallScore,
      clockDrawScore,
      totalScore,
      interpretation,
      wordListVersion: selectedWordListVersion
    };

    setResults(calculatedResults);
    setCurrentStep('results');
  };

  const restartAssessment = () => {
    setCurrentStep('info');
    setCurrentItemIndex(0);
    setResponses([]);
    setResults(null);
    setPatientInfo({
      name: '',
      age: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  if (currentStep === 'results' && results) {
    return (
      <MiniCogResults 
        results={results} 
        patientInfo={patientInfo}
        onRestart={restartAssessment}
      />
    );
  }

  // Update the current item to use the selected word list
  const currentItem = miniCogItems[currentItemIndex];
  if (currentItem.step === 'registration') {
    const wordList = MINI_COG_WORD_LISTS.find(list => list.version === selectedWordListVersion);
    currentItem.wordList = language === 'ml' ? (wordList?.wordsMl || []) : (wordList?.words || []);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-800">
              {language === 'en' ? 'Mini-Cog™ Assessment' : 'Mini-Cog™ വിലയിരുത്തൽ'}
            </h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'A brief cognitive screening tool for detecting cognitive impairment in older adults'
              : 'പ്രായമായവരിലെ വൈജ്ഞാനിക വൈകല്യം കണ്ടെത്തുന്നതിനുള്ള ഒരു ഹ്രസ്വ വൈജ്ഞാനിക സ്ക്രീനിംഗ് ഉപകരണം'}
          </p>
        </div>

        {currentStep === 'info' && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-lg">
              <CardTitle className="text-xl">
                {language === 'en' ? 'Patient Information' : 'രോഗിയുടെ വിവരങ്ങൾ'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {language === 'en' ? 'Patient Name' : 'രോഗിയുടെ പേര്'}{' '}
                    <span className="text-muted-foreground text-sm">
                      ({language === 'en' ? 'optional' : 'ഓപ്ഷണൽ'})
                    </span>
                  </Label>
                  <Input
                    id="name"
                    value={patientInfo.name}
                    onChange={(e) => handlePatientInfoChange('name', e.target.value)}
                    placeholder={language === 'en' ? 'Enter patient name' : 'രോഗിയുടെ പേര് നൽകുക'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">
                    {language === 'en' ? 'Age' : 'പ്രായം'}{' '}
                    <span className="text-muted-foreground text-sm">
                      ({language === 'en' ? 'optional' : 'ഓപ്ഷണൽ'})
                    </span>
                  </Label>
                  <Input
                    id="age"
                    value={patientInfo.age}
                    onChange={(e) => handlePatientInfoChange('age', e.target.value)}
                    placeholder={language === 'en' ? 'Enter age' : 'പ്രായം നൽകുക'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">
                    {language === 'en' ? 'Assessment Date' : 'വിലയിരുത്തൽ തീയതി'}
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={patientInfo.date}
                    onChange={(e) => handlePatientInfoChange('date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wordlist">
                    {language === 'en' ? 'Word List Version' : 'വാക്ക് പട്ടിക പതിപ്പ്'}
                  </Label>
                  <Select 
                    value={selectedWordListVersion.toString()} 
                    onValueChange={(value) => setSelectedWordListVersion(parseInt(value))}
                  >
                    <SelectTrigger id="wordlist">
                      <SelectValue placeholder={language === 'en' ? 'Select word list version' : 'വാക്ക് പട്ടിക പതിപ്പ് തിരഞ്ഞെടുക്കുക'} />
                    </SelectTrigger>
                    <SelectContent>
                      {MINI_COG_WORD_LISTS.map((list) => (
                        <SelectItem key={list.version} value={list.version.toString()}>
                          {language === 'en' ? 'Version' : 'പതിപ്പ്'} {list.version}: {language === 'en' ? list.words.join(', ') : list.wordsMl?.join(', ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-center gap-3 pt-4">
                <Button variant="outline" onClick={startAssessment} className="flex items-center gap-2">
                  {language === 'en' ? 'Skip' : 'ഒഴിവാക്കുക'}
                </Button>
                <Button onClick={startAssessment} className="flex items-center gap-2">
                  {language === 'en' ? 'Start Assessment' : 'വിലയിരുത്തൽ ആരംഭിക്കുക'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'assessment' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                {language === 'en' ? 'Step' : 'ഘട്ടം'} {currentItemIndex + 1} {language === 'en' ? 'of' : '/'} {miniCogItems.length}
              </h2>
              <div className="text-sm text-slate-600">
                {Math.round(((currentItemIndex + 1) / miniCogItems.length) * 100)}% {language === 'en' ? 'Complete' : 'പൂർത്തിയായി'}
              </div>
            </div>
            
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentItemIndex + 1) / miniCogItems.length) * 100}%` }}
              />
            </div>

            <MiniCogItemCard
              item={currentItem}
              currentScore={getCurrentScore(currentItem.id)}
              onScoreChange={handleScoreChange}
            />

            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={goToPrevious}
                disabled={currentItemIndex === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {language === 'en' ? 'Previous' : 'മുമ്പത്തേത്'}
              </Button>
              
              <Button 
                onClick={goToNext}
                className="flex items-center gap-2"
              >
                {currentItemIndex === miniCogItems.length - 1 
                  ? (language === 'en' ? 'Calculate Results' : 'ഫലങ്ങൾ കണക്കാക്കുക')
                  : (language === 'en' ? 'Next' : 'അടുത്തത്')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <AssessmentReference assessmentKey="minicog" />

    </div>
  );
};

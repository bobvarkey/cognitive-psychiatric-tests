import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { MINI_ACE_VERSIONS, MINI_ACE_ITEMS, getInterpretation, CLINICAL_NOTES } from '@/data/miniAceScale';
import { MiniAceResponse, MiniAceResults } from '@/types/miniace';
import { ArrowLeft, Brain, Clock, ListChecks, AlertCircle, CheckCircle2, Info, FileText, Cat } from 'lucide-react';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';

interface MiniAceAssessmentProps {
  onBack?: () => void;
}

export const MiniAceAssessment: React.FC<MiniAceAssessmentProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const [selectedVersion, setSelectedVersion] = useState<'A' | 'B' | 'C'>('A');
  const [responses, setResponses] = useState<MiniAceResponse>({
    version: 'A',
    attention: 0,
    memory: 0,
    fluency: 0,
    clock: 0,
    recall: 0
  });
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<MiniAceResults | null>(null);

  const currentVersion = MINI_ACE_VERSIONS.find(v => v.version === selectedVersion)!;

  const handleVersionChange = (version: 'A' | 'B' | 'C') => {
    setSelectedVersion(version);
    setResponses(prev => ({ ...prev, version }));
  };

  const handleScoreChange = (domain: keyof Omit<MiniAceResponse, 'version'>, value: number) => {
    setResponses(prev => ({ ...prev, [domain]: value }));
  };

  const calculateResults = (): MiniAceResults => {
    const totalScore = responses.attention + responses.memory + responses.fluency + responses.clock + responses.recall;
    const { interpretation, riskLevel } = getInterpretation(totalScore, language);
    
    return {
      version: selectedVersion,
      responses,
      totalScore,
      interpretation,
      interpretationMl: language === 'ml' ? interpretation : getInterpretation(totalScore, 'ml').interpretation,
      domainScores: {
        attention: responses.attention,
        memory: responses.memory,
        fluency: responses.fluency,
        clock: responses.clock,
        recall: responses.recall
      },
      riskLevel
    };
  };

  const handleSubmit = () => {
    const calculatedResults = calculateResults();
    setResults(calculatedResults);
    setShowResults(true);
  };

  const handleReset = () => {
    setResponses({
      version: selectedVersion,
      attention: 0,
      memory: 0,
      fluency: 0,
      clock: 0,
      recall: 0
    });
    setShowResults(false);
    setResults(null);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'normal': return 'bg-green-100 border-green-500 text-green-800';
      case 'mild': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'moderate': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'severe': return 'bg-red-100 border-red-500 text-red-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 md:p-8">
        <LanguageToggle />
        <div className="max-w-3xl mx-auto space-y-6">
          <Button variant="ghost" onClick={() => setShowResults(false)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === 'ml' ? 'തിരികെ' : 'Back to Assessment'}
          </Button>

          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Brain className="h-6 w-6" />
                {language === 'ml' ? 'Mini-ACE ഫലങ്ങൾ' : 'Mini-ACE Results'} - {language === 'ml' ? 'പതിപ്പ്' : 'Version'} {results.version}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Total Score */}
              <div className={`p-6 rounded-lg border-2 ${getRiskColor(results.riskLevel)}`}>
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">
                    {language === 'ml' ? 'ആകെ സ്കോർ' : 'Total Score'}
                  </p>
                  <p className="text-5xl font-bold">{results.totalScore}/30</p>
                  <p className="mt-2 text-sm">
                    {language === 'ml' ? results.interpretationMl : results.interpretation}
                  </p>
                </div>
              </div>

              {/* Domain Scores */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(results.domainScores).map(([domain, score]) => {
                  const item = MINI_ACE_ITEMS.find(i => i.id === domain);
                  return (
                    <div key={domain} className="bg-white border rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">
                        {language === 'ml' ? item?.titleMl : item?.title}
                      </p>
                      <p className="text-xl font-semibold text-emerald-700">
                        {score}/{item?.maxScore}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Cut-off Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {language === 'ml' ? 'കട്ട്-ഓഫ് മൂല്യങ്ങൾ' : 'Cut-off Values'}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {results.totalScore <= 25 ? (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                    <span>
                      <strong>≤25:</strong> {language === 'ml' 
                        ? 'ഉയർന്ന സംവേദനക്ഷമത - സാധ്യമായ വൈജ്ഞാനിക കുറവ്' 
                        : 'High sensitivity - Possible cognitive impairment'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {results.totalScore <= 21 ? (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                    <span>
                      <strong>≤21:</strong> {language === 'ml' 
                        ? 'ഉയർന്ന പ്രത്യേകത - ഡിമെൻഷ്യ വളരെ സാധ്യത' 
                        : 'High specificity - Dementia highly likely'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleReset} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  {language === 'ml' ? 'പുതിയ അസെസ്മെന്റ്' : 'New Assessment'}
                </Button>
                {onBack && (
                  <Button onClick={onBack} variant="outline" className="flex-1">
                    {language === 'ml' ? 'മെനുവിലേക്ക്' : 'Back to Menu'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 md:p-8">
      <LanguageToggle />
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === 'ml' ? 'തിരികെ' : 'Back'}
          </Button>
        )}

        <PatientInfoForm />

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Brain className="h-8 w-8 text-emerald-600" />
              <CardTitle className="text-2xl md:text-3xl font-bold text-emerald-800">
                Mini-ACE
              </CardTitle>
            </div>
            <CardDescription className="text-base">
              {language === 'ml' 
                ? 'മിനി-ആഡൻബ്രൂക്ക് കോഗ്നിറ്റീവ് എക്സാമിനേഷൻ (ഇന്ത്യൻ അഡാപ്റ്റേഷൻ)'
                : "Mini-Addenbrooke's Cognitive Examination (Indian Adaptation)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Version Selection */}
            <div className="mb-6">
              <Label className="text-base font-semibold mb-3 block">
                {language === 'ml' ? 'പതിപ്പ് തിരഞ്ഞെടുക്കുക' : 'Select Version'}
              </Label>
              <RadioGroup
                value={selectedVersion}
                onValueChange={(v) => handleVersionChange(v as 'A' | 'B' | 'C')}
                className="flex gap-4"
              >
                {MINI_ACE_VERSIONS.map((version) => (
                  <div key={version.version} className="flex items-center space-x-2">
                    <RadioGroupItem value={version.version} id={`version-${version.version}`} />
                    <Label htmlFor={`version-${version.version}`} className="cursor-pointer font-medium">
                      {language === 'ml' ? 'പതിപ്പ്' : 'Version'} {version.version}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Version-specific Information */}
            <Card className="mb-6 bg-emerald-50 border-emerald-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-emerald-800 mb-3">
                  {language === 'ml' ? 'പതിപ്പ് വിവരങ്ങൾ' : 'Version Information'} - {selectedVersion}
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-emerald-100">
                    <p className="font-medium text-emerald-700 mb-1">
                      {language === 'ml' ? 'പേരും വിലാസവും:' : 'Name & Address:'}
                    </p>
                    <div className="space-y-1 text-emerald-900">
                      <p className="font-semibold">
                        {language === 'ml' ? currentVersion.address.nameMl : currentVersion.address.name}
                      </p>
                      <p>{language === 'ml' ? currentVersion.address.streetMl : currentVersion.address.street}</p>
                      <p>{language === 'ml' ? currentVersion.address.cityMl : currentVersion.address.city}</p>
                      <p>{language === 'ml' ? currentVersion.address.stateMl : currentVersion.address.state}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Cat className="h-4 w-4" />
                    <span className="font-medium">
                      {language === 'ml' ? 'ഫ്ലൂയൻസി:' : 'Fluency:'} {language === 'ml' ? 'മൃഗങ്ങൾ (1 മിനിറ്റ്)' : 'Animals (1 minute)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">
                      {language === 'ml' ? 'ഘടികാര സമയം:' : 'Clock time:'} {language === 'ml' ? 'പത്ത് കഴിഞ്ഞ് അഞ്ച് (5:10)' : 'Ten past five (5:10)'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clinical Usage Notes */}
            <Card className="mb-6 bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 mb-3">
                  <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                  <h4 className="font-semibold text-amber-800">
                    {language === 'ml' ? 'ക്ലിനിക്കൽ കുറിപ്പുകൾ' : 'Clinical Notes'}
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-amber-100">
                    <p className="font-medium text-amber-800 mb-2">
                      {language === 'ml' ? CLINICAL_NOTES.englishVersion.titleMl : CLINICAL_NOTES.englishVersion.title}
                    </p>
                    <ul className="list-disc list-inside text-amber-700 space-y-1">
                      {(language === 'ml' ? CLINICAL_NOTES.englishVersion.pointsMl : CLINICAL_NOTES.englishVersion.points).map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-amber-100">
                    <p className="font-medium text-amber-800 mb-2">
                      {language === 'ml' ? CLINICAL_NOTES.malayalamVersion.titleMl : CLINICAL_NOTES.malayalamVersion.title}
                    </p>
                    <ul className="list-disc list-inside text-amber-700 space-y-1">
                      {(language === 'ml' ? CLINICAL_NOTES.malayalamVersion.pointsMl : CLINICAL_NOTES.malayalamVersion.points).map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-amber-100">
                    <p className="font-medium text-amber-800 mb-2">
                      {language === 'ml' ? CLINICAL_NOTES.cautionNote.titleMl : CLINICAL_NOTES.cautionNote.title}
                    </p>
                    <ul className="list-disc list-inside text-amber-700 space-y-1">
                      {(language === 'ml' ? CLINICAL_NOTES.cautionNote.pointsMl : CLINICAL_NOTES.cautionNote.points).map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-amber-100 rounded text-xs text-amber-800 flex items-start gap-2">
                  <FileText className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>{language === 'ml' ? CLINICAL_NOTES.legalNote.ml : CLINICAL_NOTES.legalNote.en}</p>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Items */}
            <div className="space-y-6 colorful-questions">
              {MINI_ACE_ITEMS.map((item) => (
                <Card key={item.id} className="border border-emerald-100">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                      {item.domain === 'attention' && <ListChecks className="h-5 w-5 text-emerald-600 mt-1" />}
                      {(item.domain === 'memory' || item.domain === 'recall') && <Brain className="h-5 w-5 text-emerald-600 mt-1" />}
                      {item.domain === 'fluency' && <Cat className="h-5 w-5 text-emerald-600 mt-1" />}
                      {item.domain === 'clock' && <Clock className="h-5 w-5 text-emerald-600 mt-1" />}
                      <div className="flex-1">
                        <h3 className="font-semibold text-emerald-800">
                          {language === 'ml' ? item.titleMl : item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {language === 'ml' ? item.instructionsMl : item.instructions}
                        </p>
                        <p className="text-xs text-emerald-600 mt-2">
                          <strong>{language === 'ml' ? 'സ്കോറിംഗ്:' : 'Scoring:'}</strong>{' '}
                          {language === 'ml' ? item.scoringGuidelinesMl : item.scoringGuidelines}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[responses[item.domain as keyof Omit<MiniAceResponse, 'version'>] as number]}
                        onValueChange={([value]) => handleScoreChange(item.domain as keyof Omit<MiniAceResponse, 'version'>, value)}
                        max={item.maxScore}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-lg font-bold text-emerald-700 min-w-[4rem] text-right">
                        {responses[item.domain as keyof Omit<MiniAceResponse, 'version'>]}/{item.maxScore}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Total Score Preview */}
            <div className="mt-6 p-4 bg-emerald-100 rounded-lg text-center">
              <p className="text-sm text-emerald-700">
                {language === 'ml' ? 'നിലവിലെ ആകെ സ്കോർ' : 'Current Total Score'}
              </p>
              <p className="text-3xl font-bold text-emerald-800">
                {responses.attention + responses.memory + responses.fluency + responses.clock + responses.recall}/30
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
              <Button 
                onClick={handleSubmit} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                size="lg"
              >
                {language === 'ml' ? 'ഫലങ്ങൾ കാണുക' : 'View Results'}
              </Button>
              <Button 
                onClick={handleReset} 
                variant="outline" 
                size="lg"
              >
                {language === 'ml' ? 'റീസെറ്റ്' : 'Reset'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <AssessmentReference assessmentKey="miniace" />

    </div>
  );
};

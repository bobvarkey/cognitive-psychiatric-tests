import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DpdrResult } from "@/types/dpdr";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, RotateCcw, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DpdrResultsProps {
  results: DpdrResult;
  onReset: () => void;
  onBack: () => void;
}

export const DpdrResults = ({ results, onReset, onBack }: DpdrResultsProps) => {
  const { language } = useLanguage();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minimal':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'mild':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'moderate':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'severe':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return '';
    }
  };

  const getSeverityLabel = (severity: string) => {
    const labels = {
      minimal: { en: 'Minimal', ml: 'ഏറ്റവും കുറഞ്ഞത്' },
      mild: { en: 'Mild', ml: 'നേരിയത്' },
      moderate: { en: 'Moderate', ml: 'മദ്ധ്യമം' },
      severe: { en: 'Severe', ml: 'ഗുരുതരം' }
    };
    return labels[severity as keyof typeof labels]?.[language] || severity;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold">
          {language === 'en' ? 'Assessment Results' : 'വിലയിരുത്തൽ ഫലങ്ങൾ'}
        </h2>
      </div>

      {results.severity !== 'minimal' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {language === 'en' ? 'Professional Consultation Recommended' : 'പ്രൊഫഷണൽ കൂടിയാലോചന ശുപാർശ ചെയ്യുന്നു'}
          </AlertTitle>
          <AlertDescription>
            {language === 'en'
              ? 'These results suggest symptoms that may benefit from professional evaluation. A mental health professional can provide proper diagnosis and treatment options.'
              : 'ഈ ഫലങ്ങൾ പ്രൊഫഷണൽ വിലയിരുത്തൽ ഉപകരിക്കുന്ന ലക്ഷണങ്ങൾ സൂചിപ്പിക്കുന്നു. ശരിയായ രോഗനിർണയവും ചികിത്സാ ഓപ്ഷനുകളും ഒരു മാനസികാരോഗ്യ വിദഗ്ധന് നൽകാൻ കഴിയും.'}
          </AlertDescription>
        </Alert>
      )}

      <Card className={`${getSeverityColor(results.severity)} border-2`}>
        <CardHeader>
          <CardTitle className="text-2xl">
            {language === 'en' ? 'Overall Severity' : 'മൊത്തം തീവ്രത'}
          </CardTitle>
          <CardDescription className="text-lg font-semibold">
            {getSeverityLabel(results.severity)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  {language === 'en' ? 'Total Score' : 'മൊത്തം സ്കോർ'}
                </span>
                <span className="text-2xl font-bold">
                  {results.totalScore} / 80
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              {language === 'en' ? results.interpretation : results.interpretationMl}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-1 h-8 bg-purple-500 rounded-full" />
              {language === 'en' ? 'Depersonalization' : 'വ്യക്തിത്വനഷ്ടം'}
            </CardTitle>
            <CardDescription className="text-xs">
              {language === 'en' ? 'Detachment from self' : 'സ്വയം വേർപിരിയൽ'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {results.depersonalizationScore}
              <span className="text-base text-muted-foreground ml-1">/ 32</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-1 h-8 bg-blue-500 rounded-full" />
              {language === 'en' ? 'Derealization' : 'യാഥാർത്ഥ്യനഷ്ടം'}
            </CardTitle>
            <CardDescription className="text-xs">
              {language === 'en' ? 'Unreality of surroundings' : 'ചുറ്റുപാടുകളുടെ അയഥാർത്ഥത'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {results.derealizationScore}
              <span className="text-base text-muted-foreground ml-1">/ 28</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-1 h-8 bg-orange-500 rounded-full" />
              {language === 'en' ? 'Impact & Distress' : 'ആഘാതവും ദുരിതവും'}
            </CardTitle>
            <CardDescription className="text-xs">
              {language === 'en' ? 'Functional impairment' : 'പ്രവർത്തന വൈകല്യം'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {results.distressScore}
              <span className="text-base text-muted-foreground ml-1">/ 20</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>
          {language === 'en' ? 'About This Assessment' : 'ഈ വിലയിരുത്തലിനെക്കുറിച്ച്'}
        </AlertTitle>
        <AlertDescription className="space-y-2 text-sm">
          <p>
            {language === 'en'
              ? 'This screening tool is based on DSM-5 criteria for Depersonalization-Derealization Disorder. It assesses the frequency of dissociative symptoms across three domains:'
              : 'ഈ സ്ക്രീനിംഗ് ഉപകരണം വ്യക്തിത്വനഷ്ടം-യാഥാർത്ഥ്യനഷ്ടം ഡിസോർഡറിനുള്ള DSM-5 മാനദണ്ഡങ്ങളെ അടിസ്ഥാനമാക്കിയുള്ളതാണ്. മൂന്ന് ഡൊമെയിനുകളിലായി വിഘടിത ലക്ഷണങ്ങളുടെ ആവൃത്തി വിലയിരുത്തുന്നു:'}
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              {language === 'en'
                ? 'Depersonalization: Experiences of unreality or detachment from oneself'
                : 'വ്യക്തിത്വനഷ്ടം: സ്വയം അയഥാർത്ഥത അല്ലെങ്കിൽ വേർപിരിയൽ അനുഭവങ്ങൾ'}
            </li>
            <li>
              {language === 'en'
                ? 'Derealization: Experiences of unreality or detachment from surroundings'
                : 'യാഥാർത്ഥ്യനഷ്ടം: ചുറ്റുപാടുകളിൽ നിന്നുള്ള അയഥാർത്ഥത അല്ലെങ്കിൽ വേർപിരിയൽ അനുഭവങ്ങൾ'}
            </li>
            <li>
              {language === 'en'
                ? 'Impact & Distress: Functional impairment and emotional distress caused by symptoms'
                : 'ആഘാതവും ദുരിതവും: ലക്ഷണങ്ങൾ മൂലമുണ്ടാകുന്ന പ്രവർത്തന വൈകല്യവും വൈകാരിക ദുരിതവും'}
            </li>
          </ul>
          <p className="pt-2 font-medium">
            {language === 'en'
              ? 'Note: This is a screening tool, not a diagnostic instrument. Only a qualified mental health professional can provide a formal diagnosis.'
              : 'കുറിപ്പ്: ഇതൊരു സ്ക്രീനിംഗ് ഉപകരണമാണ്, ഡയഗ്നോസ്റ്റിക് ഉപകരണമല്ല. യോഗ്യതയുള്ള ഒരു മാനസികാരോഗ്യ വിദഗ്ധന് മാത്രമേ ഔപചാരിക രോഗനിർണയം നൽകാൻ കഴിയൂ.'}
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Recommended Next Steps' : 'ശുപാർശ ചെയ്യുന്ന അടുത്ത ഘട്ടങ്ങൾ'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="text-primary font-bold">1.</div>
            <p>
              {language === 'en'
                ? 'Consult a mental health professional (psychiatrist, psychologist, or clinical social worker) for comprehensive evaluation'
                : 'സമഗ്രമായ വിലയിരുത്തലിനായി ഒരു മാനസികാരോഗ്യ വിദഗ്ധനെ (സൈക്യാട്രിസ്റ്റ്, സൈക്കോളജിസ്റ്റ്, അല്ലെങ്കിൽ ക്ലിനിക്കൽ സോഷ്യൽ വർക്കർ) കാണുക'}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-bold">2.</div>
            <p>
              {language === 'en'
                ? 'Keep a symptom diary to track when experiences occur and potential triggers'
                : 'അനുഭവങ്ങൾ എപ്പോൾ സംഭവിക്കുന്നുവെന്നും സാധ്യതയുള്ള ട്രിഗറുകളെയും ട്രാക്ക് ചെയ്യാൻ ഒരു ലക്ഷണ ഡയറി സൂക്ഷിക്കുക'}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-bold">3.</div>
            <p>
              {language === 'en'
                ? 'Practice grounding techniques: focus on sensory experiences (sight, sound, touch) to reconnect with reality'
                : 'ഗ്രൗണ്ടിംഗ് ടെക്നിക്കുകൾ പരിശീലിക്കുക: യാഥാർത്ഥ്യവുമായി വീണ്ടും ബന്ധപ്പെടാൻ സെൻസറി അനുഭവങ്ങളിൽ (കാഴ്ച, ശബ്ദം, സ്പർശനം) ശ്രദ്ധ കേന്ദ്രീകരിക്കുക'}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-bold">4.</div>
            <p>
              {language === 'en'
                ? 'Consider evidence-based treatments: cognitive-behavioral therapy (CBT) has shown effectiveness for DPDR'
                : 'തെളിവ് അടിസ്ഥാനമാക്കിയുള്ള ചികിത്സകൾ പരിഗണിക്കുക: കോഗ്നിറ്റീവ്-ബിഹേവിയറൽ തെറാപ്പി (CBT) DPDR-നുള്ള ഫലപ്രാപ്തി കാണിച്ചിട്ടുണ്ട്'}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-bold">5.</div>
            <p>
              {language === 'en'
                ? 'Address underlying conditions: anxiety, depression, or trauma may contribute to dissociative symptoms'
                : 'അടിസ്ഥാന അവസ്ഥകൾ പരിഹരിക്കുക: ഉത്കണ്ഠ, വിഷാദം, അല്ലെങ്കിൽ ട്രോമ വിഘടിത ലക്ഷണങ്ങൾക്ക് കാരണമാകാം'}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Retake Assessment' : 'വീണ്ടും വിലയിരുത്തുക'}
        </Button>
      </div>
    </div>
  );
};

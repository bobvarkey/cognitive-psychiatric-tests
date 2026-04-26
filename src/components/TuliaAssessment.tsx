import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { TuliaItemCard } from '@/components/TuliaItemCard';
import { TuliaResults as TuliaResultsComponent } from '@/components/TuliaResults';
import { tuliaItems } from '@/data/tuliaScale';
import { TuliaResponse, TuliaScore } from '@/types/tulia';
import { Hand, ArrowRight, ArrowLeft } from 'lucide-react';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';
import { LanguageToggle } from '@/components/LanguageToggle';

interface TuliaAssessmentProps {
  onBack?: () => void;
}

export const TuliaAssessment = ({ onBack }: TuliaAssessmentProps = {}) => {
  const { t, language } = useLanguage();
  const [responses, setResponses] = useState<Map<number, TuliaScore>>(new Map());
  const [showResults, setShowResults] = useState(false);

  const handleScoreChange = (itemId: number, score: TuliaScore) => {
    const newResponses = new Map(responses);
    newResponses.set(itemId, score);
    setResponses(newResponses);
  };

  const handleSubmit = () => {
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progress = (responses.size / tuliaItems.length) * 100;
  const isComplete = responses.size === tuliaItems.length;

  if (showResults) {
    const tuliaResponses: TuliaResponse[] = Array.from(responses.entries()).map(
      ([itemId, score]) => ({
        itemId,
        score,
      })
    );
    return <TuliaResultsComponent responses={tuliaResponses} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4 print:bg-white">
      <div className="max-w-4xl mx-auto">
        {onBack && (
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {language === 'en' ? 'Back to Menu' : 'മെനുവിലേക്ക് മടങ്ങുക'}
            </Button>
            <LanguageToggle />
          </div>
        )}
        <PatientInfoForm />
        <Card className="shadow-2xl border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <Hand className="h-10 w-10" />
              <div>
                <CardTitle className="text-3xl">
                  {language === 'en' ? 'TULIA - Apraxia Screen' : 'TULIA - അപ്രാക്സിയ സ്ക്രീൻ'}
                </CardTitle>
                <p className="text-teal-100 text-sm mt-1">
                  {language === 'en' 
                    ? 'Test of Upper Limb Apraxia - Screening Version' 
                    : 'മേൽ കൈ അപ്രാക്സിയ പരിശോധന - സ്ക്രീനിംഗ് പതിപ്പ്'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>
                    {language === 'en' ? 'Progress' : 'പുരോഗതി'}: {responses.size}/{tuliaItems.length}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-blue-900 font-medium">
                  {language === 'en' ? 'Test Instructions:' : 'പരിശോധന നിർദ്ദേശങ്ങൾ:'}
                </p>
                <ul className="text-sm text-blue-800 space-y-1 ml-4">
                  <li>• {language === 'en' 
                    ? 'Patient should be seated in front of examiner with forearms on table' 
                    : 'രോഗി പരിശോധകന്റെ മുന്നിൽ ഇരിക്കണം, മേശപ്പുറത്ത് കൈകൾ വച്ചുകൊണ്ട്'}</li>
                  <li>• {language === 'en' 
                    ? 'Use non-paretic limb for hemiparetic patients' 
                    : 'ഹെമിപരെറ്റിക് രോഗികൾക്ക് പരുക്കില്ലാത്ത കൈ ഉപയോഗിക്കുക'}</li>
                  <li>• {language === 'en' 
                    ? 'In non-hemiplegia patients, both upper limbs are tested' 
                    : 'ഹെമിപ്ലീജിയ ഇല്ലാത്ത രോഗികളിൽ, രണ്ട് മേൽകൈകളും പരിശോധിക്കുന്നു'}</li>
                  <li>• {language === 'en' 
                    ? 'Items 1-7: Imitation tasks (mirror fashion)' 
                    : 'ഇനങ്ങൾ 1-7: അനുകരണ ടാസ്കുകൾ (കണ്ണാടി രീതി)'}</li>
                  <li>• {language === 'en' 
                    ? 'Items 8-12: Pantomime tasks (verbal command)' 
                    : 'ഇനങ്ങൾ 8-12: പാന്റോമൈം ടാസ്കുകൾ (വാക്കാലുള്ള കമാൻഡ്)'}</li>
                  <li>• {language === 'en' 
                    ? "For tool-related items: imagine holding the object, don't use fingers as tools" 
                    : 'ഉപകരണ ബന്ധിത ഇനങ്ങൾക്ക്: വസ്തു പിടിച്ചിരിക്കുന്നതായി സങ്കൽപ്പിക്കുക, വിരലുകൾ ഉപകരണമായി ഉപയോഗിക്കരുത്'}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {(['meaningless', 'intransitive', 'transitive'] as const).map((cat) => {
          const items = tuliaItems.filter((i) => i.category === cat);
          if (items.length === 0) return null;
          const catLabel =
            cat === 'meaningless'
              ? language === 'en' ? 'Meaningless Gestures' : 'അർത്ഥരഹിത ആംഗ്യങ്ങൾ'
              : cat === 'intransitive'
              ? language === 'en' ? 'Intransitive (Communicative) Gestures' : 'ഇൻട്രാൻസിറ്റീവ് (ആശയവിനിമയ) ആംഗ്യങ്ങൾ'
              : language === 'en' ? 'Transitive (Tool-related) Gestures' : 'ട്രാൻസിറ്റീവ് (ഉപകരണ ബന്ധിത) ആംഗ്യങ്ങൾ';
          const gradient =
            cat === 'meaningless'
              ? 'from-gray-500 to-slate-600'
              : cat === 'intransitive'
              ? 'from-blue-500 to-indigo-600'
              : 'from-teal-500 to-cyan-600';
          return (
            <div key={cat} className="mb-8">
              <div className={`bg-gradient-to-r ${gradient} text-white rounded-lg px-4 py-3 mb-4 shadow-md`}>
                <h2 className="text-xl font-bold">{catLabel}</h2>
                <p className="text-sm opacity-90">
                  {language === 'en' ? `${items.length} item${items.length > 1 ? 's' : ''}` : `${items.length} ഇനങ്ങൾ`}
                </p>
              </div>
              <div className="space-y-6 colorful-questions">
                {items.map((item) => (
                  <TuliaItemCard
                    key={item.id}
                    item={item}
                    value={responses.get(item.id) ?? null}
                    onChange={(score) => handleScoreChange(item.id, score)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        <Card className="shadow-lg border-0 mt-8 mb-4">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-t-lg">
            <CardTitle className="text-lg">
              {language === 'en' ? 'About the Subcategories' : 'ഉപവിഭാഗങ്ങളെക്കുറിച്ച്'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-sm text-slate-700">
            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                {language === 'en' ? 'Meaningless Gestures' : 'അർത്ഥരഹിത ആംഗ്യങ്ങൾ'}
              </h3>
              <p>
                {language === 'en'
                  ? 'Novel, non-symbolic hand/arm postures with no semantic content. They test the ability to visually analyze and reproduce a posture (visuo-imitative pathway), independent of stored gesture knowledge.'
                  : 'അർത്ഥമില്ലാത്ത പുതിയ കൈ/കൈ പൊസിഷനുകൾ. സംഭരിച്ച ആംഗ്യ പരിജ്ഞാനത്തിൽ നിന്ന് സ്വതന്ത്രമായി ഒരു പൊസിഷൻ വിശകലനം ചെയ്യാനും പുനർനിർമ്മിക്കാനുമുള്ള കഴിവ് പരീക്ഷിക്കുന്നു.'}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                {language === 'en' ? 'Intransitive (Communicative) Gestures' : 'ഇൻട്രാൻസിറ്റീവ് (ആശയവിനിമയ) ആംഗ്യങ്ങൾ'}
              </h3>
              <p>
                {language === 'en'
                  ? 'Symbolic, socially meaningful gestures that do not involve a tool or object (e.g., waving, threatening sign). They probe the semantic store of culturally learned gestures.'
                  : 'ഉപകരണമോ വസ്തുവോ ഉൾപ്പെടാത്ത സാമൂഹികമായി അർത്ഥവത്തായ ആംഗ്യങ്ങൾ (ഉദാ. കൈവീശൽ, ഭീഷണി അടയാളം). സാംസ്കാരികമായി പഠിച്ച ആംഗ്യങ്ങളുടെ സെമാന്റിക് സ്റ്റോർ പരിശോധിക്കുന്നു.'}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                {language === 'en' ? 'Transitive (Tool-related) Gestures' : 'ട്രാൻസിറ്റീവ് (ഉപകരണ ബന്ധിത) ആംഗ്യങ്ങൾ'}
              </h3>
              <p>
                {language === 'en'
                  ? 'Object-directed actions that mime tool use (e.g., hammer, scissors, toothbrush). They engage stored action knowledge linking objects to their motor programs and are the most sensitive to ideomotor apraxia.'
                  : 'ഉപകരണ ഉപയോഗത്തെ അനുകരിക്കുന്ന വസ്തു-കേന്ദ്രീകൃത പ്രവർത്തനങ്ങൾ (ഉദാ. ചുറ്റിക, കത്രിക, ടൂത്ത്ബ്രഷ്). ഐഡിയോമോട്ടോർ അപ്രാക്സിയയോട് ഏറ്റവും സംവേദനക്ഷമമാണ്.'}
              </p>
            </div>
            <div className="pt-2 border-t text-xs text-slate-500">
              {language === 'en'
                ? 'Items 1–7 are performed by imitation; items 8–12 by pantomime to verbal command. Comparing performance across categories and domains helps localize the apraxic deficit.'
                : 'ഇനങ്ങൾ 1-7 അനുകരണത്തിലൂടെയും 8-12 വാക്കാലുള്ള കമാൻഡ് വഴി പാന്റോമൈം വഴിയും നടത്തുന്നു.'}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mt-8 sticky bottom-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {language === 'en' ? 'Completed' : 'പൂർത്തിയായി'}: {responses.size}/{tuliaItems.length}
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!isComplete}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 flex items-center gap-2"
              >
                {language === 'en' ? 'View Results' : 'ഫലങ്ങൾ കാണുക'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <AssessmentReference assessmentKey="tulia" />

    </div>
  );
};

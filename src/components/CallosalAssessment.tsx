import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Brain, Hand, Eye, PenLine, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CallosalAssessmentProps {
  onBack: () => void;
}

const tests = [
  {
    icon: Hand,
    name: 'Left-Hand Tactile Anomia',
    nameMl: 'ഇടത് കൈ ടാക്റ്റൈൽ അനോമിയ',
    how: 'Blindfold the patient (or occlude vision). Place common objects (key, coin, comb) in the LEFT hand only and ask the patient to name them. Repeat with the RIGHT hand as a control.',
    howMl: 'രോഗിയുടെ കണ്ണുകൾ മറയ്ക്കുക. സാധാരണ വസ്തുക്കൾ ഇടത് കൈയിൽ മാത്രം വയ്ക്കുക, പേര് പറയാൻ ആവശ്യപ്പെടുക. വലത് കൈ ഉപയോഗിച്ച് നിയന്ത്രണമായി ആവർത്തിക്കുക.',
    positive: 'Patient cannot name objects with the LEFT hand but names them correctly with the RIGHT hand.',
    positiveMl: 'ഇടത് കൈ ഉപയോഗിച്ച് വസ്തുക്കൾ പേര് പറയാൻ കഴിയാത്തത്, എന്നാൽ വലത് കൈ ഉപയോഗിച്ച് ശരിയായി പറയുന്നത്.',
    rationale: 'Right-hemisphere tactile information cannot reach the left-hemisphere language area through the corpus callosum.',
  },
  {
    icon: PenLine,
    name: 'Left-Hand Agraphia',
    nameMl: 'ഇടത് കൈ അഗ്രാഫിയ',
    how: 'Ask the patient to write a short dictated sentence with the LEFT hand, then the RIGHT hand. Right-handed patients only.',
    howMl: 'ഒരു ചെറിയ വാചകം ഇടത് കൈ കൊണ്ടും പിന്നെ വലത് കൈ കൊണ്ടും എഴുതാൻ ആവശ്യപ്പെടുക (വലങ്കൈയന്മാർ മാത്രം).',
    positive: 'Illegible or absent writing with the left hand despite normal writing with the right hand.',
    positiveMl: 'വലത് കൈ കൊണ്ട് സാധാരണ എഴുത്ത് ഉണ്ടെങ്കിലും ഇടത് കൈ കൊണ്ട് വ്യക്തമല്ലാത്തതോ ഇല്ലാത്തതോ ആയ എഴുത്ത്.',
    rationale: 'Verbal/linguistic motor program from the left hemisphere cannot reach the right motor cortex controlling the left hand.',
  },
  {
    icon: Activity,
    name: 'Left-Hand Apraxia to Verbal Command',
    nameMl: 'ഇടത് കൈ വാക്കാലുള്ള കമാൻഡിലെ അപ്രാക്സിയ',
    how: 'Give verbal commands ("show me how you wave goodbye", "pretend to brush your teeth") and ask the patient to perform with the LEFT hand only, then the RIGHT.',
    howMl: 'വാക്കാലുള്ള നിർദ്ദേശങ്ങൾ നൽകുക ("വിട പറയുന്നത് കാണിക്കുക") ഇടത് കൈ കൊണ്ട് മാത്രം ചെയ്യാൻ ആവശ്യപ്പെടുക, പിന്നെ വലത് കൈ.',
    positive: 'Left hand fails to perform the gesture; right hand succeeds. Imitation may be preserved.',
    positiveMl: 'ഇടത് കൈ ജെസ്ച്ചർ ചെയ്യാൻ കഴിയില്ല; വലത് കൈ വിജയിക്കും. അനുകരണം നിലനിൽക്കാം.',
    rationale: 'Disconnects left-hemisphere language comprehension from right-hemisphere motor execution.',
  },
  {
    icon: Hand,
    name: 'Diagonistic Dyspraxia / Alien Hand Sign',
    nameMl: 'ഡയഗോണിസ്റ്റിക് ഡിസ്പ്രാക്സിയ / ഏലിയൻ ഹാൻഡ് സൈൻ',
    how: 'Observe spontaneous bimanual activity (buttoning, opening a drawer). Ask about involuntary, purposeful but unwanted movements of the left hand.',
    howMl: 'സ്വാഭാവിക ദ്വിമാനുവൽ പ്രവർത്തനം നിരീക്ഷിക്കുക (ബട്ടണിടൽ, ഡ്രോ തുറക്കൽ). ഇടത് കൈയുടെ അനിച്ഛാപൂർവമായ ചലനങ്ങളെക്കുറിച്ച് ചോദിക്കുക.',
    positive: 'Left hand acts antagonistically to the right (e.g., closes a drawer the right hand just opened); patient feels the hand "is not mine".',
    positiveMl: 'ഇടത് കൈ വലത് കൈക്ക് എതിരായി പ്രവർത്തിക്കുന്നു; "ഈ കൈ എന്റേതല്ല" എന്ന് രോഗി തോന്നുന്നു.',
    rationale: 'Loss of inter-hemispheric inhibition; right hemisphere acts independently.',
  },
  {
    icon: Eye,
    name: 'Left Visual Field Anomia',
    nameMl: 'ഇടത് ദൃശ്യ ഫീൽഡ് അനോമിയ',
    how: 'With the patient fixating centrally, briefly present pictures or words in the LEFT visual field only (tachistoscopic exposure or quick lateral presentation). Ask the patient to name what was seen.',
    howMl: 'രോഗി കേന്ദ്രത്തിൽ നോക്കുമ്പോൾ, ഇടത് ദൃശ്യ ഫീൽഡിൽ മാത്രം ചിത്രങ്ങളോ വാക്കുകളോ ഹ്രസ്വമായി കാണിക്കുക. കണ്ടത് പേര് പറയാൻ ആവശ്യപ്പെടുക.',
    positive: 'Inability to name stimuli in the left visual field despite intact visual acuity and fields on confrontation; the patient may point to or match the item with the left hand.',
    positiveMl: 'ഇടത് ദൃശ്യ ഫീൽഡിലെ ഉത്തേജനങ്ങൾ പേര് പറയാൻ കഴിയില്ല; രോഗി ഇടത് കൈ ഉപയോഗിച്ച് വസ്തുവിലേക്ക് ചൂണ്ടാൻ കഴിയും.',
    rationale: 'Visual information from the right occipital cortex cannot cross to the left-hemisphere language area.',
  },
];

export const CallosalAssessment = ({ onBack }: CallosalAssessmentProps) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4 sm:p-6 print:bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            {isEn ? 'Back to Menu' : 'മെനുവിലേക്ക് മടങ്ങുക'}
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {isEn ? 'Callosal Disconnection Syndrome' : 'കാലോസൽ ഡിസ്‌കണക്ഷൻ സിൻഡ്രോം'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEn ? 'Bedside "split-brain" examination' : 'ബെഡ്‌സൈഡ് "സ്പ്ലിറ്റ്-ബ്രെയിൻ" പരിശോധന'}
            </p>
          </div>
        </div>

        <Card className="mb-6 border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <p className="text-sm text-foreground leading-relaxed">
              {isEn ? (
                <>
                  <strong>Callosal Disconnection Syndrome (CDS)</strong> reflects loss of communication
                  between the cerebral hemispheres through the corpus callosum (surgical commissurotomy,
                  infarct of the anterior cerebral artery, tumour, multiple sclerosis, Marchiafava–Bignami
                  disease). The bedside tests below isolate each hemisphere by routing input or output
                  through one side only. Definitive diagnosis is by <strong>MRI / DTI</strong>.
                </>
              ) : (
                <>
                  <strong>കാലോസൽ ഡിസ്‌കണക്ഷൻ സിൻഡ്രോം (CDS)</strong> എന്നത് കോർപസ് കാലോസം വഴി
                  സെറിബ്രൽ ഹെമിസ്ഫിയറുകൾ തമ്മിലുള്ള ആശയവിനിമയം നഷ്ടപ്പെടുന്നതാണ്. ഉറപ്പുള്ള
                  രോഗനിർണയം <strong>MRI / DTI</strong> വഴിയാണ്.
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {tests.map((test, idx) => {
            const Icon = test.icon;
            return (
              <Card key={idx} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base sm:text-lg">
                        {idx + 1}. {isEn ? test.name : test.nameMl}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <Badge variant="secondary" className="mb-1">
                      {isEn ? 'How to test' : 'എങ്ങനെ പരിശോധിക്കാം'}
                    </Badge>
                    <p className="text-foreground leading-relaxed">{isEn ? test.how : test.howMl}</p>
                  </div>
                  <div>
                    <Badge variant="destructive" className="mb-1">
                      {isEn ? 'Positive finding' : 'പോസിറ്റീവ് കണ്ടെത്തൽ'}
                    </Badge>
                    <p className="text-foreground leading-relaxed">
                      {isEn ? test.positive : test.positiveMl}
                    </p>
                  </div>
                  {isEn && (
                    <div>
                      <Badge variant="outline" className="mb-1">Rationale</Badge>
                      <p className="text-muted-foreground leading-relaxed italic">{test.rationale}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-6 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">
              {isEn ? 'Causes & Imaging' : 'കാരണങ്ങളും ഇമേജിംഗും'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <strong>{isEn ? 'Common causes:' : 'സാധാരണ കാരണങ്ങൾ:'} </strong>
              {isEn
                ? 'Surgical callosotomy (epilepsy surgery), anterior cerebral artery infarct, callosal tumour, multiple sclerosis, Marchiafava–Bignami disease, traumatic shearing injury.'
                : 'സർജിക്കൽ കാലോസോട്ടമി, ആന്റീരിയർ സെറിബ്രൽ ആർട്ടറി ഇൻഫാർക്റ്റ്, കാലോസൽ ട്യൂമർ, മൾട്ടിപ്പിൾ സ്‌ക്ലിറോസിസ്, മാർക്കിയഫാവ–ബിഞാമി രോഗം.'}
            </p>
            <p>
              <strong>{isEn ? 'Confirmation:' : 'സ്ഥിരീകരണം:'} </strong>
              {isEn
                ? 'MRI (sagittal T1/FLAIR) demonstrates callosal lesions; DTI / tractography shows interrupted callosal fibres.'
                : 'MRI കാലോസൽ ലെഷനുകൾ കാണിക്കുന്നു; DTI തടസ്സപ്പെട്ട കാലോസൽ ഫൈബറുകൾ കാണിക്കുന്നു.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

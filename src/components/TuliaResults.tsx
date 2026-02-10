import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { TuliaResponse, TuliaResults as TuliaResultsType } from '@/types/tulia';
import { tuliaItems } from '@/data/tuliaScale';
import { Hand, AlertCircle, CheckCircle, XCircle, Printer, RotateCcw } from 'lucide-react';

interface TuliaResultsProps {
  responses: TuliaResponse[];
}

export const TuliaResults = ({ responses }: TuliaResultsProps) => {
  const { language } = useLanguage();

  const calculateResults = (): TuliaResultsType => {
    const totalScore = responses.reduce((sum, r) => sum + r.score, 0);
    
    const imitationScore = responses
      .filter(r => {
        const item = tuliaItems.find(i => i.id === r.itemId);
        return item?.domain === 'imitation';
      })
      .reduce((sum, r) => sum + r.score, 0);
    
    const pantomimeScore = responses
      .filter(r => {
        const item = tuliaItems.find(i => i.id === r.itemId);
        return item?.domain === 'pantomime';
      })
      .reduce((sum, r) => sum + r.score, 0);
    
    const meaninglessScore = responses
      .filter(r => {
        const item = tuliaItems.find(i => i.id === r.itemId);
        return item?.category === 'meaningless';
      })
      .reduce((sum, r) => sum + r.score, 0);
    
    const intransitiveScore = responses
      .filter(r => {
        const item = tuliaItems.find(i => i.id === r.itemId);
        return item?.category === 'intransitive';
      })
      .reduce((sum, r) => sum + r.score, 0);
    
    const transitiveScore = responses
      .filter(r => {
        const item = tuliaItems.find(i => i.id === r.itemId);
        return item?.category === 'transitive';
      })
      .reduce((sum, r) => sum + r.score, 0);
    
    let interpretation: 'normal' | 'mild-apraxia' | 'severe-apraxia';
    if (totalScore >= 9) {
      interpretation = 'normal';
    } else if (totalScore >= 5) {
      interpretation = 'mild-apraxia';
    } else {
      interpretation = 'severe-apraxia';
    }

    return {
      responses,
      totalScore,
      imitationScore,
      pantomimeScore,
      meaninglessScore,
      intransitiveScore,
      transitiveScore,
      interpretation,
    };
  };

  const results = calculateResults();

  const getInterpretationDetails = () => {
    switch (results.interpretation) {
      case 'normal':
        return {
          title: language === 'en' ? 'Normal Performance' : 'സാധാരണ പ്രകടനം',
          description: language === 'en' 
            ? 'No significant signs of apraxia detected.' 
            : 'അപ്രാക്സിയയുടെ പ്രധാന ലക്ഷണങ്ങൾ കണ്ടെത്തിയില്ല.',
          Icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'mild-apraxia':
        return {
          title: language === 'en' ? 'Mild Apraxia' : 'നേരിയ അപ്രാക്സിയ',
          description: language === 'en' 
            ? 'Score indicates possible presence of mild apraxia. Further comprehensive assessment recommended.' 
            : 'സ്കോർ നേരിയ അപ്രാക്സിയയുടെ സാധ്യത സൂചിപ്പിക്കുന്നു. കൂടുതൽ സമഗ്ര വിലയിരുത്തൽ ശുപാർശ ചെയ്യുന്നു.',
          Icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'severe-apraxia':
        return {
          title: language === 'en' ? 'Severe Apraxia' : 'കഠിന അപ്രാക്സിയ',
          description: language === 'en' 
            ? 'Score suggests severe apraxia. Comprehensive clinical evaluation and intervention planning strongly recommended.' 
            : 'സ്കോർ കഠിന അപ്രാക്സിയ സൂചിപ്പിക്കുന്നു. സമഗ്ര ക്ലിനിക്കൽ വിലയിരുത്തലും ഇടപെടൽ ആസൂത്രണവും ശക്തമായി ശുപാർശ ചെയ്യുന്നു.',
          Icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
    }
  };

  const interpretationDetails = getInterpretationDetails();
  const InterpretationIcon = interpretationDetails.Icon;

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4 print:bg-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <Hand className="h-10 w-10" />
              <CardTitle className="text-3xl">
                {language === 'en' ? 'TULIA Assessment Results' : 'TULIA വിലയിരുത്തൽ ഫലങ്ങൾ'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className={`p-6 rounded-lg border-2 ${interpretationDetails.bgColor} ${interpretationDetails.borderColor}`}>
              <div className="flex items-start gap-4">
                <InterpretationIcon className={`h-8 w-8 ${interpretationDetails.color} flex-shrink-0`} />
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold ${interpretationDetails.color} mb-2`}>
                    {interpretationDetails.title}
                  </h3>
                  <p className="text-slate-700 mb-4">{interpretationDetails.description}</p>
                  <div className="bg-white/60 p-4 rounded-lg">
                    <div className="text-4xl font-bold text-slate-800 mb-1">
                      {results.totalScore}/12
                    </div>
                    <div className="text-sm text-slate-600">
                      {language === 'en' ? 'Total Score' : 'മൊത്തം സ്കോർ'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-md">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-slate-700 mb-3">
                    {language === 'en' ? 'Domain Scores' : 'ഡൊമെയ്ൻ സ്കോറുകൾ'}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        {language === 'en' ? 'Imitation (Items 1-7)' : 'അനുകരണം (ഇനങ്ങൾ 1-7)'}
                      </span>
                      <span className="font-bold text-purple-600">{results.imitationScore}/7</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        {language === 'en' ? 'Pantomime (Items 8-12)' : 'പാന്റോമൈം (ഇനങ്ങൾ 8-12)'}
                      </span>
                      <span className="font-bold text-orange-600">{results.pantomimeScore}/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-slate-700 mb-3">
                    {language === 'en' ? 'Category Scores' : 'വിഭാഗ സ്കോറുകൾ'}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        {language === 'en' ? 'Meaningless' : 'അർത്ഥരഹിതം'}
                      </span>
                      <span className="font-bold text-gray-600">{results.meaninglessScore}/1</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        {language === 'en' ? 'Intransitive' : 'ഇൻട്രാൻസിറ്റീവ്'}
                      </span>
                      <span className="font-bold text-blue-600">{results.intransitiveScore}/3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        {language === 'en' ? 'Transitive' : 'ട്രാൻസിറ്റീവ്'}
                      </span>
                      <span className="font-bold text-teal-600">{results.transitiveScore}/8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-md bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  {language === 'en' ? 'Clinical Notes' : 'ക്ലിനിക്കൽ കുറിപ്പുകൾ'}
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• {language === 'en' 
                    ? 'Cut-off score: <9 suggests apraxia, <5 suggests severe apraxia' 
                    : 'കട്ട്-ഓഫ് സ്കോർ: <9 അപ്രാക്സിയ സൂചിപ്പിക്കുന്നു, <5 കഠിന അപ്രാക്സിയ സൂചിപ്പിക്കുന്നു'}</li>
                  <li>• {language === 'en' 
                    ? 'Screening tool with 93% specificity and 88% sensitivity' 
                    : '93% സ്പെസിഫിസിറ്റിയും 88% സെൻസിറ്റിവിറ്റിയും ഉള്ള സ്ക്രീനിംഗ് ഉപകരണം'}</li>
                  <li>• {language === 'en' 
                    ? 'Comprehensive TULIA assessment recommended for detailed evaluation' 
                    : 'വിശദമായ വിലയിരുത്തലിന് സമഗ്ര TULIA വിലയിരുത്തൽ ശുപാർശ ചെയ്യുന്നു'}</li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex gap-3 print:hidden">
              <Button
                onClick={handlePrint}
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                {language === 'en' ? 'Print Results' : 'ഫലങ്ങൾ പ്രിന്റ് ചെയ്യുക'}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {language === 'en' ? 'New Assessment' : 'പുതിയ വിലയിരുത്തൽ'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 print:block">
          <CardHeader className="bg-slate-100">
            <CardTitle className="text-lg">
              {language === 'en' ? 'Item-by-Item Results' : 'ഇനം തിരിച്ചുള്ള ഫലങ്ങൾ'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {responses.map((response) => {
                const item = tuliaItems.find(i => i.id === response.itemId);
                if (!item) return null;
                
                return (
                  <div key={response.itemId} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex-1">
                      <span className="font-medium text-slate-700">Item {item.id}: </span>
                      <span className="text-slate-600 text-sm">
                        {language === 'en' ? item.description.en : item.description.ml}
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      response.score === 1 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {response.score === 1 
                        ? (language === 'en' ? 'Pass' : 'വിജയം')
                        : (language === 'en' ? 'Fail' : 'പരാജയം')}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

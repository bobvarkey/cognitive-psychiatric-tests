import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MiniCogResults as MiniCogResultsType, MINI_COG_WORD_LISTS } from '@/types/minicog';
import { Brain, FileText, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';

interface MiniCogResultsProps {
  results: MiniCogResultsType;
  patientInfo: {
    name: string;
    age: string;
    date: string;
  };
  onRestart: () => void;
}

export const MiniCogResults = ({ results, patientInfo, onRestart }: MiniCogResultsProps) => {
  const { language } = useLanguage();
  
  const getSeverityColor = () => {
    if (results.totalScore >= 4) return 'text-green-600';
    if (results.totalScore === 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityBadge = () => {
    if (results.totalScore >= 4) {
      return <Badge className="bg-green-100 text-green-800 border-green-300">
        {language === 'en' ? 'Low Risk' : 'കുറഞ്ഞ അപകടസാധ്യത'}
      </Badge>;
    }
    if (results.totalScore === 3) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
        {language === 'en' ? 'Borderline - Consider Further Evaluation' : 'അതിർത്തി - കൂടുതൽ വിലയിരുത്തൽ പരിഗണിക്കുക'}
      </Badge>;
    }
    return <Badge className="bg-red-100 text-red-800 border-red-300">
      {language === 'en' ? 'Positive Screen - Further Evaluation Recommended' : 'പോസിറ്റീവ് സ്ക്രീൻ - കൂടുതൽ വിലയിരുത്തൽ ശുപാർശ ചെയ്യുന്നു'}
    </Badge>;
  };

  const wordList = MINI_COG_WORD_LISTS.find(list => list.version === results.wordListVersion);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-800">
              {language === 'en' ? 'Mini-Cog™ Results' : 'Mini-Cog™ ഫലങ്ങൾ'}
            </h1>
          </div>
          <p className="text-slate-600">
            {language === 'en' ? 'Cognitive Screening Assessment Results' : 'വൈജ്ഞാനിക സ്ക്രീനിംഗ് വിലയിരുത്തൽ ഫലങ്ങൾ'}
          </p>
        </div>

        {/* Patient Information */}
        {(patientInfo.name || patientInfo.age || patientInfo.date) && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {language === 'en' ? 'Patient Information' : 'രോഗിയുടെ വിവരങ്ങൾ'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {patientInfo.name && (
                  <div>
                    <span className="font-semibold text-slate-700">
                      {language === 'en' ? 'Name:' : 'പേര്:'}
                    </span>
                    <p className="text-slate-900">{patientInfo.name}</p>
                  </div>
                )}
                {patientInfo.age && (
                  <div>
                    <span className="font-semibold text-slate-700">
                      {language === 'en' ? 'Age:' : 'പ്രായം:'}
                    </span>
                    <p className="text-slate-900">{patientInfo.age}</p>
                  </div>
                )}
                {patientInfo.date && (
                  <div>
                    <span className="font-semibold text-slate-700">
                      {language === 'en' ? 'Date:' : 'തീയതി:'}
                    </span>
                    <p className="text-slate-900">{patientInfo.date}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overall Score */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {language === 'en' ? 'Total Score' : 'മൊത്തം സ്കോർ'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className={`text-6xl font-bold ${getSeverityColor()}`}>
                {results.totalScore}<span className="text-2xl text-slate-600">/5</span>
              </div>
              <Progress value={(results.totalScore / 5) * 100} className="h-3" />
              <div className="flex justify-center">
                {getSeverityBadge()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardTitle>{language === 'en' ? 'Score Breakdown' : 'സ്കോർ വിശദാംശങ്ങൾ'}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-900">
                    {language === 'en' ? 'Word Recall' : 'വാക്ക് തിരിച്ചുവിളിക്കൽ'}
                  </h4>
                  <span className="text-2xl font-bold text-blue-700">
                    {results.wordRecallScore}/3
                  </span>
                </div>
                {wordList && (
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">
                      {language === 'en' ? 'Word List Version' : 'വാക്ക് പട്ടിക പതിപ്പ്'} {results.wordListVersion}:
                    </p>
                    <ul className="list-disc list-inside">
                      {(language === 'en' ? wordList.words : wordList.wordsMl || wordList.words).map((word, idx) => (
                        <li key={idx}>{word}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-green-900">
                    {language === 'en' ? 'Clock Drawing' : 'ക്ലോക്ക് വരയൽ'}
                  </h4>
                  <span className="text-2xl font-bold text-green-700">
                    {results.clockDrawScore}/2
                  </span>
                </div>
                <p className="text-sm text-green-800">
                  {results.clockDrawScore === 2 
                    ? (language === 'en' ? 'Normal clock drawing' : 'സാധാരണ ക്ലോക്ക് വരയൽ')
                    : (language === 'en' ? 'Abnormal clock drawing' : 'അസാധാരണ ക്ലോക്ക് വരയൽ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interpretation */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
            <CardTitle className="flex items-center gap-2">
              {results.totalScore >= 3 ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
              {language === 'en' ? 'Clinical Interpretation' : 'ക്ലിനിക്കൽ വ്യാഖ്യാനം'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose max-w-none">
              <p className="text-base font-bold text-slate-900 mb-4 p-4 rounded-lg bg-gradient-to-r from-orange-100 via-red-50 to-pink-100 border-l-4 border-red-500 shadow-sm">
                {results.interpretation}
              </p>
              
              <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-5 rounded-lg border-2 border-amber-300 mt-4 shadow-md">
                <h4 className="font-extrabold text-amber-900 mb-3 flex items-center gap-2 text-lg uppercase tracking-wide">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  {language === 'en' ? 'Important Notes:' : 'പ്രധാന കുറിപ്പുകൾ:'}
                </h4>
                <ul className="space-y-2.5 text-sm font-semibold">
                  {language === 'en' ? (
                    <>
                      <li className="flex gap-2 text-blue-900"><span className="text-blue-600 font-bold">▸</span><span>A cut point of <span className="font-extrabold text-red-600">&lt;3</span> has been validated for dementia screening</span></li>
                      <li className="flex gap-2 text-purple-900"><span className="text-purple-600 font-bold">▸</span><span>A cut point of <span className="font-extrabold text-red-600">&lt;4</span> is recommended when greater sensitivity is desired</span></li>
                      <li className="flex gap-2 text-emerald-900"><span className="text-emerald-600 font-bold">▸</span><span>This is a <span className="font-extrabold text-emerald-700">screening tool</span> - positive screens require comprehensive evaluation</span></li>
                      <li className="flex gap-2 text-orange-900"><span className="text-orange-600 font-bold">▸</span><span>Many individuals with clinically meaningful cognitive impairment may score <span className="font-extrabold text-red-600">≥3</span></span></li>
                      <li className="flex gap-2 text-pink-900"><span className="text-pink-600 font-bold">▸</span><span>Consider patient's <span className="font-extrabold">baseline, education, and other clinical factors</span></span></li>
                    </>
                  ) : (
                    <>
                      <li className="flex gap-2 text-blue-900"><span className="text-blue-600 font-bold">▸</span><span>ഡിമെൻഷ്യ സ്ക്രീനിംഗിനായി <span className="font-extrabold text-red-600">&lt;3</span> എന്ന കട്ട് പോയിന്റ് സാധൂകരിച്ചിട്ടുണ്ട്</span></li>
                      <li className="flex gap-2 text-purple-900"><span className="text-purple-600 font-bold">▸</span><span>കൂടുതൽ സംവേദനക്ഷമത ആവശ്യമുള്ളപ്പോൾ <span className="font-extrabold text-red-600">&lt;4</span> എന്ന കട്ട് പോയിന്റ് ശുപാർശ ചെയ്യുന്നു</span></li>
                      <li className="flex gap-2 text-emerald-900"><span className="text-emerald-600 font-bold">▸</span><span>ഇത് ഒരു <span className="font-extrabold text-emerald-700">സ്ക്രീനിംഗ് ഉപകരണമാണ്</span> - പോസിറ്റീവ് സ്ക്രീനുകൾക്ക് സമഗ്ര വിലയിരുത്തൽ ആവശ്യമാണ്</span></li>
                      <li className="flex gap-2 text-orange-900"><span className="text-orange-600 font-bold">▸</span><span>ക്ലിനിക്കലായി അർത്ഥവത്തായ വൈജ്ഞാനിക വൈകല്യമുള്ള പല വ്യക്തികളും <span className="font-extrabold text-red-600">≥3</span> സ്കോർ നേടിയേക്കാം</span></li>
                      <li className="flex gap-2 text-pink-900"><span className="text-pink-600 font-bold">▸</span><span>രോഗിയുടെ <span className="font-extrabold">അടിസ്ഥാനം, വിദ്യാഭ്യാസം, മറ്റ് ക്ലിനിക്കൽ ഘടകങ്ങൾ</span> പരിഗണിക്കുക</span></li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 print:hidden">
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {language === 'en' ? 'Print Results' : 'ഫലങ്ങൾ പ്രിന്റ് ചെയ്യുക'}
          </Button>
          <Button
            onClick={onRestart}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
          >
            <RotateCcw className="h-4 w-4" />
            {language === 'en' ? 'New Assessment' : 'പുതിയ വിലയിരുത്തൽ'}
          </Button>
        </div>
      </div>
    </div>
  );
};

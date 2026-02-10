import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MiniCogItem } from '@/types/minicog';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MiniCogItemCardProps {
  item: MiniCogItem;
  currentScore: number;
  onScoreChange: (itemId: string, score: number) => void;
}

export const MiniCogItemCard = ({ item, currentScore, onScoreChange }: MiniCogItemCardProps) => {
  const { language } = useLanguage();
  
  const handleScoreChange = (value: string) => {
    onScoreChange(item.id, parseInt(value));
  };

  const getStepColor = () => {
    switch (item.step) {
      case 'registration':
        return 'from-blue-500 to-cyan-600';
      case 'clock':
        return 'from-green-500 to-emerald-600';
      case 'recall':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-slate-500 to-gray-600';
    }
  };

  const renderScoreOptions = () => {
    if (item.step === 'registration') {
      return (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {language === 'en' 
              ? 'This step is for registration only. No points are awarded. Move to the next step.'
              : 'ഈ ഘട്ടം രജിസ്ട്രേഷനുവേണ്ടി മാത്രമാണ്. പോയിന്റുകളൊന്നും നൽകുന്നില്ല. അടുത്ത ഘട്ടത്തിലേക്ക് പോകുക.'}
          </p>
          {item.wordList && (
            <div className="mt-3">
              <p className="font-semibold text-blue-900 mb-2">
                {language === 'en' ? 'Word List:' : 'വാക്ക് പട്ടിക:'}
              </p>
              <ul className="list-disc list-inside space-y-1">
                {item.wordList.map((word, idx) => (
                  <li key={idx} className="text-blue-800">{word}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    if (item.step === 'clock') {
      return (
        <RadioGroup value={currentScore.toString()} onValueChange={handleScoreChange}>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <RadioGroupItem value="2" id={`${item.id}-2`} />
              <Label htmlFor={`${item.id}-2`} className="flex-1 cursor-pointer">
                <div className="font-medium text-green-700">
                  {language === 'en' ? 'Normal Clock (2 points)' : 'സാധാരണ ക്ലോക്ക് (2 പോയിന്റുകൾ)'}
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  {language === 'en'
                    ? 'All numbers in correct sequence and approximately correct position (12, 3, 6, 9 in anchor positions). No missing or duplicate numbers. Hands pointing to 11 and 2 (11:10).'
                    : 'എല്ലാ സംഖ്യകളും ശരിയായ ക്രമത്തിലും ഏകദേശം ശരിയായ സ്ഥാനത്തും (12, 3, 6, 9 ആങ്കർ സ്ഥാനങ്ങളിൽ). കാണാതായതോ ഡ്യൂപ്ലിക്കേറ്റ് സംഖ്യകളോ ഇല്ല. കൈകൾ 11-ഉം 2-ഉം (11:10) ചൂണ്ടുന്നു.'}
                </p>
              </Label>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <RadioGroupItem value="0" id={`${item.id}-0`} />
              <Label htmlFor={`${item.id}-0`} className="flex-1 cursor-pointer">
                <div className="font-medium text-red-700">
                  {language === 'en' ? 'Abnormal Clock (0 points)' : 'അസാധാരണ ക്ലോക്ക് (0 പോയിന്റുകൾ)'}
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  {language === 'en'
                    ? 'Inability or refusal to draw a clock, or errors in number placement or hand positioning.'
                    : 'ക്ലോക്ക് വരയ്ക്കാനുള്ള കഴിവില്ലായ്മ അല്ലെങ്കിൽ വിസമ്മതം, അല്ലെങ്കിൽ സംഖ്യ സ്ഥാനീകരണത്തിലോ കൈ സ്ഥാനത്തിലോ പിശകുകൾ.'}
                </p>
              </Label>
            </div>
          </div>
        </RadioGroup>
      );
    }

    if (item.step === 'recall') {
      return (
        <RadioGroup value={currentScore.toString()} onValueChange={handleScoreChange}>
          <div className="space-y-3">
            {[0, 1, 2, 3].map((score) => (
              <div key={score} className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                <Label htmlFor={`${item.id}-${score}`} className="flex-1 cursor-pointer">
                  <div className="font-medium">
                    {language === 'en' ? (
                      <>
                        {score === 0 && 'No words recalled'}
                        {score === 1 && '1 word recalled'}
                        {score === 2 && '2 words recalled'}
                        {score === 3 && 'All 3 words recalled'}
                        {' '}
                        <span className="text-slate-600">({score} {score === 1 ? 'point' : 'points'})</span>
                      </>
                    ) : (
                      <>
                        {score === 0 && 'വാക്കുകളൊന്നും തിരിച്ചുവിളിച്ചില്ല'}
                        {score === 1 && '1 വാക്ക് തിരിച്ചുവിളിച്ചു'}
                        {score === 2 && '2 വാക്കുകൾ തിരിച്ചുവിളിച്ചു'}
                        {score === 3 && 'എല്ലാ 3 വാക്കുകളും തിരിച്ചുവിളിച്ചു'}
                        {' '}
                        <span className="text-slate-600">({score} പോയിന്റ്{score !== 1 ? 'കൾ' : ''})</span>
                      </>
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      );
    }

    return null;
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className={`bg-gradient-to-r ${getStepColor()} text-white rounded-t-lg`}>
        <CardTitle className="text-2xl">
          {item.title}
        </CardTitle>
        <p className="text-white/90 text-sm mt-2">{item.description}</p>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="bg-slate-50 p-4 rounded-lg">
          <h4 className="font-semibold text-slate-800 mb-2">
            {language === 'en' ? 'Instructions:' : 'നിർദ്ദേശങ്ങൾ:'}
          </h4>
          <p className="text-sm text-slate-700 whitespace-pre-line">{item.instructions}</p>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-slate-800">
            {item.step === 'registration' 
              ? (language === 'en' ? 'Word List to Read' : 'വായിക്കാനുള്ള വാക്ക് പട്ടിക')
              : (language === 'en' ? 'Score' : 'സ്കോർ')}
          </Label>
          {renderScoreOptions()}
        </div>
      </CardContent>
    </Card>
  );
};

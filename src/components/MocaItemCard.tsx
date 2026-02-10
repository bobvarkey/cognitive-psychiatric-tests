import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { MocaItem } from '@/types/moca';
import { mocaScaleEnglish, mocaScaleMalayalam } from '@/data/mocaScale';

interface MocaItemCardProps {
  item: MocaItem;
  currentScore: number;
  onScoreChange: (itemId: string, score: number) => void;
}

export const MocaItemCard = ({ item, currentScore, onScoreChange }: MocaItemCardProps) => {
  const { t } = useLanguage();
  
  // Get the corresponding Malayalam item
  const malayalamItem = mocaScaleMalayalam.find(mlItem => mlItem.id === item.id);

  const generateScoreOptions = (maxScore: number) => {
    const options = [];
    for (let i = 0; i <= maxScore; i++) {
      options.push({
        value: i,
        label: i === 0 ? t('incorrect') : i === maxScore ? t('correct') : `${i}/${maxScore}`
      });
    }
    return options;
  };

  const scoreOptions = generateScoreOptions(item.maxScore);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{item.title}</CardTitle>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {t(item.domain)} - {item.maxScore} {t('points')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <p className="text-slate-700 text-lg font-medium">{item.description}</p>
            {malayalamItem && (
              <p className="text-slate-600 text-base mt-2 italic">{malayalamItem.description}</p>
            )}
          </div>
          
          {item.instructions && (
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-blue-800 font-medium">{t('instructions')}:</p>
              <p className="text-blue-700 mt-1">{item.instructions}</p>
              {malayalamItem?.instructions && (
                <p className="text-blue-600 mt-2 italic">{malayalamItem.instructions}</p>
              )}
            </div>
          )}

          {item.imageUrl && (
            <div className="flex justify-center p-4 bg-slate-50 rounded-lg">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="max-w-full max-h-64 object-contain"
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-slate-700">
            {t('score')} (0-{item.maxScore}):
          </Label>
          <RadioGroup
            value={currentScore.toString()}
            onValueChange={(value) => onScoreChange(item.id, parseInt(value))}
            className="flex flex-wrap gap-4"
          >
            {scoreOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.value.toString()} 
                  id={`${item.id}-${option.value}`}
                />
                <Label 
                  htmlFor={`${item.id}-${option.value}`}
                  className="text-sm cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
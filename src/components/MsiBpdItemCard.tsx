import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MsiBpdItem, MsiBpdResponse } from '@/types/msibpd';
import { useLanguage } from '@/contexts/LanguageContext';

interface MsiBpdItemCardProps {
  item: MsiBpdItem;
  response?: MsiBpdResponse;
  onResponse: (itemId: number, score: 0 | 1) => void;
}

export const MsiBpdItemCard = ({ item, response, onResponse }: MsiBpdItemCardProps) => {
  const { language, t } = useLanguage();
  const question = language === 'ml' ? item.questionMl : item.question;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-rose-600">Item {item.id}</span>
          </div>
          <p className="text-slate-700 font-medium">{question}</p>
        </div>

        <RadioGroup
          value={response?.score.toString()}
          onValueChange={(value) => onResponse(item.id, parseInt(value) as 0 | 1)}
        >
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id={`${item.id}-no`} />
              <Label htmlFor={`${item.id}-no`} className="cursor-pointer">
                {t('no')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id={`${item.id}-yes`} />
              <Label htmlFor={`${item.id}-yes`} className="cursor-pointer">
                {t('yes')}
              </Label>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

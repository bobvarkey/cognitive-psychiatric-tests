import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AdhdCriterion } from '@/types/adhd';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdhdCriterionCardProps {
  criterion: AdhdCriterion;
  met: boolean;
  onChange: (met: boolean) => void;
}

export const AdhdCriterionCard = ({ criterion, met, onChange }: AdhdCriterionCardProps) => {
  const { language } = useLanguage();

  return (
    <Card className={`mb-3 shadow-sm ${met ? 'ring-2 ring-green-500 bg-green-50' : 'bg-slate-50'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold bg-slate-700 text-white px-2 py-0.5 rounded">
                Criterion {criterion.id}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                met ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {met ? (language === 'ml' ? 'പാലിക്കുന്നു' : 'Met') : (language === 'ml' ? 'പാലിക്കുന്നില്ല' : 'Not Met')}
              </span>
            </div>
            <Label htmlFor={`criterion-${criterion.id}`} className="cursor-pointer">
              <p className="font-medium text-slate-800 mb-1">{criterion.question}</p>
              <p className="text-sm text-slate-600 mb-2">{criterion.description}</p>
              <div className="border-t pt-2 mt-2">
                <p className="font-medium text-slate-700">{criterion.questionMl}</p>
                <p className="text-sm text-slate-500">{criterion.descriptionMl}</p>
              </div>
            </Label>
          </div>
          <Switch
            id={`criterion-${criterion.id}`}
            checked={met}
            onCheckedChange={onChange}
            className="data-[state=checked]:bg-green-600"
          />
        </div>
      </CardContent>
    </Card>
  );
};

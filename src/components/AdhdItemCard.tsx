import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AdhdSymptom } from '@/types/adhd';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdhdItemCardProps {
  symptom: AdhdSymptom;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const AdhdItemCard = ({ symptom, checked, onChange }: AdhdItemCardProps) => {
  const { language } = useLanguage();
  const isInattention = symptom.domain === 'inattention';

  return (
    <Card className={`mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
      checked ? (isInattention ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'ring-2 ring-amber-500 bg-amber-50') : ''
    }`}
    onClick={() => onChange(!checked)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Checkbox 
            id={symptom.id}
            checked={checked}
            onCheckedChange={onChange}
            className={`mt-1 ${isInattention ? 'data-[state=checked]:bg-indigo-600' : 'data-[state=checked]:bg-amber-600'}`}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex-1">
            <Label 
              htmlFor={symptom.id} 
              className="cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  isInattention ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {symptom.id.toUpperCase()}
                </span>
                <span className="font-semibold text-slate-800">{symptom.label}</span>
              </div>
              <p className="text-sm text-slate-600 mb-1">{symptom.description}</p>
              {language === 'ml' && (
                <div className="border-t pt-2 mt-2">
                  <p className="font-medium text-slate-700">{symptom.labelMl}</p>
                  <p className="text-sm text-slate-500">{symptom.descriptionMl}</p>
                </div>
              )}
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

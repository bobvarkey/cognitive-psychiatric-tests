import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AdhdCriterion } from '@/types/adhd';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdhdCriterionCardProps {
  criterion: AdhdCriterion;
  /** undefined = not yet answered; false is an explicit "Not met" answer. */
  met: boolean | undefined;
  onChange: (met: boolean) => void;
}

export const AdhdCriterionCard = ({ criterion, met, onChange }: AdhdCriterionCardProps) => {
  const { language } = useLanguage();

  return (
    <Card className={`mb-3 shadow-sm ${met === true ? 'ring-2 ring-green-500 bg-green-50' : met === false ? 'ring-2 ring-slate-400 bg-slate-50' : 'bg-slate-50'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold bg-slate-700 text-white px-2 py-0.5 rounded">
                Criterion {criterion.id}
              </span>
              {met !== undefined && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  met ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {met ? (language === 'ml' ? 'പാലിക്കുന്നു' : 'Met') : (language === 'ml' ? 'പാലിക്കുന്നില്ല' : 'Not Met')}
                </span>
              )}
            </div>
            <Label id={`criterion-${criterion.id}-label`}>
              <p className="font-medium text-slate-800 mb-1">{criterion.question}</p>
              <p className="text-sm text-slate-600 mb-2">{criterion.description}</p>
              {language === 'ml' && (
                <div className="border-t pt-2 mt-2">
                  <p className="font-medium text-slate-700">{criterion.questionMl}</p>
                  <p className="text-sm text-slate-500">{criterion.descriptionMl}</p>
                </div>
              )}
            </Label>
          </div>
          <div role="radiogroup" aria-labelledby={`criterion-${criterion.id}-label`} className="flex shrink-0 flex-col gap-2 sm:flex-row">
            {([true, false] as const).map((value) => {
              const selected = met === value;
              const label = value
                ? (language === 'ml' ? 'പാലിക്കുന്നു' : 'Met')
                : (language === 'ml' ? 'പാലിക്കുന്നില്ല' : 'Not met');
              return (
                <button
                  key={String(value)}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onChange(value)}
                  className={`min-h-11 whitespace-nowrap rounded-md border px-3 text-sm font-medium transition-colors ${
                    selected
                      ? value ? 'border-green-600 bg-green-600 text-white' : 'border-slate-600 bg-slate-600 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

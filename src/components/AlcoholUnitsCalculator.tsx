import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FlaskConical, Plus, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Props { onBack?: () => void }

type Drink = {
  id: number;
  name: string;
  volumeMl: number;
  abv: number;
  daysPerWeek: number;
};

const PRESET_DRINKS: Omit<Drink, 'id'>[] = [
  { name: 'Pint beer/lager (4%)', volumeMl: 568, abv: 4 },
  { name: '330 ml beer (5%)', volumeMl: 330, abv: 5 },
  { name: 'Wine 175 ml (13%)', volumeMl: 175, abv: 13 },
  { name: 'Wine 250 ml (13%)', volumeMl: 250, abv: 13 },
  { name: 'Spirit 25 ml (40%)', volumeMl: 25, abv: 40 },
  { name: 'Spirit 35 ml (40%)', volumeMl: 35, abv: 40 },
];

const WEEKLY_LOW_RISK_LIMIT = 14;

const calcUnits = (volumeMl: number, abv: number) => (abv * volumeMl) / 1000;

const riskCategory = (totalUnits: number) => {
  if (totalUnits <= WEEKLY_LOW_RISK_LIMIT) {
    return { label: 'Within low-risk guideline', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  }
  if (totalUnits <= 35) {
    return { label: 'Increasing risk', className: 'bg-orange-100 text-orange-800 border-orange-300' };
  }
  return { label: 'Higher risk', className: 'bg-red-100 text-red-800 border-red-300' };
};

export const AlcoholUnitsCalculator = ({ onBack }: Props) => {
  const { t } = useLanguage();
  const [drinks, setDrinks] = useState<Drink[]>([
    { id: 1, name: 'Custom drink', volumeMl: 500, abv: 5 },
  ]);
  const [nextId, setNextId] = useState(2);

  const handleChange = (id: number, field: keyof Omit<Drink, 'id'>, value: string) => {
    setDrinks((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              [field]:
                field === 'name'
                  ? value
                  : Number.isNaN(parseFloat(value)) ? 0 : parseFloat(value),
            }
          : d,
      ),
    );
  };

  const addDrink = () => {
    setDrinks((prev) => [...prev, { id: nextId, name: 'Custom drink', volumeMl: 500, abv: 5 }]);
    setNextId((i) => i + 1);
  };

  const removeDrink = (id: number) => setDrinks((prev) => prev.filter((d) => d.id !== id));

  const applyPreset = (id: number, preset: Omit<Drink, 'id'>) =>
    setDrinks((prev) => prev.map((d) => (d.id === id ? { ...d, ...preset } : d)));

  const totalUnits = drinks.reduce((sum, d) => sum + calcUnits(d.volumeMl, d.abv), 0);
  const category = riskCategory(totalUnits);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToMenu')}
          </Button>
        )}

        <Card className="shadow-xl">
          <CardContent className="p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
                <FlaskConical className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Alcohol Units Calculator</h1>
                <p className="text-sm text-slate-700">
                  Enter drink volume (ml) and strength (ABV%) to estimate units. One unit = 10 ml pure alcohol.
                  UK guideline: ≤ {WEEKLY_LOW_RISK_LIMIT} units per week.
                </p>
              </div>
            </div>

            {drinks.map((drink) => {
              const units = calcUnits(drink.volumeMl, drink.abv);
              return (
                <div key={drink.id} className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                  <div className="flex gap-2 items-center">
                    <Input
                      value={drink.name}
                      onChange={(e) => handleChange(drink.id, 'name', e.target.value)}
                      placeholder="Drink name"
                      className="flex-1 text-slate-900"
                    />
                    {drinks.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDrink(drink.id)}
                        aria-label="Remove drink"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-slate-600">Volume (ml)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={drink.volumeMl}
                        onChange={(e) => handleChange(drink.id, 'volumeMl', e.target.value)}
                        className="text-slate-900"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-600">Strength (ABV %)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={80}
                        step={0.1}
                        value={drink.abv}
                        onChange={(e) => handleChange(drink.id, 'abv', e.target.value)}
                        className="text-slate-900"
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <div className="text-sm font-semibold text-slate-900">
                        Units: {units.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        (ABV × ml) / 1000
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600">Quick presets</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {PRESET_DRINKS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => applyPreset(drink.id, preset)}
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs bg-slate-50 hover:bg-slate-100 text-slate-800"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            <Button type="button" variant="outline" onClick={addDrink}>
              <Plus className="mr-2 h-4 w-4" /> Add drink
            </Button>

            <div className="border-t border-slate-200 pt-4 space-y-2">
              <div className="text-lg font-bold text-slate-900">
                Total units: {totalUnits.toFixed(2)}
              </div>
              <Badge className={cn('text-sm border', category.className)}>{category.label}</Badge>
              <p className="text-xs text-slate-600">
                This calculator uses UK-style alcohol units and public low-risk guidance to support
                safer drinking decisions. It is not a substitute for medical advice or individualised
                risk assessment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlcoholUnitsCalculator;

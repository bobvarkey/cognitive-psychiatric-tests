import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CdsItem } from '@/types/cds';
import { cdsFrequencyOptions, cdsDurationOptions } from '@/data/cdsScale';

interface Props {
  item: CdsItem;
  frequency?: number;
  duration?: number;
  onChange: (itemId: number, frequency: number, duration: number) => void;
}

export const CdsItemCard = ({ item, frequency, duration, onChange }: Props) => {
  return (
    <Card className="border-l-4 border-l-cyan-500 transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-base font-medium leading-relaxed flex-1">
            {item.question}
          </CardTitle>
          <span className="text-sm font-semibold text-muted-foreground min-w-[2rem] text-right">
            #{item.id}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Frequency (last 6 months)
          </p>
          <RadioGroup
            value={frequency?.toString()}
            onValueChange={(v) => onChange(item.id, parseInt(v), duration ?? 1)}
            className="flex flex-wrap gap-3"
          >
            {cdsFrequencyOptions.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value.toString()} id={`cds-${item.id}-f-${opt.value}`} />
                <Label htmlFor={`cds-${item.id}-f-${opt.value}`} className="cursor-pointer text-sm font-normal">
                  {opt.value} — {opt.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Duration (when it occurs)
          </p>
          <RadioGroup
            value={duration?.toString()}
            onValueChange={(v) => onChange(item.id, frequency ?? 0, parseInt(v))}
            className="flex flex-wrap gap-3"
          >
            {cdsDurationOptions.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value.toString()} id={`cds-${item.id}-d-${opt.value}`} />
                <Label htmlFor={`cds-${item.id}-d-${opt.value}`} className="cursor-pointer text-sm font-normal">
                  {opt.value} — {opt.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

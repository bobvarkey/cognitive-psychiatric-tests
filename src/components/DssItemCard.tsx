import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DssItem } from '@/types/dss';
import { dssScoreOptions, DSS_DOMAIN_LABEL } from '@/data/dssScale';

interface Props {
  item: DssItem;
  selectedScore?: number;
  onScoreSelect: (itemId: number, score: number) => void;
}

const domainBorder: Record<string, string> = {
  depersonalization: 'border-l-purple-500',
  derealization: 'border-l-blue-500',
  gaps: 'border-l-amber-500',
  sensory: 'border-l-emerald-500',
  cognitive: 'border-l-rose-500',
  identity: 'border-l-fuchsia-500',
};

export const DssItemCard = ({ item, selectedScore, onScoreSelect }: Props) => {
  return (
    <Card
      className={`border-l-4 ${domainBorder[item.domain] ?? ''} transition-all hover:shadow-md`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {DSS_DOMAIN_LABEL[item.domain]}
              </span>
            </div>
            <CardTitle className="text-base font-medium leading-relaxed">
              {item.question}
            </CardTitle>
          </div>
          <span className="text-sm font-semibold text-muted-foreground min-w-[2rem] text-right">
            #{item.id}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-2">In the past 7 days, how often…</p>
        <RadioGroup
          value={selectedScore?.toString()}
          onValueChange={(v) => onScoreSelect(item.id, parseInt(v))}
          className="flex flex-wrap gap-3"
        >
          {dssScoreOptions.map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2">
              <RadioGroupItem value={opt.value.toString()} id={`dss-${item.id}-${opt.value}`} />
              <Label
                htmlFor={`dss-${item.id}-${opt.value}`}
                className="cursor-pointer text-sm font-normal"
              >
                {opt.value} — {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

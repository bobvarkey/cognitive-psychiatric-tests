import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DesItem } from '@/types/des';
import { desScoreOptions } from '@/data/desScale';

interface Props {
  item: DesItem;
  selectedScore?: number;
  onScoreSelect: (itemId: number, score: number) => void;
}

export const DesItemCard = ({ item, selectedScore, onScoreSelect }: Props) => {
  return (
    <Card
      className={`${
        item.taxon ? 'border-l-4 border-l-rose-500' : 'border-l-4 border-l-violet-500'
      } transition-all hover:shadow-md`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {item.taxon ? 'DES-T (taxon)' : 'DES-II'}
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
        <p className="text-xs text-muted-foreground mb-2">
          What percentage of the time does this happen to you (when not under the influence of
          alcohol or drugs)?
        </p>
        <RadioGroup
          value={selectedScore?.toString()}
          onValueChange={(v) => onScoreSelect(item.id, parseInt(v))}
          className="flex flex-wrap gap-3"
        >
          {desScoreOptions.map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2">
              <RadioGroupItem value={opt.value.toString()} id={`des-${item.id}-${opt.value}`} />
              <Label
                htmlFor={`des-${item.id}-${opt.value}`}
                className="cursor-pointer text-sm font-normal"
              >
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

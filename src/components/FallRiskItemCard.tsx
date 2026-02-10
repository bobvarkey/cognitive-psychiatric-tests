import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { SteadiItem, MorseItem } from "@/types/fallRisk";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SteadiItemCardProps {
  item: SteadiItem;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  index: number;
}

export function SteadiItemCard({ item, value, onChange, index }: SteadiItemCardProps) {
  const { language } = useLanguage();
  
  return (
    <Card className="mb-3">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id={item.id}
            checked={value || false}
            onCheckedChange={(checked) => onChange(checked === true)}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <Label htmlFor={item.id} className="text-sm font-medium cursor-pointer flex-1">
                <span className="text-muted-foreground mr-2">{index + 1}.</span>
                {language === 'ml' ? item.questionMl : item.question}
                <span className="ml-2 text-xs text-primary font-semibold">
                  ({item.points} {item.points > 1 ? 'pts' : 'pt'})
                </span>
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">
                      {language === 'ml' ? item.explanationMl : item.explanation}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MorseItemCardProps {
  item: MorseItem;
  value: number | undefined;
  onChange: (value: number) => void;
}

export function MorseItemCard({ item, value, onChange }: MorseItemCardProps) {
  const { language } = useLanguage();
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <Label className="text-sm font-medium mb-3 block">
          {language === 'ml' ? item.nameMl : item.name}
        </Label>
        <RadioGroup
          value={value?.toString()}
          onValueChange={(val) => onChange(parseInt(val))}
          className="space-y-2"
        >
          {item.options.map((option, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value.toString()} id={`${item.id}-${idx}`} />
              <Label htmlFor={`${item.id}-${idx}`} className="text-sm cursor-pointer flex-1">
                {language === 'ml' ? option.labelMl : option.label}
                <span className="ml-2 text-xs text-muted-foreground">
                  ({option.value} pts)
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

interface PhysicalAssessmentInputProps {
  label: string;
  labelMl: string;
  description: string;
  descriptionMl: string;
  value: number | null;
  onChange: (value: number | null) => void;
  unit?: string;
  placeholder?: string;
}

export function PhysicalAssessmentInput({
  label,
  labelMl,
  description,
  descriptionMl,
  value,
  onChange,
  unit,
  placeholder
}: PhysicalAssessmentInputProps) {
  const { language } = useLanguage();
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <Label className="text-sm font-medium mb-1 block">
          {language === 'ml' ? labelMl : label}
        </Label>
        <p className="text-xs text-muted-foreground mb-3">
          {language === 'ml' ? descriptionMl : description}
        </p>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
            placeholder={placeholder}
            className="w-32"
          />
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

interface BalanceTestCardProps {
  stages: { name: string; nameMl: string; duration: number }[];
  values: Record<string, boolean>;
  onChange: (stage: string, value: boolean) => void;
}

export function BalanceTestCard({ stages, values, onChange }: BalanceTestCardProps) {
  const { language } = useLanguage();
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <Label className="text-sm font-medium mb-3 block">
          {language === 'ml' ? '4-ഘട്ട ബാലൻസ് ടെസ്റ്റ്' : '4-Stage Balance Test'}
        </Label>
        <p className="text-xs text-muted-foreground mb-3">
          {language === 'ml' 
            ? 'ഓരോ ഘട്ടത്തിലും 10 സെക്കന്റ് നിലനിർത്താൻ കഴിഞ്ഞാൽ ടിക്ക് ചെയ്യുക'
            : 'Check if patient can hold position for 10 seconds at each stage'}
        </p>
        <div className="space-y-2">
          {stages.map((stage, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Checkbox
                id={`balance-${idx}`}
                checked={values[`stage${idx + 1}`] || false}
                onCheckedChange={(checked) => onChange(`stage${idx + 1}`, checked === true)}
              />
              <Label htmlFor={`balance-${idx}`} className="text-sm cursor-pointer">
                {language === 'ml' ? stage.nameMl : stage.name}
                <span className="text-xs text-muted-foreground ml-1">({stage.duration}s)</span>
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

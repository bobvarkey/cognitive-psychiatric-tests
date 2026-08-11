import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ClipboardList, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  FRAT_ITEMS,
  FRAT_AUTOMATIC_HIGH_RISK,
  FRAT_RISK_FACTOR_CHECKLIST,
  FRAT_BAND_LABELS,
  fratBandFromScore,
} from '@/data/fratScale';
import fallRiskAlgorithm from '@/assets/fall-risk-algorithm.png';

type FratResponses = {
  scores: Partial<Record<typeof FRAT_ITEMS[number]['id'], number>>;
  automaticHighRisk: Record<string, boolean>;
  checklist: Record<string, boolean>;
};

interface FratTabProps {
  responses: FratResponses;
  onChange: (next: FratResponses) => void;
}

export const FratTab = ({ responses, onChange }: FratTabProps) => {
  const { language } = useLanguage();
  const isMl = language === 'ml';

  const setItem = (id: typeof FRAT_ITEMS[number]['id'], value: number) =>
    onChange({ ...responses, scores: { ...responses.scores, [id]: value } });

  const toggleAuto = (id: string) =>
    onChange({
      ...responses,
      automaticHighRisk: { ...responses.automaticHighRisk, [id]: !responses.automaticHighRisk[id] },
    });

  const toggleChecklist = (id: string) =>
    onChange({
      ...responses,
      checklist: { ...responses.checklist, [id]: !responses.checklist[id] },
    });

  const total = useMemo(
    () => FRAT_ITEMS.reduce((sum, it) => sum + (responses.scores[it.id] ?? 0), 0),
    [responses.scores],
  );
  const allAnswered = FRAT_ITEMS.every(it => responses.scores[it.id] != null);
  const autoHigh = Object.values(responses.automaticHighRisk).some(Boolean);
  const band = allAnswered ? fratBandFromScore(total) : null;
  const effectiveBand = autoHigh ? 'high' : band;

  return (
    <div className="space-y-4">
      {/* BMJ 2025 Fall Risk Algorithm reference */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            {isMl ? 'വീഴ്ച അപകട സ്ട്രാറ്റിഫിക്കേഷൻ അൽഗോരിതം (BMJ 2025)' : 'Fall Risk Stratification Algorithm (BMJ 2025)'}
          </CardTitle>
          <CardDescription className="text-xs">
            {isMl
              ? 'കഴിഞ്ഞ 12 മാസത്തെ വീഴ്ച, നടത്തം/ബാലൻസ്, അപകട തീവ്രത എന്നിവ അടിസ്ഥാനമാക്കി കുറവ്/ഇടത്തരം/ഉയർന്ന അപകടസാധ്യതയിലേക്ക് ട്രയേജ് ചെയ്യുക.'
              : 'Triage to Low / Intermediate / High risk based on falls in past 12 months, gait & balance, and severity markers.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <img
            src={fallRiskAlgorithm}
            alt={isMl ? 'വീഴ്ച അപകട അൽഗോരിതം ഫ്ലോചാർട്ട്' : 'Fall risk algorithm flowchart'}
            className="w-full h-auto rounded-md border border-border bg-white"
            loading="lazy"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {isMl ? 'ഭാഗം 1: വീഴ്ച അപകട നില' : 'Part 1: Fall Risk Status'}
          </CardTitle>
          <CardDescription>
            {isMl
              ? 'ഓരോ ഘടകത്തിനും ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക. കുറവ് 5–11, ഇടത്തരം 12–15, ഉയർന്നത് 16–20.'
              : 'Select one option for each factor. Low 5–11, Medium 12–15, High 16–20.'}
          </CardDescription>
        </CardHeader>
      </Card>

      {FRAT_ITEMS.map((item, idx) => {
        const palette = ['border-l-blue-500', 'border-l-emerald-500', 'border-l-amber-500', 'border-l-rose-500'][idx];
        const value = responses.scores[item.id];
        return (
          <Card key={item.id} className={`border-l-4 ${palette}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">{idx + 1}</Badge>
                {isMl ? item.nameMl : item.name}
              </CardTitle>
              <CardDescription className="text-xs">
                {isMl ? item.descriptionMl : item.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {item.options.map(opt => {
                const selected = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setItem(item.id, opt.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                      selected
                        ? 'bg-primary/10 border-primary text-foreground'
                        : 'bg-card hover:bg-accent/50 border-border'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span>{isMl ? opt.labelMl : opt.label}</span>
                      <Badge variant={selected ? 'default' : 'outline'} className="shrink-0">
                        {opt.value}
                      </Badge>
                    </span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      {/* Total + band */}
      <Card
        className={`border-2 ${
          effectiveBand === 'high'
            ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30'
            : effectiveBand === 'medium'
            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
            : effectiveBand === 'low'
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
            : 'border-muted'
        }`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{isMl ? 'FRAT സ്കോർ' : 'FRAT Score'}</span>
            <span className="text-2xl font-bold">{total} / 20</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {effectiveBand ? (
            <p>
              <strong>
                {isMl ? FRAT_BAND_LABELS[effectiveBand].ml : FRAT_BAND_LABELS[effectiveBand].en}
              </strong>{' '}
              <span className="text-muted-foreground">
                ({FRAT_BAND_LABELS[effectiveBand].range})
              </span>
              {autoHigh && (
                <span className="ml-2 text-rose-600 font-medium">
                  · {isMl ? 'ഓട്ടോമാറ്റിക് ഉയർന്ന അപകടസാധ്യത' : 'Automatic high risk'}
                </span>
              )}
            </p>
          ) : (
            <p className="text-muted-foreground">
              {isMl ? 'എല്ലാ 4 ഘടകങ്ങളും പൂർത്തിയാക്കുക' : 'Complete all 4 factors to score'}
            </p>
          )}
          {effectiveBand === 'high' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {isMl
                  ? 'ഉയർന്ന അപകടസാധ്യത: ഫാൾ അലേർട്ട് ആരംഭിക്കുക, പരിചരണ പദ്ധതി/ഫ്ലോ ചാർട്ടിൽ വീഴ്ച നില രേഖപ്പെടുത്തുക.'
                  : 'High risk: commence Fall Alert and list fall status on care plan / flow chart.'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Automatic High Risk */}
      <Card className="border-l-4 border-l-rose-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            {isMl ? 'ഓട്ടോമാറ്റിക് ഉയർന്ന അപകടസാധ്യത' : 'Automatic High Risk'}
          </CardTitle>
          <CardDescription className="text-xs">
            {isMl
              ? 'ഏതെങ്കിലും ടിക്ക് ചെയ്താൽ ഉയർന്ന അപകടസാധ്യതയായി തരംതിരിക്കുക'
              : 'If any are ticked, classify as HIGH risk regardless of score'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {FRAT_AUTOMATIC_HIGH_RISK.map(opt => (
            <label
              key={opt.id}
              htmlFor={`frat-auto-${opt.id}`}
              className="flex items-start gap-2.5 p-2.5 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer"
            >
              <Checkbox
                id={`frat-auto-${opt.id}`}
                checked={!!responses.automaticHighRisk[opt.id]}
                onCheckedChange={() => toggleAuto(opt.id)}
                className="mt-0.5"
              />
              <span className="text-sm leading-tight">
                {isMl ? opt.labelMl : opt.label}
              </span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Part 2 Checklist */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" />
            {isMl ? 'ഭാഗം 2: അപകട ഘടക ചെക്ക്‌ലിസ്റ്റ്' : 'Part 2: Risk Factor Checklist'}
          </CardTitle>
          <CardDescription className="text-xs">
            {isMl
              ? 'ബാധകമായ എല്ലാ ഇനങ്ങളും ടിക്ക് ചെയ്യുക'
              : 'Tick any item that applies — guides targeted interventions'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {FRAT_RISK_FACTOR_CHECKLIST.map(row => (
            <label
              key={row.id}
              htmlFor={`frat-cl-${row.id}`}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                responses.checklist[row.id]
                  ? 'bg-primary/5 border-primary/40'
                  : 'bg-card hover:bg-accent/50'
              }`}
            >
              <Checkbox
                id={`frat-cl-${row.id}`}
                checked={!!responses.checklist[row.id]}
                onCheckedChange={() => toggleChecklist(row.id)}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {isMl ? row.domainMl : row.domain}
                </p>
                <p className="text-sm leading-tight mt-0.5">
                  {isMl ? row.itemMl : row.item}
                </p>
              </div>
            </label>
          ))}
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          {isMl
            ? 'പ്രസിദ്ധീകരണം: Stapleton C, et al. Australas J Ageing. 2009;28(3):139–143. ക്ലിനിക്കൽ അപ്‌ഡേറ്റ്: BMJ 2025;392:s223.'
            : 'Source: Stapleton C, et al. Four-item Fall Risk Screening Tool (FRAT). Australas J Ageing. 2009;28(3):139–143. Clinical update: BMJ 2025;392:s223.'}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export const emptyFratResponses = (): FratResponses => ({
  scores: {},
  automaticHighRisk: {},
  checklist: {},
});

export type { FratResponses };

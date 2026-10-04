import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, BookOpen, Check, ChevronDown, ExternalLink, Maximize2, RotateCcw, XCircle, CheckCircle2 } from 'lucide-react';
import { ExportButtons } from './ExportButtons';
import schoolerKaneImg from '@/assets/schooler-kane-criteria.png';
import {
  SCHOOLER_KANE_NAME,
  SK_IMAGE_ALT,
  SK_IMAGE_CAPTION,
  SK_EXPOSURE_LABEL,
  AIMS_EXAM_PROCEDURE,
  AIMS_ACTIVATION_NOTE,
  SEVERITY_ANCHORS,
  AWARENESS_ANCHORS,
  SK_AIMS_ITEMS,
  SK_RULE_OUTS,
  SK_NO_ALTERNATIVE_LABEL,
  SK_SUBTYPES,
  SK_TIMING_NOTE,
  SK_REFERENCES,
  SK_CRITERIA_LABELS,
  createInitialSchoolerKaneState,
  evaluateSchoolerKane,
  buildSchoolerKaneReport,
  type SchoolerKaneState,
  type SkAimsItem,
} from '@/data/schoolerKaneCriteria';

interface Props {
  onBack?: () => void;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

/** Tappable checkbox card. */
const CheckCard = ({
  checked,
  onToggle,
  label,
  tone = 'primary',
  disabled,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  tone?: 'primary' | 'danger';
  disabled?: boolean;
}) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    disabled={disabled}
    onClick={onToggle}
    className={cn(
      'w-full min-w-0 rounded-lg border-2 p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:cursor-not-allowed disabled:opacity-50',
      checked
        ? tone === 'danger'
          ? 'border-red-500 bg-red-500/10 dark:border-red-400'
          : 'border-primary bg-primary/10'
        : 'border-border bg-muted/40 hover:border-primary/60',
    )}
  >
    <div className="flex items-start gap-3">
      <span
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition',
          checked
            ? tone === 'danger'
              ? 'border-red-500 bg-red-500 text-white dark:border-red-400 dark:bg-red-500'
              : 'border-primary bg-primary text-primary-foreground'
            : 'sk-box border-input bg-card',
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" />}
      </span>
      <span className="min-w-0 flex-1 break-words text-sm font-medium text-foreground">{label}</span>
    </div>
  </button>
);

/** Row of rating chips 0-4 (or Yes/No). */
const RatingChips = ({
  item,
  value,
  onChange,
}: {
  item: SkAimsItem;
  value: number | boolean | undefined;
  onChange: (v: number | boolean) => void;
}) => {
  const options: { v: number | boolean; text: string }[] =
    item.kind === 'yesno'
      ? [
          { v: false, text: 'No' },
          { v: true, text: 'Yes' },
        ]
      : (item.kind === 'awareness' ? AWARENESS_ANCHORS : SEVERITY_ANCHORS).map((t, i) => ({ v: i, text: `${i} · ${t}` }));
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={item.label}>
      {options.map((o) => {
        const selected = value === o.v;
        return (
          <button
            key={String(o.v)}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.v)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition sm:text-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected
                ? 'sk-chip-on border-primary bg-primary text-primary-foreground shadow-sm'
                : 'sk-chip border-border bg-card text-foreground hover:border-primary/60',
            )}
          >
            {o.text}
          </button>
        );
      })}
    </div>
  );
};

const StatusPill = ({ met }: { met: boolean }) => (
  <span
    className={cn(
      'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
      met
        ? 'sk-ok bg-emerald-500/15 text-emerald-700'
        : 'sk-off bg-muted/60 text-muted-foreground',
    )}
  >
    {met ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
    {met ? 'Met' : 'Not met'}
  </span>
);

const SectionHeader = ({ n, title, met }: { n: number; title: string; met?: boolean }) => (
  <div className="flex flex-wrap items-center justify-between gap-2">
    <CardTitle className="flex min-w-0 items-center gap-2 text-base sm:text-lg">
      <span className="sk-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
        {n}
      </span>
      <span className="min-w-0 break-words">{title}</span>
    </CardTitle>
    {met !== undefined && <StatusPill met={met} />}
  </div>
);

export const SchoolerKaneAssessment = ({ onBack }: Props) => {
  const [state, setState] = useState<SchoolerKaneState>(createInitialSchoolerKaneState);
  const [procedureOpen, setProcedureOpen] = useState(false);
  const result = useMemo(() => evaluateSchoolerKane(state), [state]);
  const report = useMemo(() => buildSchoolerKaneReport(state), [state]);
  const qualifying = new Set(result.threshold.qualifyingIds);

  const setAims = (id: string, v: number) => setState((s) => ({ ...s, aims: { ...s.aims, [id]: v } }));
  const setDental = (id: string, v: boolean) => setState((s) => ({ ...s, dental: { ...s.dental, [id]: v } }));
  const toggleRuleOut = (id: string) =>
    setState((s) => {
      const ruleOuts = { ...s.ruleOuts, [id]: !s.ruleOuts[id] };
      const any = Object.values(ruleOuts).some(Boolean);
      return { ...s, ruleOuts, noAlternative: any ? false : s.noAlternative };
    });
  const reset = () => setState(createInitialSchoolerKaneState());

  const groups = Array.from(new Set(SK_AIMS_ITEMS.map((i) => i.group)));
  const items8to10 = SK_AIMS_ITEMS.filter((i) => i.number >= 8 && i.number <= 10);

  return (
    <div className="sk-scope mx-auto w-full max-w-3xl min-w-0 space-y-4 overflow-x-hidden p-3 sm:p-4">
      <div className="flex items-center gap-2">
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
      </div>

      <Card className="border-purple-500/30 bg-gradient-to-r from-purple-600/15 to-blue-600/15">
        <CardHeader className="space-y-3">
          <div>
            <CardTitle className="break-words text-xl text-foreground sm:text-2xl">{SCHOOLER_KANE_NAME}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Research diagnostic criteria for TD with embedded AIMS. Tap items to select.
            </p>
          </div>
          <figure className="mx-auto w-full max-w-[560px]">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label="Enlarge Schooler-Kane criteria infographic"
                  className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <img src={schoolerKaneImg} alt={SK_IMAGE_ALT} className="h-auto w-full" loading="lazy" />
                  <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] font-medium text-white">
                    <Maximize2 className="h-3 w-3" /> Tap to enlarge
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-h-[95vh] max-w-[95vw] overflow-auto p-2 sm:p-4">
                <DialogTitle className="sr-only">Schooler-Kane criteria infographic</DialogTitle>
                <img src={schoolerKaneImg} alt={SK_IMAGE_ALT} className="mx-auto h-auto max-h-[88vh] w-auto max-w-full object-contain" />
              </DialogContent>
            </Dialog>
            <figcaption className="mt-1.5 text-center text-xs italic text-muted-foreground">{SK_IMAGE_CAPTION}</figcaption>
          </figure>
        </CardHeader>
      </Card>

      {/* Section 1 */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <SectionHeader n={1} title="Neuroleptic exposure" met={result.exposureMet} />
        </CardHeader>
        <CardContent>
          <CheckCard
            checked={state.exposure}
            onToggle={() => setState((s) => ({ ...s, exposure: !s.exposure }))}
            label={SK_EXPOSURE_LABEL}
          />
        </CardContent>
      </Card>

      {/* Section 2 */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <SectionHeader n={2} title="Abnormal Involuntary Movement Scale (AIMS)" met={result.aimsMet} />
          <p className="text-xs text-muted-foreground sm:text-sm">
            Threshold: ≥1 body area (items 1-7) rated ≥3, or ≥2 body areas rated ≥2. Qualifying areas are highlighted.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Collapsible open={procedureOpen} onOpenChange={setProcedureOpen}>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-left text-sm font-semibold text-foreground hover:bg-muted"
              >
                <span>AIMS examination procedure (12 steps)</span>
                <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', procedureOpen && 'rotate-180')} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 space-y-2 rounded-lg border border-border bg-card p-3 text-sm text-foreground">
                <p className="text-xs text-muted-foreground">
                  Observe the patient unobtrusively at rest (e.g. in the waiting room) before the examination.
                </p>
                <ol className="list-decimal space-y-1.5 pl-5">
                  {AIMS_EXAM_PROCEDURE.map((step, i) => (
                    <li key={i} className="break-words">{step}</li>
                  ))}
                </ol>
                <p className="sk-warn rounded-md bg-amber-500/10 p-2 text-xs font-medium text-amber-800">
                  {AIMS_ACTIVATION_NOTE}
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {groups.map((group) => (
            <div key={group} className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group}</h3>
              {SK_AIMS_ITEMS.filter((i) => i.group === group).map((item) => {
                const isQualifying = qualifying.has(item.id);
                const value = item.kind === 'yesno' ? state.dental[item.id] : state.aims[item.id];
                return (
                  <div
                    key={item.id}
                    data-qualifying={isQualifying || undefined}
                    className={cn(
                      'min-w-0 space-y-2 rounded-lg border-2 p-3 transition',
                      isQualifying ? 'border-amber-500 bg-amber-500/10 dark:border-amber-400' : 'border-border bg-muted/20',
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="min-w-0 flex-1 break-words text-sm font-semibold text-foreground">
                        {item.number}. {item.label}
                      </p>
                      {isQualifying && (
                        <span className="sk-warn shrink-0 rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                          Qualifying
                        </span>
                      )}
                    </div>
                    {item.description && <p className="break-words text-xs text-muted-foreground">{item.description}</p>}
                    <RatingChips
                      item={item}
                      value={value}
                      onChange={(v) => (item.kind === 'yesno' ? setDental(item.id, v as boolean) : setAims(item.id, v as number))}
                    />
                  </div>
                );
              })}
            </div>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 p-3">
            <span className="text-sm font-medium text-foreground">AIMS total (items 1-7)</span>
            <span className="sk-primary text-lg font-bold text-primary">{result.aimsTotal}/28</span>
          </div>
        </CardContent>
      </Card>

      {/* Section 3 */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <SectionHeader n={3} title="Exclusion of other causes" met={result.exclusionMet} />
          <p className="text-xs text-muted-foreground sm:text-sm">Tick any alternative cause present. Any ticked cause means this criterion is not met.</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {SK_RULE_OUTS.map((ro) => (
            <CheckCard
              key={ro.id}
              checked={!!state.ruleOuts[ro.id]}
              onToggle={() => toggleRuleOut(ro.id)}
              label={ro.label}
              tone="danger"
            />
          ))}
          <div className="pt-2">
            <CheckCard
              checked={state.noAlternative}
              disabled={result.anyRuleOut}
              onToggle={() => setState((s) => ({ ...s, noAlternative: !s.noAlternative }))}
              label={SK_NO_ALTERNATIVE_LABEL}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 4 */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <SectionHeader n={4} title="Subclassification" />
          <p className="text-xs text-muted-foreground sm:text-sm">Select the subtype that best fits the course on serial examinations.</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <div role="radiogroup" aria-label="TD subtype" className="space-y-2">
            {SK_SUBTYPES.map((st) => {
              const selected = state.subtype === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setState((s) => ({ ...s, subtype: s.subtype === st.id ? undefined : st.id }))}
                  className={cn(
                    'w-full min-w-0 rounded-lg border-2 p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    selected ? 'border-primary bg-primary/10' : 'border-border bg-muted/40 hover:border-primary/60',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                        selected ? 'border-primary bg-primary text-primary-foreground' : 'sk-box border-input bg-card',
                      )}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-foreground">{st.name}</span>
                      <span className="mt-0.5 block break-words text-xs text-muted-foreground sm:text-sm">{st.definition}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="pt-1 text-xs italic text-muted-foreground">{SK_TIMING_NOTE}</p>
        </CardContent>
      </Card>

      {/* Live result */}
      <Card
        className={cn(
          'border-2 bg-card',
          result.meetsProbable ? 'border-emerald-500/50' : 'border-border',
        )}
        aria-live="polite"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground">Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="min-w-0 rounded-lg border border-border bg-muted/50 p-3">
              <div className="text-xs text-muted-foreground">AIMS total (1-7)</div>
              <div className="sk-primary text-2xl font-bold text-primary">{result.aimsTotal}<span className="text-sm font-medium text-muted-foreground">/28</span></div>
            </div>
            {items8to10.map((item) => {
              const v = state.aims[item.id];
              const anchors = item.kind === 'awareness' ? AWARENESS_ANCHORS : SEVERITY_ANCHORS;
              return (
                <div key={item.id} className="min-w-0 rounded-lg border border-border bg-muted/50 p-3">
                  <div className="break-words text-xs text-muted-foreground">{item.number}. {item.short}</div>
                  <div className="text-2xl font-bold text-foreground">{v ?? '–'}</div>
                  {v !== undefined && <div className="break-words text-[11px] text-muted-foreground">{anchors[v]}</div>}
                </div>
              );
            })}
          </div>

          <ul className="space-y-2">
            {([
              [SK_CRITERIA_LABELS.exposure, result.exposureMet],
              [SK_CRITERIA_LABELS.aims, result.aimsMet],
              [SK_CRITERIA_LABELS.exclusion, result.exclusionMet],
            ] as const).map(([label, met]) => (
              <li key={label} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card p-2.5">
                <span className="min-w-0 break-words text-sm text-foreground">{label}</span>
                <StatusPill met={met} />
              </li>
            ))}
          </ul>

          <div
            className={cn(
              'rounded-lg border p-3',
              result.meetsProbable
                ? 'border-emerald-500/40 bg-emerald-500/10'
                : 'border-amber-500/40 bg-amber-500/10',
            )}
          >
            <p
              className={cn(
                'break-words text-sm font-semibold',
                result.meetsProbable ? 'sk-ok text-emerald-800' : 'sk-warn text-amber-900',
              )}
            >
              {result.meetsProbable ? 'Meets Schooler-Kane criteria for probable TD' : 'Does not meet Schooler-Kane criteria for probable TD'}
            </p>
            {!result.meetsProbable && (
              <p className="mt-1 break-words text-xs text-foreground/80 sm:text-sm">Missing: {result.missing.join('; ')}</p>
            )}
          </div>

          {result.subtype && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
              <p className="text-sm font-semibold text-foreground">Subtype: {result.subtype.name}</p>
              <p className="mt-0.5 break-words text-xs text-muted-foreground sm:text-sm">{result.subtype.definition}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <ExportButtons data={report} className="flex-wrap" />
            <Button variant="outline" size="sm" onClick={reset} className="flex items-center gap-1.5">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* References */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm text-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            References
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-1.5 pl-5 text-xs text-muted-foreground">
            {SK_REFERENCES.map((ref) => (
              <li key={ref.label} className="break-words">
                {ref.url ? (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="inline break-words text-primary hover:underline">
                    {ref.label}
                    <ExternalLink className="ml-1 inline h-3 w-3" />
                  </a>
                ) : (
                  ref.label
                )}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

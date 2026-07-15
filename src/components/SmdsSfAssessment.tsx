import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, RotateCcw, Copy, Check } from 'lucide-react';

type Domain =
  | 'preoccupation' | 'tolerance' | 'withdrawal' | 'persistence' | 'displacement'
  | 'escape' | 'problems' | 'deception' | 'conflict';

interface Item {
  id: string;
  domain: Domain;
  prompt: string;
}

// SMDS-SF (van den Eijnden et al., 2016) — 9 items, one per DSM-5-style IGD-analogous domain.
// Binary "yes/no" over the past year. ≥5 "yes" = probable (disordered) social media use.
const ITEMS: Item[] = [
  { id: 'SMDS_SF_01', domain: 'preoccupation',  prompt: 'During the past year, have you regularly found that you could not think of anything else but the moment you would be able to use social media again?' },
  { id: 'SMDS_SF_02', domain: 'tolerance',      prompt: 'During the past year, have you regularly felt dissatisfied because you wanted to spend more time on social media?' },
  { id: 'SMDS_SF_03', domain: 'withdrawal',     prompt: 'During the past year, have you often felt bad when you were unable to use social media?' },
  { id: 'SMDS_SF_04', domain: 'persistence',    prompt: 'During the past year, have you tried to spend less time on social media, but failed?' },
  { id: 'SMDS_SF_05', domain: 'displacement',   prompt: 'During the past year, have you regularly neglected other activities (e.g. hobbies, sport) because you wanted to use social media?' },
  { id: 'SMDS_SF_06', domain: 'problems',       prompt: 'During the past year, have you regularly had arguments with others because of your social media use?' },
  { id: 'SMDS_SF_07', domain: 'deception',      prompt: 'During the past year, have you regularly lied to your parents or friends about the amount of time you spend on social media?' },
  { id: 'SMDS_SF_08', domain: 'escape',         prompt: 'During the past year, have you often used social media to escape from negative feelings?' },
  { id: 'SMDS_SF_09', domain: 'conflict',       prompt: 'During the past year, have you had serious conflict with your parents, brother(s) or sister(s) because of your social media use?' },
];

const CUTOFF_POSITIVE = 5;

const domainLabel: Record<Domain, string> = {
  preoccupation: 'Preoccupation',
  tolerance: 'Tolerance',
  withdrawal: 'Withdrawal',
  persistence: 'Persistence',
  displacement: 'Displacement',
  problems: 'Problems',
  deception: 'Deception',
  escape: 'Escape / Mood modification',
  conflict: 'Conflict',
};

interface Props { onBack: () => void }

export const SmdsSfAssessment = ({ onBack }: Props) => {
  const [responses, setResponses] = useState<Record<string, 'yes' | 'no'>>({});
  const [copied, setCopied] = useState(false);

  const positiveCount = useMemo(
    () => ITEMS.reduce((n, it) => n + (responses[it.id] === 'yes' ? 1 : 0), 0),
    [responses]
  );
  const answered = Object.keys(responses).length;
  const complete = answered === ITEMS.length;
  const probable = complete && positiveCount >= CUTOFF_POSITIVE;

  const severity: 'none' | 'mild' | 'moderate' | 'severe' = !complete
    ? 'none'
    : positiveCount <= 2 ? 'none'
    : positiveCount <= 4 ? 'mild'
    : positiveCount <= 6 ? 'moderate'
    : 'severe';

  const reset = () => setResponses({});

  const handleCopy = async () => {
    const lines = [
      'Social Media Disorder Scale — Short Form (SMDS-SF)',
      `Positive criteria: ${positiveCount} / 9  (cutoff ≥ ${CUTOFF_POSITIVE})`,
      `Severity band: ${severity}`,
      `Probable disordered social media use: ${probable ? 'YES' : 'no'}`,
      '',
      ...ITEMS.map((it) => `- [${responses[it.id] ?? '—'}] ${domainLabel[it.domain]}: ${it.prompt}`),
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!complete}>
              {copied ? <Check className="h-4 w-4 mr-1 text-green-600" /> : <Copy className="h-4 w-4 mr-1" />}
              {copied ? 'Copied' : 'Copy report'}
            </Button>
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-1" /> Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Social Media Disorder Scale — Short Form (SMDS-SF)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Nine yes/no items covering the DSM-5 IGD-analogous domains adapted to social media
              use (van den Eijnden, Lemmens &amp; Valkenburg, 2016). Rate the <strong>past year</strong>.
            </p>
            <p>
              A count of <strong>≥ {CUTOFF_POSITIVE} "yes"</strong> responses suggests probable
              disordered social media use and warrants further clinical assessment.
            </p>
          </CardContent>
        </Card>

        {ITEMS.map((it, idx) => (
          <Card key={it.id} className="border-l-4 border-l-primary/60">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {idx + 1}. {domainLabel[it.domain]}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">{it.id}</span>
              </div>
              <CardTitle className="text-base font-medium leading-snug pt-1">
                {it.prompt}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={responses[it.id]}
                onValueChange={(v) => setResponses((r) => ({ ...r, [it.id]: v as 'yes' | 'no' }))}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem id={`${it.id}-no`} value="no" />
                  <Label htmlFor={`${it.id}-no`} className="cursor-pointer">No</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id={`${it.id}-yes`} value="yes" />
                  <Label htmlFor={`${it.id}-yes`} className="cursor-pointer">Yes</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        ))}

        <Card className={probable ? 'border-rose-500/60' : ''}>
          <CardHeader>
            <CardTitle className="text-lg">Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items answered</span>
              <span className="font-semibold tabular-nums">{answered} / {ITEMS.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Positive criteria ("yes")</span>
              <span className="font-semibold tabular-nums">{positiveCount} / 9</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cutoff for probable disorder</span>
              <span className="font-semibold tabular-nums">≥ {CUTOFF_POSITIVE}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Severity band</span>
              <span className="font-semibold capitalize">{severity}</span>
            </div>
            <div className="pt-2 border-t">
              <span className={`font-semibold ${probable ? 'text-rose-600' : 'text-emerald-600'}`}>
                {complete
                  ? probable
                    ? 'Probable disordered social media use — recommend further assessment.'
                    : 'Below cutoff for probable disordered social media use.'
                  : 'Complete all 9 items to see interpretation.'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Reference: van den Eijnden RJJM, Lemmens JS, Valkenburg PM. The Social Media Disorder Scale.
              <em> Computers in Human Behavior</em>. 2016;61:478–487.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmdsSfAssessment;

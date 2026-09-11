import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Brain, RotateCcw, Copy, Check, FileText, Eye, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import {
  OCCIPITAL_META,
  OCCIPITAL_MODULES,
  OCCIPITAL_SCORE_OPTIONS,
  type TestModule,
} from '@/data/occipitalVisualTests';

interface OccipitalAssessmentProps {
  onBack: () => void;
}

type TestStatus = 'normal' | 'abnormal' | 'not_tested' | string;

interface TestResponse {
  status: TestStatus;
  observation: string;
}

const statusBadgeClass = (status: TestStatus) => {
  if (status === 'normal' || status === 'correct') return 'bg-emerald-500 hover:bg-emerald-600 text-white';
  if (status === 'abnormal' || status === 'incorrect' || status === 'unable') return 'bg-rose-500 hover:bg-rose-600 text-white';
  if (status === 'not_tested') return 'bg-slate-400 hover:bg-slate-500 text-white';
  return 'bg-amber-500 hover:bg-amber-600 text-white';
};

export default function OccipitalAssessment({ onBack }: OccipitalAssessmentProps) {
  const { isMl } = useLanguage();
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, TestResponse>>({});
  const [copied, setCopied] = useState(false);

  const setStatus = (testId: string, status: TestStatus) => {
    setResponses((prev) => ({ ...prev, [testId]: { ...(prev[testId] || { observation: '' }), status } }));
  };

  const setObservation = (testId: string, observation: string) => {
    setResponses((prev) => ({ ...prev, [testId]: { ...(prev[testId] || { status: 'not_tested' }), observation } }));
  };

  const reset = () => {
    setResponses({});
    setActiveModuleId(null);
  };

  const completedCount = useMemo(
    () => Object.values(responses).filter((r) => r.status && r.status !== 'not_tested').length,
    [responses]
  );
  const abnormalCount = useMemo(
    () => Object.values(responses).filter((r) => r.status === 'abnormal' || r.status === 'incorrect' || r.status === 'unable').length,
    [responses]
  );

  const abnormalList = useMemo(
    () =>
      OCCIPITAL_MODULES.filter((m) => {
        const r = responses[m.id];
        return r?.status === 'abnormal' || r?.status === 'incorrect' || r?.status === 'unable';
      }).map((m) => ({ id: m.id, title: m.title, observation: responses[m.id]?.observation || '' })),
    [responses]
  );

  const generatedReport = useMemo(() => {
    const lines: string[] = [];
    lines.push(OCCIPITAL_META.title);
    lines.push(`Date: ${new Date().toLocaleDateString()}`);
    lines.push('');
    OCCIPITAL_MODULES.forEach((m) => {
      const r = responses[m.id];
      if (!r || !r.status || r.status === 'not_tested') {
        lines.push(`${m.title}: Not tested.`);
      } else if (r.status === 'normal' || r.status === 'correct') {
        lines.push(`${m.title}: Normal.`);
      } else {
        lines.push(`${m.title}: Abnormal. ${r.observation || r.status}`);
      }
    });
    if (abnormalList.length > 0) {
      lines.push('');
      lines.push('Impression:');
      lines.push(
        `Abnormalities on ${abnormalList.length} module(s). Interpret in the context of the full neurological examination.`
      );
    }
    return lines.join('\n');
  }, [responses, abnormalList.length]);

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(generatedReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const activeModule = useMemo(
    () => OCCIPITAL_MODULES.find((m) => m.id === activeModuleId) || null,
    [activeModuleId]
  );

  const renderSvgContent = (mod: TestModule) => {
    switch (mod.id) {
      case 'colour_naming':
      case 'colour_pointing':
      case 'colour_matching': {
        const colours = (mod.parameters?.colours as { name: string; hex: string }[]) || [
          { name: 'red', hex: '#D32F2F' },
          { name: 'blue', hex: '#1976D2' },
          { name: 'green', hex: '#388E3C' },
          { name: 'yellow', hex: '#FBC02D' },
        ];
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {mod.id === 'colour_pointing'
                ? 'Tap the colour named by the examiner.'
                : mod.id === 'colour_matching'
                ? 'Tap the tile that matches the target colour.'
                : 'Name each colour aloud. Examiner records accuracy.'}
            </p>
            <div className="grid grid-cols-4 gap-3">
              {colours.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => mod.id === 'colour_pointing' && setStatus(mod.id, 'normal')}
                  className={cn('h-16 rounded-lg border shadow-sm focus:outline-none focus:ring-2', mod.id === 'colour_pointing' && 'cursor-pointer')}
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>
        );
      }

      case 'letter_cancellation': {
        const rows = Number(mod.parameters?.rows) || 8;
        const cols = Number(mod.parameters?.columns) || 10;
        const target = String(mod.parameters?.targetLetter || 'A');
        const distractors = (mod.parameters?.distractorLetters as string[]) || ['B', 'C', 'D', 'E'];
        const cells = Array.from({ length: rows * cols }, (_, i) => {
          if (Math.random() < 0.15) return target;
          return distractors[Math.floor(Math.random() * distractors.length)];
        });
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Tap every letter <strong>{target}</strong> you can find.</p>
            <div
              className="grid gap-1 font-mono text-sm select-none"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {cells.map((letter, i) => (
                <button
                  key={i}
                  type="button"
                  className="aspect-square rounded border hover:bg-yellow-100 dark:hover:bg-yellow-900/30 focus:outline-none"
                  onClick={() => {}}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        );
      }

      case 'global_local': {
        const items = (mod.items as { global: string; local: string }[]) || [{ global: 'H', local: 'S' }];
        const item = items[0];
        const localLetters = Array(120).fill(item.local);
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Step 1: What is the large letter? Step 2: What are the small letters?
            </p>
            <svg viewBox="0 0 300 300" className="w-full max-w-md mx-auto border rounded bg-white">
              <text x="150" y="190" textAnchor="middle" fontSize="220" fontFamily="Arial" fontWeight="bold" fill="#000">
                {item.global}
              </text>
              {localLetters.slice(0, 100).map((l, i) => {
                const row = Math.floor(i / 10);
                const col = i % 10;
                const x = 30 + col * 24;
                const y = 50 + row * 22;
                return (
                  <text key={i} x={x} y={y} fontSize="14" fontFamily="Arial" fill="#000">
                    {l}
                  </text>
                );
              })}
            </svg>
            <p className="text-center text-xs text-muted-foreground">Demonstration only; real Navon stimuli need precise spacing.</p>
          </div>
        );
      }

      case 'circle_center': {
        const r = Number(mod.parameters?.circleRadius) || 120;
        const [tap, setTap] = useState<{ x: number; y: number } | null>(null);
        const cx = 200;
        const cy = 200;
        const dist = tap ? Math.hypot(tap.x - cx, tap.y - cy) : 0;
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{mod.instruction}</p>
            <svg
              viewBox="0 0 400 400"
              className="w-full max-w-md mx-auto border rounded bg-white cursor-crosshair"
              onClick={(e) => {
                const rect = (e.target as SVGElement).closest('svg')!.getBoundingClientRect();
                const scaleX = 400 / rect.width;
                const scaleY = 400 / rect.height;
                setTap({ x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY });
              }}
            >
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#000" strokeWidth={3} />
              <circle cx={cx} cy={cy} r={3} fill="red" />
              {tap && (
                <>
                  <circle cx={tap.x} cy={tap.y} r={5} fill="blue" />
                  <line x1={cx} y1={cy} x2={tap.x} y2={tap.y} stroke="blue" strokeDasharray="4" />
                </>
              )}
            </svg>
            {tap && (
              <p className="text-sm text-center">
                Error: {dist.toFixed(1)} px ({((dist / r) * 100).toFixed(1)}% of radius)
              </p>
            )}
          </div>
        );
      }

      case 'spatial_localization': {
        const shapes = [
          { id: 'a', x: 80, y: 120, fill: '#D32F2F' },
          { id: 'b', x: 260, y: 220, fill: '#1976D2' },
        ];
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Which shape is farther from you? (Left / Right / Nearer / Farther)</p>
            <svg viewBox="0 0 360 320" className="w-full max-w-md mx-auto border rounded bg-white">
              {shapes.map((s) => (
                <rect key={s.id} x={s.x} y={s.y} width={60} height={60} fill={s.fill} />
              ))}
            </svg>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Left', 'Right', 'Nearer', 'Farther'].map((label) => (
                <Button key={label} size="sm" variant="outline" onClick={() => setStatus(mod.id, 'normal')}>
                  {label}
                </Button>
              ))}
            </div>
          </div>
        );
      }

      case 'visual_matching': {
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Select the figure identical to the target.</p>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square rounded border bg-white flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-20 h-20">
                    <polygon points="50,10 90,90 10,90" fill="none" stroke="#000" strokeWidth={2} />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'figure_copying': {
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Ask the patient to copy the figure. Examiner scores below.</p>
            <svg viewBox="0 0 200 200" className="w-full max-w-xs mx-auto border rounded bg-white">
              <polygon points="100,20 180,180 20,180" fill="none" stroke="#000" strokeWidth={2} />
            </svg>
          </div>
        );
      }

      default:
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              This module requires image assets or bedside administration. Use the examiner controls below.
            </p>
            {Boolean(mod.interaction?.instruction) && <p className="text-sm font-medium">{String(mod.interaction?.instruction)}</p>}
          </div>
        );
    }
  };

  const renderExaminerControls = (mod: TestModule) => {
    const r = responses[mod.id] || { status: 'not_tested' as TestStatus, observation: '' };
    const options = mod.scoreOptions?.length
      ? mod.scoreOptions.map((id) => OCCIPITAL_SCORE_OPTIONS.find((o) => o.id === id) || { id, label: id })
      : OCCIPITAL_SCORE_OPTIONS.slice(0, 3);

    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <Button
              key={opt.id}
              type="button"
              size="sm"
              variant={r.status === opt.id ? 'default' : 'outline'}
              className={cn('text-xs', r.status === opt.id && statusBadgeClass(opt.id))}
              onClick={() => setStatus(mod.id, opt.id)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
        <textarea
          placeholder="Observation / notes"
          value={r.observation}
          onChange={(e) => setObservation(mod.id, e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[60px]"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 text-foreground p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {isMl ? 'തിരികെ' : 'Back'}
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={reset} className="gap-1">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <Button variant="outline" size="sm" onClick={copyReport} className="gap-1">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy report'}
            </Button>
          </div>
        </div>

        <PatientInfoForm />

        <Card className="border-l-4 border-l-violet-500">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-md">
                <Eye className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-2xl md:text-3xl">{OCCIPITAL_META.title}</CardTitle>
                <CardDescription className="mt-1 text-base break-words">{OCCIPITAL_META.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 text-sm">
              <Badge variant="outline">{completedCount}/{OCCIPITAL_MODULES.length} tested</Badge>
              <Badge className="bg-rose-500 text-white">{abnormalCount} abnormal</Badge>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{OCCIPITAL_META.standardizedTestWarning}</p>
          </CardContent>
        </Card>

        {!activeModule ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OCCIPITAL_MODULES.map((mod) => {
              const r = responses[mod.id];
              return (
                <Card
                  key={mod.id}
                  className="cursor-pointer hover:border-violet-400 transition-colors"
                  onClick={() => setActiveModuleId(mod.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{mod.title}</CardTitle>
                    {mod.clinicalTarget && <CardDescription className="text-xs">{mod.clinicalTarget}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{mod.renderer}</Badge>
                      {r?.status && r.status !== 'not_tested' && <Badge className={statusBadgeClass(r.status)}>{r.status}</Badge>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-xl">{activeModule.title}</CardTitle>
                  {activeModule.clinicalTarget && (
                    <CardDescription className="text-sm mt-1">{activeModule.clinicalTarget}</CardDescription>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveModuleId(null)}>
                  All modules
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderSvgContent(activeModule)}
              {renderExaminerControls(activeModule)}
            </CardContent>
          </Card>
        )}

        {abnormalList.length > 0 && !activeModule && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-rose-500" />
                Abnormal modules ({abnormalList.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {abnormalList.map((m) => (
                  <li key={m.id} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>
                      {m.title}: {m.observation || 'abnormal'}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {!activeModule && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Generated report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={copyReport} className="gap-1">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <pre className="rounded-lg border bg-muted p-4 text-xs whitespace-pre-wrap break-words max-h-[300px] overflow-auto">
                {generatedReport}
              </pre>
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground text-center">
          {OCCIPITAL_META.standardizedTestWarning}
        </p>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Check, Copy, Download, FileDown, Pill, Plus, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { ResultsActionBar } from '@/components/ResultsActionBar';
import { AssessmentReference } from '@/components/AssessmentReference';
import { useRegisterResult } from '@/components/results/useRegisterResult';
import { copyResultsToClipboard } from '@/lib/copyResults';
import { downloadTextReport, generatePdfReport } from '@/utils/reportGenerator';
import {
  ACB_INTERPRETATION,
  acbLevel,
  acbTotal,
  buildAcbReport,
  buildAcbText,
  searchAcbDrugs,
  type AcbSelection,
} from '@/lib/acbScale';

interface Props { onBack?: () => void }

const scoreClass = (score: number) =>
  score >= 3
    ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-200 dark:border-red-800'
    : score === 2
      ? 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800'
      : score === 1
        ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800'
        : 'bg-muted text-muted-foreground border-border';

const ScoreBadge = ({ score }: { score: number }) => (
  <span className={cn('inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full border px-2 text-sm font-semibold', scoreClass(score))}>
    {score}
  </span>
);

export const AcbAssessment = ({ onBack }: Props) => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<AcbSelection[]>([]);
  const [customName, setCustomName] = useState('');
  const [customScore, setCustomScore] = useState(1);
  const [copied, setCopied] = useState(false);

  const hits = useMemo(() => searchAcbDrugs(query, 25), [query]);
  const total = acbTotal(selected);
  const level = acbLevel(total);
  const report = buildAcbReport(selected);
  useRegisterResult(selected.length ? report : null);

  const has = (name: string) => selected.some((d) => d.name.toLowerCase() === name.trim().toLowerCase());

  const addDrug = (name: string, score: number, custom = false) => {
    const clean = name.trim();
    if (!clean || has(clean)) return;
    setSelected((prev) => [...prev, { id: `${custom ? 'c' : 'd'}-${clean.toLowerCase()}`, name: clean, score, custom }]);
  };

  const addCustom = () => {
    if (!customName.trim()) return;
    addDrug(customName, customScore, true);
    setCustomName('');
    setCustomScore(1);
  };

  const handleCopy = async () => {
    try {
      await copyResultsToClipboard(buildAcbText(selected));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const levelBox =
    level === 'high'
      ? 'border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/60 dark:text-red-100'
      : level === 'low'
        ? 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-100'
        : 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-100';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-background dark:via-background dark:to-background p-3 sm:p-4 md:p-8 break-words [hyphens:none]">
      <div className="max-w-3xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToMenu')}
          </Button>
        )}

        <Card className="shadow-xl">
          <CardContent className="p-4 sm:p-6 md:p-8 space-y-6">
            <div className="flex items-start gap-3">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md">
                <Pill className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{t('acbTitle')}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{t('acbSubtitle')}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="acb-search" className="text-foreground">{t('acbSearchLabel')}</Label>
              <Input
                id="acb-search"
                type="search"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('acbSearchPlaceholder')}
                className="text-base"
              />
              {query.trim() && (
                <ul className="max-h-72 overflow-y-auto rounded-lg border border-border bg-card divide-y divide-border" role="listbox" aria-label={t('acbSearchLabel')}>
                  {hits.length === 0 && <li className="p-3 text-sm text-muted-foreground">{t('acbNoMatch')}</li>}
                  {hits.map(({ drug, viaBrand }) => {
                    const added = has(drug.name);
                    return (
                      <li key={drug.name}>
                        <button
                          type="button"
                          disabled={added}
                          onClick={() => { addDrug(drug.name, drug.score); setQuery(''); }}
                          className="flex w-full items-center gap-3 p-3 text-left hover:bg-accent disabled:opacity-50"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block font-medium text-foreground">{drug.name}</span>
                            {drug.brands.length > 0 && (
                              <span className="block text-xs text-muted-foreground">
                                {viaBrand ? `${t('acbBrandMatch')}: ${viaBrand}` : drug.brands.join(', ')}
                              </span>
                            )}
                          </span>
                          <ScoreBadge score={drug.score} />
                          {added ? <Check className="h-4 w-4 shrink-0 text-emerald-600" /> : <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="space-y-2 rounded-lg border border-dashed border-border p-3 sm:p-4">
              <p className="text-sm font-semibold text-foreground">{t('acbCustomTitle')}</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <Label htmlFor="acb-custom-name" className="text-xs text-muted-foreground">{t('acbCustomName')}</Label>
                  <Input
                    id="acb-custom-name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addCustom(); }}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('acbCustomScore')}</Label>
                  <div className="flex gap-2" role="radiogroup" aria-label={t('acbCustomScore')}>
                    {[1, 2, 3].map((s) => (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={customScore === s}
                        onClick={() => setCustomScore(s)}
                        className={cn(
                          'h-10 w-10 rounded-md border text-sm font-semibold',
                          customScore === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-foreground hover:bg-accent',
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <Button type="button" variant="outline" onClick={addCustom} disabled={!customName.trim() || has(customName)}>
                  <Plus className="mr-1 h-4 w-4" /> {t('acbAdd')}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{t('acbSelected')}</p>
                {selected.length > 0 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setSelected([])}>{t('acbClear')}</Button>
                )}
              </div>
              {selected.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('acbNoneSelected')}</p>
              ) : (
                <ul className="space-y-2">
                  {selected.map((d) => (
                    <li key={d.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                      <span className="min-w-0 flex-1 font-medium text-foreground">{d.name}</span>
                      <ScoreBadge score={d.score} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`${t('acbRemove')} ${d.name}`}
                        onClick={() => setSelected((prev) => prev.filter((x) => x.id !== d.id))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={cn('rounded-lg border p-4 space-y-2', levelBox)} aria-live="polite">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-base font-semibold">{t('acbTotal')}</span>
                <span className="text-3xl font-bold">{total}</span>
              </div>
              <p className="font-semibold">{ACB_INTERPRETATION[level][language === 'ml' ? 'ml' : 'en']}</p>
              {selected.length > 0 && (
                <p className="text-sm">{level === 'high' ? t('acbHighAdvice') : t('acbLowAdvice')}</p>
              )}
            </div>

            {selected.length > 0 && (
              <ResultsActionBar>
                <Button variant="outline" onClick={handleCopy} className="flex items-center gap-1.5">
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy results'}
                </Button>
                <Button variant="outline" onClick={() => downloadTextReport(report)} className="flex items-center gap-1.5">
                  <Download className="h-4 w-4" />
                  Download .txt
                </Button>
                <Button variant="outline" onClick={() => generatePdfReport(report)} className="flex items-center gap-1.5">
                  <FileDown className="h-4 w-4" />
                  Export PDF
                </Button>
              </ResultsActionBar>
            )}

            <p className="text-xs text-muted-foreground">{t('acbDisclaimer')}</p>
          </CardContent>
        </Card>

        <AssessmentReference assessmentKey="acb" />
      </div>
    </div>
  );
};

export default AcbAssessment;

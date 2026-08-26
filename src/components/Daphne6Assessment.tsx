import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Brain, FileText, AlertTriangle, ShieldCheck, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DAPHNE6_DOMAINS,
  DAPHNE6_MAX_SCORE,
  DAPHNE6_CUTOFF,
  DAPHNE6_INTERPRETATION,
  DAPHNE6_METADATA,
} from '@/data/daphne6Scale';
import { ExportButtons } from './ExportButtons';
import { AssessmentReference } from '@/components/AssessmentReference';
import type { ReportData } from '@/utils/reportGenerator';

interface Daphne6AssessmentProps {
  onBack?: () => void;
}

const DAPHNE6_STORAGE_KEY = 'cognito.daphne6.draft.v1';

interface Daphne6Draft {
  selected: Record<string, string[]>;
  currentDomainIndex: number;
  patientInfo: { name: string; age: string; assessorName: string };
  started: boolean;
}

const readDraft = (): Daphne6Draft | null => {
  try {
    const raw = localStorage.getItem(DAPHNE6_STORAGE_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as Daphne6Draft;
    if (draft && typeof draft.selected === 'object' && draft.patientInfo) return draft;
  } catch {
    // Ignore unavailable or invalid local storage.
  }
  return null;
};

/** Binary per-domain DAPHNE-6 screener: a domain is positive when ANY symptom present. */
export const Daphne6Assessment: React.FC<Daphne6AssessmentProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const initialDraft = useRef<Daphne6Draft | null>(readDraft());
  const [selected, setSelected] = useState<Record<string, string[]>>(() => initialDraft.current?.selected ?? {});
  const [showResults, setShowResults] = useState(false);
  const [started, setStarted] = useState(() => initialDraft.current?.started ?? false);
  const [currentDomainIndex, setCurrentDomainIndex] = useState(() => initialDraft.current?.currentDomainIndex ?? 0);
  const [patientInfo, setPatientInfo] = useState(() => initialDraft.current?.patientInfo ?? ({ name: '', age: '', assessorName: '' }));
  const [resumed, setResumed] = useState(() => Boolean(initialDraft.current && Object.keys(initialDraft.current.selected).length));

  const setSymptomPresence = (domainId: string, symptomIndex: number, present: boolean) => {
    const domainIndex = DAPHNE6_DOMAINS.findIndex(domain => domain.id === domainId);
    if (domainIndex >= 0) setCurrentDomainIndex(domainIndex);
    setSelected(prev => {
      const current = prev[domainId] ?? [];
      const key = String(symptomIndex);
      const exists = current.includes(key);
      return {
        ...prev,
        [domainId]: present
          ? (exists ? current : [...current, key])
          : current.filter(k => k !== key),
      };
    });
  };

  const domainPositive = (domainId: string): boolean => {
    const symptoms = selected[domainId] ?? [];
    return symptoms.length > 0;
  };

  // DAPHNE-6 total = number of domains with >= 1 symptom present (0-6)
  const totalScore = DAPHNE6_DOMAINS.filter(d => domainPositive(d.id)).length;
  const isPositive = totalScore >= DAPHNE6_CUTOFF.threshold;

  const answeredDomains = DAPHNE6_DOMAINS.filter(d => Object.prototype.hasOwnProperty.call(selected, d.id)).length;

  const goToDomain = (index: number) => {
    setCurrentDomainIndex(index);
    document.getElementById(`daphne6-${DAPHNE6_DOMAINS[index].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (!started || showResults) return;
    try {
      localStorage.setItem(DAPHNE6_STORAGE_KEY, JSON.stringify({
        selected,
        currentDomainIndex,
        patientInfo,
        started,
      } satisfies Daphne6Draft));
    } catch {
      // Draft persistence is best effort.
    }
  }, [selected, currentDomainIndex, patientInfo, started, showResults]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(DAPHNE6_STORAGE_KEY);
    } catch {
      // Ignore unavailable local storage.
    }
    setResumed(false);
  };

  const handleBegin = () => setStarted(true);
  const handleRestart = () => {
    clearDraft();
    setSelected({});
    setShowResults(false);
    setStarted(false);
    setCurrentDomainIndex(0);
    setPatientInfo({ name: '', age: '', assessorName: '' });
  };

  const interpretation = isPositive ? DAPHNE6_INTERPRETATION.high : DAPHNE6_INTERPRETATION.low;

  const reportData: ReportData = {
    assessmentName: DAPHNE6_METADATA.toolName,
    date: new Date().toLocaleString(),
    totalScore: `${totalScore}/${DAPHNE6_MAX_SCORE}`,
    interpretation: `${interpretation.label}: ${interpretation.meaning}`,
    severity: isPositive ? 'Positive screening (>= 4/6)' : 'Below screening threshold (< 4/6)',
    patientInfo: patientInfo.name
      ? { Patient: patientInfo.name, Age: patientInfo.age || 'N/A', Assessor: patientInfo.assessorName || 'N/A' }
      : undefined,
    sections: [
      {
        title: language === 'ml' ? 'ഡൊമെയ്ൻ സ്കോറുകൾ' : 'Domain Scores',
        items: DAPHNE6_DOMAINS.map(
          d => `${language === 'ml' ? d.domainMl : d.domain}: ${domainPositive(d.id) ? '1' : '0'}`
        ),
        type: 'info',
      },
      {
        title: language === 'ml' ? 'പോസിറ്റീവ് ഡൊമെയ്ൻ ലക്ഷണങ്ങൾ' : 'Positive Domain Symptoms',
        items: DAPHNE6_DOMAINS.flatMap(d =>
          (selected[d.id] ?? []).map(i => `${language === 'ml' ? d.domainMl : d.domain}: ${language === 'ml' ? d.symptomsMl[Number(i)] : d.symptoms[Number(i)]}`)
        ),
        type: 'info',
      },
    ],
    disclaimer: DAPHNE6_METADATA.importantNote,
  };

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto w-full p-3 sm:p-4 space-y-5">
        {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2" /> Back</Button>}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Brain /> {DAPHNE6_METADATA.toolName}</CardTitle>
            <CardDescription>{DAPHNE6_METADATA.fullName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {resumed && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
                Saved DAPHNE-6 answers were restored. You can continue from domain {currentDomainIndex + 1}.
              </div>
            )}
            <p className="text-muted-foreground text-sm">{DAPHNE6_METADATA.purpose}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block">Respondent</span>
                <span className="text-sm">{DAPHNE6_METADATA.respondent}</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block">Max Score</span>
                <span className="text-sm">{DAPHNE6_METADATA.maximumScore} domains</span>
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium">{language === 'ml' ? 'രോഗിയുടെ പേര് (ഓപ്ഷണൽ)' : 'Patient name (optional)'}</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                value={patientInfo.name}
                onChange={(e) => setPatientInfo(p => ({ ...p, name: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">{language === 'ml' ? 'വയസ്സ് (optional)' : 'Age (optional)'}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-input rounded-md mt-1"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo(p => ({ ...p, age: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{language === 'ml' ? 'വിലയിരുത്തുന്നയാൾ (optional)' : 'Assessor (optional)'}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-input rounded-md mt-1"
                    value={patientInfo.assessorName}
                    onChange={(e) => setPatientInfo(p => ({ ...p, assessorName: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <Button onClick={handleBegin} className="w-full" size="lg">
              <FileText className="mr-2 h-4 w-4" /> {language === 'ml' ? 'ആരംഭിക്കുക' : 'Begin Assessment'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2" /> Back</Button>}
        <Card className={isPositive ? 'border-amber-500/40' : 'border-emerald-500/40'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isPositive ? <AlertTriangle className="h-5 w-5 text-amber-500" /> : <ShieldCheck className="h-5 w-5 text-emerald-500" />}
              DAPHNE-6 Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="text-center">
              <div className="text-5xl font-bold">{totalScore}<span className="text-2xl text-muted-foreground">/{DAPHNE6_MAX_SCORE}</span></div>
              <p className="text-sm text-muted-foreground mt-1">DAPHNE-6 screening score</p>
            </div>
            <div className={`p-4 rounded-lg ${isPositive ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-emerald-500/10 border border-emerald-500/30'}`}>
              <span className="text-xs font-bold uppercase block mb-1">{language === 'ml' ? interpretation.labelMl : interpretation.label}</span>
              <p>{language === 'ml' ? interpretation.meaningMl : interpretation.meaning}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {DAPHNE6_DOMAINS.map(d => (
                <div key={d.id} className={`p-3 rounded-lg border ${domainPositive(d.id) ? 'border-amber-400 bg-amber-500/5' : 'border-border bg-muted/40'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{language === 'ml' ? d.domainMl : d.domain}</span>
                    <Badge variant={domainPositive(d.id) ? 'default' : 'outline'}>{domainPositive(d.id) ? 'Positive' : '0'}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground italic">
              Cut-off ≥ {DAPHNE6_CUTOFF.threshold}/6 — sensitivity {DAPHNE6_CUTOFF.sensitivity}, specificity {DAPHNE6_CUTOFF.specificity}. {DAPHNE6_CUTOFF.note}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <ExportButtons data={reportData} />
              <Button variant="outline" size="sm" onClick={handleRestart}><RotateCcw className="mr-1.5 h-4 w-4" /> Restart</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-3xl mx-auto w-full p-3 sm:p-4 space-y-5">
      {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2" /> Back</Button>}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2"><Brain /> DAPHNE-6</CardTitle>
              <CardDescription className="mt-2">
                {language === 'ml'
                  ? 'ഓരോ ലക്ഷണത്തിനും നിലവിലുള്ളത് അല്ലെങ്കിൽ ഇല്ലാത്തത് തിരഞ്ഞെടുക്കുക.'
                  : 'For each symptom, select Present or Absent. One or more present symptoms make the domain positive.'}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="shrink-0">{answeredDomains}/6</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Domain {currentDomainIndex + 1} of {DAPHNE6_MAX_SCORE}</span>
              <span>{Math.round(((currentDomainIndex + 1) / DAPHNE6_MAX_SCORE) * 100)}%</span>
            </div>
            <Progress value={((currentDomainIndex + 1) / DAPHNE6_MAX_SCORE) * 100} className="h-2" />
            <div className="grid grid-cols-6 gap-1" aria-label="DAPHNE-6 domain progress">
              {DAPHNE6_DOMAINS.map((domain, index) => (
                <button
                  key={domain.id}
                  type="button"
                  aria-label={`Go to ${domain.domain}`}
                  onClick={() => goToDomain(index)}
                  className={`h-2 rounded-full transition-colors ${index === currentDomainIndex ? 'bg-primary' : domainPositive(domain.id) ? 'bg-primary/50' : 'bg-muted'}`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {resumed && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
              Saved answers restored. Continue with domain {currentDomainIndex + 1}.
            </div>
          )}

          <div className="space-y-5">
            {DAPHNE6_DOMAINS.map((domain, domainIndex) => (
              <section key={domain.id} id={`daphne6-${domain.id}`} className="scroll-mt-24 rounded-xl border p-3 sm:p-5 space-y-4">
                <div className="flex items-center justify-between gap-3 rounded-lg bg-primary/10 p-3 sm:p-4">
                  <div>
                    <p className="font-semibold">{domainIndex + 1}. {language === 'ml' ? domain.domainMl : domain.domain}</p>
                    <p className="text-xs text-muted-foreground">{domain.symptoms.length} symptom {domain.symptoms.length === 1 ? 'item' : 'items'}</p>
                  </div>
                  <Badge variant={domainPositive(domain.id) ? 'default' : 'outline'}>
                    {domainPositive(domain.id) ? 'Positive: 1' : 'Negative: 0'}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {domain.symptoms.map((symptom, idx) => {
                    const present = (selected[domain.id] ?? []).includes(String(idx));
                    return (
                      <div key={symptom} className="relative z-10 rounded-lg border bg-background p-3 sm:p-4 space-y-3">
                        <p className="text-sm font-medium leading-relaxed">{language === 'ml' ? domain.symptomsMl[idx] : symptom}</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant={present ? 'default' : 'outline'}
                            className="min-h-11 w-full"
                            onClick={() => setSymptomPresence(domain.id, idx, true)}
                          >
                            Present
                          </Button>
                          <Button
                            type="button"
                            variant={!present ? 'secondary' : 'outline'}
                            className="min-h-11 w-full"
                            onClick={() => setSymptomPresence(domain.id, idx, false)}
                          >
                            Absent
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button variant="outline" onClick={handleRestart} className="sm:w-auto"><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
            <div className="flex flex-1 gap-2">
              <Button variant="outline" onClick={() => goToDomain(Math.max(0, currentDomainIndex - 1))} disabled={currentDomainIndex === 0} className="flex-1">Previous</Button>
              {currentDomainIndex < DAPHNE6_DOMAINS.length - 1 ? (
                <Button onClick={() => { goToDomain(currentDomainIndex + 1); setResumed(false); }} className="flex-1">Next</Button>
              ) : (
                <Button onClick={() => { setShowResults(true); clearDraft(); }} className="flex-1" size="lg">View Result</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

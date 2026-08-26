import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Brain,
  Calendar,
  Check,
  ClipboardCopy,
  Download,
  ExternalLink,
  FileText,
  RotateCcw,
  Target,
  User,
} from 'lucide-react';
import { PsychosisScale, SeverityBand } from '@/data/psychosisScales';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { usePatientInfo } from '@/contexts/PatientInfoContext';
import { toast } from '@/hooks/use-toast';
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
  AlignmentType,
} from 'docx';
import { saveAs } from 'file-saver';

interface Props {
  scale: PsychosisScale;
  onBack?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  /** Optional patient age range — used for ADHD screener interpretation/SOAP. */
  ageRange?: 'child' | 'adolescent' | 'adult';
}

interface Totals {
  total: number;
  bySubscale: Record<string, number>;
}

// IDs of scales that should use ADHD-specific scoring/SOAP behaviour.
const ADHD_SCREENER_IDS = new Set(['asrs6', 'asrs18', 'vanderbilt']);

// ASRS-6 "shaded-zone" thresholds: items 1–3 positive at ≥2, items 4–6 at ≥3.
const ASRS6_SHADED_THRESHOLD: Record<string, number> = {
  a1: 2, a2: 2, a3: 2, a4: 3, a5: 3, a6: 3,
};

const TONE_CLASSES: Record<SeverityBand['tone'], { text: string; bg: string; border: string }> = {
  success: {
    text: 'text-medical-success',
    bg: 'bg-medical-success/10',
    border: 'border-medical-success/30',
  },
  warning: {
    text: 'text-medical-warning',
    bg: 'bg-medical-warning/10',
    border: 'border-medical-warning/30',
  },
  orange: {
    text: 'text-orange-600',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
  },
  destructive: {
    text: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/30',
  },
};

const findBand = (bands: SeverityBand[] | undefined, score: number): SeverityBand | undefined =>
  bands?.find((b) => score >= b.min && score <= b.max);

/**
 * Standardised report builder for psychiatric assessments.
 */
const buildClinicalReport = (scale: PsychosisScale, totals: Totals, responses: Record<string, number>, patientInfo: any, currentDate: string) => {
  const lines: string[] = [];
  lines.push(`${scale.fullName} - Clinical Report`);
  lines.push('—'.repeat(46));
  if (patientInfo.name) lines.push(`Patient: ${patientInfo.name}`);
  if (patientInfo.id) lines.push(`Patient ID: ${patientInfo.id}`);
  lines.push(`Date: ${currentDate}`);
  lines.push('');

  if (scale.subscales) {
    lines.push('Subscale Totals:');
    scale.subscales.forEach((s) => {
      const v = totals.bySubscale[s.id] ?? 0;
      const band = findBand(scale.severityBands?.[s.id], v);
      lines.push(`  • ${s.label}: ${v}${band ? ` — ${band.label}` : ''}`);
    });
  }

  lines.push(`Total Score: ${totals.total}`);
  const totalBand = findBand(scale.severityBands?.total, totals.total);
  if (totalBand) {
    lines.push(`Impression: ${totalBand.label}`);
    lines.push(`Description: ${totalBand.description}`);
  }

  lines.push('');
  lines.push('Item-Level Breakdown:');
  scale.items.forEach((it) => {
    const v = responses[it.id];
    const anchors = it.anchors ?? scale.anchors;
    const anchor = anchors.find(a => a.value === v);
    lines.push(`  - ${it.label}: ${v != null ? `${v} (${anchor?.label || ''})` : '—'}`);
  });

  if (scale.thresholdNote) {
    lines.push('');
    lines.push(`Clinical Note: ${scale.thresholdNote}`);
  }

  lines.push('');
  lines.push(`Reference: ${scale.citation}`);
  lines.push('Disclaimer: Screening tool — does not replace comprehensive clinical diagnostic evaluation.');
  
  return lines.join('\n');
};



export const PsychosisScaleAssessment = ({ scale, onBack, onNext, onPrevious, ageRange }: Props) => {

  const { patientInfo } = usePatientInfo();
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [showNote, setShowNote] = useState(true);
  const [showSoap, setShowSoap] = useState(false);
  const [copied, setCopied] = useState(false);
  const [soapCopied, setSoapCopied] = useState(false);

  const isAdhdScreener = ADHD_SCREENER_IDS.has(scale.id as string);
  const isAsrs6 = scale.id === ('asrs6' as PsychosisScale['id']);

  const completed = Object.keys(responses).length;
  const totalItems = scale.items.length;
  const progress = (completed / totalItems) * 100;

  const handleScore = (id: string, value: number) =>
    setResponses((prev) => ({ ...prev, [id]: value }));

  const totals: Totals = useMemo(() => {
    const bySubscale: Record<string, number> = {};
    let total = 0;
    scale.items.forEach((it) => {
      const v = responses[it.id];
      if (v == null) return;
      // ASRS-6: count items in the validated shaded zone instead of raw sum.
      const contribution = isAsrs6
        ? (v >= (ASRS6_SHADED_THRESHOLD[it.id] ?? 99) ? 1 : 0)
        : v;
      total += contribution;
      const sub = it.subscale ?? '__all__';
      bySubscale[sub] = (bySubscale[sub] ?? 0) + contribution;
    });
    return { total, bySubscale };
  }, [responses, scale.items, isAsrs6]);

  // ── SOAP block builder (ADHD screeners only) ──
  const ageLabel =
    ageRange === 'child'
      ? 'Child (6–12 years)'
      : ageRange === 'adolescent'
      ? 'Adolescent (13–17 years)'
      : ageRange === 'adult'
      ? 'Adult (≥18 years)'
      : null;

  const buildSoap = (): string => {
    const totalBand = findBand(scale.severityBands?.total, totals.total);
    const positive = totalBand?.tone === 'destructive' || totalBand?.tone === 'orange';
    const inattCount = scale.items
      .filter((i) => i.subscale === 'inattention')
      .filter((i) => (responses[i.id] ?? 0) >= 2).length;
    const hyperCount = scale.items
      .filter((i) => i.subscale === 'hyperactivity')
      .filter((i) => (responses[i.id] ?? 0) >= 2).length;

    const lines: string[] = [];
    lines.push(`ADHD SCREENING — ${scale.fullName}`);
    lines.push('='.repeat(60));
    if (patientInfo.name) lines.push(`Patient: ${patientInfo.name}`);
    if (patientInfo.id) lines.push(`Patient ID: ${patientInfo.id}`);
    if (ageLabel) lines.push(`Age range: ${ageLabel}`);
    lines.push(`Date: ${currentDate}`);
    lines.push('');

    // S — Subjective
    lines.push('S — SUBJECTIVE');
    lines.push(
      `Patient${ageRange === 'child' ? ' (parent informant)' : ''} completed the ${scale.name} screener` +
        (ageLabel ? ` for ${ageLabel.toLowerCase()}` : '') +
        '. Symptoms reported over the relevant lookback window per scale instructions.',
    );
    lines.push('');

    // O — Objective
    lines.push('O — OBJECTIVE');
    if (isAsrs6) {
      lines.push(`ASRS-6 shaded-zone item count: ${totals.total}/6.`);
    } else {
      if (scale.subscales) {
        scale.subscales.forEach((s) => {
          const v = totals.bySubscale[s.id] ?? 0;
          lines.push(`  • ${s.label}: ${v}`);
        });
      }
      lines.push(`Total: ${totals.total}`);
    }
    if (scale.id === ('asrs18' as PsychosisScale['id'])) {
      lines.push(`Items rated ≥2 — Inattention: ${inattCount}/9, Hyperactivity-Impulsivity: ${hyperCount}/9.`);
    }
    lines.push('');

    // A — Assessment
    lines.push('A — ASSESSMENT');
    if (totalBand) {
      lines.push(`Risk level: ${totalBand.label}. ${totalBand.description}`);
    }
    if (isAsrs6) {
      lines.push(
        positive
          ? 'Positive screen — symptoms highly consistent with adult ADHD; warrants full diagnostic evaluation.'
          : 'Negative screen — symptoms not highly consistent with adult ADHD on this brief screener; clinical judgement still applies.',
      );
      if (ageRange === 'adolescent') {
        lines.push('NOTE: ASRS validated for adults ≥18; interpret cautiously in adolescents and corroborate with collateral or a youth-validated tool.');
      }
    }
    if (scale.id === ('vanderbilt' as PsychosisScale['id'])) {
      lines.push(
        'Diagnostic thresholds use COUNT of items rated ≥2: Inattention ≥6/9, Hyperactivity ≥6/9, ODD ≥4/8, Conduct ≥3/14, Anx/Dep ≥3/7. Performance impairment requires ≥1 item rated 4–5.',
      );
    }
    lines.push('');

    // P — Plan
    lines.push('P — PLAN / RECOMMENDED NEXT STEPS');
    if (positive) {
      lines.push('  1. Conduct full DSM-5-TR ADHD diagnostic interview (Criteria A–E).');
      lines.push('  2. Obtain collateral history (partner / parent / teacher) and developmental history (onset before age 12).');
      lines.push('  3. Document functional impairment across ≥2 settings.');
      lines.push('  4. Rule out: mood, anxiety, sleep, substance, thyroid, hearing/vision, learning disorder.');
      lines.push('  5. Consider standardised neuropsychological testing if diagnostic uncertainty.');
      lines.push('  6. Discuss psychoeducation and shared decision-making for pharmacological + behavioural treatment.');
    } else {
      lines.push('  1. Reassure; address presenting concerns and consider differential (mood, anxiety, sleep, substance use).');
      lines.push('  2. Reassess if symptoms worsen or new functional impairment emerges.');
      lines.push('  3. Consider full ASRS-18 or DSM-5-TR review if clinical suspicion remains despite negative screen.');
    }
    lines.push('');
    lines.push(`Tool / version: ${scale.fullName}`);
    lines.push(`Reference: ${scale.citation}`);
    lines.push('Screening tool — does not replace clinical judgement.');
    return lines.join('\n');
  };


  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const buildNote = (): string => {
    const lines: string[] = [];
    lines.push(`${scale.fullName}`);
    lines.push('—'.repeat(46));
    if (patientInfo.name) lines.push(`Patient: ${patientInfo.name}`);
    if (patientInfo.id) lines.push(`Patient ID: ${patientInfo.id}`);
    lines.push(`Date: ${currentDate}`);
    lines.push('');
    if (scale.subscales) {
      lines.push('Subscale totals:');
      scale.subscales.forEach((s) => {
        const v = totals.bySubscale[s.id] ?? 0;
        const band = findBand(scale.severityBands?.[s.id], v);
        lines.push(`  • ${s.label}: ${v}${band ? `  — ${band.label}` : ''}`);
      });
    }
    lines.push(`Total: ${totals.total}`);
    const totalBand = findBand(scale.severityBands?.total, totals.total);
    if (totalBand) lines.push(`Overall band: ${totalBand.label} — ${totalBand.description}`);
    lines.push('');
    lines.push('Item-level scores:');
    scale.items.forEach((it) => {
      const v = responses[it.id];
      lines.push(`  - ${it.label}: ${v != null ? v : '—'}`);
    });
    if (scale.thresholdNote) {
      lines.push('');
      lines.push(`Note: ${scale.thresholdNote}`);
    }
    lines.push('');
    lines.push(`Reference: ${scale.citation}`);
    lines.push('Screening tool — does not replace clinical judgement.');
    return lines.join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildNote());
      setCopied(true);
      toast({ title: 'Note copied to clipboard' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  const handleCopySoap = async () => {
    try {
      await navigator.clipboard.writeText(buildSoap());
      setSoapCopied(true);
      toast({ title: 'SOAP report copied to clipboard' });
      setTimeout(() => setSoapCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  const handleCopyAll = async () => {
    const text = [showNote ? buildNote() : '', isAdhdScreener && showSoap ? buildSoap() : '']
      .filter(Boolean)
      .join('\n\n');
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'All text copied to clipboard' });
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  const handleExportDocx = async () => {
    try {
      const heading = (
        text: string,
        level: typeof HeadingLevel.HEADING_1 | typeof HeadingLevel.HEADING_2,
      ) => new Paragraph({ heading: level, children: [new TextRun(text)] });

      const kv = (label: string, value: string) =>
        new Paragraph({
          children: [
            new TextRun({ text: `${label}: `, bold: true }),
            new TextRun(value),
          ],
        });

      const subscaleRows: Paragraph[] = scale.subscales
        ? scale.subscales.map((s) => {
            const v = totals.bySubscale[s.id] ?? 0;
            const band = findBand(scale.severityBands?.[s.id], v);
            return new Paragraph({
              bullet: { level: 0 },
              children: [
                new TextRun({ text: `${s.label}: `, bold: true }),
                new TextRun(`${v}${band ? `  (${band.label})` : ''}`),
              ],
            });
          })
        : [];

      const itemRows: Paragraph[] = scale.items.map(
        (it) =>
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: `${it.label}: `, bold: true }),
              new TextRun(responses[it.id] != null ? String(responses[it.id]) : '—'),
            ],
          }),
      );

      const totalBand = findBand(scale.severityBands?.total, totals.total);

      const doc = new Document({
        styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } },
        sections: [
          {
            properties: {
              page: {
                size: { width: 12240, height: 15840 },
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
              },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun(scale.fullName)],
              }),
              new Paragraph({ children: [] }),
              ...(patientInfo.name ? [kv('Patient', patientInfo.name)] : []),
              ...(patientInfo.id ? [kv('Patient ID', patientInfo.id)] : []),
              kv('Date', currentDate),
              new Paragraph({ children: [] }),
              heading('Scores', HeadingLevel.HEADING_2),
              ...subscaleRows,
              kv('Total', String(totals.total)),
              ...(totalBand ? [kv('Overall band', `${totalBand.label} — ${totalBand.description}`)] : []),
              new Paragraph({ children: [] }),
              heading('Item-level scores', HeadingLevel.HEADING_2),
              ...itemRows,
              new Paragraph({ children: [] }),
              ...(scale.thresholdNote
                ? [
                    new Paragraph({
                      children: [new TextRun({ text: scale.thresholdNote, italics: true })],
                    }),
                  ]
                : []),
              new Paragraph({ children: [] }),
              new Paragraph({
                children: [new TextRun({ text: `Reference: ${scale.citation}`, italics: true })],
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const safeName = (patientInfo.name || 'patient').replace(/[^a-z0-9_-]+/gi, '_');
      const dateStamp = new Date().toISOString().slice(0, 10);
      saveAs(blob, `${scale.name.replace(/[^A-Z0-9]/gi, '_')}_${safeName}_${dateStamp}.docx`);
      toast({ title: 'DOCX exported' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Export failed', variant: 'destructive' });
    }
  };

  const handleReset = () => {
    setResponses({});
    setShowResults(false);
    setShowNote(false);
  };

  // ────────── Results view ──────────
  if (showResults) {
    const totalBand = findBand(scale.severityBands?.total, totals.total);
    return (
      <div className="min-h-screen bg-gradient-subtle p-4 md:p-8">
        <div className="w-full space-y-6">
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to menu
            </Button>
          )}

          <Card className="shadow-medical">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2 text-medical-primary">
                <FileText className="h-6 w-6" />
                {scale.fullName} — Results
              </CardTitle>
              <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground mt-2">
                {patientInfo.name && (
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" /> {patientInfo.name}
                  </span>
                )}
                {patientInfo.id && <span>ID: {patientInfo.id}</span>}
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" /> {currentDate}
                </span>
              </div>
            </CardHeader>
          </Card>

          {/* Overall total */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Target className="h-5 w-5 mr-2 text-medical-primary" />
                Overall total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-medical-primary mb-2">{totals.total}</div>
                {totalBand && (
                  <>
                    <div className={`text-lg font-medium ${TONE_CLASSES[totalBand.tone].text}`}>
                      {totalBand.label}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{totalBand.description}</p>
                  </>
                )}
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center no-print">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={async () => {
                      try {
                        const report = buildClinicalReport(scale, totals, responses, patientInfo, currentDate);
                        await navigator.clipboard.writeText(report);
                        setCopied(true);
                        toast({ title: 'Report copied to clipboard' });
                        setTimeout(() => setCopied(false), 2000);
                      } catch (err) {
                        toast({ title: 'Copy failed', variant: 'destructive' });
                      }
                    }}
                  >
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <ClipboardCopy className="h-4 w-4" />}
                    {copied ? 'Copied' : 'Copy TXT Report'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={handleExportDocx}
                  >
                    <Download className="h-4 w-4" />
                    Export DOCX
                  </Button>
                </div>
              </CardContent>
            </Card>


          {/* Subscales */}
          {scale.subscales && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Subscale totals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scale.subscales.map((s) => {
                    const v = totals.bySubscale[s.id] ?? 0;
                    const band = findBand(scale.severityBands?.[s.id], v);
                    const tone = band ? TONE_CLASSES[band.tone] : null;
                    return (
                      <div
                        key={s.id}
                        className={`rounded-lg border p-3 ${tone?.border ?? 'border-border'} ${
                          tone?.bg ?? ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{s.label}</span>
                          <Badge variant="outline" className={tone?.text}>
                            {v}
                          </Badge>
                        </div>
                        {band && (
                          <p className={`text-xs mt-1 ${tone?.text}`}>
                            {band.label} — <span className="text-muted-foreground">{band.description}</span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Threshold note */}
          {scale.thresholdNote && (
            <Card className="shadow-card border-2 border-medical-primary/20">
              <CardHeader>
                <CardTitle className="text-base">Clinical threshold</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">{scale.thresholdNote}</p>
              </CardContent>
            </Card>
          )}

          {/* Source */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <FileText className="h-4 w-4 mr-2 text-medical-primary" />
                Source & citation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="text-foreground">{scale.citation}</p>
              {scale.citationUrl && (
                <a
                  href={scale.citationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-medical-primary hover:underline text-xs"
                >
                  <ExternalLink className="h-3 w-3" /> Open reference
                </a>
              )}
            </CardContent>
          </Card>

          {/* Generated text note */}
          {showNote && (
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-medical-primary" />
                  Clinical text note
                </CardTitle>
                <Button onClick={handleCopy} variant="outline" size="sm">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" /> Copied
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  readOnly
                  value={buildNote()}
                  className="font-mono text-xs min-h-[280px] whitespace-pre"
                />
              </CardContent>
            </Card>
          )}

          {/* SOAP-style clinician summary (ADHD screeners) */}
          {isAdhdScreener && showSoap && (
            <Card className="shadow-card border-medical-primary/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-medical-primary" />
                  SOAP clinician summary
                </CardTitle>
                <Button onClick={handleCopySoap} variant="outline" size="sm">
                  {soapCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" /> Copied
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  readOnly
                  value={buildSoap()}
                  className="font-mono text-xs min-h-[360px] whitespace-pre"
                />
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <Button onClick={handleCopyAll} variant="outline" size="lg" disabled={!showNote && !(isAdhdScreener && showSoap)}>
              <ClipboardCopy className="h-4 w-4 mr-2" />
              Copy all
            </Button>
            <Button onClick={() => window.print()} variant="outline" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Print / PDF
            </Button>
            <Button onClick={() => setShowNote((v) => !v)} variant="outline" size="lg">
              <FileText className="h-4 w-4 mr-2" />
              {showNote ? 'Hide text note' : 'Generate text note'}
            </Button>
            {isAdhdScreener && (
              <Button
                onClick={() => setShowSoap((v) => !v)}
                variant="outline"
                size="lg"
                className="border-medical-primary/40"
              >
                <FileText className="h-4 w-4 mr-2" />
                {showSoap ? 'Hide SOAP report' : 'Generate SOAP report'}
              </Button>
            )}
            <Button onClick={handleExportDocx} variant="outline" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Export to DOCX
            </Button>
            <Button
              onClick={handleReset}
              size="lg"
              className="bg-medical-primary hover:bg-medical-primary/90"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              New assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ────────── Form view ──────────
  // Group items by subscale (or single bucket if none)
  const grouped = scale.subscales
    ? scale.subscales.map((s) => ({
        id: s.id,
        label: s.label,
        items: scale.items.filter((i) => i.subscale === s.id),
      }))
    : [{ id: '__all__', label: 'Items', items: scale.items }];

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 md:p-8">
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center mb-2">
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to menu
            </Button>
          )}
          
          <div className="flex gap-2">
            {onPrevious && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onPrevious}
              >
                Previous Test
              </Button>
            )}
            {onNext && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onNext}
              >
                Next Test
              </Button>
            )}
          </div>
        </div>

        <Card className="shadow-card border-medical-primary/20">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <span className="text-sm font-medium text-muted-foreground">Current score</span>
            <span className="text-2xl font-bold tabular-nums text-medical-primary">
              {totals.total}/{isAsrs6 ? 6 : totalItems}
            </span>
          </CardContent>
        </Card>

        <PatientInfoForm />

        <Card className="shadow-medical">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-medical-primary">
              <Brain className="h-6 w-6" />
              {scale.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{scale.fullName}</p>
            <p className="text-sm mt-2 text-foreground">{scale.shortDescription}</p>
            <div className="rounded-md bg-muted/40 border border-border p-3 text-sm mt-3">
              <strong>Instructions:</strong> {scale.instructions}
            </div>
            <div className="space-y-2 mt-3">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>
                  {completed}/{totalItems}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {grouped.map((group, gi) => (
          <Card key={group.id} className="shadow-card">
            {scale.subscales && (
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-medical-primary">{group.label}</CardTitle>
              </CardHeader>
            )}
            <CardContent className={scale.subscales ? 'pt-2' : ''}>
              <div className="space-y-5">
                {group.items.map((item, idx) => {
                  const anchors = item.anchors ?? scale.anchors;
                  const value = responses[item.id];
                  return (
                    <div key={item.id}>
                      {idx > 0 && <Separator className="mb-4" />}
                      <div className="mb-2">
                        <p className="font-medium text-sm text-foreground">{item.label}</p>
                        {item.hint && (
                          <p className="text-xs text-muted-foreground mt-1">{item.hint}</p>
                        )}
                      </div>
                      <RadioGroup
                        value={value != null ? String(value) : ''}
                        onValueChange={(v) => handleScore(item.id, parseInt(v))}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
                      >
                        {anchors.map((a) => (
                          <Label
                            key={a.value}
                            htmlFor={`${item.id}-${a.value}`}
                            className={`flex items-start gap-2 rounded-md border p-2 text-xs cursor-pointer transition ${
                              value === a.value
                                ? 'border-medical-primary bg-medical-primary/10'
                                : 'border-border hover:bg-muted/40'
                            }`}
                          >
                            <RadioGroupItem
                              id={`${item.id}-${a.value}`}
                              value={String(a.value)}
                              className="mt-0.5"
                            />
                            <span className="leading-tight">{a.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="shadow-lg sticky bottom-4">
          <CardContent className="p-4">
            <Button
              onClick={() => setShowResults(true)}
              disabled={completed !== totalItems}
              className="w-full bg-medical-primary hover:bg-medical-primary/90"
              size="lg"
            >
              {completed === totalItems
                ? 'View results'
                : `Answer all ${totalItems} items (${completed}/${totalItems})`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

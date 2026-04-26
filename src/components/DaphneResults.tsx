import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  RotateCcw,
  Download,
  User,
  Calendar,
  Target,
  TrendingUp,
  AlertCircle,
  ClipboardCopy,
  Check,
} from 'lucide-react';
import { DaphneResults as DaphneResultsType } from '@/types/daphne';
import { getDaphneScaleItems } from '@/data/daphneScale';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { DomainRadarChart } from './DomainRadarChart';
import { toast } from '@/hooks/use-toast';
import { Document, Packer, Paragraph, HeadingLevel, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

interface DaphneResultsProps {
  results: DaphneResultsType;
  patientInfo: {
    name: string;
    age: string;
    assessorName: string;
  };
  onRestart: () => void;
}

export const DaphneResults: React.FC<DaphneResultsProps> = ({
  results,
  patientInfo,
  onRestart
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getDaphne6Interpretation = (score: number): { level: string; color: string; description: string } => {
    if (score === 0) return { 
      level: t('interp.no.behavioral'), 
      color: 'text-medical-success', 
      description: t('interp.no.domains') 
    };
    if (score <= 2) return { 
      level: t('interp.mild.behavioral'), 
      color: 'text-medical-warning', 
      description: `${score} ${score > 1 ? t('interp.domains.affected') : t('interp.domain.affected')}` 
    };
    if (score <= 4) return { 
      level: t('interp.moderate.behavioral'), 
      color: 'text-orange-600', 
      description: `${score} ${t('interp.domains.affected')}` 
    };
    return { 
      level: t('interp.severe.behavioral'), 
      color: 'text-destructive', 
      description: `${score} ${t('interp.domains.affected')}` 
    };
  };

  const getDaphne40Interpretation = (score: number): { level: string; color: string; description: string } => {
    if (score === 0) return { 
      level: t('interp.no.symptoms'), 
      color: 'text-medical-success', 
      description: t('interp.all.normal') 
    };
    if (score <= 10) return { 
      level: t('interp.mild.severity'), 
      color: 'text-medical-warning', 
      description: t('interp.low.severity') 
    };
    if (score <= 20) return { 
      level: t('interp.moderate.severity'), 
      color: 'text-orange-600', 
      description: t('interp.moderate.overall') 
    };
    return { 
      level: t('interp.high.severity'), 
      color: 'text-destructive', 
      description: t('interp.high.overall') 
    };
  };

  const daphne6Interp = getDaphne6Interpretation(results.daphne6Score);
  const daphne40Interp = getDaphne40Interpretation(results.daphne40Score);

  const domainDetails = [
    { name: t('domain.disinhibition'), key: 'disinhibition', items: 4 },
    { name: t('domain.apathy'), key: 'apathy', items: 1 },
    { name: t('domain.empathy'), key: 'empathy', items: 1 },
    { name: t('domain.perseverations'), key: 'perseverations', items: 1 },
    { name: t('domain.hyperorality'), key: 'hyperorality', items: 2 },
    { name: t('domain.neglect'), key: 'neglect', items: 1 }
  ];

  const handlePrint = () => {
    window.print();
  };

  const buildClinicalNote = (): string => {
    const allItems = getDaphneScaleItems('en');
    const scoreLabels = ['Normal (0)', 'Very mild (1)', 'Mild (2)', 'Moderate (3)', 'Severe (4)'];

    const daphne6Positive = results.daphne6Score >= 4;
    const daphne40Positive = results.daphne40Score >= 15;
    let likelihood = 'Low likelihood of bvFTD';
    if (daphne6Positive && daphne40Positive)
      likelihood = 'High likelihood of bvFTD (both screening and diagnostic thresholds met)';
    else if (daphne6Positive)
      likelihood = 'Moderate likelihood of bvFTD (screening threshold met, diagnostic not)';
    else if (daphne40Positive)
      likelihood = 'Atypical presentation (diagnostic threshold met, screening not)';

    const lines: string[] = [];
    lines.push('DAPHNE-40 / DAPHNE-6 Behavioural Assessment');
    lines.push('—'.repeat(46));
    if (patientInfo.name) lines.push(`Patient: ${patientInfo.name}`);
    if (patientInfo.age) lines.push(`Age: ${patientInfo.age}`);
    if (patientInfo.assessorName) lines.push(`Assessor: ${patientInfo.assessorName}`);
    lines.push(`Date: ${currentDate}`);
    lines.push('');
    lines.push(`DAPHNE-6 (screening): ${results.daphne6Score}/6 — threshold ≥4 (sens 92%)`);
    lines.push(`DAPHNE-40 (diagnostic): ${results.daphne40Score}/40 — threshold ≥15 (spec 92%)`);
    lines.push(`Impression: ${likelihood}.`);
    lines.push('');
    lines.push('Domain summary:');
    domainDetails.forEach((d) => {
      const responses = results.responses.filter((r) => {
        const it = allItems.find((i) => i.id === r.itemId);
        return it?.domain === d.key;
      });
      const sum = responses.reduce((a, r) => a + r.score, 0);
      const positive = responses.some((r) => r.score > 0);
      lines.push(`  • ${d.name}: ${sum}/${d.items * 4}  [${positive ? 'PRESENT' : 'absent'}]`);
    });
    lines.push('');
    lines.push('Item-level findings:');
    allItems.forEach((it) => {
      const r = results.responses.find((x) => x.itemId === it.id);
      const s = r?.score ?? 0;
      lines.push(`  - ${it.title}: ${scoreLabels[s]}`);
    });
    lines.push('');
    lines.push(
      'Note: Screening tool. Final diagnosis requires clinical correlation, neuroimaging, and full neuropsychiatric evaluation.'
    );
    return lines.join('\n');
  };

  const handleCopyNote = async () => {
    try {
      await navigator.clipboard.writeText(buildClinicalNote());
      setCopied(true);
      toast({ title: 'Clinical note copied', description: 'Pasted-ready text is on your clipboard.' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Select the text manually and copy.',
        variant: 'destructive',
      });
    }
  };

  const handleExportDocx = async () => {
    try {
      const allItems = getDaphneScaleItems('en');
      const scoreLabels = ['Normal (0)', 'Very mild (1)', 'Mild (2)', 'Moderate (3)', 'Severe (4)'];

      const daphne6Positive = results.daphne6Score >= 4;
      const daphne40Positive = results.daphne40Score >= 15;
      let likelihood = 'Low likelihood of bvFTD';
      if (daphne6Positive && daphne40Positive)
        likelihood = 'High likelihood of bvFTD (both screening and diagnostic thresholds met)';
      else if (daphne6Positive)
        likelihood = 'Moderate likelihood of bvFTD (screening threshold met, diagnostic not)';
      else if (daphne40Positive)
        likelihood = 'Atypical presentation (diagnostic threshold met, screening not)';

      const kv = (label: string, value: string) =>
        new Paragraph({
          children: [
            new TextRun({ text: `${label}: `, bold: true }),
            new TextRun(value),
          ],
        });

      const heading = (text: string, level: typeof HeadingLevel.HEADING_1 | typeof HeadingLevel.HEADING_2) =>
        new Paragraph({ heading: level, children: [new TextRun(text)] });

      const bullet = (text: string) =>
        new Paragraph({ bullet: { level: 0 }, children: [new TextRun(text)] });

      const domainParagraphs: Paragraph[] = domainDetails.map((d) => {
        const responses = results.responses.filter((r) => {
          const it = allItems.find((i) => i.id === r.itemId);
          return it?.domain === d.key;
        });
        const sum = responses.reduce((a, r) => a + r.score, 0);
        const positive = responses.some((r) => r.score > 0);
        return new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: `${d.name}: `, bold: true }),
            new TextRun(`${sum}/${d.items * 4}  `),
            new TextRun({ text: positive ? '[PRESENT]' : '[absent]', bold: positive }),
          ],
        });
      });

      const itemParagraphs: Paragraph[] = allItems.map((it) => {
        const r = results.responses.find((x) => x.itemId === it.id);
        const s = r?.score ?? 0;
        return new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: `${it.title}: `, bold: true }),
            new TextRun(scoreLabels[s]),
          ],
        });
      });

      const doc = new Document({
        styles: {
          default: { document: { run: { font: 'Calibri', size: 22 } } },
        },
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
                children: [new TextRun('DAPHNE-40 / DAPHNE-6 Behavioural Assessment')],
              }),
              new Paragraph({ children: [] }),
              ...(patientInfo.name ? [kv('Patient', patientInfo.name)] : []),
              ...(patientInfo.age ? [kv('Age', patientInfo.age)] : []),
              ...(patientInfo.assessorName ? [kv('Assessor', patientInfo.assessorName)] : []),
              kv('Date', currentDate),
              new Paragraph({ children: [] }),
              heading('Scores', HeadingLevel.HEADING_2),
              kv('DAPHNE-6 (screening)', `${results.daphne6Score}/6  — threshold ≥4 (sens 92%)`),
              kv('DAPHNE-40 (diagnostic)', `${results.daphne40Score}/40 — threshold ≥15 (spec 92%)`),
              kv('Impression', likelihood),
              new Paragraph({ children: [] }),
              heading('Domain summary', HeadingLevel.HEADING_2),
              ...domainParagraphs,
              new Paragraph({ children: [] }),
              heading('Item-level findings', HeadingLevel.HEADING_2),
              ...itemParagraphs,
              new Paragraph({ children: [] }),
              new Paragraph({
                children: [
                  new TextRun({
                    text:
                      'Note: Screening tool. Final diagnosis requires clinical correlation, neuroimaging, and full neuropsychiatric evaluation.',
                    italics: true,
                  }),
                ],
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const safeName = (patientInfo.name || 'patient').replace(/[^a-z0-9_-]+/gi, '_');
      const dateStamp = new Date().toISOString().slice(0, 10);
      saveAs(blob, `DAPHNE_${safeName}_${dateStamp}.docx`);
      toast({ title: 'DOCX exported', description: 'Clinical summary downloaded.' });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Export failed',
        description: 'Could not generate the DOCX file.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <LanguageToggle />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card className="shadow-medical">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-medical-primary mr-3" />
                <CardTitle className="text-3xl font-bold text-medical-primary">
                  {t('assessment.results.title')}
                </CardTitle>
              </div>
              <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{t('nav.patient')}: {patientInfo.name}</span>
                </div>
                {patientInfo.age && (
                  <div className="flex items-center">
                    <span>{t('nav.age')}: {patientInfo.age}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{currentDate}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {t('results.assessed.by')}: {patientInfo.assessorName}
              </p>
            </CardHeader>
          </Card>

          {/* Primary Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Target className="h-5 w-5 mr-2 text-medical-primary" />
                  {t('results.screening')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-medical-primary mb-2">
                    {results.daphne6Score}/6
                  </div>
                  <div className={`text-lg font-medium ${daphne6Interp.color}`}>
                    {daphne6Interp.level}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {daphne6Interp.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="h-5 w-5 mr-2 text-medical-primary" />
                  {t('results.diagnostic')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-medical-primary mb-2">
                    {results.daphne40Score}/40
                  </div>
                  <div className={`text-lg font-medium ${daphne40Interp.color}`}>
                    {daphne40Interp.level}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {daphne40Interp.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* DAPHNE-6 Screening Interpretation Panel */}
          {(() => {
            const involvedDomains = domainDetails.filter((d) => {
              const responses = results.responses.filter((r) => {
                const it = getDaphneScaleItems('en').find((i) => i.id === r.itemId);
                return it?.domain === d.key;
              });
              return responses.some((r) => r.score > 0);
            });

            const score = results.daphne6Score;
            let status: 'negative' | 'possible' | 'high';
            let statusLabel: string;
            let statusDescription: string;
            let statusBg: string;
            let statusBorder: string;
            let statusText: string;

            if (score === 0) {
              status = 'negative';
              statusLabel = 'Negative screen';
              statusDescription =
                'No behavioural domains affected. bvFTD screening is negative on DAPHNE-6.';
              statusBg = 'bg-medical-success/10';
              statusBorder = 'border-medical-success/30';
              statusText = 'text-medical-success';
            } else if (score < 4) {
              status = 'possible';
              statusLabel = 'Possible behavioural change';
              statusDescription = `${score} of 6 domains involved — below the DAPHNE-6 screening threshold (≥4). Behavioural change is present but does not meet the bvFTD screening cut-off; clinical follow-up advised.`;
              statusBg = 'bg-medical-warning/10';
              statusBorder = 'border-medical-warning/30';
              statusText = 'text-medical-warning';
            } else {
              status = 'high';
              statusLabel = 'High likelihood — positive screen';
              statusDescription = `${score} of 6 domains involved — meets the DAPHNE-6 screening threshold (≥4, sensitivity 92%). Suggests high likelihood of bvFTD; proceed to full diagnostic work-up.`;
              statusBg = 'bg-destructive/10';
              statusBorder = 'border-destructive/30';
              statusText = 'text-destructive';
            }

            const allDomainKeys = domainDetails.map((d) => d.key);
            const involvedKeys = new Set(involvedDomains.map((d) => d.key));

            return (
              <Card className={`shadow-card border-2 ${statusBorder}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between flex-wrap gap-3">
                    <span className="flex items-center">
                      <Target className="h-5 w-5 mr-2 text-medical-primary" />
                      DAPHNE-6 Screening Interpretation
                    </span>
                    <Badge variant="outline" className={`${statusText} border-current`}>
                      {score}/6
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`rounded-lg p-4 ${statusBg} border ${statusBorder}`}>
                    <h4 className={`font-semibold text-lg flex items-center mb-1 ${statusText}`}>
                      <AlertCircle className="h-5 w-5 mr-2" />
                      {statusLabel}
                    </h4>
                    <p className="text-sm text-foreground">{statusDescription}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-foreground">
                      Involved domains{' '}
                      <span className="text-muted-foreground font-normal">
                        ({involvedDomains.length}/6)
                      </span>
                    </h4>
                    {involvedDomains.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">
                        None — all six domains scored 0.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {allDomainKeys.map((key) => {
                          const d = domainDetails.find((x) => x.key === key)!;
                          const involved = involvedKeys.has(key);
                          return (
                            <Badge
                              key={key}
                              variant={involved ? 'destructive' : 'secondary'}
                              className={
                                involved
                                  ? ''
                                  : 'opacity-50 line-through decoration-muted-foreground/40'
                              }
                            >
                              {d.name}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground italic border-t pt-3">
                    DAPHNE-6 counts each of the six bvFTD domains (disinhibition, apathy, empathy,
                    perseverations, hyperorality, neglect) as 1 if any item in that domain scores
                    &gt;0. Cut-off ≥4 has 92% sensitivity for bvFTD (Boutoleau-Bretonnière, 2015).
                  </p>
                </CardContent>
              </Card>
            );
          })()}

          {/* Source / Citation */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <FileText className="h-4 w-4 mr-2 text-medical-primary" />
                Source & citation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-md border border-border bg-muted/40 p-3 space-y-2">
                <p className="text-foreground leading-relaxed">
                  Boutoleau-Bretonnière C, Evrard C, Hardouin J-B, Rocher L, Charriau T,
                  Etcharry-Bouyx F, Auriacombe S, Richard-Mornas A, Lebert F, Pasquier F,
                  Vercelletto M, Thomas-Antérion C.{' '}
                  <strong>
                    DAPHNE: A new tool for the assessment of the behavioral variant of
                    frontotemporal dementia.
                  </strong>{' '}
                  <em>Dementia and Geriatric Cognitive Disorders Extra.</em> 2015;5(3):503–516.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    <strong className="text-foreground">DOI:</strong>{' '}
                    <a
                      href="https://doi.org/10.1159/000440859"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-medical-primary hover:underline"
                    >
                      10.1159/000440859
                    </a>
                  </span>
                  <span>
                    <strong className="text-foreground">PubMed:</strong>{' '}
                    <a
                      href="https://pubmed.ncbi.nlm.nih.gov/26955380/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-medical-primary hover:underline"
                    >
                      26955380
                    </a>
                  </span>
                  <span>
                    <strong className="text-foreground">Full text (Karger):</strong>{' '}
                    <a
                      href="https://karger.com/dee/article/5/3/503/93770"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-medical-primary hover:underline"
                    >
                      open access
                    </a>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-md border border-border p-3">
                  <p className="font-semibold text-foreground mb-1">Tool version used</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    <li>DAPHNE-40 — full 10-item, 0–4 scoring</li>
                    <li>DAPHNE-6 — six-domain binary derivative</li>
                    <li>Original validation cohort (n = 156, 2015)</li>
                  </ul>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="font-semibold text-foreground mb-1">Cut-offs applied</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    <li>DAPHNE-6 ≥ 4 → sensitivity 92% for bvFTD</li>
                    <li>DAPHNE-40 ≥ 15 → specificity 92% for bvFTD</li>
                  </ul>
                </div>
              </div>

              <p className="text-xs text-muted-foreground italic">
                Cut-offs and domain definitions reproduced from the 2015 validation paper. This
                application implements scoring only and does not replace clinical judgement.
              </p>
            </CardContent>
          </Card>

          {/* Domain Radar Chart */}
          <DomainRadarChart
            title={t('results.domain.analysis') + ' — Overview'}
            data={domainDetails.map((domain) => {
              const domainResponses = results.responses.filter(r => {
                const item = getDaphneScaleItems('en').find(i => i.id === r.itemId);
                return item?.domain === domain.key;
              });
              const domainScore = domainResponses.reduce((sum, r) => sum + r.score, 0);
              return {
                domain: domain.name,
                score: domainScore,
                maxScore: domain.items * 4,
                fullMark: 100,
              };
            })}
          />

          {/* Domain Breakdown */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-medical-primary" />
                {t('results.domain.analysis')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {domainDetails.map((domain) => {
                  const domainResponses = results.responses.filter(r => {
                    const item = getDaphneScaleItems('en').find(i => i.id === r.itemId);
                    return item?.domain === domain.key;
                  });
                  
                  const domainScore = domainResponses.reduce((sum, r) => sum + r.score, 0);
                  const hasSymptoms = domainResponses.some(r => r.score > 0);
                  
                  return (
                    <div key={domain.key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{domain.name}</h4>
                        <Badge variant={hasSymptoms ? "destructive" : "secondary"}>
                          {hasSymptoms ? t('results.present') : t('results.absent')}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-medical-primary">
                        {domainScore}/{domain.items * 4}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {domain.items} {domain.items > 1 ? t('clinical.items') : t('clinical.item')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Diagnostic Suggestion */}
          <Card className="shadow-card border-2 border-medical-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-medical-primary" />
                bvFTD Diagnostic Suggestion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  const daphne6Positive = results.daphne6Score >= 4;
                  const daphne40Positive = results.daphne40Score >= 15;
                  
                  if (daphne6Positive && daphne40Positive) {
                    return (
                      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                        <h4 className="font-semibold text-destructive mb-2 flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          High Likelihood of bvFTD
                        </h4>
                        <p className="text-sm text-foreground">
                          Both screening (DAPHNE-6: {results.daphne6Score} ≥4) and diagnostic (DAPHNE-40: {results.daphne40Score} ≥15) thresholds are met. This suggests a <strong>high likelihood of behavioral variant frontotemporal dementia (bvFTD)</strong>. Clinical correlation and further neurological evaluation are recommended.
                        </p>
                      </div>
                    );
                  } else if (daphne6Positive && !daphne40Positive) {
                    return (
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          Moderate Likelihood of bvFTD
                        </h4>
                        <p className="text-sm text-foreground">
                          The screening threshold is met (DAPHNE-6: {results.daphne6Score} ≥4, 92% sensitivity), but the diagnostic threshold is not reached (DAPHNE-40: {results.daphne40Score} &lt;15). This suggests <strong>moderate likelihood</strong> of bvFTD. Further assessment and clinical evaluation are recommended.
                        </p>
                      </div>
                    );
                  } else if (!daphne6Positive && daphne40Positive) {
                    return (
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          Atypical Presentation
                        </h4>
                        <p className="text-sm text-foreground">
                          The diagnostic threshold is met (DAPHNE-40: {results.daphne40Score} ≥15, 92% specificity), but the screening threshold is not (DAPHNE-6: {results.daphne6Score} &lt;4). This is an <strong>atypical presentation</strong> that warrants comprehensive clinical evaluation to rule out other conditions.
                        </p>
                      </div>
                    );
                  } else {
                    return (
                      <div className="bg-medical-success/10 border border-medical-success/30 rounded-lg p-4">
                        <h4 className="font-semibold text-medical-success mb-2 flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          Low Likelihood of bvFTD
                        </h4>
                        <p className="text-sm text-foreground">
                          Neither diagnostic threshold is met (DAPHNE-6: {results.daphne6Score} &lt;4, DAPHNE-40: {results.daphne40Score} &lt;15). This suggests a <strong>low likelihood of bvFTD</strong>. However, clinical judgment should be used in conjunction with these results.
                        </p>
                      </div>
                    );
                  }
                })()}
                <p className="text-xs text-muted-foreground italic">
                  Note: This is a screening tool suggestion based on validated thresholds. Final diagnosis must be made by a qualified healthcare professional considering the full clinical picture, neuroimaging, and other diagnostic criteria.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Notes */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>{t('results.clinical.notes')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">{t('results.scoring.method')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>{t('results.screening')}:</strong> {t('clinical.scoring.daphne6')}</li>
                    <li><strong>{t('results.diagnostic')}:</strong> {t('clinical.scoring.daphne40')}</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">{t('results.assessment.domains')}</h4>
                  <p className="text-muted-foreground">
                    {t('clinical.domains.description')}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Diagnostic Thresholds</h4>
                  <p className="text-muted-foreground">
                    DAPHNE-6 allowed bvFTD diagnosis (score ≥4) with a sensitivity of 92%, while DAPHNE-40 (score ≥15) had a specificity of 92%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated text note */}
          {showNote && (
            <Card className="shadow-card print:hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-medical-primary" />
                  Clinical text note
                </CardTitle>
                <Button onClick={handleCopyNote} variant="outline" size="sm">
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
                  value={buildClinicalNote()}
                  className="font-mono text-xs min-h-[320px] whitespace-pre"
                />
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
            <Button onClick={handlePrint} variant="outline" size="lg">
              <Download className="h-4 w-4 mr-2" />
              {t('results.print')}
            </Button>
            <Button
              onClick={() => setShowNote((v) => !v)}
              variant="outline"
              size="lg"
            >
              <FileText className="h-4 w-4 mr-2" />
              {showNote ? 'Hide text note' : 'Generate text note'}
            </Button>
            <Button onClick={handleExportDocx} variant="outline" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Export to DOCX
            </Button>
            <Button onClick={onRestart} size="lg" className="bg-medical-primary hover:bg-medical-primary/90">
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('results.new')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
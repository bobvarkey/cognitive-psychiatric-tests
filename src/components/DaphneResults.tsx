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

  const daphne6Positive = results.daphne6Score >= 4;
  const daphne40Positive = results.daphne40Score >= 15;
  const involvedDomains = domainDetails.filter((d) => {
    const responses = results.responses.filter((r) => {
      const it = getDaphneScaleItems('en').find((i) => i.id === r.itemId);
      return it?.domain === d.key;
    });
    return responses.some((r) => r.score > 0);
  });

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
                  <span>{t('nav.patient')}: {patientInfo.name || 'Anonymous'}</span>
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
                {t('results.assessed.by')}: {patientInfo.assessorName || 'Clinical User'}
              </p>
            </CardHeader>
          </Card>

          {/* DAPHNE-6 Domain Score Summary (Clinician Ready) */}
          <Card className="shadow-card border-2 border-medical-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Target className="h-6 w-6 mr-3 text-medical-primary" />
                DAPHNE-6 Clinical Score Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-center p-6 bg-muted/30 rounded-xl border border-border">
                  <div className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Total Score</div>
                  <div className="text-6xl font-bold text-medical-primary mb-2">
                    {results.daphne6Score}<span className="text-2xl text-muted-foreground">/6</span>
                  </div>
                  <Badge variant={daphne6Positive ? "destructive" : "secondary"} className="text-sm px-4 py-1">
                    {daphne6Positive ? "POSITIVE SCREEN" : "NEGATIVE SCREEN"}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Domain Status</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {domainDetails.map((domain) => {
                      const involved = involvedDomains.some(id => id.key === domain.key);
                      return (
                        <div key={domain.key} className="flex items-center justify-between p-2 rounded-lg border bg-background/50">
                          <span className="text-sm font-medium">{domain.name}</span>
                          {involved ? (
                            <Badge variant="destructive" className="h-5">Positive</Badge>
                          ) : (
                            <Badge variant="outline" className="h-5 opacity-60">Absent</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-medical-primary" />
                  Clinician-Ready Conclusion
                </h4>
                <div className={`p-5 rounded-lg border-l-4 ${daphne6Positive ? 'bg-destructive/5 border-l-destructive' : 'bg-medical-success/5 border-l-medical-success'}`}>
                  <p className="text-base leading-relaxed text-foreground">
                    {daphne6Positive ? (
                      <>
                        The patient met the DAPHNE-6 screening threshold (<strong>{results.daphne6Score} ≥ 4</strong>), which carries a <strong>92% sensitivity</strong> for the behavioral variant of Frontotemporal Dementia (bvFTD).
                        {daphne40Positive ? (
                          <span> Furthermore, the diagnostic threshold (DAPHNE-40: {results.daphne40Score} ≥ 15) was also met, significantly increasing clinical suspicion.</span>
                        ) : (
                          <span> However, the diagnostic threshold was not met (DAPHNE-40: {results.daphne40Score} < 15), suggesting a need for careful clinical follow-up or re-evaluation.</span>
                        )}
                        {" "}A comprehensive neuropsychiatric evaluation and neuroimaging are strongly indicated.
                      </>
                    ) : (
                      <>
                        The screening threshold was not met (<strong>{results.daphne6Score} &lt; 4</strong>). This suggests a <strong>low likelihood of bvFTD</strong> based on the DAPHNE-6 criteria.
                        {daphne40Positive && (
                          <span> <strong>Note:</strong> An atypical presentation is noted as the DAPHNE-40 diagnostic threshold was exceeded ({results.daphne40Score} ≥ 15).</span>
                        )}
                        {" "}Clinical monitoring is advised if symptoms persist or progress.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Primary Scores Grid */}
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

          {/* Source / Citation */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <FileText className="h-4 w-4 mr-2 text-medical-primary" />
                Reference Standards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-md border border-border bg-muted/40 p-3 space-y-2">
                <p className="text-foreground leading-relaxed">
                  Boutoleau-Bretonnière C, et al.{' '}
                  <strong>DAPHNE: A new tool for the assessment of the behavioral variant of frontotemporal dementia.</strong>{' '}
                  <em>Dement Geriatr Cogn Disord Extra.</em> 2015;5(3):503–516.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-md border border-border p-3">
                  <p className="font-semibold text-foreground mb-1">DAPHNE-6 Threshold</p>
                  <p className="text-muted-foreground">Score ≥ 4 indicates high sensitivity (92%) for bvFTD screening.</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="font-semibold text-foreground mb-1">DAPHNE-40 Threshold</p>
                  <p className="text-muted-foreground">Score ≥ 15 indicates high specificity (92%) for bvFTD diagnosis.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Domain Radar Chart */}
          <DomainRadarChart
            title={t('results.domain.analysis') + ' — Visual Profile'}
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

          {/* Clinical Notes */}
          {showNote && (
            <Card className="shadow-card print:hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-medical-primary" />
                  Generated Clinical Note
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
              {showNote ? 'Hide Note' : 'Text Note'}
            </Button>
            <Button onClick={handleExportDocx} variant="outline" size="lg">
              <Download className="h-4 w-4 mr-2" />
              DOCX
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
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { cognitiveSyndromes, frontalLobeTests } from '@/data/cognitiveSyndromesData';
import { CognitiveSyndromeCategory } from '@/types/cognitiveSyndromes';
import { Brain, Search, X, FileText, RotateCcw, AlertTriangle, Info } from 'lucide-react';
import { usePatientInfo } from '@/contexts/PatientInfoContext';
import { generatePdfReport } from '@/utils/reportGenerator';

interface CognitiveSyndromesAssessmentProps {
  onBack?: () => void;
}

const categoryColors: Record<CognitiveSyndromeCategory, string> = {
  'Attention & Psychomotor': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Perceptual Disorders': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Body Schema & Awareness': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Delusional Misidentification': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'Other Delusions': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'Frontal Lobe Signs': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  'Movement & Behaviour': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
};

export const CognitiveSyndromesAssessment = ({ onBack }: CognitiveSyndromesAssessmentProps) => {
  const { language, t } = useLanguage();
  const { patientInfo } = usePatientInfo();
  const [selectedSyndromes, setSelectedSyndromes] = useState<Set<string>>(new Set());
  const [selectedTests, setSelectedTests] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const toggleSyndrome = (id: string) => {
    setSelectedSyndromes(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleTest = (id: string) => {
    setSelectedTests(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleReset = () => {
    setSelectedSyndromes(new Set());
    setSelectedTests(new Set());
    setNotes('');
    setShowResults(false);
  };

  const handleExportPdf = () => {
    const presentSyndromes = cognitiveSyndromes.filter(s => selectedSyndromes.has(s.id));
    const presentTests = frontalLobeTests.filter(t => selectedTests.has(t.id));

    const sections = [
      {
        title: 'Cognitive Syndromes Identified',
        items: presentSyndromes.map(s => ({
          label: s.name,
          value: language === 'en' ? s.description : s.descriptionMl,
        })),
      },
      {
        title: 'Frontal Lobe Tests — Abnormal',
        items: presentTests.map(t => ({
          label: t.name,
          value: language === 'en' ? t.description : t.descriptionMl,
        })),
      },
    ];

    if (notes.trim()) {
      sections.push({
        title: 'Clinical Notes',
        items: [{ label: 'Notes', value: notes }],
      });
    }

    generatePdfReport({
      title: 'Cognitive Syndromes & Frontal Lobe Assessment',
      patientInfo: patientInfo || undefined,
      sections,
      scores: {
        'Syndromes Present': presentSyndromes.length,
        'Frontal Tests Abnormal': presentTests.length,
      },
    });
  };

  // Group syndromes by category
  const categories = Array.from(new Set(cognitiveSyndromes.map(s => s.category)));

  const filteredSyndromes = searchQuery.trim()
    ? cognitiveSyndromes.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cognitiveSyndromes;

  const filteredTests = searchQuery.trim()
    ? frontalLobeTests.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : frontalLobeTests;

  if (showResults) {
    const presentSyndromes = cognitiveSyndromes.filter(s => selectedSyndromes.has(s.id));
    const presentTests = frontalLobeTests.filter(t => selectedTests.has(t.id));
    const affectedCategories = Array.from(new Set(presentSyndromes.map(s => s.category)));

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 pt-16">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary" />
          Cognitive Syndromes — Report
        </h1>

        {/* Summary */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">{presentSyndromes.length}</div>
                <div className="text-xs text-muted-foreground">Syndromes Identified</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">{presentTests.length}</div>
                <div className="text-xs text-muted-foreground">Frontal Tests Abnormal</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">{affectedCategories.length}</div>
                <div className="text-xs text-muted-foreground">Categories Affected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Identified syndromes */}
        {presentSyndromes.length > 0 && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Identified Syndromes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {presentSyndromes.map(s => (
                <div key={s.id} className="p-3 rounded-lg border border-border">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{s.name}</span>
                    <Badge className={categoryColors[s.category]} variant="secondary">{s.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'en' ? s.description : s.descriptionMl}
                  </p>
                  {s.clinicalNote && (
                    <p className="text-xs text-primary mt-1 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {language === 'en' ? s.clinicalNote : s.clinicalNoteMl}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Frontal lobe tests */}
        {presentTests.length > 0 && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Abnormal Frontal Lobe Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {presentTests.map(test => (
                <div key={test.id} className="p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{test.name}</span>
                    <Badge variant="outline">{test.domain}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'en' ? test.description : test.descriptionMl}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {notes.trim() && (
          <Card className="mb-4">
            <CardHeader><CardTitle>Clinical Notes</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{notes}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3 mt-6">
          <Button onClick={handleReset} variant="outline" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" /> {t('reset')}
          </Button>
          <Button onClick={handleExportPdf} className="flex-1">
            <FileText className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pt-16">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary" />
          Cognitive Syndromes & Frontal Lobe Tests
        </h1>
        <p className="text-sm text-muted-foreground">
          Select observed syndromes and abnormal frontal lobe test findings. This is a clinical reference and documentation tool.
        </p>
      </div>

      <PatientInfoForm />

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search syndromes…"
          className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Cognitive Syndromes */}
      <Accordion type="multiple" defaultValue={categories} className="space-y-2">
        {categories.map(cat => {
          const items = filteredSyndromes.filter(s => s.category === cat);
          if (items.length === 0) return null;
          return (
            <AccordionItem key={cat} value={cat} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Badge className={categoryColors[cat]} variant="secondary">{cat}</Badge>
                  <span className="text-xs text-muted-foreground">({items.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {items.map(syndrome => (
                    <div
                      key={syndrome.id}
                      className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                        selectedSyndromes.has(syndrome.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                      onClick={() => toggleSyndrome(syndrome.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedSyndromes.has(syndrome.id)}
                          onCheckedChange={() => toggleSyndrome(syndrome.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Label className="font-semibold text-foreground cursor-pointer">
                              {syndrome.name}
                            </Label>
                            {language === 'ml' && (
                              <span className="text-xs text-muted-foreground">{syndrome.nameMl}</span>
                            )}
                          </div>
                          {syndrome.etymology && (
                            <p className="text-xs text-primary/70 italic mt-0.5">{syndrome.etymology}</p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            {language === 'en' ? syndrome.description : syndrome.descriptionMl}
                          </p>
                          {syndrome.clinicalNote && (
                            <p className="text-xs text-primary mt-1 flex items-center gap-1">
                              <Info className="h-3 w-3 shrink-0" />
                              {language === 'en' ? syndrome.clinicalNote : syndrome.clinicalNoteMl}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Frontal Lobe Tests */}
      <Separator className="my-6" />
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Frontal Lobe Tests</CardTitle>
          <p className="text-sm text-muted-foreground">Select tests with abnormal findings</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredTests.map(test => (
            <div
              key={test.id}
              className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                selectedTests.has(test.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
              onClick={() => toggleTest(test.id)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedTests.has(test.id)}
                  onCheckedChange={() => toggleTest(test.id)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Label className="font-semibold text-foreground cursor-pointer">{test.name}</Label>
                    <Badge variant="outline" className="text-xs">{test.domain}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'en' ? test.description : test.descriptionMl}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">Clinical Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add clinical observations…"
            className="w-full min-h-[100px] p-3 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 mt-6 mb-8">
        <Button
          onClick={() => setShowResults(true)}
          disabled={selectedSyndromes.size === 0 && selectedTests.size === 0}
          className="flex-1"
        >
          View Report ({selectedSyndromes.size + selectedTests.size} selected)
        </Button>
        <Button onClick={handleReset} variant="outline">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

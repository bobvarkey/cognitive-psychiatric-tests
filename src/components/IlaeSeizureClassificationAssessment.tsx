import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronRight, BookOpen, AlertCircle } from 'lucide-react';
import {
  ILAE_SEIZURE_CLASSIFICATION,
  DESCRIPTORS,
  SEIZURE_NOTES,
  CLINICAL_CONTEXT,
} from '@/data/ilaeSeizureClassification';

interface ExpandedCategories {
  [key: string]: boolean;
}

interface IlaeSeizureClassificationAssessmentProps {
  onBack?: () => void;
}

export const IlaeSeizureClassificationAssessment = ({ onBack: _onBack }: IlaeSeizureClassificationAssessmentProps) => {
  const [expandedCategories, setExpandedCategories] = useState<ExpandedCategories>({
    focal: true,
    generalized: true,
  });

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderSeizureType = (type: any, level: number = 0, parentId: string = ''): JSX.Element => {
    const isExpandable = type.subcategories && type.subcategories.length > 0;
    const isExpanded = expandedCategories[type.id];
    const indent = level * 20;

    return (
      <div key={type.id}>
        <div
          className={`p-3 border-l-4 mb-2 cursor-pointer hover:bg-muted transition ${
            level === 0
              ? 'border-fuchsia-500/50 bg-card'
              : level === 1
                ? 'border-cyan-500/30 bg-muted/40'
                : 'border-purple-500/20 bg-slate-800/10'
          }`}
          style={{ marginLeft: `${indent}px` }}
          onClick={() => isExpandable && toggleCategory(type.id)}
        >
          <div className="flex items-start gap-3">
            {isExpandable && (
              <div className="mt-1 text-cyan-400">
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            )}
            {!isExpandable && <div className="w-4 h-4 mt-1" />}

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-fuchsia-400 text-sm">{type.code}</span>
                <span className="font-semibold text-white">{type.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">{type.description}</p>
            </div>
          </div>
        </div>

        {isExpandable && isExpanded && (
          <div>
            {type.subcategories.map((subtype: any) =>
              renderSeizureType(subtype, level + 1, type.id)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-fuchsia-600/20 to-cyan-600/20 border-fuchsia-500/30">
        <CardHeader>
          <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-fuchsia-400 mt-1" />
            <div>
              <CardTitle className="text-2xl text-white">ILAE Seizure Classification</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Updated Classification of Epileptic Seizures (2025)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                International League Against Epilepsy Official Guidelines
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="classification" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted border border-border">
          <TabsTrigger value="classification">Classification</TabsTrigger>
          <TabsTrigger value="descriptors">Descriptors</TabsTrigger>
          <TabsTrigger value="clinical">Clinical Guide</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Classification Tab */}
        <TabsContent value="classification">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-cyan-400">Seizure Type Hierarchy</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Click on categories to expand and view subcategories
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-2">
                  {ILAE_SEIZURE_CLASSIFICATION.map(seizureType =>
                    renderSeizureType(seizureType)
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Descriptors Tab */}
        <TabsContent value="descriptors">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-cyan-400">Seizure Descriptors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-fuchsia-400 rounded-full" />
                  {DESCRIPTORS.BASIC.title}
                </h3>
                <div className="space-y-2 ml-4">
                  {DESCRIPTORS.BASIC.items.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span className="text-foreground/90">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3 ml-4">
                  Used for all seizure types to document presence or absence of observable features
                </p>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                  {DESCRIPTORS.EXPANDED.title}
                </h3>
                <div className="space-y-2 ml-4">
                  {DESCRIPTORS.EXPANDED.items.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-fuchsia-400 mt-1">•</span>
                      <span className="text-foreground/90">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3 ml-4">
                  Applied to focal and unknown seizures for detailed characterization
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clinical Guide Tab */}
        <TabsContent value="clinical">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-cyan-400">{CLINICAL_CONTEXT.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {CLINICAL_CONTEXT.sections.map((section, idx) => (
                <div key={idx} className={idx > 0 ? 'border-t border-border pt-6' : ''}>
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-fuchsia-400 rounded-full" />
                    {section.heading}
                  </h3>
                  <ul className="space-y-2 ml-4">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="text-cyan-400 mt-1">→</span>
                        <span className="text-foreground/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-cyan-400">Important Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {SEIZURE_NOTES.map((note, idx) => (
                  <div key={idx} className="flex gap-3 p-3 rounded bg-muted/60 border border-border">
                    <AlertCircle className="w-5 h-5 text-fuchsia-400 mt-0.5 flex-shrink-0" />
                    <p className="text-foreground/90">{note}</p>
                  </div>
                ))}

                <div className="mt-6 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <p className="text-sm text-foreground/90">
                    <span className="font-semibold text-cyan-400">Citation: </span>
                    Beniczky S., Trinka E., Wirrell E., et al. Updated classification of epileptic seizures: A position
                    paper by the International League Against Epilepsy. <em>Epilepsia</em>. 2025; online ahead of print.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

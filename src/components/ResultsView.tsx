import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileBarChart, Trash2, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useResultsHistory, type AssessmentResult } from '@/hooks/useResultsHistory';

interface ResultsViewProps {
  onOpenAssessment?: (key: string) => void;
}

const formatTime = (ms: number, isMl: boolean) => {
  const d = new Date(ms);
  return d.toLocaleString(isMl ? 'ml-IN' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export const ResultsView = ({ onOpenAssessment }: ResultsViewProps) => {
  const { language } = useLanguage();
  const isMl = language === 'ml';
  const { results, clear, remove } = useResultsHistory();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <FileBarChart className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {isMl ? 'ഫലങ്ങൾ' : 'Results'}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isMl
                  ? 'പൂർത്തിയാക്കിയ വിലയിരുത്തലുകളുടെ പ്രാദേശിക ചരിത്രം (ഈ ഉപകരണത്തിൽ മാത്രം സംരക്ഷിച്ചു).'
                  : 'Local history of completed assessments (stored on this device only).'}
              </p>
            </div>
          </div>
          {results.length > 0 && (
            <Button variant="outline" size="sm" onClick={clear}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              {isMl ? 'മായ്ക്കുക' : 'Clear all'}
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileBarChart className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">
                {isMl
                  ? 'ഇതുവരെ സംരക്ഷിച്ച ഫലങ്ങളൊന്നുമില്ല.'
                  : 'No saved results yet.'}
              </p>
              <p className="text-xs mt-1">
                {isMl
                  ? 'ഒരു വിലയിരുത്തൽ പൂർത്തിയാക്കിയ ശേഷം അത് ഇവിടെ ദൃശ്യമാകും.'
                  : 'Completed assessments will appear here.'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {results.map((r: AssessmentResult) => (
                <li
                  key={r.completedAt}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{r.name}</span>
                      {r.score !== undefined && (
                        <Badge variant="secondary" className="text-[10px]">
                          {isMl ? 'സ്കോർ' : 'Score'}: {r.score}
                        </Badge>
                      )}
                      {r.interpretation && (
                        <Badge variant="outline" className="text-[10px]">
                          {r.interpretation}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3" />
                      {formatTime(r.completedAt, isMl)}
                      {r.patient && <span>· {r.patient}</span>}
                    </div>
                  </div>
                  {onOpenAssessment && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => onOpenAssessment(r.key)}
                    >
                      {isMl ? 'വീണ്ടും തുറക്കുക' : 'Reopen'}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(r.completedAt)}
                    aria-label={isMl ? 'നീക്കം ചെയ്യുക' : 'Remove'}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

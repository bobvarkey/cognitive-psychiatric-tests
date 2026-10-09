import { useState } from 'react';
import { Check, ClipboardList, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResultsActionBar } from '@/components/ResultsActionBar';
import { copyResultsToClipboard, downloadResultsText, resultFileName } from '@/lib/copyResults';

function SummaryActions({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const fileName = resultFileName(text.split('\n')[0] ?? '');

  const handleCopy = async () => {
    try {
      await copyResultsToClipboard(text);
      setFailed(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setFailed(true);
    }
  };

  return (
    <>
      <ResultsActionBar align="start">
        <Button type="button" variant="outline" size="sm" onClick={handleCopy} data-testid="result-summary-copy">
          {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
          {copied ? 'Copied' : 'Copy results'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => downloadResultsText(text, fileName)}
          data-testid="result-summary-download"
          title={fileName}
        >
          <Download className="h-4 w-4 mr-1.5" />
          Download .txt
        </Button>
      </ResultsActionBar>
      {failed && (
        <p className="text-xs text-muted-foreground" role="status">
          Copy is blocked by this browser. Use Download .txt instead.
        </p>
      )}
    </>
  );
}

/** Page-bottom result summary: the exact text that Copy and Download produce, plus both actions. */
export function ResultSummaryFooter({ texts }: { texts: string[] }) {
  return (
    <section
      aria-label="Result summary"
      data-testid="result-summary"
      className="w-full mt-8 mb-[max(2rem,env(safe-area-inset-bottom))] space-y-4 print:hidden"
    >
      {texts.map((text, i) => (
        <Card key={i} data-testid="result-summary-card" className="border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="h-5 w-5 text-primary shrink-0" />
              Result summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre
              data-testid="result-summary-text"
              className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed rounded-md bg-muted/50 p-3 text-foreground"
            >
              {text}
            </pre>
            <SummaryActions text={text} />
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

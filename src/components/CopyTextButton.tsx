import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyResultsToClipboard } from '@/lib/copyResults';
import { useRegisterResult } from '@/components/results/useRegisterResult';

interface CopyTextButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  /** Set false when the page registers its own (cleaner) result for the page-bottom summary. */
  registerSummary?: boolean;
}

export function CopyTextButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied',
  className,
  registerSummary = true,
}: CopyTextButtonProps) {
  const [copied, setCopied] = useState(false);
  useRegisterResult(registerSummary ? text : null);

  const handleCopy = async () => {
    try {
      await copyResultsToClipboard(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button type="button" onClick={handleCopy} variant="outline" size="sm" className={className}>
      {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
      {copied ? copiedLabel : label}
    </Button>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, FileText, Check, Download } from 'lucide-react';
import { generatePdfReport, downloadTextReport } from '@/utils/reportGenerator';
import type { ReportData } from '@/utils/reportGenerator';
import { formatResultsForCopy, copyResultsToClipboard } from '@/lib/copyResults';
import { useRegisterResult } from '@/components/results/useRegisterResult';

interface ExportButtonsProps {
  data: ReportData;
  className?: string;
  /** Set false on reference pages so their export does not create a page-bottom result summary. */
  registerSummary?: boolean;
}

export function ExportButtons({ data, className = '', registerSummary = true }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);
  useRegisterResult(registerSummary ? data : null);

  const handleCopy = async () => {
    try {
      const text = formatResultsForCopy(data);
      await copyResultsToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handlePdf = () => generatePdfReport(data);
  const handleDownload = () => downloadTextReport(data);

  return (
    <div className={`flex flex-wrap items-center gap-2 print:hidden ${className}`}>
      <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-1.5">
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
        {copied ? 'Copied' : 'Copy all'}
      </Button>
      <Button variant="outline" size="sm" onClick={handleDownload} className="flex items-center gap-1.5">
        <Download className="h-4 w-4" />
        Download .txt
      </Button>
      <Button variant="outline" size="sm" onClick={handlePdf} className="flex items-center gap-1.5">
        <FileText className="h-4 w-4" />
        Export PDF
      </Button>
    </div>
  );
}


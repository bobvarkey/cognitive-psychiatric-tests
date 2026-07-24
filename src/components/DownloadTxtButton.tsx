import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { downloadTextReport } from '@/utils/reportGenerator';
import type { ReportData } from '@/utils/reportGenerator';

interface Props {
  getData: () => ReportData;
  filename?: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  label?: string;
}

export function DownloadTxtButton({
  getData,
  filename,
  className = '',
  size = 'sm',
  variant = 'outline',
  label = 'Download .txt',
}: Props) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => {
        try {
          downloadTextReport(getData(), filename);
        } catch {}
      }}
      className={`flex items-center gap-1.5 ${className}`}
    >
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
}

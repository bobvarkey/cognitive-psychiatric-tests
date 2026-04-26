import { BookOpen, ExternalLink } from 'lucide-react';
import { ASSESSMENT_REFERENCES } from '@/data/assessmentReferences';

interface AssessmentReferenceProps {
  /** Key into ASSESSMENT_REFERENCES (e.g. 'hamd', 'pss', 'catatoniaBfcrs') */
  assessmentKey: string;
  className?: string;
}

/**
 * Compact footer block shown at the bottom of every assessment, listing the
 * classic / original publication for the instrument being used.
 */
export const AssessmentReference = ({ assessmentKey, className = '' }: AssessmentReferenceProps) => {
  const ref = ASSESSMENT_REFERENCES[assessmentKey];
  if (!ref) return null;

  return (
    <div
      className={`mt-8 mb-4 rounded-lg border bg-muted/40 p-4 text-xs text-muted-foreground ${className}`}
    >
      <div className="flex items-start gap-2">
        <BookOpen className="h-4 w-4 mt-0.5 shrink-0 text-primary/70" />
        <div className="flex-1 leading-relaxed">
          <p className="font-semibold text-foreground/80 mb-1">Reference</p>
          <p>{ref.citation}</p>
          {ref.url && (
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-1.5 text-primary hover:underline"
            >
              Original publication <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

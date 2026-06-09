import { BookOpen, ExternalLink, Stethoscope } from 'lucide-react';
import { ASSESSMENT_REFERENCES } from '@/data/assessmentReferences';
import { ASSESSMENT_INTERPRETATIONS } from '@/data/assessmentInterpretations';

interface AssessmentReferenceProps {
  /** Key into ASSESSMENT_REFERENCES (e.g. 'hamd', 'pss', 'catatoniaBfcrs') */
  assessmentKey: string;
  className?: string;
}

/**
 * Footer block shown at the bottom of every assessment: original publication
 * citation plus (when available) a structured clinical interpretation of
 * results, published psychometric properties, and recommended next steps.
 */
export const AssessmentReference = ({ assessmentKey, className = '' }: AssessmentReferenceProps) => {
  const ref = ASSESSMENT_REFERENCES[assessmentKey];
  const interp = ASSESSMENT_INTERPRETATIONS[assessmentKey];
  if (!ref && !interp) return null;

  return (
    <div className={`mt-8 mb-4 space-y-3 ${className}`}>
      {interp && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-xs leading-relaxed text-slate-800">
          <div className="flex items-start gap-2">
            <Stethoscope className="h-4 w-4 mt-0.5 shrink-0 text-blue-700" />
            <div className="flex-1 space-y-2">
              <p className="font-semibold text-slate-900">Clinical Interpretation</p>
              <p>{interp.interpretation}</p>
              {interp.psychometrics && (
                <p>
                  <span className="font-semibold text-slate-900">Psychometric note: </span>
                  {interp.psychometrics}
                </p>
              )}
              {interp.clinicalAction && (
                <p>
                  <span className="font-semibold text-slate-900">Clinical action: </span>
                  {interp.clinicalAction}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {ref && (
        <div className="rounded-lg border bg-muted/40 p-4 text-xs text-muted-foreground">
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
      )}
    </div>
  );
};

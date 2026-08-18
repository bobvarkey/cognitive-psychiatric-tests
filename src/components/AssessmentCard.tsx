import { Assessment } from '@/config/assessments';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, ChevronRight } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface AssessmentCardProps {
  assessment: Assessment;
  onClick?: () => void;
}

export const AssessmentCard = ({ assessment, onClick }: AssessmentCardProps) => {
  return (
    <div className="group rounded-xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-xl transition-all hover:border-primary/50 dark:hover:bg-accent/5 relative overflow-hidden dark:bg-card/80 dark:backdrop-blur-sm dark:shadow-primary/5">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <div className="text-6xl -rotate-12">{assessment.icon}</div>
      </div>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{assessment.icon}</div>
          <div>
            <h3 className="font-semibold text-foreground text-sm leading-tight">
              {assessment.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{assessment.abbreviation}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {assessment.description}
      </p>

      {/* Metadata */}
      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{assessment.duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          <span>{assessment.items} items</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">
          {assessment.subcategory}
        </span>
      </div>

      {/* CTA Button */}
      <Button
        className="w-full justify-between group/btn bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
        onClick={onClick}
      >
        <span>Start Assessment</span>
        <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};

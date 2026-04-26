import { Assessment } from '@/config/assessments';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AssessmentCardProps {
  assessment: Assessment;
  onClick?: () => void;
}

export const AssessmentCard = ({ assessment, onClick }: AssessmentCardProps) => {
  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{assessment.icon}</div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
              {assessment.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{assessment.abbreviation}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {assessment.description}
      </p>

      {/* Metadata */}
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
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
        className="w-full justify-between group/btn"
        onClick={onClick}
      >
        <span>Start Assessment</span>
        <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};

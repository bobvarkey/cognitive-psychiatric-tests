import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, AlertCircle, BookOpen, CheckCircle2 } from 'lucide-react';

interface FiveTwoOneCriteriaAssessmentProps {
  onBack?: () => void;
}

export const FiveTwoOneCriteriaAssessment = ({ onBack }: FiveTwoOneCriteriaAssessmentProps) => {
  const [criteria, setCriteria] = useState<Record<string, boolean>>({
    levodopa: false,
    offTime: false,
    dyskinesia: false,
  });

  const metCriteria = Object.values(criteria).filter(Boolean).length;
  const isAdvanced = metCriteria >= 1; // Advanced PD if ANY criterion is met

  const handleToggle = (key: string) => {
    setCriteria(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            size="sm"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Back
          </Button>
        )}
      </div>

      <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30">
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-purple-400 mt-1" />
            <div>
              <CardTitle className="text-2xl text-white">5-2-1 Criteria</CardTitle>
              <p className="text-sm text-gray-400 mt-2">
                Rule of Thumb for Advanced Parkinson's Disease
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Criteria Checklist */}
      <Card className="bg-slate-900/30 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-purple-400">Advanced PD Indicators</CardTitle>
          <p className="text-sm text-gray-400 mt-2">Select criteria that apply to the patient</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              id: 'levodopa',
              title: '≥ 5 doses of oral levodopa per day',
              description: 'Patient requires 5 or more daily doses of levodopa for motor control',
            },
            {
              id: 'offTime',
              title: '≥ 2 hours of "off" time per day',
              description: 'Patient experiences 2+ hours daily when medication wears off',
            },
            {
              id: 'dyskinesia',
              title: '≥ 1 hour of troublesome dyskinesia per day',
              description: 'Patient experiences involuntary movements for 1+ hours daily',
            },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`w-full p-4 rounded-lg border-2 text-left transition ${
                criteria[item.id]
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-slate-700 bg-slate-800/20 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded border-2 mt-0.5 flex items-center justify-center transition flex-shrink-0 ${
                    criteria[item.id]
                      ? 'bg-purple-500/30 border-purple-400'
                      : 'border-slate-600'
                  }`}
                >
                  {criteria[item.id] && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">{item.title}</div>
                  <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Results */}
      <Card className={`bg-slate-900/30 border-slate-800 ${isAdvanced ? 'border-purple-500/30' : 'border-blue-500/30'}`}>
        <CardHeader>
          <CardTitle className="text-lg text-white">Assessment Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="text-sm text-gray-400 mb-1">Criteria Met</div>
              <div className={`text-3xl font-bold ${isAdvanced ? 'text-purple-400' : 'text-blue-400'}`}>
                {metCriteria}/3
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="text-sm text-gray-400 mb-1">Classification</div>
              <div className={`text-xl font-bold ${isAdvanced ? 'text-purple-400' : 'text-blue-400'}`}>
                {isAdvanced ? 'Advanced PD' : 'Early-Mid PD'}
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${isAdvanced ? 'bg-purple-500/10 border-purple-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
            <div className="font-semibold text-white mb-2">Clinical Interpretation</div>
            <p className="text-sm text-gray-300">
              {isAdvanced
                ? 'Patient meets criteria for advanced Parkinson\'s Disease. Consider evaluation for advanced therapeutics including deep brain stimulation (DBS), continuous levodopa-carbidopa intestinal gel infusion (LCIG), or continuous subcutaneous apomorphine infusion (CSAI).'
                : 'Patient does not currently meet criteria for advanced PD. Continue standard dopaminergic therapy with periodic reassessment. Consider preventive strategies to optimize long-term outcomes.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Notes */}
      <Card className="bg-slate-900/30 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-purple-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Clinical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-400">
          <p>
            <span className="font-semibold text-white">Purpose:</span> The 5-2-1 criteria serve as a practical rule of thumb to
            identify patients with advanced PD who may benefit from advanced therapeutic interventions.
          </p>
          <p>
            <span className="font-semibold text-white">Criteria Met:</span> Patient meets criteria for advanced PD if ANY of the
            three conditions are present. The rule identifies approximately 20-30% of PD patients who may require treatment escalation.
          </p>
          <p>
            <span className="font-semibold text-white">Next Steps:</span> Advanced PD diagnosis should prompt evaluation for
            appropriateness for DAT (Device-Aided Therapy) including DBS, LCIG, CSAI, or LECIG.
          </p>
          <p className="italic text-gray-500">
            First published: Santos-Garciá et al. 2020; Aldred et al. 2020. Term introduced by Antonini 2017.
          </p>
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card className="bg-slate-900/30 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-purple-400">Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-400">
            <p>
              <span className="font-semibold text-white">The "5-2-1" Breakdown:</span>
            </p>
            <ul className="ml-4 space-y-1">
              <li>• <span className="font-semibold">5</span> = doses of oral levodopa daily</li>
              <li>• <span className="font-semibold">2</span> = hours of "off" time daily</li>
              <li>• <span className="font-semibold">1</span> = hour of troublesome dyskinesia daily</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              Any ONE of these three conditions indicates need for consideration of advanced therapy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

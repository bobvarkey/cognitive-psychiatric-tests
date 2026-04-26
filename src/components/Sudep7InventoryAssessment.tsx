import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle, BookOpen } from 'lucide-react';
import { SUDEP_7_ITEMS, SUDEP_7_RISK_LEVELS } from '@/data/sudepScales';

interface Sudep7InventoryAssessmentProps {
  onBack?: () => void;
}

export const Sudep7InventoryAssessment = ({ onBack }: Sudep7InventoryAssessmentProps) => {
  const [scores, setScores] = useState<Record<string, number>>({});

  const handleScoreChange = (id: string, value: number) => {
    setScores(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const answeredItems = Object.keys(scores).length;
  const allAnswered = answeredItems === SUDEP_7_ITEMS.length;

  const getRiskLevel = () => {
    if (totalScore <= 3) return { level: 'low', ...SUDEP_7_RISK_LEVELS.low, color: 'text-green-400' };
    if (totalScore <= 7) return { level: 'moderate', ...SUDEP_7_RISK_LEVELS.moderate, color: 'text-yellow-400' };
    if (totalScore <= 13) return { level: 'high', ...SUDEP_7_RISK_LEVELS.high, color: 'text-orange-400' };
    return { level: 'veryhigh', ...SUDEP_7_RISK_LEVELS.veryhigh, color: 'text-red-400' };
  };

  const riskLevel = allAnswered ? getRiskLevel() : null;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
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

      <Card className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border-red-500/30">
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 mt-1" />
            <div>
              <CardTitle className="text-2xl text-white">SUDEP-7 Inventory</CardTitle>
              <p className="text-sm text-gray-400 mt-2">
                Risk Assessment Tool for Sudden Unexpected Death in Epilepsy
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Assessment Items */}
      <Card className="bg-slate-900/30 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-red-400">Risk Factor Assessment</CardTitle>
          <p className="text-sm text-gray-400 mt-2">
            Score each item (0-3 scale)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {SUDEP_7_ITEMS.map((item, idx) => (
            <div key={item.id} className="p-4 rounded-lg border border-slate-700/50 bg-slate-800/20">
              <div className="mb-3">
                <label className="font-semibold text-white text-sm">{idx + 1}. {item.name}</label>
                <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                <p className="text-xs text-gray-500 mt-2 italic">{item.scoring}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {item.options.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleScoreChange(item.id, option.value)}
                    className={`px-3 py-2 rounded text-sm font-semibold transition ${
                      scores[item.id] === option.value
                        ? 'bg-red-500/30 text-red-300 border border-red-500'
                        : 'bg-slate-700/50 text-gray-300 border border-slate-600 hover:bg-slate-600/50'
                    }`}
                  >
                    <div className="text-xs text-gray-500">{option.value}</div>
                    <div className="text-xs">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Results */}
      {allAnswered && riskLevel && (
        <Card className={`bg-slate-900/30 border-slate-800 ${riskLevel.color.includes('red') ? 'border-red-500/30' : riskLevel.color.includes('orange') ? 'border-orange-500/30' : 'border-yellow-500/30'}`}>
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${riskLevel.color.replace('text', 'bg')}`} />
              SUDEP Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="text-sm text-gray-400 mb-1">Total Score</div>
                <div className={`text-3xl font-bold ${riskLevel.color}`}>{totalScore}</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="text-sm text-gray-400 mb-1">Risk Category</div>
                <div className={`text-lg font-bold ${riskLevel.color}`}>
                  {riskLevel.description.toUpperCase()}
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${riskLevel.color.includes('red') ? 'bg-red-500/10 border-red-500/30' : riskLevel.color.includes('orange') ? 'bg-orange-500/10 border-orange-500/30' : riskLevel.color.includes('yellow') ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
              <div className="font-semibold text-white mb-2">Annual SUDEP Risk</div>
              <p className={`text-sm font-bold ${riskLevel.color}`}>{riskLevel.percentage}</p>
              <p className="text-xs text-gray-300 mt-2">
                Score Range: {riskLevel.range}
              </p>
            </div>

            <div className="border-t border-slate-700/50 pt-4">
              <div className="font-semibold text-white mb-2">Clinical Interpretation</div>
              <p className="text-sm text-gray-300">
                {riskLevel.level === 'low' && 'Low SUDEP risk. Continue standard seizure management with regular follow-up.'}
                {riskLevel.level === 'moderate' && 'Moderate SUDEP risk. Optimize seizure control and medication adherence. Educate patient about risk reduction.'}
                {riskLevel.level === 'high' && 'High SUDEP risk. Urgent intervention recommended. Strongly consider advanced epilepsy treatment (surgery/neuromodulation) and seizure monitoring devices.'}
                {riskLevel.level === 'veryhigh' && 'Very high SUDEP risk. Immediate intervention essential. Evaluate for epilepsy surgery candidacy, implement comprehensive safety measures, and consider seizure alert devices.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!allAnswered && (
        <Card className="bg-slate-900/30 border-slate-800">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-400">
              Complete all items to see risk assessment. ({answeredItems}/{SUDEP_7_ITEMS.length} answered)
            </p>
          </CardContent>
        </Card>
      )}

      {/* Clinical Notes */}
      <Card className="bg-slate-900/30 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-red-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Clinical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-400">
          <p>
            <span className="font-semibold text-white">Purpose:</span> The SUDEP-7 Inventory is a validated clinical screening
            tool that assesses key risk factors for Sudden Unexpected Death in Epilepsy (SUDEP).
          </p>
          <p>
            <span className="font-semibold text-white">Key Risk Factors:</span> Tonic-clonic seizure frequency, medication
            adherence, intellectual disability, drug-resistant epilepsy, seizure clustering, young age of onset, and male gender.
          </p>
          <p>
            <span className="font-semibold text-white">Clinical Use:</span> Helps stratify SUDEP risk, guides counseling about
            seizure management importance, and identifies candidates for advanced interventions.
          </p>
          <p>
            <span className="font-semibold text-white">SUDEP Background:</span> Rare but serious complication of epilepsy. Most
            common cause of death in young patients with uncontrolled seizures. Risk primarily linked to inadequate seizure control.
          </p>
        </CardContent>
      </Card>

      {/* Risk Reduction */}
      <Card className="bg-slate-900/30 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-red-400">Key Prevention Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span>Optimize antiepileptic drug therapy and ensure medication adherence</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span>Evaluate for epilepsy surgery or neuromodulation in drug-resistant cases</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span>Position sleeping patient on side and monitor during sleep</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span>Have rescue medications available and educate caregivers on CPR</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span>Promote seizure avoidance through lifestyle modifications</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

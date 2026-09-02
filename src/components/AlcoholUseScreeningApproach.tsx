import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, ClipboardCheck, FlaskConical, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ZoomableImage } from '@/components/ZoomableImage';
import { AssessmentReference } from '@/components/AssessmentReference';
import alcoholUseScreening from '@/assets/alcohol-use-screening.png';

interface AlcoholUseScreeningApproachProps {
  onBack?: () => void;
}

const STEPS = [
  {
    icon: FlaskConical,
    title: '1. Screen',
    color: 'bg-amber-100 text-amber-800',
    items: [
      'Start with the AUDIT-C or the NIAAA Single Question Tool to identify heavy drinking.',
      'NIAAA Single Question: "How many times in the past year have you had ≥5 drinks in a day (men) or ≥4 drinks in a day (women)?"',
      'AUDIT-C: 3-item screen (frequency, amount, binging). Total score 0–12.',
    ],
  },
  {
    icon: ClipboardCheck,
    title: '2. Interpret',
    color: 'bg-blue-100 text-blue-800',
    items: [
      'AUDIT-C positive if score ≥ 4 (men) or ≥ 3 (women).',
      'NIAAA tool positive if ≥ 1 episode of heavy drinking in the past year.',
      'Positive result on either tool = unhealthy alcohol use.',
    ],
  },
  {
    icon: ShieldCheck,
    title: '3. Negative screen → Advise safe consumption',
    color: 'bg-green-100 text-green-800',
    items: [
      'Without liver disease: men ≤ 2 standard drinks per 24 hours; women ≤ 1 standard drink per 24 hours.',
      'With liver disease (ALD, MASLD, MASH, viral hepatitis, hemochromatosis): no safe level of drinking.',
    ],
  },
  {
    icon: AlertTriangle,
    title: '4. Unhealthy use → Assess for AUD',
    color: 'bg-orange-100 text-orange-800',
    items: [
      'Take a structured drinking history to understand weekly pattern.',
      'Assess for Alcohol Use Disorder using the alcohol symptom checklist (DSM-5-TR criteria).',
    ],
  },
  {
    icon: ClipboardCheck,
    title: '5a. Heavy drinking, NO AUD (0–1 symptom)',
    color: 'bg-yellow-100 text-yellow-800',
    items: [
      'Assist patient with heavy drinking: discuss risks, assess motivation, offer support, set individualized goals (reduce/abstain), follow up.',
    ],
  },
  {
    icon: BookOpen,
    title: '5b. AUD present (≥1 symptoms)',
    color: 'bg-red-100 text-red-800',
    items: [
      'Advise and assist for AUD: gradual reduction/abstinence, assess need for medically supervised withdrawal, set individualized goals, offer evidence-based treatment (medications, support groups), follow up.',
    ],
  },
];

export const AlcoholUseScreeningApproach = ({ onBack }: AlcoholUseScreeningApproachProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold">Approach to Alcohol Use Screening</h1>
          <p className="text-gray-600 text-sm mt-1">
            USPSTF recommendation — screening & brief intervention in primary care
          </p>
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 mb-3">
            <strong>Overview:</strong> Screen adults for unhealthy alcohol use using the AUDIT-C
            or NIAAA single question, then interpret results, advise safe consumption for negative
            screens, and assess for Alcohol Use Disorder (DSM-5-TR) when screening is positive.
            Manage based on whether AUD criteria are met.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Clinical Algorithm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ZoomableImage
            src={alcoholUseScreening}
            alt="Approach to Alcohol Use Screening — USPSTF algorithm flowchart"
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Tap the image to zoom. A text version of the algorithm follows below.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STEPS.map(step => (
          <Card key={step.title} className="h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center justify-center h-9 w-9 rounded-full ${step.color}`}>
                  <step.icon className="h-4 w-4" />
                </span>
                <h3 className="font-semibold text-gray-800">{step.title}</h3>
              </div>
              <ul className="space-y-2">
                {step.items.map((item, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-gray-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <AssessmentReference assessmentKey="alcoholUseScreeningApproach" />
    </div>
  );
};

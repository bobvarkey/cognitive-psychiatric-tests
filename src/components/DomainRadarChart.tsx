import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DomainData {
  domain: string;
  score: number;
  maxScore: number;
  fullMark: number;
}

interface DomainRadarChartProps {
  data: DomainData[];
  title: string;
  fillColor?: string;
  strokeColor?: string;
}

export const DomainRadarChart = ({
  data,
  title,
  fillColor = 'hsl(var(--primary))',
  strokeColor = 'hsl(var(--primary))',
}: DomainRadarChartProps) => {
  // Normalize scores to percentage for radar display
  const chartData = data.map((d) => ({
    domain: d.domain,
    score: d.maxScore > 0 ? Math.round((d.score / d.maxScore) * 100) : 0,
    fullMark: 100,
    raw: `${d.score}/${d.maxScore}`,
  }));

  return (
    <Card className="shadow-lg border-0 print:shadow-none print:border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="domain"
                tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md">
                      <p className="font-medium">{d.domain}</p>
                      <p className="text-muted-foreground">
                        {d.raw} ({d.score}%)
                      </p>
                    </div>
                  );
                }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke={strokeColor}
                fill={fillColor}
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

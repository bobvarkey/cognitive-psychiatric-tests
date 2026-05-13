export interface ReportSection {
  title: string;
  items: string[];
  type?: 'positive' | 'negative' | 'not-assessed' | 'info';
}

export interface ReportData {
  assessmentName: string;
  date: string;
  totalScore?: string;
  interpretation?: string;
  severity?: string;
  sections: ReportSection[];
  disclaimer?: string;
  patientInfo?: Record<string, string>;
}

export function generateTextReport(data: ReportData): string {
  const lines: string[] = [];
  lines.push(data.assessmentName);
  lines.push('='.repeat(Math.min(data.assessmentName.length, 60)));
  lines.push(`Generated: ${data.date}`);
  lines.push('');

  if (data.patientInfo) {
    for (const [key, value] of Object.entries(data.patientInfo)) {
      lines.push(`${key}: ${value}`);
    }
    lines.push('');
  }

  if (data.totalScore) {
    lines.push(`Score: ${data.totalScore}`);
    if (data.severity) lines.push(`Severity: ${data.severity}`);
    if (data.interpretation) lines.push(`Interpretation: ${data.interpretation}`);
    lines.push('');
  }

  for (const section of data.sections) {
    const marker = section.type === 'positive' ? '[!]' : section.type === 'negative' ? '[✓]' : section.type === 'not-assessed' ? '[○]' : '[*]';
    lines.push(`--- ${section.title} ---`);
    if (section.items.length > 0) {
      for (const item of section.items) {
        lines.push(`  ${marker} ${item}`);
      }
    } else {
      lines.push('  (none)');
    }
    lines.push('');
  }

  if (data.disclaimer) {
    lines.push(`DISCLAIMER: ${data.disclaimer}`);
    lines.push('');
  }

  lines.push('This report is generated for clinical use only. Not a substitute for professional diagnosis.');
  return lines.join('\n');
}

export function generatePdfReport(data: ReportData) {
  const getSectionClass = (type?: string) => {
    switch (type) {
      case 'positive': return 'positive';
      case 'negative': return 'negative';
      case 'not-assessed': return 'not-assessed';
      default: return 'info';
    }
  };

  const html = `<!DOCTYPE html>
<html><head>
  <meta charset="utf-8">
  <title>${data.assessmentName} - Clinical Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1a1a2e; line-height: 1.6; max-width: 800px; margin: 0 auto; }
    .header { border-bottom: 3px solid #1e40af; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { font-size: 22px; color: #1e40af; margin-bottom: 4px; }
    .header .meta { font-size: 12px; color: #6b7280; }
    .patient-info { background: #f0f9ff; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; display: flex; flex-wrap: wrap; gap: 8px 24px; }
    .patient-info span { font-size: 13px; }
    .patient-info strong { color: #374151; }
    .score-box { background: #eff6ff; border: 2px solid #bfdbfe; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px; }
    .score-box .score { font-size: 32px; font-weight: 700; color: #1e40af; }
    .score-box .severity { font-size: 15px; font-weight: 600; margin-top: 4px; color: #374151; }
    .score-box .interpretation { font-size: 13px; color: #4b5563; margin-top: 8px; max-width: 600px; margin-left: auto; margin-right: auto; }
    .section { margin-bottom: 20px; page-break-inside: avoid; }
    .section h2 { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 6px; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; }
    .section ul { list-style: none; padding: 0; }
    .section li { padding: 5px 0; font-size: 13px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: flex-start; gap: 8px; }
    .section li .marker { flex-shrink: 0; width: 16px; text-align: center; }
    .section.positive h2 { color: #dc2626; border-bottom-color: #fecaca; }
    .section.positive li .marker { color: #dc2626; }
    .section.negative h2 { color: #16a34a; border-bottom-color: #bbf7d0; }
    .section.negative li .marker { color: #16a34a; }
    .section.not-assessed h2 { color: #d97706; border-bottom-color: #fde68a; }
    .section.not-assessed li .marker { color: #d97706; }
    .section.info h2 { color: #2563eb; border-bottom-color: #bfdbfe; }
    .section.info li .marker { color: #2563eb; }
    .empty-note { font-size: 13px; color: #9ca3af; font-style: italic; padding: 4px 0; }
    .disclaimer { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 12px 16px; font-size: 11px; color: #92400e; margin-top: 24px; }
    .footer { text-align: center; font-size: 11px; color: #9ca3af; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
    @media print {
      body { padding: 20px; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${data.assessmentName}</h1>
    <div class="meta">Clinical Assessment Report &bull; Generated: ${data.date}</div>
  </div>
  ${data.patientInfo ? `<div class="patient-info">${Object.entries(data.patientInfo).map(([k, v]) => `<span><strong>${k}:</strong> ${v}</span>`).join('')}</div>` : ''}
  ${data.totalScore ? `<div class="score-box">
    <div class="score">${data.totalScore}</div>
    ${data.severity ? `<div class="severity">${data.severity}</div>` : ''}
    ${data.interpretation ? `<div class="interpretation">${data.interpretation}</div>` : ''}
  </div>` : ''}
  ${data.sections.map(s => {
    const cls = getSectionClass(s.type);
    const marker = s.type === 'positive' ? '⚠' : s.type === 'negative' ? '✓' : s.type === 'not-assessed' ? '○' : '•';
    return `<div class="section ${cls}">
    <h2>${s.title}</h2>
    ${s.items.length > 0 
      ? `<ul>${s.items.map(i => `<li><span class="marker">${marker}</span><span>${i}</span></li>`).join('')}</ul>` 
      : `<p class="empty-note">None</p>`}
  </div>`;
  }).join('')}
  ${data.disclaimer ? `<div class="disclaimer"><strong>⚠ Disclaimer:</strong> ${data.disclaimer}</div>` : ''}
  <div class="footer">This report is generated for clinical use only. Not a substitute for professional diagnosis.</div>
</body></html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

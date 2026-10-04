import type { ReportData, ReportSection } from '@/utils/reportGenerator';

/**
 * Shared "Copy results" helpers.
 *
 * Every Copy / Copy-results button in the app routes through this module so the
 * clipboard only ever receives result values, formatted as plain text:
 *
 *   <Scale name>
 *   <Item>: <value>
 *   Total score: <value>
 *   Interpretation: <category>
 *
 * Disclaimers, branding, URLs, timestamps, generation tokens / spec versions,
 * markdown, emoji, blank lines and N/A padding are stripped. User-entered
 * patient identifiers are kept only when they were filled in. On-screen UI text
 * (including disclaimers) is unaffected.
 */

/** Phrases that identify generic disclaimer / boilerplate lines. */
export const DISCLAIMER_PATTERNS: RegExp[] = [
  /disclaimer/i,
  /for (clinical|research|educational|informational|screening) (use|purposes?) only/i,
  /informational purposes/i,
  /educational purposes/i,
  /not (a|intended (as|to be) a) (substitute|replacement)/i,
  /does not (replace|substitute|constitute)/i,
  /(professional|clinical|medical) judge?ment/i,
  /consult (a|an|your|with)? ?(qualified |licensed )?(healthcare|health care|medical|mental health)? ?(provider|professional|doctor|physician|clinician|specialist)/i,
  /seek (professional|medical) (help|advice)/i,
  /medical advice/i,
  /not (a )?diagnos(is|tic)(\b| instrument| tool)/i,
  /only a qualified/i,
  /should be interpreted (with|in the context|alongside)/i,
  /\binterpret(ed)? (with caution|in (the )?context)/i,
  /should be correlated with/i,
  /clinical interpretation (is )?required/i,
  /confirm .* with (a )?(full|comprehensive) clinical/i,
  /screening (tool|instrument)\b.*(not|only|assist|help|does)/i,
  /all rights reserved/i,
  /©|\(c\) \d{4}|copyright/i,
  /\b(generated|created|exported|produced) (by|with|using|via)\b/i,
  /powered by/i,
  /\bcognito\b/i,
];

/** Line labels whose content is never a result value. */
const DROP_LABELS = [
  'date', 'date of assessment', 'assessment date', 'report date', 'generated', 'generated on', 'generated at',
  'report generated', 'exported', 'exported on', 'timestamp', 'time', 'copied', 'copied at', 'printed',
  'reference', 'references', 'source', 'sources', 'citation', 'url', 'link', 'website',
  'note', 'clinical note', 'disclaimer',
  'version', 'spec', 'spec version', 'app version', 'build', 'token', 'generation token', 'generation id',
];

const EMPTY_VALUES = /^(n\/?a|na|—|–|-|\.|not rated|not assessed|not answered|unanswered|not applicable|not recorded|not tested|not specified|unknown|\?|none selected)\.?$/i;

const URL_RE = /(?:https?:\/\/|www\.)[^\s)>\]]+/gi;
const TOKEN_RE = /\b(?:tok|token)_[A-Za-z0-9_-]+\b/gi;
const SPEC_RE = /\b(?:spec(?:ification)?[\s_-]*(?:version|ver|v)?|schema[\s_-]*v(?:ersion)?)\s*[:=#]?\s*v?\d+(?:\.\d+)*\b/gi;
const GEN_TOKEN_RE = /\bgeneration[\s_-]*(?:token|id)\s*[:=#]?\s*\S+/gi;
const ISO_TS_RE = /\b\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?\b/g;
// Emoji / pictographs, variation selectors, ZWJ, plus decorative status symbols.
const EMOJI_RE = /\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]|\u{FE0E}|\u{FE0F}|\u{200D}|\u{20E3}|[✓✔✗✘☐☑☒⚠★☆●○◯■□▪▫◆◇►▶◀]/gu;
const MARKER_ONLY = /^(?:!|\*|\+|-|x|✓|✔|✗|○|•|\s)$/i;

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s);

export function isDisclaimerLine(line: string): boolean {
  return DISCLAIMER_PATTERNS.some((re) => re.test(line));
}

function stripInline(line: string): string {
  return line
    .replace(URL_RE, '')
    .replace(TOKEN_RE, '')
    .replace(GEN_TOKEN_RE, '')
    .replace(SPEC_RE, '')
    .replace(ISO_TS_RE, '')
    .replace(EMOJI_RE, '')
    .replace(/\*\*|__|`/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\(\s*\)|\[\s*\]/g, '')
    .trim();
}

/** Normalises one raw line; returns null when the line must be dropped. */
function normaliseLine(raw: string): string | null {
  let line = raw.trim();
  if (!line) return null;
  // Pure separators (===, ---, ———, ***, ___)
  if (/^[\s=\-—–_*~#•.·:|]+$/.test(line)) return null;
  // Markdown headings / "--- Title ---" section rules
  line = line.replace(/^#{1,6}\s+/, '');
  line = line.replace(/^[-—–=]{2,}\s*(.*?)\s*[-—–=]{2,}$/, '$1');
  // Leading bullets
  line = line.replace(/^(?:[-*•+·▪◦>]\s+)+/, '');
  // "[!] text" / "[YES] text" / "[2] text" status markers
  const marker = line.match(/^\[([^\]]{1,20})\]\s*(.+)$/);
  if (marker) {
    const [, m, rest] = marker;
    if (MARKER_ONLY.test(m)) line = rest;
    else if (EMPTY_VALUES.test(m.trim())) return null;
    else line = `${rest}: ${/^[a-z]+$/i.test(m) ? capitalize(m) : m.trim()}`;
  }
  // Remove disclaimer sentences; drop the line if nothing else remains.
  if (isDisclaimerLine(line)) {
    line = line
      .split(/(?<=[.!?])\s+(?=[A-Z(])/)
      .filter((sentence) => !isDisclaimerLine(sentence))
      .join(' ')
      .trim();
    if (!line || /:$/.test(line)) return null;
  }
  const hadUrl = URL_RE.test(line);
  URL_RE.lastIndex = 0;
  line = stripInline(line);
  if (!line || /^[\s:.,;\-—–]+$/.test(line)) return null;

  const colon = line.indexOf(':');
  if (colon > 0) {
    const label = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (DROP_LABELS.includes(label.toLowerCase())) return null;
    if (value && EMPTY_VALUES.test(value.replace(/\s*\(.*\)\s*$/, '').trim())) return null;
    if (!value && hadUrl) return null;
  } else if (/^(none|n\/?a|\(none\)|not assessed)$/i.test(line)) {
    return null;
  }
  return line;
}

/**
 * Cleans arbitrary copy text so only result values remain.
 * Safe to call on text that is already clean (idempotent).
 */
export function sanitizeCopyText(text: string): string {
  const kept: string[] = [];
  for (const raw of (text ?? '').split(/\r?\n/)) {
    const line = normaliseLine(raw);
    if (line) kept.push(line);
  }
  // "Header:" followed by plain list lines becomes a single "Header: a, b" line.
  // Headers left with nothing beneath them are dropped.
  const isHeader = (l: string) => /:$/.test(l);
  const out: string[] = [];
  for (let i = 0; i < kept.length; i++) {
    const line = kept[i];
    if (!isHeader(line)) {
      out.push(line);
      continue;
    }
    const items: string[] = [];
    let j = i + 1;
    while (j < kept.length && !kept[j].includes(':')) items.push(kept[j++].replace(/[.;,]+$/, ''));
    if (items.length) {
      const value = items.join(', ');
      if (!EMPTY_VALUES.test(value)) out.push(`${line} ${value}`);
      i = j - 1;
    } else if (j < kept.length && !isHeader(kept[j])) {
      out.push(line);
    }
  }
  return out.join('\n');
}

const SKIP_SECTION = /recommend|guidance|next step|reference|disclaimer|^notes?$|clinical note|information|education|about|not assessed|unanswered/i;

function normaliseItem(item: string, section: ReportSection): string {
  let s = item.trim();
  // "Question — answer (Score: 2/4)" → "Question: answer (2/4)"
  s = s.replace(/\(\s*score:\s*([^)]+)\)/i, '($1)');
  if (!s.includes(':') && /\s[—–]\s/.test(s)) s = s.replace(/\s[—–]\s/, ': ');
  // "Question (0)" → "Question: 0"
  if (!s.includes(':')) {
    const m = s.match(/^(.*?)\s*\(([^()]+)\)$/);
    if (m && /\d/.test(m[2])) s = `${m[1]}: ${m[2]}`;
  }
  if (!s.includes(':')) {
    if (section.type === 'positive') s = `${s}: Present`;
    else if (section.type === 'negative') s = `${s}: Absent`;
  }
  return s;
}

/** Builds results-only plain text from the shared ReportData structure. */
export function formatResultsForCopy(data: ReportData): string {
  const lines: string[] = [data.assessmentName];
  // Patient identifiers are included only when the clinician entered them.
  for (const [key, value] of Object.entries(data.patientInfo ?? {})) {
    if (value && String(value).trim()) lines.push(`${key}: ${String(value).trim()}`);
  }
  for (const section of data.sections ?? []) {
    if (section.type === 'not-assessed' || SKIP_SECTION.test(section.title)) continue;
    for (const item of section.items ?? []) {
      if (item && item.trim()) lines.push(normaliseItem(item, section));
    }
  }
  if (data.totalScore) lines.push(`Total score: ${data.totalScore}`);
  const category = (data.severity || data.interpretation || '').trim();
  if (category) lines.push(`Interpretation: ${category}`);
  return sanitizeCopyText(lines.join('\n'));
}

/** Writes sanitized results text to the clipboard. Rejects if the clipboard is unavailable. */
export async function copyResultsToClipboard(text: string): Promise<string> {
  const clean = sanitizeCopyText(text);
  await navigator.clipboard.writeText(clean);
  return clean;
}

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
    // "Age: not recorded years" → padding, drop it.
    if (/^(not (recorded|specified|rated|assessed|answered|tested)|unanswered)\b/i.test(value)) return null;
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

const SKIP_SECTION =
  /recommend|guidance|guide\b|next step|reference|disclaimer|^notes?$|clinical note|information|education|about|not assessed|unanswered|cut-?offs?\b|suggestion|monitoring schedule|management|prevention|strateg|characteristic|^(clinical |score )?interpretation( guide)?$/i;

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
  // "Score: 3/14" inside a "STEADI Score" section → "STEADI Score: 3/14" (keeps lines unambiguous).
  const generic = s.match(/^(score|level|total|result|count|grade|stage|class)\s*:\s*(.+)$/i);
  if (generic && section.title && !/^(scores?|results?|items?|criteria|findings|responses)$/i.test(section.title.trim())) {
    const title = section.title.trim();
    const label = generic[1].toLowerCase();
    s = new RegExp(`\\b${label}$`, 'i').test(title) ? `${title}: ${generic[2]}` : `${title} ${label}: ${generic[2]}`;
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
  // Labels used in more than one section ("Eye" in GCS and FOUR) get the section name.
  const labelSections = new Map<string, Set<string>>();
  for (const section of data.sections ?? []) {
    if (section.type === 'not-assessed' || SKIP_SECTION.test(section.title)) continue;
    for (const item of section.items ?? []) {
      const label = normaliseItem(item ?? '', section).split(':')[0].trim().toLowerCase();
      if (!label) continue;
      if (!labelSections.has(label)) labelSections.set(label, new Set());
      labelSections.get(label)!.add(section.title);
    }
  }
  const disambiguate = (line: string, section: ReportSection) => {
    const i = line.indexOf(':');
    if (i <= 0 || !section.title?.trim()) return line;
    const label = line.slice(0, i).trim();
    if ((labelSections.get(label.toLowerCase())?.size ?? 0) < 2) return line;
    if (label.toLowerCase().startsWith(section.title.trim().toLowerCase())) return line;
    return `${section.title.trim()} ${label.charAt(0).toLowerCase()}${label.slice(1)}${line.slice(i)}`;
  };
  for (const section of data.sections ?? []) {
    if (section.type === 'not-assessed' || SKIP_SECTION.test(section.title)) continue;
    // Bare answer lines (no "label: value") become one "<Section title>: a, b" line so
    // every line reads as item: value. A "Header:" item keeps its own list (merged later).
    const bare: string[] = [];
    let underHeader = false;
    for (const item of section.items ?? []) {
      if (!item || !item.trim()) continue;
      const line = disambiguate(normaliseItem(item, section), section);
      if (/:\s*$/.test(line)) {
        underHeader = true;
        lines.push(line);
      } else if (line.includes(':') ) {
        underHeader = false;
        lines.push(line);
      } else if (underHeader) {
        lines.push(line);
      } else {
        bare.push(line.replace(/[.;,]+$/, ''));
      }
    }
    if (bare.length && section.title?.trim()) lines.push(`${section.title.trim()}: ${bare.join(', ')}`);
  }
  if (data.totalScore) lines.push(`${data.totalLabel?.trim() || 'Total score'}: ${data.totalScore}`);
  const category = (data.severity || data.interpretation || '').trim();
  if (category) lines.push(`Interpretation: ${category}`);
  return sanitizeCopyText(lines.join('\n'));
}

/** Writes sanitized results text to the clipboard. Rejects if no copy method works. */
export async function copyResultsToClipboard(text: string): Promise<string> {
  const clean = sanitizeCopyText(text);
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(clean);
    return clean;
  } catch (err) {
    // Fallback for older mobile browsers / non-secure contexts.
    if (legacyCopy(clean)) return clean;
    throw err;
  }
}

function legacyCopy(text: string): boolean {
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') return false;
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.top = '0';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  try {
    ta.select();
    ta.setSelectionRange(0, text.length);
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    ta.remove();
  }
}

/** The exact text used for both "Copy results" and "Download .txt". */
export function buildResultText(input: ReportData | string): string {
  if (typeof input !== 'string') return formatResultsForCopy(input);
  // Free-text reports: keep the name line and "label: value" lines only; section
  // headings and prose are not results. (Header lists were already merged.)
  const [name, ...rest] = sanitizeCopyText(input).split('\n');
  return [name, ...rest.filter((l) => l.includes(':'))].filter(Boolean).join('\n');
}

/** True when the text holds a result beyond the scale-name line. */
export function hasResultContent(text: string): boolean {
  return (text ?? '').split('\n').filter((l) => l.trim()).length >= 2;
}

/** "Hamilton Depression Rating Scale (HAM-D)" → "hamilton-depression-rating-scale-ham-d-result.txt" */
export function resultFileName(scaleName: string): string {
  const slug = (scaleName ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
  return `${slug || 'assessment'}-result.txt`;
}

/**
 * Downloads results as a .txt file whose content is identical to the clipboard text.
 * Uses a Blob + <a download> (supported by iOS Safari 13+ and Android Chrome); if that
 * throws, falls back to opening the plain text in a new tab so it can be saved/shared.
 * Returns the exact text written.
 */
export function downloadResultsText(input: ReportData | string, filename?: string): string {
  const text = buildResultText(input);
  const name = filename ?? resultFileName(text.split('\n')[0] ?? '');
  try {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Safari can cancel the download if the URL is revoked synchronously.
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  } catch {
    try {
      window.open(`data:text/plain;charset=utf-8,${encodeURIComponent(text)}`, '_blank', 'noopener');
    } catch {
      /* nothing else we can do */
    }
  }
  return text;
}

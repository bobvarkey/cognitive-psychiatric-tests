// Generates src/styles/dark-mode.css: remaps hard-coded *light* Tailwind palette
// utilities (bg-white, bg-blue-50, text-gray-700, border-amber-200, from-indigo-50 ...)
// to readable dark equivalents when <html class="dark"> is active.
//
// Every selector is wrapped in :where(.dark) so it has the specificity of a single
// class: it beats the plain utility (this file loads after index.css) but loses to
// any explicit `dark:` variant a component sets, so hand-tuned dark styles win.
//
// Run: node scripts/generate-dark-mode-css.mjs
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const colors = require('tailwindcss/colors');

const GRAYS = ['slate', 'gray', 'zinc', 'neutral', 'stone'];
const HUES = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];

const esc = (cls) => cls.replace(/[:/.]/g, (m) => `\\${m}`);
const sel = (classes, pseudo = '') => classes.map((c) => `:where(.dark) .${esc(c)}${pseudo}`).join(',\n');
const rgba = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255} / ${a})`;
};
const rules = [];
const rule = (selectors, body) => rules.push(`${selectors} {\n  ${body}\n}`);
const withHover = (prefix, shades, name) => shades.flatMap((s) => [`${prefix}-${name}-${s}`]);

const gradient = (name, color) => {
  rule(sel([`from-${name}`]), `--tw-gradient-from: ${color} var(--tw-gradient-from-position); --tw-gradient-to: transparent var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);`);
  rule(sel([`via-${name}`]), `--tw-gradient-to: transparent var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-from), ${color} var(--tw-gradient-via-position), var(--tw-gradient-to);`);
  rule(sel([`to-${name}`]), `--tw-gradient-to: ${color} var(--tw-gradient-to-position);`);
};

// White / black
rule(sel(['bg-white']), 'background-color: hsl(var(--card));');
rule(sel(['hover:bg-white'], ':hover'), 'background-color: hsl(var(--card));');
for (const a of [95, 90, 80, 70, 60, 50]) rule(sel([`bg-white/${a}`]), `background-color: hsl(var(--card) / ${a / 100});`);
rule(sel(['text-black']), 'color: hsl(var(--foreground));');
rule(sel(['hover:text-black'], ':hover'), 'color: hsl(var(--foreground));');
gradient('white', 'hsl(var(--card))');

// Neutral grays -> theme tokens
for (const g of GRAYS) {
  rule(sel(withHover('text', [950, 900, 800, 700], g)), 'color: hsl(var(--foreground));');
  rule(sel(withHover('text', [600, 500, 400], g)), 'color: hsl(var(--muted-foreground));');
  rule(sel([950, 900, 800, 700, 600].map((s) => `hover:text-${g}-${s}`), ':hover'), 'color: hsl(var(--foreground));');
  rule(sel([`bg-${g}-50`]), 'background-color: hsl(var(--secondary));');
  rule(sel([`bg-${g}-100`]), 'background-color: hsl(var(--muted));');
  rule(sel([`bg-${g}-200`]), 'background-color: hsl(240 6% 20%);');
  // Mid grays are used as solid chips behind white text; darken for contrast.
  rule(sel([`bg-${g}-300`]), 'background-color: hsl(240 5% 28%);');
  rule(sel([`bg-${g}-400`]), 'background-color: hsl(240 5% 34%);');
  rule(sel([`hover:bg-${g}-500`], ':hover'), 'background-color: hsl(240 5% 40%);');
  rule(sel([`hover:bg-${g}-50`, `hover:bg-${g}-100`, `hover:bg-${g}-200`], ':hover'), 'background-color: hsl(var(--accent));');
  rule(sel([`border-${g}-100`, `border-${g}-200`, `border-${g}-300`]), 'border-color: hsl(var(--border));');
  rule(sel([`divide-${g}-100`, `divide-${g}-200`], ' > :not([hidden]) ~ :not([hidden])'), 'border-color: hsl(var(--border));');
  for (const s of [50, 100]) gradient(`${g}-${s}`, 'hsl(var(--secondary))');
}

// Chromatic hues: pastel backgrounds -> deep tints, dark text -> light text
for (const h of HUES) {
  const c = colors[h];
  rule(sel([`bg-${h}-50`, `bg-${h}-100`]), `background-color: ${rgba(c[950], 0.45)};`);
  rule(sel([`bg-${h}-50/50`, `bg-${h}-100/50`, `bg-${h}-50/30`, `bg-${h}-100/30`]), `background-color: ${rgba(c[950], 0.3)};`);
  rule(sel([`bg-${h}-200`]), `background-color: ${rgba(c[900], 0.55)};`);
  rule(sel([`bg-${h}-300`]), `background-color: ${rgba(c[800], 0.6)};`);
  rule(sel([`hover:bg-${h}-50`, `hover:bg-${h}-100`, `hover:bg-${h}-200`], ':hover'), `background-color: ${rgba(c[900], 0.6)};`);
  rule(sel([`text-${h}-950`, `text-${h}-900`, `text-${h}-800`]), `color: ${c[200]};`);
  rule(sel([`text-${h}-700`]), `color: ${c[300]};`);
  rule(sel([`text-${h}-600`]), `color: ${c[400]};`);
  rule(sel([`hover:text-${h}-900`, `hover:text-${h}-800`, `hover:text-${h}-700`], ':hover'), `color: ${c[200]};`);
  rule(sel([`border-${h}-50`, `border-${h}-100`, `border-${h}-200`, `border-${h}-300`]), `border-color: ${rgba(c[800], 0.8)};`);
  for (const s of [50, 100, 200]) gradient(`${h}-${s}`, rgba(c[950], 0.5));
}

// Solid mid-tone chips/badges with white text: pick the first shade >= 500 that
// gives white text WCAG AA (4.5:1) contrast in dark mode.
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f((n >> 16) & 255) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
};
const whiteContrast = (hex) => 1.05 / (lum(hex) + 0.05);
for (const h of HUES) {
  const shade = [500, 600, 700, 800].find((s) => whiteContrast(colors[h][s]) >= 4.5);
  for (const base of [400, 500]) {
    if (shade && shade !== base) rules.push(`:where(.dark) :where(.text-white).bg-${h}-${base} {\n  background-color: ${colors[h][shade]};\n}`);
  }
}

// Brand colour used as text needs a lighter tone on dark surfaces for AA contrast.
rule(sel(['text-primary']), 'color: hsl(243 90% 77%);');

const header = `/* GENERATED by scripts/generate-dark-mode-css.mjs - do not edit by hand.
 * Dark-mode remap of hard-coded light palette utilities. Loaded after index.css.
 * :where(.dark) keeps specificity low so explicit dark: variants still win. */\n`;
writeFileSync(new URL('../src/styles/dark-mode.css', import.meta.url), header + rules.join('\n') + '\n');
console.log(`wrote ${rules.length} rules`);

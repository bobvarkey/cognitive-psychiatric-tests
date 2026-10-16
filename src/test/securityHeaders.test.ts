import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SECURITY_HEADERS, buildCsp } from '../../security-headers.config';

const root = resolve(__dirname, '../..');

describe('security headers', () => {
  it('public/_headers matches security-headers.config.ts', () => {
    const text = readFileSync(resolve(root, 'public/_headers'), 'utf8');
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) expect(text).toContain(`  ${k}: ${v}`);
  });

  it('vercel.json matches security-headers.config.ts', () => {
    const json = JSON.parse(readFileSync(resolve(root, 'vercel.json'), 'utf8'));
    const got = Object.fromEntries(json.headers[0].headers.map((h: { key: string; value: string }) => [h.key, h.value]));
    expect(got).toEqual(SECURITY_HEADERS);
  });

  it('CSP allows the origins the app needs and nothing unsafe for scripts', () => {
    const csp = buildCsp();
    for (const o of ['https://checkout.razorpay.com', 'https://*.razorpay.com', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com', '.supabase.co']) {
      expect(csp).toContain(o);
    }
    expect(csp).toMatch(/frame-ancestors /);
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-(inline|eval)'/);
    expect(buildCsp({ forMeta: true })).not.toMatch(/frame-ancestors/);
  });
});

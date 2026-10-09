import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { CheckoutSuccess } from './CheckoutSuccess';

const STORE_KEY = 'psycognito.webPremium.v1';
const FUTURE = new Date(Date.now() + 365 * 86400 * 1000).toISOString();

/** Seed the record the real checkout writes, with per-test overrides. */
const seed = (record: Record<string, unknown>) =>
  localStorage.setItem(
    STORE_KEY,
    JSON.stringify({
      email: 'buyer@example.com',
      plan: 'yearly',
      currentPeriodEnd: FUTURE,
      ...record,
    }),
  );

const renderAt = (url: string) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <CheckoutSuccess />
    </MemoryRouter>,
  );

describe('CheckoutSuccess', () => {
  beforeEach(() => localStorage.clear());

  it('confirms the plan, amount and activation for the order in the URL', () => {
    seed({ orderId: 'order_abc', amount: 299900, currency: 'INR', label: 'PsyCognito Premium — Yearly' });
    renderAt('/checkout/success?order=order_abc');

    expect(screen.getByText('Payment successful')).toBeTruthy();
    expect(screen.getByText('PsyCognito Premium — Yearly')).toBeTruthy();
    expect(screen.getByText('₹2,999')).toBeTruthy();
    expect(screen.getByText('Active now')).toBeTruthy();
    expect(screen.getByText(/2027/)).toBeTruthy();
  });

  it('formats an INR amount from paise', () => {
    seed({ orderId: 'order_inr', amount: 24900, currency: 'INR' });
    renderAt('/checkout/success?order=order_inr');

    expect(screen.getByText('₹249')).toBeTruthy();
    expect(screen.queryByText('₹249.00')).toBeNull();
  });

  it('formats a USD amount from cents', () => {
    seed({ orderId: 'order_usd', amount: 299, currency: 'USD' });
    renderAt('/checkout/success?order=order_usd');

    expect(screen.getByText('$2.99')).toBeTruthy();
  });

  it('derives the plan name when the server sent no label', () => {
    seed({ orderId: 'order_plain', plan: 'monthly', amount: 24900, currency: 'INR' });
    renderAt('/checkout/success?order=order_plain');

    expect(screen.getByText(/monthly/i)).toBeTruthy();
  });

  it('omits the paid line rather than showing a number it does not have', () => {
    // A restored purchase carries no amount: it was never bought in this browser.
    seed({ orderId: 'order_restored' });
    renderAt('/checkout/success?order=order_restored');

    expect(screen.getByText('Payment successful')).toBeTruthy();
    expect(screen.queryByText('Paid')).toBeNull();
    expect(screen.getByText('Active now')).toBeTruthy();
  });

  it('falls back when the URL order does not match the stored record', () => {
    seed({ orderId: 'order_abc', amount: 299900, currency: 'INR' });
    renderAt('/checkout/success?order=order_someone_elses');

    expect(screen.queryByText('Payment successful')).toBeNull();
    expect(screen.getByText(/could not find that order/i)).toBeTruthy();
  });

  it('falls back when nothing was bought in this browser', () => {
    renderAt('/checkout/success?order=order_abc');

    expect(screen.queryByText('Payment successful')).toBeNull();
    expect(screen.getByText(/could not find that order/i)).toBeTruthy();
  });

  it('falls back when the URL names no order at all', () => {
    seed({ orderId: 'order_abc', amount: 299900, currency: 'INR' });
    renderAt('/checkout/success');

    expect(screen.queryByText('Payment successful')).toBeNull();
    expect(screen.getByText(/could not find that order/i)).toBeTruthy();
  });
});

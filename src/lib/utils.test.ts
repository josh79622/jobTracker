import { describe, it, expect } from "vitest";
import { cn, formatDate, getStatusLabel } from "./utils";

describe('cn', () => {
  it('merges multiple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  })

  it('ignores falsy values (false / null / undefined)', () => {
    expect(cn('foo', false, 'bar', null, undefined)).toBe('foo bar');
  })

  it('resolves Tailwind conflicts via twMerge', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  })

  it('formats an ISO date into a human-readable string', () => {
    expect(formatDate('2024-06-01')).toBe('Jun 1, 2024');
  })
})

describe('getStatusLabel', () => {
  it('returns the default label when no custom labels are given', () => {
    expect(getStatusLabel('phone_screen')).toBe('Phone Screen')
  })

  it('applies a custom override when present', () => {
    expect(getStatusLabel('phone_screen', { phone_screen: 'Initial Call' })).toBe('Initial Call')
  })

  it('falls back to the default when the override is blank', () => {
    expect(getStatusLabel('phone_screen', { phone_screen: '   ' })).toBe('Phone Screen')
  })

  it('ignores overrides for other statuses', () => {
    expect(getStatusLabel('offer', { phone_screen: 'Initial Call' })).toBe('Offer')
  })
})

import { describe, it, expect } from "vitest";
import { cn, formatDate } from "./utils";

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
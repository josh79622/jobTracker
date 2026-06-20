import { describe, it, expect } from 'vitest'
import { applicationsToCsv, applicationsToJson } from './export'
import type { Application } from '@/types/database'

function makeApp(overrides: Partial<Application> = {}): Application {
  return {
    id: 'id-1',
    company: 'Acme',
    role: 'Frontend Engineer',
    url: 'https://acme.test',
    status: 'applied',
    salary_min: 80000,
    salary_max: 120000,
    location: 'Sydney',
    notes: null,
    applied_date: '2026-06-01',
    updated_at: '2026-06-01T00:00:00Z',
    user_id: 'user-1',
    ...overrides,
  }
}

describe('applicationsToCsv', () => {
  it('emits a header row with the expected columns', () => {
    expect(applicationsToCsv([])).toBe(
      'company,role,status,location,salary_min,salary_max,url,applied_date,notes',
    )
  })

  it('renders a plain row without quoting', () => {
    const csv = applicationsToCsv([makeApp({ notes: 'all good' })])
    expect(csv.split('\n')[1]).toBe(
      'Acme,Frontend Engineer,applied,Sydney,80000,120000,https://acme.test,2026-06-01,all good',
    )
  })

  it('wraps fields containing commas in double quotes', () => {
    const csv = applicationsToCsv([makeApp({ notes: 'great team, remote' })])
    expect(csv).toContain('"great team, remote"')
  })

  it('escapes inner double quotes by doubling them', () => {
    const csv = applicationsToCsv([makeApp({ notes: 'said "hi"' })])
    expect(csv).toContain('"said ""hi"""')
  })

  it('wraps fields containing newlines', () => {
    const csv = applicationsToCsv([makeApp({ notes: 'line1\nline2' })])
    expect(csv).toContain('"line1\nline2"')
  })

  it('renders null fields as empty strings, not "null"', () => {
    const csv = applicationsToCsv([
      makeApp({ location: null, salary_min: null, notes: null }),
    ])
    expect(csv.split('\n')[1]).toBe(
      'Acme,Frontend Engineer,applied,,,120000,https://acme.test,2026-06-01,',
    )
  })
})

describe('applicationsToJson', () => {
  it('produces pretty-printed JSON that round-trips', () => {
    const apps = [makeApp()]
    const json = applicationsToJson(apps)
    expect(json).toContain('\n') // pretty-printed (indent)
    expect(JSON.parse(json)).toEqual(apps)
  })
})

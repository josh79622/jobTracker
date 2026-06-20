import type { Application } from '@/types/database'

function todayStamp(): string {
  return new Date().toISOString().slice(0, 10) // e.g. 2026-06-19
}

// Build a Blob and trigger a browser download — no server involved
function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url) // release the object URL to avoid a memory leak
}

const CSV_COLUMNS: (keyof Application)[] = [
  'company',
  'role',
  'status',
  'location',
  'salary_min',
  'salary_max',
  'url',
  'applied_date',
  'notes',
]

// Quote fields that contain commas, quotes, or newlines; double any inner quotes
function escapeCsv(value: unknown): string {
  if (value == null) return ''
  const str = String(value)
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

// --- Pure transforms (unit-tested) ---

export function applicationsToCsv(applications: Application[]): string {
  const header = CSV_COLUMNS.join(',')
  const rows = applications.map((app) =>
    CSV_COLUMNS.map((col) => escapeCsv(app[col])).join(','),
  )
  return [header, ...rows].join('\n')
}

export function applicationsToJson(applications: Application[]): string {
  return JSON.stringify(applications, null, 2)
}

// --- Download wrappers (side effects) ---

export function exportApplicationsAsCsv(applications: Application[]) {
  downloadBlob(applicationsToCsv(applications), `applications-${todayStamp()}.csv`, 'text/csv;charset=utf-8')
}

export function exportApplicationsAsJson(applications: Application[]) {
  downloadBlob(applicationsToJson(applications), `applications-${todayStamp()}.json`, 'application/json')
}

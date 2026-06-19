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

export function exportApplicationsAsJson(applications: Application[]) {
  const content = JSON.stringify(applications, null, 2)
  downloadBlob(content, `applications-${todayStamp()}.json`, 'application/json')
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

export function exportApplicationsAsCsv(applications: Application[]) {
  const header = CSV_COLUMNS.join(',')
  const rows = applications.map((app) =>
    CSV_COLUMNS.map((col) => escapeCsv(app[col])).join(','),
  )
  const content = [header, ...rows].join('\n')
  downloadBlob(content, `applications-${todayStamp()}.csv`, 'text/csv;charset=utf-8')
}

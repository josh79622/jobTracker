import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import type { ApplicationStatus } from '@/types/database'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'PP')
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true })
}

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  phone_screen: 'Phone Screen',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

export const STATUS_COLOR: Record<ApplicationStatus, string> = {
  applied: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
  phone_screen:
    'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200',
  interview: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
  offer: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
  withdrawn: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
}

export const KANBAN_COLUMN_ORDER: ApplicationStatus[] = [
  'applied',
  'phone_screen',
  'interview',
  'offer',
  'rejected',
]

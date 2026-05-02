import type { Application } from '@/types/database'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateApplication } from "@/hooks/useCreateApplication"
import { useUpdateApplication } from "@/hooks/useUpdateApplication"
import { APPLICATION_STATUSES } from '@/types/database'
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"

import { Controller } from 'react-hook-form'
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem,
} from '@/components/ui/select'

interface ApplicationFormProps {
  application?: Application
  onSubmit?: (values: Partial<Application>) => void
}

const applicationSchema = z.object({
  company: z.string().min(1, { message: 'Company name is required.' }),
  role: z.string().min(1, { message: 'Role is required.' }),
  url: z.string().optional(),
  status: z.enum(APPLICATION_STATUSES).optional(),
  salary_min: z.number().optional().or(z.nan().transform(() => undefined)),
  salary_max: z.number().optional().or(z.nan().transform(() => undefined)),
  location: z.string().optional(),
  applied_date: z.string().optional(),
  notes: z.string().optional(),
})

type ApplicationFormValues = z.infer<typeof applicationSchema>

const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`; // 產出如 "2023-10-25"
};

export function ApplicationForm(props: ApplicationFormProps) {
  const createApplication = useCreateApplication()
  const updateApplication = useUpdateApplication()

  const isSubmitting = createApplication.isPending || updateApplication.isPending

  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors }, 
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: props.application ? {
      company: props.application.company,
      role: props.application.role,
      url: props.application.url ?? undefined,
      status: props.application.status,
      salary_min: props.application.salary_min ?? undefined,
      salary_max: props.application.salary_max ?? undefined,
      location: props.application.location ?? undefined,
      applied_date: props.application.applied_date,
      notes: props.application.notes ?? undefined,
    } : {
      status: 'applied',
      applied_date: getTodayString(),
    }
  });

  function onSubmit(values: ApplicationFormValues) {
    const payload = {
    company: values.company,
    role: values.role,
    url: values.url ?? null,
    status: values.status ?? 'applied',
    salary_min: values.salary_min ?? null,
    salary_max: values.salary_max ?? null,
    location: values.location ?? null,
    notes: values.notes ?? null,
    applied_date: values.applied_date ?? getTodayString(),
  }

    if (props.application) {
      updateApplication.mutate({ id: props.application.id, ...payload }, { 
        onSuccess: () => {
          props.onSubmit?.(payload)
        }
      })
    } else {
      createApplication.mutate(payload, { 
        onSuccess: () => {
          props.onSubmit?.(payload)
        },
      })
    }
  }

  return <div data-slot="application-form">
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="FormCompany" className="block text-sm font-medium text-gray-700">Company</Label>
        <Input id="FormCompany" {...register('company')} className="w-full rounded-md border border-gray-300 px-3 py-2" />

        {errors.company && <p style={{ color: 'red', margin: '4px 0 0' }}>{errors.company.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="FormRole" className="block text-sm font-medium text-gray-700">Role</Label>
        <Input id="FormRole" {...register('role')} className="w-full rounded-md border border-gray-300 px-3 py-2" />
        
        {errors.role && <p style={{ color: 'red', margin: '4px 0 0' }}>{errors.role.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="FormUrl" className="block text-sm font-medium text-gray-700">Url</Label>
        <Input id="FormUrl" {...register('url')} className="w-full rounded-md border border-gray-300 px-3 py-2" />
        {errors.url && <p style={{ color: 'red', margin: '4px 0 0' }}>{errors.url.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="FormStatus" className="block text-sm font-medium text-gray-700">Status</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="phone_screen">Phone Screen</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {errors.status && <p style={{ color: 'red', margin: '4px 0 0' }}>{errors.status.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="FormSalaryMin" className="block text-sm font-medium text-gray-700">Minimum Salary</Label>
        <Input type="number" id="FormSalaryMin" {...register('salary_min', { valueAsNumber: true })} className="w-full rounded-md border border-gray-300 px-3 py-2" />
        {errors.salary_min && <p style={{ color: 'red', margin: '4px 0 0' }}>{errors.salary_min.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="FormSalaryMax" className="block text-sm font-medium text-gray-700">Maximum Salary</Label>
        <Input type="number" id="FormSalaryMax" {...register('salary_max', { valueAsNumber: true })} className="w-full rounded-md border border-gray-300 px-3 py-2" />
        {errors.salary_max && <p style={{ color: 'red', margin: '4px 0 0' }}>{errors.salary_max.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="FormAppliedDate" className="block text-sm font-medium text-gray-700">Applied Date</Label>
        <Input type="date" id="FormAppliedDate" {...register('applied_date')} className="w-full rounded-md border border-gray-300 px-3 py-2" />
        {errors.applied_date && <p style={{ color: 'red', margin: '4px 0 0' }}>{errors.applied_date.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="FormLocation" className="block text-sm font-medium text-gray-700">Location</Label>
        <Input id="FormLocation" {...register('location')} className="w-full rounded-md border border-gray-300 px-3 py-2" />
        {errors.location && <p style={{ color: 'red', margin: '4px 0 0' }}>{errors.location.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="FormNotes" className="block text-sm font-medium text-gray-700">Notes</Label>
        <textarea id="FormNotes" {...register('notes')} className="w-full rounded-md border border-gray-300 px-3 py-2" />
        {errors.notes && <p style={{ color: 'red', margin: '4px 0 0' }}>{errors.notes.message}</p>}
      </div>

      <Button 
        type="submit" 
        className="rounded-md bg-blue-600 px-4 py-2 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Submit'}
      </Button>
    </form>
  </div>
}

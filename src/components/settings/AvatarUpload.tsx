import { useRef } from 'react'
import { toast } from 'sonner'
import { Loader2Icon, UploadIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAvatarUpload } from '@/hooks/useAvatarUpload'
import { useUpdateUserPreferences } from '@/hooks/useUserPreferences'

interface AvatarUploadProps {
  avatarUrl: string | null
  fallback: string
}

export function AvatarUpload({ avatarUrl, fallback }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { upload, uploading } = useAvatarUpload()
  const { mutate: savePreferences, isPending: saving } = useUpdateUserPreferences()

  const busy = uploading || saving

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    let url: string
    try {
      url = await upload(file)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
      return
    } finally {
      // reset so picking the same file again still fires onChange
      if (inputRef.current) inputRef.current.value = ''
    }

    // hook shows its own success / error toast
    savePreferences({ avatar_url: url })
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-16">
        <AvatarImage src={avatarUrl ?? undefined} alt="Avatar" />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>

      <div className="space-y-1">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFile}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? <Loader2Icon className="size-4 animate-spin" /> : <UploadIcon className="size-4" />}
          {busy ? 'Uploading…' : 'Change avatar'}
        </Button>
        <p className="text-xs text-muted-foreground">JPG, PNG or WebP. Max 2MB.</p>
      </div>
    </div>
  )
}

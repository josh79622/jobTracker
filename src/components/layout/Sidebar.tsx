import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={cn(
        'hidden flex-col border-r bg-sidebar text-sidebar-foreground transition-all md:flex',
        sidebarOpen ? 'w-60' : 'w-16',
      )}
    >
      <nav className="flex-1 p-4">Sidebar stub</nav>
      <div className="border-t p-3">
        {sidebarOpen ? (
          <div className="space-y-2">
            {user?.email ? (
              <p
                className="truncate text-xs text-muted-foreground"
                title={user.email}
              >
                {user.email}
              </p>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              <LogOut />
              Sign out
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleSignOut}
            aria-label="Sign out"
            title={user?.email ?? 'Sign out'}
          >
            <LogOut />
          </Button>
        )}
      </div>
    </aside>
  )
}

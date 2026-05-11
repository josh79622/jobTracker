import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from './nav-items'

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
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                isActive && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
              )
            }
          >
            <Icon size={18} className="shrink-0" />
            <span className={cn('truncate', !sidebarOpen && 'sr-only')}>
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t p-3">
        {sidebarOpen ? (
          <div className="space-y-2">
            {user?.email ? (
              <p className="truncate text-xs text-muted-foreground" title={user.email}>
                {user.email}
              </p>
            ) : null}
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleSignOut}>
              <LogOut />
              Sign out
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon-sm" onClick={handleSignOut} aria-label="Sign out" title={user?.email ?? 'Sign out'}>
            <LogOut />
          </Button>
        )}
      </div>
    </aside>
  )
}

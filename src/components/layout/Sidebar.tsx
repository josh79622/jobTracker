import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)

  return (
    <aside
      className={cn(
        'hidden border-r bg-sidebar text-sidebar-foreground transition-all md:block',
        sidebarOpen ? 'w-60' : 'w-16',
      )}
    >
      <nav className="p-4">Sidebar stub</nav>
    </aside>
  )
}

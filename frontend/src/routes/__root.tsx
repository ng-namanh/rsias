import { createRootRoute, Outlet } from '@tanstack/react-router'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { AppHeader } from '@/components/layout/AppHeader'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Link, useMatchRoute } from '@tanstack/react-router'
import {
  Archive,
  BarChart2,
  Bot,
  Briefcase,
  Building2,
  HelpCircle,
  LogOut,
  Newspaper,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react'

// ── Navigation data ─────────────────────────────────────────────────────────

const navGroups = [
  {
    label: 'Intelligence',
    items: [
      { title: 'News', icon: Newspaper, to: '/news', description: 'Real-time market news' },
      { title: 'Market', icon: BarChart2, to: '/market', description: 'Market instruments overview' },
      { title: 'Companies', icon: Building2, to: '/companies', description: 'Browse companies by sector' },
      { title: 'Market Insights', icon: TrendingUp, to: '/insights', description: 'Deep-dive analyses' },
    ],
  },
  {
    label: 'Personal',
    items: [
      { title: 'Portfolio', icon: Briefcase, to: '/portfolio', description: 'Track your investments' },
      { title: 'Wishlist', icon: Star, to: '/wishlist', description: 'Bookmarked assets' },
    ],
  },
  {
    label: 'Analysis',
    items: [
      { title: 'AI Analysis', icon: Bot, to: '/ai-analysis', description: 'AI-powered market analysis', badge: 'AI' },
      { title: 'Report Archive', icon: Archive, to: '/reports', description: 'Historical reports' },
    ],
  },
]

// ── Component ────────────────────────────────────────────────────────────────

export function AppSidebar() {
  const matchRoute = useMatchRoute()

  return (
    <Sidebar collapsible="icon">
      {/* ── Brand Header ─────────────────────────────────────── */}
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3.5">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* Logo mark */}
          <div className="flex size-7 shrink-0 items-center justify-center rounded bg-primary shadow-sm">
            <Zap size={14} className="text-white" strokeWidth={2.5} />
          </div>
          {/* Brand text */}
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold leading-none text-primary tracking-tight">
              Financial Atelier
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Nav Groups ───────────────────────────────────────── */}
      <SidebarContent className="px-1 py-2">
        {navGroups.map((group, gi) => (
          <SidebarGroup key={group.label} className={cn('py-1', gi > 0 && 'mt-1')}>
            <SidebarGroupLabel className="mb-0.5 px-2 text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/35">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = !!matchRoute({ to: item.to, fuzzy: true })
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                        render={
                          <Link to={item.to as any} />
                        }
                        className={cn(
                          'group/item relative rounded-md text-sidebar-foreground/70 transition-all duration-150',
                          'hover:bg-sidebar-accent hover:text-primary',
                          isActive && [
                            'bg-primary/10 text-primary font-medium',
                            'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2',
                            'before:h-4 before:w-1 before:rounded-full before:bg-primary',
                          ]
                        )}
                      >
                        <item.icon
                          className={cn(
                            'size-3.5 shrink-0 transition-colors',
                            isActive ? 'text-primary' : 'text-sidebar-foreground/50 group-hover/item:text-primary'
                          )}
                        />
                        <span className={cn('flex-1 text-sm', isActive ? 'text-primary' : '')}>{item.title}</span>
                        {item.badge && (
                          <span className="rounded bg-primary/15 px-1 py-px font-mono text-xs font-semibold uppercase tracking-wider text-primary group-data-[collapsible=icon]:hidden">
                            {item.badge}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ── Footer ───────────────────────────────────────────── */}
      <SidebarFooter className="border-t border-sidebar-border p-2">
        {/* Upgrade CTA */}
        <div className="mb-1 overflow-hidden rounded-md bg-linear-to-br from-primary/20 via-primary/10 to-transparent p-3 ring-1 ring-primary/20 group-data-[collapsible=icon]:hidden">
          <p className="text-xs font-semibold text-primary">Upgrade to Pro</p>
          <p className="mt-0.5 text-xs leading-relaxed text-sidebar-foreground/50">
            Unlock AI-powered screening, advanced reports & real-time alerts.
          </p>
          <button
            type="button"
            className="mt-2 w-full rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-all hover:scale-105 hover:bg-primary/90 active:scale-95"
          >
            Get Pro Access
          </button>
        </div>

        <SidebarSeparator className="my-1" />

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Help Center"
              className="rounded-md text-sm text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-primary"
            >
              <HelpCircle className="size-4" />
              <span>Help Center</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Log Out"
              className="rounded-md text-sm text-sidebar-foreground/50 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4" />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import {
  Bell,
  ChevronDown,
  Circle,
  Download,
  FileText,
  Search,
  Settings,
} from 'lucide-react'
import React from 'react'

// ── Header Ticker Strip ───────────────────────────────────────────────────────

const tickers = [
  { symbol: 'AAPL', price: '189.43', change: '+1.28%', up: true },
  { symbol: 'TSLA', price: '172.63', change: '-3.91%', up: false },
  { symbol: 'NVDA', price: '903.55', change: '+4.81%', up: true },
  { symbol: 'BTC', price: '67,294', change: '+0.68%', up: true },
  { symbol: 'GOOGL', price: '154.22', change: '+0.32%', up: true },
]

function TickerStrip() {
  return (
    <div className="flex items-center gap-5 overflow-hidden">
      {tickers.map((t) => (
        <div key={t.symbol} className="flex shrink-0 items-baseline gap-1.5">
          <span className="font-mono text-xs font-semibold tracking-tight text-foreground/60 uppercase">
            {t.symbol}
          </span>
          <span className="font-mono text-xs font-bold text-foreground">
            ${t.price}
          </span>
          <span
            className={cn(
              'font-mono text-xs font-semibold',
              t.up ? 'text-emerald-500' : 'text-destructive'
            )}
          >
            {t.change}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Notification Badge ────────────────────────────────────────────────────────

function NotificationBell() {
  return (
    <div className="relative">
      <button
        id="header-notifications"
        type="button"
        className="flex size-8 items-center justify-center rounded-md text-foreground/50 transition-all hover:bg-secondary hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell size={16} strokeWidth={1.8} />
      </button>
      <span
        aria-hidden
        className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary ring-1 ring-background"
      />
    </div>
  )
}

// ── User Menu ─────────────────────────────────────────────────────────────────

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <button
          id="header-user-menu"
          type="button"
          className="flex items-center gap-2 rounded-md px-1.5 py-1 text-sm transition-all hover:bg-secondary"
          aria-label="User menu"
        >
          <Avatar className="size-6 rounded">
            <AvatarImage src="" alt="User avatar" />
            <AvatarFallback className="rounded bg-primary/15 text-xs font-bold text-primary">
              FA
            </AvatarFallback>
          </Avatar>
          <ChevronDown size={12} className="text-foreground/40" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52 rounded-lg">
        <DropdownMenuLabel className="pb-1">
          <p className="text-sm font-semibold">Financial Atelier</p>
          <p className="text-xs font-normal text-muted-foreground">analyst@fa.io</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-sm">Profile</DropdownMenuItem>
        <DropdownMenuItem className="text-sm">Settings</DropdownMenuItem>
        <DropdownMenuItem className="text-sm">API Keys</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-sm text-destructive focus:text-destructive">
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Global Search ─────────────────────────────────────────────────────────────

function GlobalSearch() {
  const [focused, setFocused] = React.useState(false)

  // ⌘K shortcut
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('global-search')?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className={cn('relative flex w-full max-w-sm items-center', focused && 'z-20')}>
      <Search
        size={14}
        className="absolute left-3 text-foreground/35 pointer-events-none"
        strokeWidth={2}
      />
      <Input
        id="global-search"
        type="search"
        placeholder="Search markets, news, or tickers…"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          'h-8 w-full rounded-md border-border bg-secondary/60 pl-8 pr-16 text-sm shadow-none placeholder:text-foreground/35',
          'transition-all duration-150',
          focused && 'border-primary/40 bg-card shadow-sm ring-1 ring-primary/20'
        )}
      />
      <kbd
        aria-hidden
        className="pointer-events-none absolute right-2.5 hidden select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-xs text-foreground/30 sm:flex"
      >
        ⌘K
      </kbd>
    </div>
  )
}

// ── Main Header ───────────────────────────────────────────────────────────────

export function AppHeader() {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 flex h-14 w-full shrink-0 flex-col border-b border-border bg-card/80 backdrop-blur-sm"
    >
      <div className="flex flex-1 items-center gap-3 px-3">
        {/* Sidebar toggle */}
        <SidebarTrigger
          id="sidebar-toggle"
          className="size-7 shrink-0 rounded-md text-foreground/50 hover:bg-secondary hover:text-foreground"
        />

        <Separator orientation="vertical" className="h-4" />

        {/* Ticker strip — hidden on small screens */}
        <div className="hidden flex-1 overflow-hidden xl:flex">
          <TickerStrip />
        </div>

        {/* Search — grows to fill space on medium screens */}
        <div className="flex flex-1 justify-center xl:flex-none">
          <GlobalSearch />
        </div>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          {/* Status dot */}
          <div className="hidden items-center gap-1.5 pr-1 lg:flex">
            <Circle size={6} className="fill-emerald-500 text-emerald-500 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-foreground/40">
              Live
            </span>
          </div>

          <Separator orientation="vertical" className="hidden h-4 lg:block" />

          {/* Notifications */}
          <NotificationBell />

          {/* Settings */}
          <button
            id="header-settings"
            type="button"
            className="flex size-8 items-center justify-center rounded-md text-foreground/50 transition-all hover:bg-secondary hover:text-foreground"
            aria-label="Settings"
          >
            <Settings size={16} strokeWidth={1.8} />
          </button>

          <Separator orientation="vertical" className="h-4" />

          {/* Export button */}
          <Button
            id="header-export"
            variant="outline"
            size="sm"
            className="h-7 rounded border-border px-3 text-xs font-medium text-foreground/70 hover:text-foreground"
          >
            <Download data-icon="inline-start" size={12} />
            Export
          </Button>

          {/* Create Report — Fin Orange CTA */}
          <Button
            id="header-create-report"
            size="sm"
            className="h-7 rounded bg-foreground px-3 text-xs font-semibold text-background transition-all hover:scale-105 hover:bg-foreground/90 active:scale-95"
          >
            <FileText data-icon="inline-start" size={12} />
            Create Report
          </Button>

          <Separator orientation="vertical" className="h-4" />

          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}

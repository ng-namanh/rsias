import {
  createRouter,
  createRoute,
  redirect,
} from '@tanstack/react-router'
import { Route as rootRoute } from './routes/__root'

// ── Page components (lazy-friendly stubs) ────────────────────────────────────
import React from 'react'
import {
  Newspaper, Building2, TrendingUp,
  Briefcase, Star, Bot, Archive,
} from 'lucide-react'
import { MarketDashboard } from './pages/MarketDashboard'

function PageStub({ icon: Icon, title, description, accent }: {
  icon: React.ElementType
  title: string
  description: string
  accent?: boolean
}) {
  return (
    <div className="flex h-full min-h-[calc(100vh-52px)] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className={`flex size-14 items-center justify-center rounded-[8px] ${accent ? 'bg-[#ff5600]/10' : 'bg-secondary'}`}>
        <Icon size={24} className="text-[#ff5600]" />
      </div>
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 max-w-sm text-[14px] text-muted-foreground">{description}</p>
      </div>
      <div className={`mt-2 rounded-[6px] border border-dashed px-4 py-2 ${accent ? 'border-[#ff5600]/30 bg-[#ff5600]/5' : 'border-border bg-secondary/40'}`}>
        <p className={`font-mono text-[11px] uppercase tracking-wider ${accent ? 'text-[#ff5600]/60' : 'text-muted-foreground/60'}`}>
          {accent ? 'AI Engine Initializing' : 'Feature coming soon'}
        </p>
      </div>
    </div>
  )
}

// ── Routes ───────────────────────────────────────────────────────────────────

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/news' }) },
  component: () => null,
})

const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/news',
  component: () => <PageStub icon={Newspaper} title="News" description="Stay updated with the latest financial news and real-time market updates." />,
})

const marketRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/market',
  component: MarketDashboard,
})

const companiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/companies',
  component: () => <PageStub icon={Building2} title="Companies" description="Browse all companies by name, sector, industry, or market region." />,
})

const insightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/insights',
  component: () => <PageStub icon={TrendingUp} title="Market Insights" description="Explore deep-dive analyses and general market trends." />,
})

const portfolioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/portfolio',
  component: () => <PageStub icon={Briefcase} title="Portfolio" description="Manage and track your personal investment portfolio." />,
})

const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wishlist',
  component: () => <PageStub icon={Star} title="Wishlist" description="Bookmark your favourite assets for quick access." />,
})

const aiAnalysisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai-analysis',
  component: () => <PageStub icon={Bot} title="AI Analysis" description="Enter commands or prompt the AI for specific market analysis." accent />,
})

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: () => <PageStub icon={Archive} title="Report Archive" description="Comprehensive history of all previously generated reports and market analyses." />,
})

// ── Route Tree ───────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  indexRoute,
  newsRoute,
  marketRoute,
  companiesRoute,
  insightsRoute,
  portfolioRoute,
  wishlistRoute,
  aiAnalysisRoute,
  reportsRoute,
])

// ── Router ───────────────────────────────────────────────────────────────────

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

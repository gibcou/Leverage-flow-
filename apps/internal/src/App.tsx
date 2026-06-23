import { useState } from 'react'
// framer-motion imported for future use
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Bell,
  LogOut,
  Plus,
  Circle,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Send,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Zap,
  Search,
  ArrowUpRight,
  Calendar,
  Mail,
  Phone,
  Building2,
  Tag
} from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────────────────────────

type LeadStage = 'new' | 'audited' | 'proposal' | 'negotiating' | 'closed_won' | 'closed_lost'
type RequestStatus = 'pending' | 'in_progress' | 'review' | 'completed' | 'paused'
type Priority = 'low' | 'medium' | 'high'
type View = 'dashboard' | 'leads' | 'requests' | 'notifications'

interface Lead {
  id: string
  name: string
  email: string
  company: string
  phone: string
  message: string
  stage: LeadStage
  value: number
  createdAt: string
  notes: string[]
  tags: string[]
}

interface AutomationRequest {
  id: string
  clientName: string
  clientEmail: string
  title: string
  description: string
  status: RequestStatus
  priority: Priority
  createdAt: string
  updatedAt: string
  assignee: string
  notes: string[]
  plan: 'starter' | 'growth'
}

interface Notification {
  id: string
  type: 'lead' | 'request' | 'system'
  message: string
  time: string
  read: boolean
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const INITIAL_LEADS: Lead[] = [
  { id: 'l1', name: 'Sarah Mitchell', email: 'sarah@apexmarketing.io', company: 'Apex Marketing', phone: '+1 555-0101', message: 'We need to automate our lead follow-up in HubSpot. Currently losing deals because of slow response times.', stage: 'audited', value: 3499, createdAt: '2026-06-18', notes: ['Audit call scheduled for Monday', 'Currently using HubSpot + Slack + Gmail'], tags: ['HubSpot', 'High Intent'] },
  { id: 'l2', name: 'James Thornton', email: 'james@scaleopsconsulting.com', company: 'ScaleOps Consulting', phone: '+1 555-0182', message: 'We have 14 different spreadsheets for tracking client projects. Need it all automated.', stage: 'proposal', value: 1999, createdAt: '2026-06-17', notes: ['Sent proposal on June 17', 'Decision by end of week'], tags: ['Notion', 'Airtable'] },
  { id: 'l3', name: 'Priya Nair', email: 'priya@recruitflow.co', company: 'RecruitFlow', phone: '+1 555-0234', message: 'Want to automate candidate outreach and interview scheduling. Currently 100% manual.', stage: 'negotiating', value: 3499, createdAt: '2026-06-15', notes: ['Wants to start July 1', 'Requesting small discount'], tags: ['Recruiting', 'High Value'] },
  { id: 'l4', name: 'Daniel Osei', email: 'daniel@summitdigital.co', company: 'Summit Digital', phone: '+1 555-0311', message: 'Looking for client reporting automation. We send 30+ reports a month manually.', stage: 'new', value: 1999, createdAt: '2026-06-22', notes: [], tags: ['Reporting'] },
  { id: 'l5', name: 'Chloe Watkins', email: 'chloe@flowagency.io', company: 'Flow Agency', phone: '+1 555-0445', message: 'Need CRM sync between Pipedrive and our billing tool QuickBooks.', stage: 'closed_won', value: 3499, createdAt: '2026-06-10', notes: ['Signed June 12', 'Onboarding in progress'], tags: ['Pipedrive', 'QuickBooks'] },
  { id: 'l6', name: 'Marcus Webb', email: 'marcus@growthlab.co', company: 'GrowthLab', phone: '+1 555-0567', message: 'Interested but need to think about budget.', stage: 'closed_lost', value: 1999, createdAt: '2026-06-05', notes: ['Budget concerns. Revisit Q3.'], tags: ['Budget Issue'] },
]

const INITIAL_REQUESTS: AutomationRequest[] = [
  { id: 'r1', clientName: 'Chloe Watkins', clientEmail: 'chloe@flowagency.io', title: 'Pipedrive → QuickBooks Sync', description: 'Automatically create QuickBooks invoice when deal is marked Closed Won in Pipedrive. Include line items from deal custom fields.', status: 'in_progress', priority: 'high', createdAt: '2026-06-13', updatedAt: '2026-06-21', assignee: 'Gibson', notes: ['Pipedrive API connected', 'Working on QB invoice mapping', 'ETA: 2 days'], plan: 'growth' },
  { id: 'r2', clientName: 'Chloe Watkins', clientEmail: 'chloe@flowagency.io', title: 'Weekly Pipeline Report to Slack', description: 'Every Monday 8am, post a Slack message summarising: deals closed last week, revenue, open pipeline value, and top 3 deals to close this week.', status: 'pending', priority: 'medium', createdAt: '2026-06-14', updatedAt: '2026-06-14', assignee: 'Unassigned', notes: [], plan: 'growth' },
  { id: 'r3', clientName: 'James Thornton', clientEmail: 'james@scaleopsconsulting.com', title: 'New Client Onboarding Workflow', description: 'When a new client row is added to Airtable, automatically: create Notion workspace, send welcome email sequence, create project in Asana, post in #new-clients Slack channel.', status: 'review', priority: 'high', createdAt: '2026-06-17', updatedAt: '2026-06-22', assignee: 'Gibson', notes: ['Build complete', 'Awaiting client sign-off on email templates'], plan: 'starter' },
]

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'lead', message: 'New audit request from Daniel Osei at Summit Digital', time: '2 hours ago', read: false },
  { id: 'n2', type: 'request', message: 'James Thornton approved the onboarding workflow — mark as complete', time: '4 hours ago', read: false },
  { id: 'n3', type: 'system', message: 'Priya Nair replied to your proposal email', time: '1 day ago', read: true },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const STAGE_META: Record<LeadStage, { label: string; color: string; bg: string }> = {
  new:          { label: 'New Lead',      color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20' },
  audited:      { label: 'Audited',       color: 'text-indigo-400',  bg: 'bg-indigo-500/10 border-indigo-500/20' },
  proposal:     { label: 'Proposal Sent', color: 'text-yellow-400',  bg: 'bg-yellow-500/10 border-yellow-500/20' },
  negotiating:  { label: 'Negotiating',   color: 'text-orange-400',  bg: 'bg-orange-500/10 border-orange-500/20' },
  closed_won:   { label: 'Closed Won',    color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  closed_lost:  { label: 'Closed Lost',   color: 'text-slate-500',   bg: 'bg-slate-500/10 border-slate-500/20' },
}

const STATUS_META: Record<RequestStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending:     { label: 'Pending',     color: 'text-slate-400',   icon: <Circle className="w-3 h-3" /> },
  in_progress: { label: 'In Progress', color: 'text-blue-400',    icon: <Clock className="w-3 h-3" /> },
  review:      { label: 'In Review',   color: 'text-yellow-400',  icon: <AlertCircle className="w-3 h-3" /> },
  completed:   { label: 'Completed',   color: 'text-emerald-400', icon: <CheckCircle2 className="w-3 h-3" /> },
  paused:      { label: 'Paused',      color: 'text-orange-400',  icon: <AlertCircle className="w-3 h-3" /> },
}

const PRIORITY_META: Record<Priority, { label: string; color: string }> = {
  low:    { label: 'Low',    color: 'text-slate-400' },
  medium: { label: 'Medium', color: 'text-yellow-400' },
  high:   { label: 'High',   color: 'text-red-400' },
}

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${className}`}>
      {children}
    </span>
  )
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-xs text-slate-400 font-medium">{label}</div>
      {sub && <div className="text-xs text-slate-600 mt-1">{sub}</div>}
    </div>
  )
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>('dashboard')
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS)
  const [requests, setRequests] = useState<AutomationRequest[]>(INITIAL_REQUESTS)
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<AutomationRequest | null>(null)
  const [leadSearch, setLeadSearch] = useState('')
  const [leadStageFilter, setLeadStageFilter] = useState<LeadStage | 'all'>('all')
  const [showNewLeadForm, setShowNewLeadForm] = useState(false)
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)
  const [noteInput, setNoteInput] = useState('')
  const [leadTab, setLeadTab] = useState<'leads' | 'details'>('leads')

  const unreadCount = notifications.filter(n => !n.read).length

  // ── Stats ────────────────────────────────────────────────────────────────
  const openLeads = leads.filter(l => !['closed_won', 'closed_lost'].includes(l.stage)).length
  const wonRevenue = leads.filter(l => l.stage === 'closed_won').reduce((s, l) => s + l.value, 0)
  const pipelineValue = leads.filter(l => !['closed_won', 'closed_lost'].includes(l.stage)).reduce((s, l) => s + l.value, 0)
  const activeRequests = requests.filter(r => r.status === 'in_progress').length

  // ── Lead actions ─────────────────────────────────────────────────────────
  const updateLeadStage = (id: string, stage: LeadStage) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage } : l))
    if (selectedLead?.id === id) setSelectedLead(prev => prev ? { ...prev, stage } : null)
  }

  const addLeadNote = (id: string, note: string) => {
    if (!note.trim()) return
    setLeads(prev => prev.map(l => l.id === id ? { ...l, notes: [...l.notes, note] } : l))
    if (selectedLead?.id === id) setSelectedLead(prev => prev ? { ...prev, notes: [...prev.notes, note] } : null)
    setNoteInput('')
  }

  // ── Request actions ──────────────────────────────────────────────────────
  const updateRequestStatus = (id: string, status: RequestStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status, updatedAt: new Date().toISOString().split('T')[0] } : r))
    if (selectedRequest?.id === id) setSelectedRequest(prev => prev ? { ...prev, status } : null)
  }

  const addRequestNote = (id: string, note: string) => {
    if (!note.trim()) return
    setRequests(prev => prev.map(r => r.id === id ? { ...r, notes: [...r.notes, note] } : r))
    if (selectedRequest?.id === id) setSelectedRequest(prev => prev ? { ...prev, notes: [...prev.notes, note] } : null)
    setNoteInput('')
  }

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  // ── Filtered leads ───────────────────────────────────────────────────────
  const filteredLeads = leads.filter(l => {
    const matchesSearch = !leadSearch || l.name.toLowerCase().includes(leadSearch.toLowerCase()) || l.company.toLowerCase().includes(leadSearch.toLowerCase())
    const matchesStage = leadStageFilter === 'all' || l.stage === leadStageFilter
    return matchesSearch && matchesStage
  })

  // ─────────────────────────────────────────────────────────────────────────
  // SIDEBAR
  // ─────────────────────────────────────────────────────────────────────────
  const navItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'leads' as View, label: 'Lead Pipeline', icon: <Users className="w-4 h-4" /> },
    { id: 'requests' as View, label: 'Client Requests', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'notifications' as View, label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount },
  ]

  return (
    <div className="flex h-screen bg-[#0f1117] text-white overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="w-56 shrink-0 bg-slate-950 border-r border-slate-800 flex flex-col">
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">LeverageFlow</div>
              <div className="text-[10px] text-slate-500">Ops Dashboard</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                view === item.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2.5">
                {item.icon}
                {item.label}
              </span>
              {item.badge ? (
                <span className="bg-blue-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">GC</div>
            <div>
              <div className="text-xs font-semibold text-white">Gibson C.</div>
              <div className="text-[10px] text-slate-500">Admin</div>
            </div>
            <LogOut className="w-3.5 h-3.5 text-slate-600 ml-auto" />
          </div>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">

        {/* ══ DASHBOARD ══════════════════════════════════════════════════ */}
        {view === 'dashboard' && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">Good morning, Gibson</h1>
              <p className="text-slate-400 text-sm mt-1">Here's what's happening with LeverageFlow today.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={<Users className="w-5 h-5" />} label="Open Leads" value={openLeads} sub={`$${pipelineValue.toLocaleString()} pipeline`} color="bg-blue-500/10 text-blue-400" />
              <StatCard icon={<DollarSign className="w-5 h-5" />} label="Revenue Won" value={`$${wonRevenue.toLocaleString()}`} sub="This month" color="bg-emerald-500/10 text-emerald-400" />
              <StatCard icon={<Zap className="w-5 h-5" />} label="Active Builds" value={activeRequests} sub="In progress" color="bg-indigo-500/10 text-indigo-400" />
              <StatCard icon={<TrendingUp className="w-5 h-5" />} label="MRR" value="$3,499" sub="+$3,499 this month" color="bg-orange-500/10 text-orange-400" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Leads */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-white">Recent Leads</h2>
                  <button onClick={() => setView('leads')} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    View all <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {leads.slice(0, 4).map(lead => (
                    <button
                      key={lead.id}
                      onClick={() => { setSelectedLead(lead); setView('leads'); setLeadTab('details') }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{lead.name}</div>
                        <div className="text-xs text-slate-500 truncate">{lead.company}</div>
                      </div>
                      <Badge className={`${STAGE_META[lead.stage].bg} ${STAGE_META[lead.stage].color} border`}>
                        {STAGE_META[lead.stage].label}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Requests */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-white">Active Builds</h2>
                  <button onClick={() => setView('requests')} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    View all <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {requests.map(req => (
                    <button
                      key={req.id}
                      onClick={() => { setSelectedRequest(req); setView('requests') }}
                      className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all text-left"
                    >
                      <div className={`mt-0.5 ${STATUS_META[req.status].color}`}>
                        {STATUS_META[req.status].icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{req.title}</div>
                        <div className="text-xs text-slate-500">{req.clientName} · {req.updatedAt}</div>
                      </div>
                      <span className={`text-xs font-semibold ${PRIORITY_META[req.priority].color}`}>
                        {PRIORITY_META[req.priority].label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ LEADS ══════════════════════════════════════════════════════ */}
        {view === 'leads' && (
          <div className="flex flex-col h-full">
            {/* Tab bar */}
            <div className="flex items-center gap-1 px-6 pt-5 pb-0 border-b border-slate-800 shrink-0">
              <button
                onClick={() => setLeadTab('leads')}
                className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${
                  leadTab === 'leads'
                    ? 'text-blue-400 border-blue-500 bg-blue-500/5'
                    : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" />
                  Leads
                  <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{filteredLeads.length}</span>
                </span>
              </button>
              <button
                onClick={() => setLeadTab('details')}
                className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${
                  leadTab === 'details'
                    ? 'text-blue-400 border-blue-500 bg-blue-500/5'
                    : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ClipboardList className="w-3.5 h-3.5" />
                  Details
                  {selectedLead && <span className="bg-blue-600/30 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">1</span>}
                </span>
              </button>
              <div className="flex-1" />
              <button onClick={() => setShowNewLeadForm(true)} className="mb-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Lead
              </button>
            </div>

            {/* Leads tab */}
            {leadTab === 'leads' && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="p-4 border-b border-slate-800 shrink-0">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        value={leadSearch}
                        onChange={e => setLeadSearch(e.target.value)}
                        placeholder="Search leads..."
                        className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <select
                      value={leadStageFilter}
                      onChange={e => setLeadStageFilter(e.target.value as LeadStage | 'all')}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Stages</option>
                      {(Object.keys(STAGE_META) as LeadStage[]).map(s => (
                        <option key={s} value={s}>{STAGE_META[s].label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 content-start">
                  {filteredLeads.map(lead => (
                    <button
                      key={lead.id}
                      onClick={() => { setSelectedLead(lead); setLeadTab('details') }}
                      className={`text-left p-4 rounded-2xl border transition-all hover:scale-[1.01] ${
                        selectedLead?.id === lead.id ? 'bg-blue-600/10 border-blue-500/40' : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <Badge className={`${STAGE_META[lead.stage].bg} ${STAGE_META[lead.stage].color} border text-[10px]`}>
                          {STAGE_META[lead.stage].label}
                        </Badge>
                      </div>
                      <div className="text-sm font-semibold text-white mb-0.5">{lead.name}</div>
                      <div className="text-xs text-slate-500 mb-2">{lead.company}</div>
                      <div className="text-sm font-bold text-emerald-400">${lead.value.toLocaleString()}/mo</div>
                      <div className="text-[10px] text-slate-600 mt-1">{lead.createdAt}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Details tab */}
            {leadTab === 'details' && (
              <div className="flex-1 overflow-auto p-8">
              {selectedLead ? (
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedLead.name}</h2>
                      <p className="text-slate-400 text-sm">{selectedLead.company} · {selectedLead.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`mailto:${selectedLead.email}`} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors">
                        <Mail className="w-3.5 h-3.5" /> Email
                      </a>
                      <a href={`tel:${selectedLead.phone}`} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors">
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Building2 className="w-3 h-3" /> Company</div>
                      <div className="text-sm font-medium text-white">{selectedLead.company}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Value</div>
                      <div className="text-sm font-medium text-emerald-400">${selectedLead.value.toLocaleString()}/mo</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Lead Date</div>
                      <div className="text-sm font-medium text-white">{selectedLead.createdAt}</div>
                    </div>
                  </div>

                  {/* Stage selector */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4">
                    <h3 className="text-sm font-bold text-white mb-3">Pipeline Stage</h3>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(STAGE_META) as LeadStage[]).map(s => (
                        <button
                          key={s}
                          onClick={() => updateLeadStage(selectedLead.id, s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            selectedLead.stage === s
                              ? `${STAGE_META[s].bg} ${STAGE_META[s].color} border-current`
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          {STAGE_META[s].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4">
                    <h3 className="text-sm font-bold text-white mb-2">Their Message</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{selectedLead.message}</p>
                  </div>

                  {/* Tags */}
                  {selectedLead.tags.length > 0 && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4">
                      <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedLead.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> Notes</h3>
                    <div className="space-y-2 mb-3">
                      {selectedLead.notes.length === 0 && <p className="text-xs text-slate-600">No notes yet.</p>}
                      {selectedLead.notes.map((note, i) => (
                        <div key={i} className="text-sm text-slate-300 bg-slate-800 rounded-lg px-3 py-2">• {note}</div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={noteInput}
                        onChange={e => setNoteInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { addLeadNote(selectedLead.id, noteInput); } }}
                        placeholder="Add a note..."
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={() => addLeadNote(selectedLead.id, noteInput)}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600">
                  <div className="text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Select a lead from the Leads tab to view details</p>
                    <button
                      onClick={() => setLeadTab('leads')}
                      className="mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors"
                    >
                      ← Back to Leads
                    </button>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
        )}

        {/* ══ REQUESTS ═══════════════════════════════════════════════════ */}
        {view === 'requests' && (
          <div className="flex h-full">
            {/* Request list */}
            <div className="w-80 border-r border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h2 className="font-bold text-white">Client Requests</h2>
                <button onClick={() => setShowNewRequestForm(true)} className="w-7 h-7 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-2 space-y-1">
                {requests.map(req => (
                  <button
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedRequest?.id === req.id ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <span className={`mt-1 shrink-0 ${STATUS_META[req.status].color}`}>{STATUS_META[req.status].icon}</span>
                      <span className="text-sm font-medium text-white leading-snug">{req.title}</span>
                    </div>
                    <div className="text-xs text-slate-500 ml-5">{req.clientName}</div>
                    <div className="flex items-center gap-2 ml-5 mt-1">
                      <span className={`text-[10px] font-semibold ${PRIORITY_META[req.priority].color}`}>{PRIORITY_META[req.priority].label}</span>
                      <span className="text-[10px] text-slate-600">·</span>
                      <span className="text-[10px] text-slate-600 capitalize">{req.plan}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Request detail */}
            <div className="flex-1 overflow-auto p-8">
              {selectedRequest ? (
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedRequest.title}</h2>
                      <p className="text-slate-400 text-sm">{selectedRequest.clientName} · {selectedRequest.clientEmail}</p>
                    </div>
                    <a href={`mailto:${selectedRequest.clientEmail}`} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors">
                      <Mail className="w-3.5 h-3.5" /> Email Client
                    </a>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <div className="text-xs text-slate-500 mb-1">Status</div>
                      <div className={`text-sm font-semibold flex items-center gap-1.5 ${STATUS_META[selectedRequest.status].color}`}>
                        {STATUS_META[selectedRequest.status].icon}
                        {STATUS_META[selectedRequest.status].label}
                      </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <div className="text-xs text-slate-500 mb-1">Priority</div>
                      <div className={`text-sm font-semibold ${PRIORITY_META[selectedRequest.priority].color}`}>
                        {PRIORITY_META[selectedRequest.priority].label}
                      </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <div className="text-xs text-slate-500 mb-1">Plan</div>
                      <div className="text-sm font-semibold text-white capitalize">{selectedRequest.plan}</div>
                    </div>
                  </div>

                  {/* Status update */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4">
                    <h3 className="text-sm font-bold text-white mb-3">Update Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(STATUS_META) as RequestStatus[]).map(s => (
                        <button
                          key={s}
                          onClick={() => updateRequestStatus(selectedRequest.id, s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                            selectedRequest.status === s
                              ? `bg-slate-700 ${STATUS_META[s].color} border-current`
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          {STATUS_META[s].icon}
                          {STATUS_META[s].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4">
                    <h3 className="text-sm font-bold text-white mb-2">Request Brief</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{selectedRequest.description}</p>
                  </div>

                  {/* Notes */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> Build Notes</h3>
                    <div className="space-y-2 mb-3">
                      {selectedRequest.notes.length === 0 && <p className="text-xs text-slate-600">No notes yet.</p>}
                      {selectedRequest.notes.map((note, i) => (
                        <div key={i} className="text-sm text-slate-300 bg-slate-800 rounded-lg px-3 py-2">• {note}</div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={noteInput}
                        onChange={e => setNoteInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { addRequestNote(selectedRequest.id, noteInput); } }}
                        placeholder="Add a build note..."
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={() => addRequestNote(selectedRequest.id, noteInput)}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600">
                  <div className="text-center">
                    <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Select a request to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ NOTIFICATIONS ══════════════════════════════════════════════ */}
        {view === 'notifications' && (
          <div className="p-8 max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Mark all read</button>
            </div>
            <div className="space-y-3">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    notif.read ? 'bg-slate-900 border-slate-800 opacity-60' : 'bg-slate-900 border-blue-500/30 bg-blue-500/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.read ? 'bg-slate-700' : 'bg-blue-500'}`} />
                    <div className="flex-1">
                      <p className="text-sm text-white">{notif.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                      className="text-slate-600 hover:text-slate-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showNewLeadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <NewLeadForm
            onClose={() => setShowNewLeadForm(false)}
            onAdd={(lead) => { setLeads(prev => [lead, ...prev]); setShowNewLeadForm(false) }}
          />
        </div>
      )}
      {showNewRequestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <NewRequestForm
            onClose={() => setShowNewRequestForm(false)}
            onAdd={(req) => { setRequests(prev => [req, ...prev]); setShowNewRequestForm(false) }}
          />
        </div>
      )}
    </div>
  )
}

// ─── NEW LEAD FORM ────────────────────────────────────────────────────────────
function NewLeadForm({ onClose, onAdd }: { onClose: () => void; onAdd: (lead: Lead) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [value, setValue] = useState('1999')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      id: generateId(),
      name, email, company, phone, message,
      stage: 'new',
      value: parseInt(value),
      createdAt: new Date().toISOString().split('T')[0],
      notes: [],
      tags: [],
    })
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-white">Add New Lead</h3>
        <button onClick={onClose}><X className="w-4 h-4 text-slate-400" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        {[
          { label: 'Name', value: name, set: setName, type: 'text', placeholder: 'Jane Smith' },
          { label: 'Email', value: email, set: setEmail, type: 'email', placeholder: 'jane@agency.com' },
          { label: 'Company', value: company, set: setCompany, type: 'text', placeholder: 'Apex Agency' },
          { label: 'Phone', value: phone, set: setPhone, type: 'text', placeholder: '+1 555-0100' },
        ].map(f => (
          <div key={f.label}>
            <label className="block text-xs font-semibold text-slate-400 mb-1">{f.label}</label>
            <input required type={f.type} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
        ))}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Message / Notes</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="What do they want to automate?"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Plan Value</label>
          <select value={value} onChange={e => setValue(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
            <option value="1999">Starter — $1,999/mo</option>
            <option value="3499">Growth — $3,499/mo</option>
          </select>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors">Cancel</button>
          <button type="submit" className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors">Add Lead</button>
        </div>
      </form>
    </div>
  )
}

// ─── NEW REQUEST FORM ─────────────────────────────────────────────────────────
function NewRequestForm({ onClose, onAdd }: { onClose: () => void; onAdd: (req: AutomationRequest) => void }) {
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [plan, setPlan] = useState<'starter' | 'growth'>('starter')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const today = new Date().toISOString().split('T')[0]
    onAdd({
      id: generateId(),
      clientName, clientEmail, title, description,
      status: 'pending',
      priority, plan,
      createdAt: today,
      updatedAt: today,
      assignee: 'Unassigned',
      notes: [],
    })
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-white">New Automation Request</h3>
        <button onClick={onClose}><X className="w-4 h-4 text-slate-400" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        {[
          { label: 'Client Name', value: clientName, set: setClientName, placeholder: 'Chloe Watkins' },
          { label: 'Client Email', value: clientEmail, set: setClientEmail, placeholder: 'chloe@agency.com' },
          { label: 'Request Title', value: title, set: setTitle, placeholder: 'e.g. Pipedrive to QuickBooks Sync' },
        ].map(f => (
          <div key={f.label}>
            <label className="block text-xs font-semibold text-slate-400 mb-1">{f.label}</label>
            <input required type="text" value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
        ))}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
          <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Describe what needs to be automated..."
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Plan</label>
            <select value={plan} onChange={e => setPlan(e.target.value as 'starter' | 'growth')}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors">Cancel</button>
          <button type="submit" className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors">Create Request</button>
        </div>
      </form>
    </div>
  )
}

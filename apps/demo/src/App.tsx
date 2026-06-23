import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, BarChart3, FileText, Bell, CheckCircle2,
  Clock, ArrowRight, Mail, MessageSquare,
  DollarSign, UserCheck, Calendar, Briefcase,
  ChevronRight, Play, Pause, RotateCcw, ExternalLink
} from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Industry = 'marketing' | 'recruiting' | 'consulting'

interface AutoEvent {
  id: string
  time: string
  icon: React.ReactNode
  color: string
  title: string
  detail: string
  tool: string
}

interface DemoLead {
  id: string
  name: string
  company: string
  score: number
  status: 'new' | 'contacted' | 'qualified' | 'proposal'
  email: string
  source: string
  responseTime: string
}

interface DemoCandidate {
  id: string
  name: string
  role: string
  score: number
  status: 'applied' | 'screened' | 'interview' | 'offer'
  skills: string[]
  outreachSent: boolean
  interviewScheduled: boolean
}

interface DemoProject {
  id: string
  client: string
  status: 'onboarding' | 'active' | 'reporting' | 'invoiced'
  health: 'on_track' | 'at_risk' | 'completed'
  lastReport: string
  invoiceStatus: 'pending' | 'sent' | 'paid'
  automations: string[]
}

// ─── INDUSTRY DATA ────────────────────────────────────────────────────────────

const MARKETING_EVENTS: AutoEvent[] = [
  { id: 'me1', time: '09:00', icon: <Mail className="w-3.5 h-3.5" />, color: 'text-blue-400 bg-blue-500/10', title: 'New lead captured', detail: 'Sarah K. filled out the contact form', tool: 'HubSpot' },
  { id: 'me2', time: '09:00', icon: <Zap className="w-3.5 h-3.5" />, color: 'text-indigo-400 bg-indigo-500/10', title: 'Lead scored automatically', detail: 'Score: 87/100 — High intent detected', tool: 'AI Agent' },
  { id: 'me3', time: '09:01', icon: <MessageSquare className="w-3.5 h-3.5" />, color: 'text-emerald-400 bg-emerald-500/10', title: 'Personalised follow-up sent', detail: '"Hi Sarah, I saw you\'re scaling your agency..."', tool: 'Gmail' },
  { id: 'me4', time: '09:01', icon: <UserCheck className="w-3.5 h-3.5" />, color: 'text-purple-400 bg-purple-500/10', title: 'CRM record created & tagged', detail: 'Added to "High Intent" sequence in HubSpot', tool: 'HubSpot' },
  { id: 'me5', time: '09:02', icon: <Bell className="w-3.5 h-3.5" />, color: 'text-orange-400 bg-orange-500/10', title: 'Sales team notified', detail: 'Slack alert: "🔥 Hot lead — Sarah K. (87 score)"', tool: 'Slack' },
  { id: 'me6', time: '09:15', icon: <BarChart3 className="w-3.5 h-3.5" />, color: 'text-yellow-400 bg-yellow-500/10', title: 'Weekly report auto-generated', detail: '12 clients received branded PDF reports', tool: 'Google Slides + Gmail' },
]

const MARKETING_LEADS: DemoLead[] = [
  { id: 'ml1', name: 'Sarah K.', company: 'Apex Agency', score: 87, status: 'contacted', email: 'sarah@apexagency.io', source: 'Website Form', responseTime: '< 1 min' },
  { id: 'ml2', name: 'James R.', company: 'Growth Digital', score: 74, status: 'qualified', email: 'james@growthdigital.co', source: 'LinkedIn', responseTime: '< 1 min' },
  { id: 'ml3', name: 'Mia T.', company: 'Summit Media', score: 91, status: 'proposal', email: 'mia@summitmedia.io', source: 'Referral', responseTime: '< 1 min' },
  { id: 'ml4', name: 'Carlos V.', company: 'BrightLabs', score: 62, status: 'new', email: 'carlos@brightlabs.co', source: 'Website Form', responseTime: 'Pending' },
]

const RECRUITING_EVENTS: AutoEvent[] = [
  { id: 're1', time: '08:30', icon: <FileText className="w-3.5 h-3.5" />, color: 'text-blue-400 bg-blue-500/10', title: 'CV received & parsed', detail: 'Marcus T. applied for Senior Engineer role', tool: 'AI Agent' },
  { id: 're2', time: '08:30', icon: <Zap className="w-3.5 h-3.5" />, color: 'text-indigo-400 bg-indigo-500/10', title: 'Candidate auto-screened', detail: 'Match score: 94% — Skills verified against JD', tool: 'AI Agent' },
  { id: 're3', time: '08:31', icon: <Calendar className="w-3.5 h-3.5" />, color: 'text-emerald-400 bg-emerald-500/10', title: 'Interview self-scheduled', detail: 'Link sent — Marcus booked Tuesday 2pm slot', tool: 'Calendly + Gmail' },
  { id: 're4', time: '08:31', icon: <MessageSquare className="w-3.5 h-3.5" />, color: 'text-purple-400 bg-purple-500/10', title: 'Hiring manager notified', detail: '"⭐ Top match for Senior Eng — CV attached"', tool: 'Slack' },
  { id: 're5', time: '08:32', icon: <UserCheck className="w-3.5 h-3.5" />, color: 'text-orange-400 bg-orange-500/10', title: 'ATS record updated', detail: 'Stage moved: Applied → Interview Scheduled', tool: 'Greenhouse' },
  { id: 're6', time: '09:00', icon: <Mail className="w-3.5 h-3.5" />, color: 'text-yellow-400 bg-yellow-500/10', title: 'Outreach campaign running', detail: '47 passive candidates contacted this morning', tool: 'Clay + Gmail' },
]

const RECRUITING_CANDIDATES: DemoCandidate[] = [
  { id: 'rc1', name: 'Marcus T.', role: 'Senior Engineer', score: 94, status: 'interview', skills: ['React', 'Node', 'AWS'], outreachSent: true, interviewScheduled: true },
  { id: 'rc2', name: 'Priya N.', role: 'Product Manager', score: 88, status: 'screened', skills: ['Agile', 'Figma', 'SQL'], outreachSent: true, interviewScheduled: false },
  { id: 'rc3', name: 'Daniel O.', role: 'Senior Engineer', score: 71, status: 'applied', skills: ['Python', 'Django'], outreachSent: false, interviewScheduled: false },
  { id: 'rc4', name: 'Chloe W.', role: 'Designer', score: 96, status: 'offer', skills: ['Figma', 'Motion', 'Brand'], outreachSent: true, interviewScheduled: true },
]

const CONSULTING_EVENTS: AutoEvent[] = [
  { id: 'ce1', time: '07:00', icon: <Briefcase className="w-3.5 h-3.5" />, color: 'text-blue-400 bg-blue-500/10', title: 'New client onboarded', detail: 'Workspace, Asana board & Notion doc created', tool: 'Zapier + Notion' },
  { id: 'ce2', time: '07:01', icon: <Mail className="w-3.5 h-3.5" />, color: 'text-emerald-400 bg-emerald-500/10', title: 'Welcome sequence started', detail: '5-email onboarding series queued for Vertex Co.', tool: 'Mailchimp' },
  { id: 'ce3', time: '07:01', icon: <MessageSquare className="w-3.5 h-3.5" />, color: 'text-purple-400 bg-purple-500/10', title: 'Team intro posted', detail: '#new-clients Slack: "Welcome Vertex Co. 🎉"', tool: 'Slack' },
  { id: 'ce4', time: '09:00', icon: <BarChart3 className="w-3.5 h-3.5" />, color: 'text-indigo-400 bg-indigo-500/10', title: 'Weekly status pulled', detail: 'All project KPIs fetched & compiled into slides', tool: 'AI Agent + Slides' },
  { id: 'ce5', time: '09:02', icon: <FileText className="w-3.5 h-3.5" />, color: 'text-yellow-400 bg-yellow-500/10', title: 'Client reports delivered', detail: '8 branded PDF reports emailed to clients', tool: 'Gmail' },
  { id: 'ce6', time: '09:03', icon: <DollarSign className="w-3.5 h-3.5" />, color: 'text-orange-400 bg-orange-500/10', title: 'Invoices auto-sent', detail: '3 invoices generated & sent via QuickBooks', tool: 'QuickBooks' },
]

const CONSULTING_PROJECTS: DemoProject[] = [
  { id: 'cp1', client: 'Vertex Co.', status: 'onboarding', health: 'on_track', lastReport: 'Auto-sent today', invoiceStatus: 'sent', automations: ['Onboarding flow', 'Weekly report'] },
  { id: 'cp2', client: 'Summit Digital', status: 'reporting', health: 'on_track', lastReport: 'Auto-sent today', invoiceStatus: 'paid', automations: ['Weekly report', 'Invoice'] },
  { id: 'cp3', client: 'Apex Consulting', status: 'active', health: 'at_risk', lastReport: 'Auto-sent today', invoiceStatus: 'pending', automations: ['Status alerts'] },
  { id: 'cp4', client: 'GrowthLab', status: 'invoiced', health: 'completed', lastReport: 'Auto-sent today', invoiceStatus: 'paid', automations: ['Invoice', 'Report'] },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const SCORE_COLOR = (s: number) => s >= 85 ? 'text-emerald-400' : s >= 70 ? 'text-yellow-400' : 'text-slate-400'
const HEALTH_BADGE: Record<DemoProject['health'], { label: string; cls: string }> = {
  on_track: { label: 'On Track', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  at_risk:  { label: 'At Risk',  cls: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  completed:{ label: 'Complete', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
}
const STATUS_STEPS: Record<Industry, string[]> = {
  marketing: ['new', 'contacted', 'qualified', 'proposal'],
  recruiting: ['applied', 'screened', 'interview', 'offer'],
  consulting: ['onboarding', 'active', 'reporting', 'invoiced'],
}

// ─── LIVE EVENT FEED ──────────────────────────────────────────────────────────

function LiveFeed({ events, running }: { events: AutoEvent[]; running: boolean }) {
  const [visible, setVisible] = useState<AutoEvent[]>([])
  const [idx, setIdx] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setVisible([])
    setIdx(0)
  }, [events])

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (!running) return
    timerRef.current = setInterval(() => {
      setIdx(prev => {
        if (prev >= events.length) { clearInterval(timerRef.current!); return prev }
        setVisible(v => [...v, events[prev]])
        return prev + 1
      })
    }, 900)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [running, events])

  const reset = () => { setVisible([]); setIdx(0) }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${running && idx < events.length ? 'bg-emerald-500 pulse-dot' : 'bg-slate-600'}`} />
          <span className="text-xs font-mono text-slate-400">automation.log</span>
        </div>
        <button onClick={reset} className="text-slate-600 hover:text-slate-400 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="p-4 space-y-3 min-h-[260px]">
        <AnimatePresence>
          {visible.map((ev) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3"
            >
              <span className="text-[10px] text-slate-600 font-mono mt-0.5 w-10 shrink-0">{ev.time}</span>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${ev.color}`}>
                {ev.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">{ev.title}</span>
                  <span className="text-[10px] text-slate-600 font-mono bg-slate-800 px-1.5 py-0.5 rounded">{ev.tool}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{ev.detail}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {visible.length === 0 && (
          <div className="flex items-center justify-center h-48 text-slate-600 text-xs">
            Press Play to watch automation run →
          </div>
        )}
        {running && idx < events.length && (
          <div className="flex items-center gap-2 text-slate-600 text-xs">
            <Clock className="w-3 h-3 pulse-dot" /> Processing...
          </div>
        )}
        {idx >= events.length && visible.length > 0 && (
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> All automations completed — zero human effort.
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PIPELINE VISUAL ──────────────────────────────────────────────────────────

function PipelineBar({ industry, items }: { industry: Industry; items: { status: string }[] }) {
  const steps = STATUS_STEPS[industry]
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const count = items.filter(x => x.status === step).length
        return (
          <div key={step} className="flex items-center gap-1">
            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
              count > 0 ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-slate-800 border-slate-700 text-slate-600'
            }`}>
              {step.replace('_', ' ')} {count > 0 && <span className="ml-1 bg-blue-500 text-white rounded-full px-1">{count}</span>}
            </div>
            {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-slate-700 shrink-0" />}
          </div>
        )
      })}
    </div>
  )
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

const INDUSTRY_META = {
  marketing: { label: 'Marketing Agency', emoji: '📣', color: 'from-blue-500 to-indigo-600', tagline: 'Automate lead follow-up, CRM sync & client reporting' },
  recruiting: { label: 'Recruiting Firm', emoji: '🧠', color: 'from-purple-500 to-pink-600', tagline: 'Automate candidate screening, outreach & scheduling' },
  consulting: { label: 'Consulting Firm', emoji: '📊', color: 'from-emerald-500 to-teal-600', tagline: 'Automate onboarding, reporting & invoicing' },
}

export default function App() {
  const [industry, setIndustry] = useState<Industry>('marketing')
  const [running, setRunning] = useState(false)
  const [tab, setTab] = useState<'pipeline' | 'details'>('pipeline')
  const [selectedItem, setSelectedItem] = useState<DemoLead | DemoCandidate | DemoProject | null>(null)

  const meta = INDUSTRY_META[industry]
  const events = industry === 'marketing' ? MARKETING_EVENTS : industry === 'recruiting' ? RECRUITING_EVENTS : CONSULTING_EVENTS

  const handleIndustryChange = (ind: Industry) => {
    setIndustry(ind)
    setRunning(false)
    setTab('pipeline')
    setSelectedItem(null)
  }

  // Stats per industry
  const stats = {
    marketing: [
      { label: 'Leads Auto-Contacted', value: '4', sub: 'Response in < 1 min', color: 'text-blue-400' },
      { label: 'Hours Saved / Week', value: '22', sub: 'vs manual follow-up', color: 'text-emerald-400' },
      { label: 'Reports Auto-Sent', value: '12', sub: 'This week, zero effort', color: 'text-purple-400' },
    ],
    recruiting: [
      { label: 'CVs Auto-Screened', value: '47', sub: 'This morning', color: 'text-blue-400' },
      { label: 'Interviews Scheduled', value: '8', sub: 'Zero manual booking', color: 'text-emerald-400' },
      { label: 'Hours Saved / Week', value: '30', sub: 'vs manual outreach', color: 'text-purple-400' },
    ],
    consulting: [
      { label: 'Reports Auto-Sent', value: '8', sub: 'To clients today', color: 'text-blue-400' },
      { label: 'Invoices Auto-Generated', value: '3', sub: 'Zero manual effort', color: 'text-emerald-400' },
      { label: 'Hours Saved / Week', value: '18', sub: 'vs manual admin', color: 'text-purple-400' },
    ],
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">LeverageFlow</div>
              <div className="text-[10px] text-slate-500 font-mono">LIVE DEMO</div>
            </div>
          </div>
          <a
            href="https://leverage-flow.com/#pricing"
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold rounded-lg transition-all"
          >
            Get This For My Business <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Hero */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-mono text-blue-400 uppercase tracking-widest mb-3">Interactive Demo</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Watch Automation Run in Real Time</h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Pick an industry. Hit Play. See exactly what LeverageFlow builds for businesses like yours.
          </p>
        </div>

        {/* Industry selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {(Object.keys(INDUSTRY_META) as Industry[]).map(ind => (
            <button
              key={ind}
              onClick={() => handleIndustryChange(ind)}
              className={`px-5 py-3 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2 ${
                industry === ind
                  ? `bg-gradient-to-r ${INDUSTRY_META[ind].color} border-transparent text-white shadow-lg`
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
              }`}
            >
              <span>{INDUSTRY_META[ind].emoji}</span>
              {INDUSTRY_META[ind].label}
            </button>
          ))}
        </div>

        {/* Active industry label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={industry}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-center mb-8"
          >
            <p className="text-slate-400 text-sm">{meta.tagline}</p>
          </motion.div>
        </AnimatePresence>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats[industry].map((s, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
              <div className={`text-3xl font-extrabold mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-xs font-semibold text-white mb-0.5">{s.label}</div>
              <div className="text-[10px] text-slate-500">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Main demo area */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Left: Live feed */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white">Automation Activity Feed</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setRunning(r => !r)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    running ? 'bg-orange-500/10 border border-orange-500/30 text-orange-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  {running ? <><Pause className="w-3 h-3" /> Pause</> : <><Play className="w-3 h-3" /> Play</>}
                </button>
              </div>
            </div>
            <LiveFeed events={events} running={running} />
          </div>

          {/* Right: Data view */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white">
                {industry === 'marketing' ? 'Lead Pipeline' : industry === 'recruiting' ? 'Candidate Tracker' : 'Project Dashboard'}
              </h2>
                <div className="flex gap-1">
                <button
                  onClick={() => setTab('pipeline')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${tab === 'pipeline' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`}
                >
                  Pipeline
                </button>
                <button
                  onClick={() => setTab('details')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${tab === 'details' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`}
                >
                  Details
                  {selectedItem && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />}
                </button>
              </div>
            </div>

            {/* ── PIPELINE TAB ── */}
            {tab === 'pipeline' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-3 border-b border-slate-800">
                  <PipelineBar
                    industry={industry}
                    items={industry === 'marketing' ? MARKETING_LEADS : industry === 'recruiting' ? RECRUITING_CANDIDATES : CONSULTING_PROJECTS}
                  />
                </div>
                <div className="divide-y divide-slate-800">
                  {/* ── Marketing Leads ── */}
                  {industry === 'marketing' && MARKETING_LEADS.map(lead => (
                    <button
                      key={lead.id}
                      onClick={() => { setSelectedItem(lead); setTab('details') }}
                      className="w-full text-left p-4 flex items-start gap-3 hover:bg-slate-800/60 transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-white">{lead.name}</span>
                          <span className={`text-xs font-bold ${SCORE_COLOR(lead.score)}`}>Score: {lead.score}</span>
                        </div>
                        <div className="text-xs text-slate-500">{lead.company} · via {lead.source}</div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> Auto-contacted in {lead.responseTime}
                          </span>
                          <span className="text-[10px] font-mono text-slate-600 capitalize">{lead.status}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-1" />
                    </button>
                  ))}

                  {/* ── Recruiting Candidates ── */}
                  {industry === 'recruiting' && RECRUITING_CANDIDATES.map(cand => (
                    <button
                      key={cand.id}
                      onClick={() => { setSelectedItem(cand); setTab('details') }}
                      className="w-full text-left p-4 flex items-start gap-3 hover:bg-slate-800/60 transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                        {cand.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-white">{cand.name}</span>
                          <span className={`text-xs font-bold ${SCORE_COLOR(cand.score)}`}>{cand.score}% match</span>
                        </div>
                        <div className="text-xs text-slate-500">{cand.role}</div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {cand.skills.map(s => (
                            <span key={s} className="text-[10px] px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400">{s}</span>
                          ))}
                          {cand.outreachSent && <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400">✓ Outreach sent</span>}
                          {cand.interviewScheduled && <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400">✓ Interview booked</span>}
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-1" />
                    </button>
                  ))}

                  {/* ── Consulting Projects ── */}
                  {industry === 'consulting' && CONSULTING_PROJECTS.map(proj => (
                    <button
                      key={proj.id}
                      onClick={() => { setSelectedItem(proj); setTab('details') }}
                      className="w-full text-left p-4 hover:bg-slate-800/60 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-sm font-semibold text-white">{proj.client}</span>
                          <div className="text-xs text-slate-500 capitalize mt-0.5">{proj.status}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${HEALTH_BADGE[proj.health].cls}`}>
                            {HEALTH_BADGE[proj.health].label}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {proj.automations.map(a => (
                          <span key={a} className="text-[10px] px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400">⚡ {a}</span>
                        ))}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                          proj.invoiceStatus === 'paid' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                        }`}>
                          Invoice: {proj.invoiceStatus}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── DETAILS TAB ── */}
            {tab === 'details' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-h-[340px]">
                {selectedItem ? (
                  <div className="p-6">
                    <button
                      onClick={() => setTab('pipeline')}
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 mb-5 transition-colors"
                    >
                      ← Back to Pipeline
                    </button>

                    {/* Marketing lead detail */}
                    {'email' in selectedItem && 'score' in selectedItem && 'source' in selectedItem && (
                      <div>
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                            {(selectedItem as DemoLead).name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-white text-lg">{(selectedItem as DemoLead).name}</div>
                            <div className="text-sm text-slate-400">{(selectedItem as DemoLead).company}</div>
                          </div>
                          <span className={`ml-auto text-xl font-extrabold ${SCORE_COLOR((selectedItem as DemoLead).score)}`}>
                            {(selectedItem as DemoLead).score}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-slate-800 rounded-xl p-3">
                            <div className="text-[10px] text-slate-500 mb-1">Email</div>
                            <div className="text-xs text-white font-mono">{(selectedItem as DemoLead).email}</div>
                          </div>
                          <div className="bg-slate-800 rounded-xl p-3">
                            <div className="text-[10px] text-slate-500 mb-1">Lead Source</div>
                            <div className="text-xs text-white">{(selectedItem as DemoLead).source}</div>
                          </div>
                          <div className="bg-slate-800 rounded-xl p-3">
                            <div className="text-[10px] text-slate-500 mb-1">Stage</div>
                            <div className="text-xs text-white capitalize">{(selectedItem as DemoLead).status}</div>
                          </div>
                          <div className="bg-slate-800 rounded-xl p-3">
                            <div className="text-[10px] text-slate-500 mb-1">Response Time</div>
                            <div className="text-xs text-emerald-400 font-semibold">{(selectedItem as DemoLead).responseTime}</div>
                          </div>
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
                          <div className="text-[10px] text-emerald-400 font-semibold mb-1">⚡ Automations Triggered</div>
                          <ul className="text-xs text-slate-400 space-y-1">
                            <li>✓ Lead scored by AI agent</li>
                            <li>✓ Personalised email sent automatically</li>
                            <li>✓ CRM record created &amp; tagged</li>
                            <li>✓ Sales team notified via Slack</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Recruiting candidate detail */}
                    {'role' in selectedItem && 'skills' in selectedItem && (
                      <div>
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                            {(selectedItem as DemoCandidate).name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-white text-lg">{(selectedItem as DemoCandidate).name}</div>
                            <div className="text-sm text-slate-400">{(selectedItem as DemoCandidate).role}</div>
                          </div>
                          <span className={`ml-auto text-xl font-extrabold ${SCORE_COLOR((selectedItem as DemoCandidate).score)}`}>
                            {(selectedItem as DemoCandidate).score}%
                          </span>
                        </div>
                        <div className="mb-4">
                          <div className="text-[10px] text-slate-500 mb-2">Skills</div>
                          <div className="flex flex-wrap gap-1.5">
                            {(selectedItem as DemoCandidate).skills.map(s => (
                              <span key={s} className="text-xs px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-slate-300">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-slate-800 rounded-xl p-3">
                            <div className="text-[10px] text-slate-500 mb-1">Stage</div>
                            <div className="text-xs text-white capitalize">{(selectedItem as DemoCandidate).status}</div>
                          </div>
                          <div className="bg-slate-800 rounded-xl p-3">
                            <div className="text-[10px] text-slate-500 mb-1">Match Score</div>
                            <div className={`text-xs font-bold ${SCORE_COLOR((selectedItem as DemoCandidate).score)}`}>{(selectedItem as DemoCandidate).score}% match</div>
                          </div>
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
                          <div className="text-[10px] text-emerald-400 font-semibold mb-1">⚡ Automations Triggered</div>
                          <ul className="text-xs text-slate-400 space-y-1">
                            <li>✓ CV parsed &amp; scored by AI</li>
                            {(selectedItem as DemoCandidate).outreachSent && <li>✓ Outreach email sent automatically</li>}
                            {(selectedItem as DemoCandidate).interviewScheduled && <li>✓ Interview self-scheduling link sent</li>}
                            <li>✓ Hiring manager notified via Slack</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Consulting project detail */}
                    {'client' in selectedItem && 'health' in selectedItem && (
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <div>
                            <div className="font-bold text-white text-lg">{(selectedItem as DemoProject).client}</div>
                            <div className="text-sm text-slate-400 capitalize">{(selectedItem as DemoProject).status}</div>
                          </div>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${HEALTH_BADGE[(selectedItem as DemoProject).health].cls}`}>
                            {HEALTH_BADGE[(selectedItem as DemoProject).health].label}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-slate-800 rounded-xl p-3">
                            <div className="text-[10px] text-slate-500 mb-1">Last Report</div>
                            <div className="text-xs text-white">{(selectedItem as DemoProject).lastReport}</div>
                          </div>
                          <div className="bg-slate-800 rounded-xl p-3">
                            <div className="text-[10px] text-slate-500 mb-1">Invoice Status</div>
                            <div className={`text-xs font-semibold capitalize ${(selectedItem as DemoProject).invoiceStatus === 'paid' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                              {(selectedItem as DemoProject).invoiceStatus}
                            </div>
                          </div>
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
                          <div className="text-[10px] text-emerald-400 font-semibold mb-1">⚡ Active Automations</div>
                          <ul className="text-xs text-slate-400 space-y-1">
                            {(selectedItem as DemoProject).automations.map(a => (
                              <li key={a}>✓ {a} running automatically</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-72 text-slate-600">
                    <ChevronRight className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-sm">Click any row in Pipeline to see details</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-extrabold text-white mb-2">This could be running in your business in 2–3 weeks.</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">Book a free 20-minute audit. We'll show you exactly which automations would save you the most time and money.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://leverage-flow.com/#contact"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Book My Free Audit <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://leverage-flow.com/#pricing"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-all"
            >
              See Pricing →
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}

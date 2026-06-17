import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  X, 
  ArrowRight, 
  Loader2, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  ChevronDown, 
  MessageSquare, 
  TrendingUp, 
  FileText, 
  Layers, 
  Lock 
} from 'lucide-react'

// Import assets
import logoImg from './assets/logo.png'
import heroImg from './assets/hero-flow.png'

interface Plan {
  id: string
  name: string
  price: string
  description: string
  features: React.ReactNode[]
  recommended?: boolean
  buttonText: string
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    price: '$1,999',
    description: 'Perfect for small agencies looking to start their automation journey.',
    features: [
      <span><strong>1 active</strong> request at a time</span>,
      <span>Standard turnaround (1–2 weeks)</span>,
      <span>Unlimited workflow requests</span>,
      <span>Lead routing & CRM synchronization</span>,
      <span>Email + Slack support (business hours)</span>,
      <span>No long-term contract, cancel anytime</span>,
    ],
    buttonText: 'Start with Starter →'
  },
  {
    id: 'growth',
    name: 'Growth Plan',
    price: '$3,499',
    description: 'For growing businesses that need more bandwidth and advanced AI.',
    features: [
      <span><strong>2 active</strong> requests at a time</span>,
      <span><strong>Fast-track turnaround</strong> (~1 week per build)</span>,
      <span>Custom AI agent development (GPT-4/Claude)</span>,
      <span>Multi-tool CRM, email, and billing workflows</span>,
      <span><strong>Priority Slack support</strong> (same-day SLA)</span>,
      <span>No long-term contract, cancel anytime</span>,
    ],
    recommended: true,
    buttonText: 'Go Growth →'
  },
]

interface Testimonial {
  quote: string
  author: string
  role: string
  initials: string
}

const testimonials: Testimonial[] = [
  {
    quote: "We were spending 20+ hours a week on manual lead follow-up. LeverageFlow automated the entire process. Our response time dropped from 4 hours to 4 minutes.",
    author: "Sarah K.",
    role: "COO of a 40-person marketing agency",
    initials: "SK"
  },
  {
    quote: "The AI agent they built for client onboarding cut our admin time by 60%. Our consultants spend more time placing talent and less time on paperwork.",
    author: "Marcus T.",
    role: "Partner at a recruiting firm",
    initials: "MT"
  },
  {
    quote: "I was skeptical about outsourcing automation, but the team at LeverageFlow proved me wrong. They set up our entire client reporting system in under 2 weeks.",
    author: "David R.",
    role: "Managing Partner at a consulting firm",
    initials: "DR"
  }
]

interface FaqItem {
  q: string
  a: string
}

const faqs: FaqItem[] = [
  {
    q: "Do I need technical skills to use LeverageFlow?",
    a: "Not at all. We handle all the technical work — you just tell us what you need automated, and we make it happen. No coding, no complex setups."
  },
  {
    q: "What tools do you integrate with?",
    a: "We integrate with virtually any tool that has an API: HubSpot, Salesforce, Pipedrive, Slack, Gmail, Outlook, Notion, Airtable, QuickBooks, Xero, WordPress, Shopify, and hundreds more via Zapier and Make.com. If your tool has an API, we can connect it."
  },
  {
    q: "How long does it take to get started?",
    a: "Most clients are live with their first automation within 2–3 weeks from kickoff. We start with a 2-day audit, then begin building immediately."
  },
  {
    q: "What if I need to change something?",
    a: "You can submit changes anytime. Starter plan handles 1 change at a time; Growth handles 2 simultaneously. We prioritize fast turnaround on edits."
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We follow industry best practices for data security. We never store your data beyond what's needed for your workflows and use encrypted connections for all integrations."
  },
  {
    q: "What happens if I cancel?",
    a: "You own any documentation we've created for your automations (workflow diagrams, process docs). We'll provide a handoff summary. No data is held hostage."
  }
]

export default function App() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'processing' | 'success'>('details')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    setCheckoutStep('processing')
    setTimeout(() => {
      setCheckoutStep('success')
    }, 2000)
  }

  const resetCheckout = () => {
    setSelectedPlan(null)
    setCheckoutStep('details')
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans overflow-x-hidden">
      
      {/* 1. Sticky Glassmorphic Navigation */}
      <header className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-800/60 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logoImg} className="h-8 w-8 rounded" alt="LeverageFlow Logo" />
            <span className="font-sans font-bold text-xl text-white tracking-tight">LeverageFlow</span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-400">
            <a href="#how-it-works" className="hover:text-blue-500 transition-colors duration-200">How It Works</a>
            <a href="#pricing" className="hover:text-blue-500 transition-colors duration-200">Pricing</a>
            <a href="#faq" className="hover:text-blue-500 transition-colors duration-200">FAQ</a>
          </nav>
          <a href="#pricing" className="text-xs font-semibold px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/50 rounded-lg transition-all">
            Get Started
          </a>
        </div>
      </header>

      {/* 2. Dark Hero Section (Above the Fold) */}
      <section className="relative overflow-hidden bg-[#0B0F19] py-20 lg:py-28 border-b border-slate-800/30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column */}
          <div className="lg:col-span-7 text-left">
            <span className="font-mono text-xs font-semibold text-blue-400 tracking-widest uppercase mb-4 block">
              INTRODUCING LEVERAGEFLOW
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Stop Hiring. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
                Start Automating.
              </span>
            </h1>
            <p className="text-lg sm:text-xl font-sans font-normal text-slate-300 leading-relaxed max-w-2xl mb-8">
              Scale your agency with custom AI agents & workflows — without the $120k developer salary. We build, manage, and maintain intelligent systems that run 24/7.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
              <a href="#pricing" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl text-base shadow-lg shadow-blue-500/20 transition-all duration-300 transform hover:scale-[1.02] text-center">
                See What We Can Automate →
              </a>
              <a href="#faq" className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium border border-slate-800 rounded-xl text-base text-center transition-all">
                Book Free Audit
              </a>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-xs font-mono">
              <span>✓ No Contracts</span>
              <span>✓ 30-Day ROI Guarantee</span>
              <span>✓ Unlimited Requests</span>
            </div>
          </div>

          {/* Right Column (Illustration) */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:h-full select-none transform hover:scale-[1.01] transition-transform duration-500">
            <div className="relative animate-float-slow">
              <img 
                src={heroImg} 
                className="w-full h-auto object-contain rounded-2xl shadow-2xl border border-slate-800" 
                alt="Workflow Illustration" 
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Trust Logo Strip */}
      <section className="bg-[#0B0F19] border-b border-slate-800/50 py-8 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-mono mb-4">
            Trusted by fast-growing B2B agencies and marketing firms
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-40 grayscale contrast-200 font-bold text-sm tracking-wider text-slate-400">
            <span>[ RECRUIT.IO ]</span>
            <span>[ APEX B2B ]</span>
            <span>[ FLOW CONSULTING ]</span>
            <span>[ SUMMIT DIGITAL ]</span>
            <span>[ SCALE OPS ]</span>
          </div>
        </div>
      </section>

      {/* 4. Pain Point / Agitator Section */}
      <section className="bg-slate-50 py-20 border-b border-slate-200/50 text-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="font-mono text-xs text-red-500 uppercase tracking-widest font-semibold mb-2 block">
              Sound Familiar?
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-slate-900 tracking-tight">
              The Ops Bottlenecks Keeping You From Scaling
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white border border-slate-200/60 p-8 rounded-2xl shadow-sm hover:border-red-300/60 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="h-1.5 w-full bg-gradient-to-r from-red-400 to-red-500 absolute top-0 left-0" />
              <span className="text-red-500 font-sans italic text-sm font-semibold mb-4 block">"I need to hire another ops person..."</span>
              <h3 className="font-sans font-bold text-lg text-slate-900 mb-3">The Hiring Trap</h3>
              <p className="font-sans text-sm text-slate-600 leading-relaxed">
                Before you know it, you're spending $60k–$80k/year on headcount for manual CRM entries and follow-ups that could easily run itself.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white border border-slate-200/60 p-8 rounded-2xl shadow-sm hover:border-red-300/60 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="h-1.5 w-full bg-gradient-to-r from-red-400 to-red-500 absolute top-0 left-0" />
              <span className="text-red-500 font-sans italic text-sm font-semibold mb-4 block">"We have 14 spreadsheets..."</span>
              <h3 className="font-sans font-bold text-lg text-slate-900 mb-3">Spreadsheet Sprawl</h3>
              <p className="font-sans text-sm text-slate-600 leading-relaxed">
                Copying and pasting data between tools is inefficient, error-prone, and burns your team's creative hours on administrative tasks.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white border border-slate-200/60 p-8 rounded-2xl shadow-sm hover:border-red-300/60 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="h-1.5 w-full bg-gradient-to-r from-red-400 to-red-500 absolute top-0 left-0" />
              <span className="text-red-500 font-sans italic text-sm font-semibold mb-4 block">"We bought Zapier but..."</span>
              <h3 className="font-sans font-bold text-lg text-slate-900 mb-3">The Tech Ghost Town</h3>
              <p className="font-sans text-sm text-slate-600 leading-relaxed">
                You've invested in tools, but building workflows takes specialized expertise — and your talent is better used serving clients.
              </p>
            </div>
          </div>

          <p className="text-center mt-12 text-slate-800 font-sans font-semibold text-lg max-w-3xl mx-auto px-6">
            You don't need more software. You need software that works — without you having to build it.
          </p>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="bg-slate-900 py-20 border-b border-slate-800/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-blue-400 uppercase tracking-widest font-semibold mb-2 block">
              YOUR ONBOARDING JOURNEY
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-white tracking-tight">
              Up And Running In 3 Weeks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-800/50 border border-slate-800/80 p-8 rounded-2xl relative transition-all hover:bg-slate-800/80 hover:border-slate-700/80 group">
              <span className="text-7xl font-sans font-extrabold text-slate-700/20 absolute top-4 right-6 select-none group-hover:text-blue-500/10 transition-colors">01</span>
              <span className="font-mono text-xs text-blue-400 font-semibold mb-3 tracking-widest block">STEP 01</span>
              <h3 className="text-xl font-bold text-white mb-3">Audit & Strategy</h3>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                We spend 2-3 days auditing your current operations — identifying your highest-ROI automation opportunities.
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs rounded-lg font-mono">
                Deliverable: Opportunity Report
              </span>
            </div>
            {/* Step 2 */}
            <div className="bg-slate-800/50 border border-slate-800/80 p-8 rounded-2xl relative transition-all hover:bg-slate-800/80 hover:border-slate-700/80 group">
              <span className="text-7xl font-sans font-extrabold text-slate-700/20 absolute top-4 right-6 select-none group-hover:text-blue-500/10 transition-colors">02</span>
              <span className="font-mono text-xs text-blue-400 font-semibold mb-3 tracking-widest block">STEP 02</span>
              <h3 className="text-xl font-bold text-white mb-3">Build & Integrate</h3>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                We build custom AI agents and workflows using Make.com, OpenAI, and custom direct API integrations.
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs rounded-lg font-mono">
                Deliverable: Live Automations
              </span>
            </div>
            {/* Step 3 */}
            <div className="bg-slate-800/50 border border-slate-800/80 p-8 rounded-2xl relative transition-all hover:bg-slate-800/80 hover:border-slate-700/80 group">
              <span className="text-7xl font-sans font-extrabold text-slate-700/20 absolute top-4 right-6 select-none group-hover:text-blue-500/10 transition-colors">03</span>
              <span className="font-mono text-xs text-blue-400 font-semibold mb-3 tracking-widest block">STEP 03</span>
              <h3 className="text-xl font-bold text-white mb-3">Manage & Optimize</h3>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                We monitor and maintain your workflows continuously. Need a change? Submit a request and we handle it.
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs rounded-lg font-mono">
                Deliverable: Ongoing Support
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Features Grid Section */}
      <section className="bg-white py-20 border-b border-slate-200/50 text-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-blue-500 uppercase tracking-widest font-semibold mb-2 block">
              OUR SOLUTIONS
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-slate-900 tracking-tight">
              Powerful Custom Architectures
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feat 1 */}
            <div className="bg-slate-50 border border-slate-200/50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Custom AI Agents</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                GPT-4 and Claude powered systems that handle lead qualification, drafting client onboarding, and CRM enrichment.
              </p>
            </div>
            {/* Feat 2 */}
            <div className="bg-slate-50 border border-slate-200/50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">End-to-End Workflows</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Seamless synchronization of lead lists, project managers, calendar tools, and automated client alerts.
              </p>
            </div>
            {/* Feat 3 */}
            <div className="bg-slate-50 border border-slate-200/50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Zero-Touch Reporting</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automated pulling of performance metrics delivered automatically to your clients in their brand template.
              </p>
            </div>
            {/* Feat 4 */}
            <div className="bg-slate-50 border border-slate-200/50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Slack SLA Support</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Priority communication in a shared Slack channel. Chat directly with the engineers running your workflows.
              </p>
            </div>
            {/* Feat 5 */}
            <div className="bg-slate-50 border border-slate-200/50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">No Contracts</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Month-to-month productized automation plans. Upgrade, scale back, or pause request streams anytime.
              </p>
            </div>
            {/* Feat 6 */}
            <div className="bg-slate-50 border border-slate-200/50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">SOC2 Security</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We design with strict alignment to data protection policies. Your client CRM details stay protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Interactive Pricing Section */}
      <section className="py-20 px-6 bg-slate-50 text-slate-900" id="pricing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 font-sans tracking-tight">Simple Pricing. Serious Results.</h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Choose the speed of implementation that matches your goals. Pause or cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ y: -5 }}
                className={`relative p-8 rounded-3xl bg-white border ${
                  plan.recommended ? 'border-2 border-indigo-600 shadow-xl' : 'border-slate-200/80 shadow-sm'
                } flex flex-col justify-between`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2 font-sans">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                    <span className="text-slate-500 ml-1">/mo</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-6">{plan.description}</p>
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
                        <span className="text-slate-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    plan.recommended
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sm font-sans italic text-slate-500 mt-8">
            Most clients see ROI within the first 30 days. We're that confident.
          </p>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="bg-white py-20 border-t border-slate-200/40 text-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-blue-500 uppercase tracking-widest font-semibold mb-2 block">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-tight">
              Agencies Like Yours Are Scaling
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200/50 p-8 rounded-2xl relative shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <span className="text-7xl font-serif text-slate-200 absolute top-4 left-4 select-none opacity-40">"</span>
                <p className="font-sans italic text-sm text-slate-600 leading-relaxed mb-6 relative z-10">
                  {test.quote}
                </p>
                <div className="flex items-center gap-3 border-t border-slate-200/60 pt-4">
                  <div className="h-10 w-10 rounded-full bg-slate-300 flex items-center justify-center font-bold text-xs text-slate-700 uppercase">
                    {test.initials}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-slate-900">{test.author}</h4>
                    <p className="font-sans text-xs text-slate-500">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Dynamic FAQ Accordion Section */}
      <section id="faq" className="bg-slate-50 py-20 border-t border-slate-200/40 text-slate-900">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="font-mono text-xs text-blue-500 uppercase tracking-widest font-semibold mb-2 block">
              QUESTIONS & ANSWERS
            </span>
            <h2 className="text-3xl font-sans font-bold tracking-tight">
              Questions We Get Asked
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div key={index} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-300 shadow-sm">
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-sans font-bold text-base text-slate-900 hover:text-blue-500 transition-colors focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-5 font-sans text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 10. High-Contrast Final CTA Section */}
      <section className="relative overflow-hidden bg-[#0B0F19] py-20 border-t border-slate-800/50 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-white tracking-tight leading-tight mb-4">
            Ready to Stop Hiring and Start Scaling?
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Book a free 20-minute automation audit. We'll identify $5,000+ in monthly time savings — or it's on us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#pricing" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl text-base shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02]">
              Book Your Free Audit →
            </a>
            <a href="#pricing" className="px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-semibold border border-slate-800 rounded-xl text-base transition-all">
              See Example Workflows →
            </a>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-xs text-slate-500 font-mono">
            <span>• Month-to-month. No contracts.</span>
            <span>• 30-day ROI guarantee.</span>
            <span>• SOC2-aligned security.</span>
          </div>
        </div>
      </section>

      {/* 11. Footer Section */}
      <footer className="bg-[#0B0F19] border-t border-slate-900/80 text-slate-400">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logoImg} className="h-6 w-6 rounded" alt="Logo" />
              <span className="font-bold text-white">LeverageFlow</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Custom AI Agents & Workflow Automation for B2B Service Businesses.
            </p>
            <p className="text-xs text-slate-600">© 2026 LeverageFlow. All rights reserved.</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#how-it-works" className="hover:text-blue-500">How It Works</a></li>
              <li><a href="#pricing" className="hover:text-blue-500">Pricing</a></li>
              <li><a href="#faq" className="hover:text-blue-500">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2 text-xs">
              <li>hello@leverageflow.io</li>
              <li><a href="#" className="hover:text-blue-500">Slack Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Security</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>✓ SOC2 Aligned</li>
              <li>✓ End-to-End Encryption</li>
              <li>✓ Secure CRM Connectors</li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Simulated Checkout Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetCheckout}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white text-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <button 
                onClick={resetCheckout}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {checkoutStep === 'details' && (
                <div className="p-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="bg-indigo-600/10 p-2 rounded-lg text-indigo-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold">Secure Checkout</h3>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-slate-600">{selectedPlan.name}</span>
                      <span className="font-bold">{selectedPlan.price}</span>
                    </div>
                    <p className="text-xs text-slate-500">Billed monthly. Pause or cancel anytime.</p>
                  </div>

                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input 
                        required 
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Card Details</label>
                      <div className="relative">
                        <input 
                          required 
                          type="text" 
                          placeholder="4242 4242 4242 4242"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-12"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-1">
                          <div className="w-6 h-4 bg-slate-200 rounded-sm" />
                          <div className="w-6 h-4 bg-slate-300 rounded-sm" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input 
                          required 
                          type="text" 
                          placeholder="MM / YY"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <div>
                        <input 
                          required 
                          type="text" 
                          placeholder="CVC"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 py-2">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Secure 256-bit encrypted payment</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Pay {selectedPlan.price}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {checkoutStep === 'processing' && (
                <div className="p-12 text-center">
                  <div className="flex justify-center mb-6">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Processing Payment</h3>
                  <p className="text-slate-500">Please don't close this window...</p>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Subscription Confirmed!</h3>
                  <p className="text-slate-500 mb-8">Welcome to LeverageFlow. You'll receive an onboarding email in the next few minutes.</p>
                  <button
                    onClick={resetCheckout}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all"
                  >
                    Go to Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

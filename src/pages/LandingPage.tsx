import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import upsailorLogo from "@/assets/upsailor-logo.png";
import logoToursbylocals from "@/assets/clients/toursbylocals.png";
import logoEchave from "@/assets/clients/echave.svg";
import logoEstaon from "@/assets/clients/estaon.png";
import logoStay22 from "@/assets/clients/stay22.webp";
import logoTelus from "@/assets/clients/telus.webp";
import logoManulife from "@/assets/clients/manulife.png";

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
{ label: "Services", href: "#services" },
{ label: "AI", href: "#ai" },
{ label: "Work", href: "#work" },
{ label: "Testimonials", href: "#testimonials" },
{ label: "Values", href: "#values" },
{ label: "Process", href: "#process" },
{ label: "FAQ", href: "#faq" },
{ label: "Contact", href: "#contact" }];


const CLIENT_LOGOS = [
  { name: "ToursByLocals", src: logoToursbylocals },
  { name: "Echave", src: logoEchave },
  { name: "EstaOn", src: logoEstaon, invert: true },
  { name: "Stay22", src: logoStay22 },
  { name: "TELUS Digital", src: logoTelus },
  { name: "Manulife", src: logoManulife },
];


const SERVICES = [
{
  icon:
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 010 20 15 15 0 010-20z" />
      </svg>,

  title: "Websites",
  summary: "Marketing sites, e-commerce, and web apps that load fast and convert.",
  bullets: ["Custom design, built around your brand", "Fast, SEO-friendly, and mobile-ready"]
},
{
  icon:
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" />
      </svg>,

  title: "Mobile Apps",
  summary: "iOS and Android apps built for real users, not just demos.",
  bullets: ["Native and cross-platform builds", "Smooth, app-store-ready experiences"]
},
{
  icon:
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="14" rx="2" /><path d="M8 21h8M12 18v3" />
      </svg>,

  title: "Native Software",
  summary: "Desktop tools and internal software built for how your team actually works.",
  bullets: ["Custom internal tools and dashboards", "Replaces spreadsheets and manual work"]
},
{
  icon:
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8m-4-4v4" />
      </svg>,

  title: "Architecture & Systems",
  summary: "Backend systems designed to grow without falling over.",
  bullets: ["Cloud-native, built to scale with demand", "Secure, reliable, and easy to maintain"]
},
{
  icon:
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>,

  title: "Platforms & Products",
  summary: "Full products, from first idea to paying customers.",
  bullets: ["Go from 0 to 1 in weeks, not quarters", "Production-ready, not just a prototype"]
},
{
  icon:
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>,

  title: "Rescue & Turnaround",
  summary: "Stalled project? We stabilize it, then ship.",
  bullets: ["Code audits and a clear technical debt roadmap", "Incremental fixes with zero disruption"]
}];


const AI_CAPABILITIES = [
{
  icon:
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4M8 16h.01M16 16h.01" />
      </svg>,

  title: "AI Agents",
  summary: "Agents that do real work, not demos.",
  bullets: [
  "Lead generation agents that find and qualify prospects for you",
  "A second brain for your company, one shared source of truth for every team or department",
  "Optimized to use fewer tokens, so agents stay fast and affordable"]

},
{
  icon:
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>,

  title: "Automations",
  summary: "Eliminate manual busywork across your stack.",
  bullets: [
  "Custom workflows built around how your team already works",
  "Connects to the tools you already use",
  "Runs in the background, 24/7, no manual triggers"]

},
{
  icon:
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /><path d="M11 8v3l2 2" />
      </svg>,

  title: "AI-Driven SEO",
  summary: "AI-first content and search strategy built to rank.",
  bullets: [
  "Content built and optimized by AI, so it ranks",
  "Set up to be found by AI search tools, not just Google",
  "Tracks what's working and adjusts on its own"]

},
{
  icon:
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l18-8-8 18-2-8-8-2z" />
      </svg>,

  title: "AI-Driven Marketing Strategy",
  summary: "Data-backed marketing systems powered by AI.",
  bullets: [
  "Campaigns and funnels that run and improve themselves",
  "AI helps pick the right audience and the right message",
  "Clear reporting so you always know what's working"]

},
{
  icon:
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>,

  title: "You, Cloned",
  summary: "A digital version of you that shows up online so you don't have to.",
  bullets: [
  "Trained on your voice, style, and expertise",
  "Built for social media content and strategy",
  "Keeps posting consistently, even when you're busy running the business"]

},
{
  icon:
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>,

  title: "AI Customer Support",
  summary: "A chatbot trained on your business, ready for any use case.",
  bullets: [
  "Answers questions instantly, day or night",
  "Trained on your product, policies, and tone",
  "Hands off to a real person the moment it should"]

}];


const CASES = [
{
  industry: "Fintech",
  tag: "Payments Platform",
  challenge: "A regional payments startup needed to process cross-border transactions under strict compliance requirements with a tight 4-month launch window.",
  approach: "We designed a microservice-based ledger with idempotent transaction flows, automated KYC hooks, and a real-time dashboard.",
  result: "Launched on schedule. Processed $2M in volume in month one. Zero compliance incidents."
},
{
  industry: "Logistics",
  tag: "Fleet Intelligence",
  challenge: "A mid-sized fleet operator was running manual dispatch and losing 18% capacity to inefficiency every quarter.",
  approach: "Built a route-optimization engine with ML-based demand forecasting, driver app, and dispatcher console.",
  result: "12% reduction in fuel cost. Dispatcher workload halved. ROI achieved in 5 months."
},
{
  industry: "Marketplace",
  tag: "B2B Commerce",
  challenge: "A B2B marketplace struggling with onboarding drop-off at 68% and a legacy monolith blocking new features.",
  approach: "Modular re-architecture, new seller onboarding flow with async verification, and a React component library for the front end.",
  result: "Onboarding drop-off cut to 31%. Feature release cycle went from 6 weeks to 9 days."
}];


const TESTIMONIALS = [
{
  quote: "One meeting was all it took for Upsailor to understand exactly what we needed. From proposal to roadmap to delivery, everything was executed flawlessly, zero friction throughout the process.",
  name: "Marcus Henley",
  role: "CTO",
  company: "NovaPay"
},
{
  quote: "We came in with a half-built mess and they turned it into something we're proud to show investors. Honest, fast, and technically excellent.",
  name: "Priya Anand",
  role: "Founder & CEO",
  company: "BuildMetrics"
},
{
  quote: "The AI integration they built for our ops team saves us roughly 40 hours a week. Practical, well-documented, and the team was a pleasure to work with.",
  name: "Jordan Wells",
  role: "VP of Operations",
  company: "FleetSync"
}];


const VALUES = [
{ label: "Ship, then iterate.", body: "We bias toward delivery. A working product teaches more than perfect specs." },
{ label: "Clarity first.", body: "No hand-waving. We give honest assessments and realistic timelines — always." },
{ label: "You own everything.", body: "Full IP transfer, clean repos, and zero lock-in. It's your software." },
{ label: "Security is non-negotiable.", body: "Authentication, encryption, and secure defaults are built in from line one." },
{ label: "Built to last.", body: "We write for the engineer who inherits it next, not just for the demo." }];


const PROCESS_STEPS = [
{
  step: "01",
  title: "Discover",
  description: "We map your goals, constraints, and existing systems. You get a scoped proposal with timeline and budget.",
  deliverable: "Scoped proposal + architecture sketch"
},
{
  step: "02",
  title: "Design",
  description: "We prototype the core flows and validate assumptions fast. No 12-week discovery phase.",
  deliverable: "Clickable prototype + technical spec"
},
{
  step: "03",
  title: "Build",
  description: "Weekly demo cycles. You see progress every 7 days and can steer at any point.",
  deliverable: "Working software, tested and reviewed"
},
{
  step: "04",
  title: "Ship & Support",
  description: "We handle deployment, knowledge transfer, and provide a structured handoff or ongoing retainer.",
  deliverable: "Production deployment + runbook"
}];


const FAQS = [
{
  q: "How do you price engagements?",
  a: "We offer both time-and-materials (hourly/weekly) and fixed-scope project pricing. After a brief discovery call, we'll recommend what fits your project best. No retainer surprises."
},
{
  q: "How long does a typical project take?",
  a: "MVPs typically take 6–12 weeks. Full product builds range from 3–6 months. We scope carefully upfront so you're not caught off guard."
},
{
  q: "Who owns the IP and code?",
  a: "You do, completely. All code, designs, and infrastructure configurations are transferred to you at project close. We retain no license or usage rights."
},
{
  q: "How do you handle security?",
  a: "Security is part of the build, not a post-launch audit. We follow OWASP guidelines, use secure-by-default configurations, and conduct internal code review for every PR."
},
{
  q: "How do we get started?",
  a: "Book a 30-minute strategy call. We'll listen, ask the right questions, and tell you honestly whether and how we can help. No hard sells."
},
{
  q: "What do you need from our side to begin?",
  a: "A clear problem statement, access to relevant stakeholders, and a point of contact. We take care of the rest. The less you have to manage us, the better we're doing our job."
}];


/* ─────────────────────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────────────────────── */

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2.5 group" aria-label="Upsailor Labs home">
      <img

        alt="Upsailor Labs logo"
        className="w-8 h-8 object-contain" src="/lovable-uploads/679cb57d-9820-4120-b5bf-47acd099457e.jpg" />

      <span className="font-display font-semibold text-lg text-foreground tracking-tight">
        Upsailor <span className="text-muted-foreground font-normal">Labs</span>
      </span>
    </a>);

}

function BookCallButton({ className = "", size = "default" }: {className?: string;size?: "sm" | "default";}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        bg-foreground text-background
        hover:bg-foreground/90 active:bg-foreground/80
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
        transition-all duration-150
        ${size === "sm" ? "px-4 py-2 text-sm" : "px-5 py-2.5 text-sm"}
        ${className}
      `}>

      Book a Call
    </button>);

}

function SectionLabel({ children }: {children: React.ReactNode;}) {
  return (
    <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-accent">
      <span className="w-4 h-px bg-accent inline-block" />
      {children}
      <span className="w-4 h-px bg-accent inline-block" />
    </p>);

}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTIONS
───────────────────────────────────────────────────────────────────────────── */

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-card" : "bg-transparent"}`
      }>

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) =>
          <button
            key={link.label}
            onClick={() => handleNavClick(link.href)}
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-md hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">

              {link.label}
            </button>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <BookCallButton size="sm" />
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}>

            {mobileOpen ?
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg> :

            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            }
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen &&
      <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) =>
          <button
            key={link.label}
            onClick={() => handleNavClick(link.href)}
            className="text-left px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors">

                {link.label}
              </button>
          )}
          </nav>
        </div>
      }
    </header>);

}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16" aria-label="Hero">
      {/* Background layers */}
      <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_30%,transparent_100%)]" />
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-dim/8 rounded-full blur-[100px] pointer-events-none" style={{ animationDelay: "1.5s" }} />

      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-medium text-accent">AI-Native · Senior engineering team · Dubai, UAE</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-[1.08] tracking-tight">
          The AI-Native Software Studio.
          <br />
          <span className="text-gradient-accent">You Give a Challenge. We Make It Happen.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">Upsailor Labs is an AI-native software studio building production-ready products, apps, platforms, and AI systems with the precision and pace that serious companies demand.

        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <BookCallButton size="default" className="min-w-[160px] py-3 text-base" />
          <a
            href="#work"
            onClick={(e) => {e.preventDefault();document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });}}
            className="inline-flex items-center gap-2 px-5 py-3 text-base font-medium rounded-lg border border-border text-foreground hover:bg-secondary hover:border-accent/30 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">

            See Our Work
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>

        {/* Trust row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-sm text-muted-foreground">
          {[
          { icon: "✦", text: "AI-native from day one" },
          { icon: "✦", text: "Senior-only engineering team" },
          { icon: "✦", text: "Weekly delivery cycles" },
          { icon: "✦", text: "Production-ready, every sprint" }].
          map((item) =>
          <span key={item.text} className="flex items-center gap-2">
              <span className="text-accent text-xs">{item.icon}</span>
              {item.text}
            </span>
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>);

}

function ClientsCarousel() {
  return (
    <section className="border-y border-border bg-surface-1 py-12 overflow-hidden" aria-label="Client logos">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Trusted by teams building serious products
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll-x w-max items-center">
          {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((client, i) =>
          <div
            key={`${client.name}-${i}`}
            className="mx-8 flex-shrink-0 inline-flex items-center justify-center h-12">
              <img
                src={client.src}
                alt={client.name}
                className={`h-10 w-auto max-w-[140px] object-contain grayscale brightness-75 opacity-60 hover:opacity-100 hover:brightness-100 transition-all duration-300 ${client.invert ? 'invert' : ''}`}
              />
            </div>
          )}
        </div>
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-surface-1 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-surface-1 to-transparent pointer-events-none" />
      </div>
    </section>);

}

function Services() {
  return (
    <section id="services" className="py-24 md:py-32 max-w-7xl mx-auto px-6" aria-labelledby="services-heading">
      <div className="text-center mb-16">
        <SectionLabel>Services</SectionLabel>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-4">
          What We Build
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          From your first website to enterprise-grade systems, built right, built fast.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map((svc) =>
        <article
          key={svc.title}
          className="group relative border-gradient card-glow rounded-xl p-6 md:p-8 bg-card hover:border-accent/30 transition-all duration-400">

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 text-accent group-hover:bg-accent/15 group-hover:border-accent/30 transition-colors">
                {svc.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{svc.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{svc.summary}</p>
                <ul className="space-y-2">
                  {svc.bullets.map((b) =>
                <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {b}
                    </li>
                )}
                </ul>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>);

}

function AICapabilities() {
  return (
    <section id="ai" className="py-24 md:py-32 bg-surface-1 border-y border-border" aria-labelledby="ai-heading">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionLabel>AI Capabilities</SectionLabel>
          <h2 id="ai-heading" className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-4">
            Built AI-Native
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            AI isn't bolted on after the fact, it's how we design, build, and grow every product. We call it <span className="text-foreground font-medium">AItifying</span> a company: getting as much of your business as possible, up to 90%, running on AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_CAPABILITIES.map((cap) =>
          <article
            key={cap.title}
            className="group relative border-gradient card-glow rounded-xl p-6 bg-card hover:border-accent/30 transition-all duration-400">

            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 text-accent group-hover:bg-accent/15 group-hover:border-accent/30 transition-colors mb-4">
              {cap.icon}
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{cap.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">{cap.summary}</p>
            <ul className="space-y-2">
              {cap.bullets.map((b) =>
              <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {b}
                </li>
              )}
            </ul>
          </article>
          )}
        </div>
      </div>
    </section>);

}

function Work() {
  return (
    <section id="work" className="py-24 md:py-32 bg-surface-1 border-y border-border" aria-labelledby="work-heading">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionLabel>Case Highlights</SectionLabel>
          <h2 id="work-heading" className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-4">
            Problems Solved
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            We don't sell capabilities. We solve problems. Here's how.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {CASES.map((c) =>
          <article key={c.industry} className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden card-glow hover:border-accent/30 transition-all duration-400">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium uppercase tracking-widest text-accent">{c.industry}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-secondary border border-border text-muted-foreground">{c.tag}</span>
                </div>
              </div>
              {/* Body */}
              <div className="px-6 py-6 flex flex-col gap-5 flex-1">
                {[
              { label: "Challenge", text: c.challenge },
              { label: "Approach", text: c.approach },
              { label: "Result", text: c.result }].
              map((block) =>
              <div key={block.label}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{block.label}</p>
                    <p className="text-sm text-foreground/85 leading-relaxed">{block.text}</p>
                  </div>
              )}
              </div>
            </article>
          )}
        </div>
      </div>
    </section>);

}

function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32 max-w-7xl mx-auto px-6" aria-labelledby="testimonials-heading">
      <div className="text-center mb-16">
        <SectionLabel>Testimonials</SectionLabel>
        <h2 id="testimonials-heading" className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
          What Clients Say
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) =>
        <figure key={t.name} className="group flex flex-col bg-card border border-border rounded-xl p-6 md:p-8 card-glow hover:border-accent/30 transition-all duration-400">
            {/* Stars */}
            <div className="flex gap-1 mb-5" aria-label="5 stars">
              {[...Array(5)].map((_, i) =>
            <svg key={i} className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            )}
            </div>
            <blockquote className="text-foreground/90 text-sm md:text-base leading-relaxed flex-1 mb-6">
              "{t.quote}"
            </blockquote>
            <figcaption className="hidden flex items-center gap-3 pt-5 border-t border-border">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/30 to-accent-dim/20 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
              </div>
            </figcaption>
          </figure>
        )}
      </div>
    </section>);

}

function Values() {
  return (
    <section id="values" className="py-24 md:py-32 bg-surface-1 border-y border-border" aria-labelledby="values-heading">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionLabel>Values</SectionLabel>
          <h2 id="values-heading" className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-4">
            How We Operate
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            These aren't wall posters. They're operating principles that show up in every codebase and every call.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {VALUES.map((v, i) =>
          <div key={v.label} className="group bg-card border border-border rounded-xl p-6 card-glow hover:border-accent/30 transition-all duration-400 text-center">
              <div className="font-display text-3xl font-bold text-accent/30 mb-3">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-display text-base font-semibold text-foreground mb-2">{v.label}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{v.body}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}

function Process() {
  return (
    <section id="process" className="py-24 md:py-32 max-w-7xl mx-auto px-6" aria-labelledby="process-heading">
      <div className="text-center mb-16">
        <SectionLabel>Process</SectionLabel>
        <h2 id="process-heading" className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-4">
          How We Work
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Four steps. No ambiguity. You know exactly where we are at all times.
        </p>
      </div>

      <div className="relative">
        {/* Connector line (desktop) */}
        <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step, i) =>
          <div key={step.step} className="flex flex-col items-center text-center group">
              {/* Circle */}
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full bg-accent/10 border border-accent/20 group-hover:border-accent/40 group-hover:bg-accent/15 transition-all duration-400" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-mono text-accent/60 mb-0.5">{step.step}</span>
                  <span className="font-display text-lg font-bold text-foreground">{step.title}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.description}</p>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/10 border border-accent/20 rounded-full px-3 py-1.5">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                {step.deliverable}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 bg-surface-1 border-y border-border" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionLabel>FAQ</SectionLabel>
          <h2 id="faq-heading" className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-4">
            Common Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) =>
          <div key={i} className="border border-border rounded-xl bg-card overflow-hidden">
              <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left flex items-center justify-between px-6 py-5 text-foreground font-medium hover:bg-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              aria-expanded={open === i}>

                <span className="pr-4 text-sm md:text-base">{faq.q}</span>
                <span className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full border border-border transition-all duration-200 ${open === i ? "border-accent/40 bg-accent/10 rotate-45" : ""}`}>
                  <svg className="w-3 h-3 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              {open === i &&
            <div className="px-6 pb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{faq.a}</p>
                </div>
            }
            </div>
          )}
        </div>
      </div>
    </section>);

}

function Contact() {
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await supabase.functions.invoke("send-contact-email", {
        body: form,
      });
      if (res.error) throw new Error(res.error.message);
      setSubmitted(true);
      setForm({ name: "", company: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 max-w-7xl mx-auto px-6" aria-labelledby="contact-heading">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left */}
        <div>
          <SectionLabel>Contact</SectionLabel>
          <h2 id="contact-heading" className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-4 leading-tight">
            Let's Build
            <br />
            <span className="text-gradient-accent">Something Real.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Tell us about your challenge. We'll respond within 24 hours with an honest assessment and a path forward.
          </p>
          <div className="space-y-4">
            {[
            { icon: "📍", label: "Location", value: "Dubai, UAE (FZCO)" },
            { icon: "✉️", label: "Email", value: "contact@upsailorlabs.com" },
            { icon: "🕐", label: "Response time", value: "Within 24 hours" }].
            map((item) =>
            <div key={item.label} className="flex items-center gap-4 text-sm">
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-secondary border border-border">{item.icon}</span>
                <div>
                  <p className="text-muted-foreground text-xs">{item.label}</p>
                  <p className="text-foreground font-medium">{item.value}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right — Form */}
        <div className="border-gradient rounded-xl p-6 md:p-8 bg-card shadow-card">
          {submitted ?
          <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">Message received</h3>
              <p className="text-muted-foreground text-sm">We'll be in touch within 24 hours.</p>
            </div> :

          <form onSubmit={handleSubmit} noValidate>
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">Send us a message</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                  <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Alex Johnson"
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors" />

                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1.5">Company</label>
                  <input
                  id="company"
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Acme Inc."
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="alex@company.com"
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors" />

                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">What are you building?</label>
                  <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your project, challenge, or timeline..."
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors resize-none" />

                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 active:bg-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-150 text-sm disabled:opacity-50 disabled:cursor-not-allowed">

                  {loading ? "Sending..." : "Send Message"}
                  {!loading && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>}
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    </section>);

}

function FinalCTA() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-surface-1 border-t border-border" aria-label="Call to action">
      {/* Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]" />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
          Ready to ship
          <br />
          <span className="text-gradient-accent">something great?</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-10">
          No hard sell. Just an honest conversation about your challenge and how we can help.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <BookCallButton size="default" className="min-w-[180px] py-3 text-base" />
          <a
            href="mailto:contact@upsailorlabs.com"
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-accent/30 hover:bg-secondary transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">

            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            Email Us
          </a>
        </div>
      </div>
    </section>);

}

function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <Logo />
            <p className="text-xs text-muted-foreground"><p className="text-xs text-muted-foreground">Dubai, UAE · FZCO · contact@upsailorlabs.com</p></p>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <span>© {new Date().getFullYear()} Upsailor Labs Consulting · All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>);

}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Header />
      <main>
        <Hero />
        <ClientsCarousel />
        <Services />
        <AICapabilities />
        <Work />
        <Testimonials />
        <Values />
        <Process />
        <FAQ />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
    </div>);

}
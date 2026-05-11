'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Metadata } from 'next'

gsap.registerPlugin(ScrollTrigger)

type Tab = 'experience' | 'patents' | 'hackathons'

const HINT: Record<Tab, string> = {
  experience: 'Hover any role to reveal a career milestone',
  patents: 'Hover any patent to see what it covers',
  hackathons: 'Hover any competition to see the context',
}

interface Item {
  role: string
  org: string
  year: string
  current?: boolean
  body: string | React.ReactNode
  tag: string
  tagClass?: 'tag-win' | 'tag-cur'
}

const EXPERIENCE: Item[] = [
  {
    role: 'Director Data Scientist',
    org: 'Mastercard AI Garage',
    year: '2022 — now',
    current: true,
    body: (
      <ul className="ach-list">
        <li><span><strong>Know Your Transaction</strong> — GenAI product that explains complex data insights and model decisions in natural language, with input/output guardrails for safety.</span></li>
        <li><span><strong>LLM Security Suite</strong> — comprehensive suite to assess LLM vulnerabilities via adversarial prompts, with mitigation recommendations.</span></li>
        <li><span><strong>Agentic Commerce</strong> — built an agentic shopping experience from scratch with multilingual and voice-based features.</span></li>
        <li><span><strong>Dynamic Decisioning Service</strong> — AI approval engine mirroring issuer-specific transaction behaviour using Graph Neural Networks.</span></li>
        <li><span><strong>Dispute &amp; Chargeback Reduction</strong> — predictive models using Boosting and GNN to proactively minimise transaction disputes.</span></li>
      </ul>
    ),
    tag: 'GenAI · LLM Security · Agentic · GNN',
    tagClass: 'tag-cur',
  },
  {
    role: 'Senior Data Scientist',
    org: 'Aera Technology',
    year: '2020 — 22',
    body: (
      <ul className="ach-list">
        <li><span><strong>Smart Skill</strong> — self-learning supply chain recommendations using contextual bandit algorithms (ε-greedy, UCB, Thompson Sampling) with off-policy evaluation.</span></li>
        <li><span><strong>Demand Forecast</strong> — ensembled time-series models (Croston, Exponential Smoothing, THETA, ARMA) for a chemical industry client using ABC-XYZ segmentation.</span></li>
        <li><span><strong>Inventory Forecast</strong> — on-hand inventory prediction for a pharma client using Random Forest &amp; XGBoost with SHAP for explainability.</span></li>
      </ul>
    ),
    tag: 'RL · Supply Chain · Forecasting',
  },
  {
    role: 'Analytics Manager',
    org: 'Piramal Financial Services',
    year: '2018 — 20',
    body: (
      <ul className="ach-list">
        <li><span><strong>Account Monitoring</strong> — deployed delinquency prediction model using Random Forest with ADASYN oversampling, monitored via PSI and GINI stability.</span></li>
        <li><span><strong>Risk Analytics</strong> — built underwriting models and reject inferencing framework with Experian; PowerBI dashboards for senior management.</span></li>
        <li><span><strong>Customer Journey Analytics</strong> — ran in-house SEM campaigns; used K-means on bureau data to segment leads by risk profile and loan propensity.</span></li>
      </ul>
    ),
    tag: 'FinTech · Risk · Marketing',
  },
  {
    role: 'PGDBA — Data Science',
    org: 'IIM Calcutta · IIT Kharagpur · ISI Kolkata',
    year: '2016 — 18',
    body: `Completed India's only triple-institute Data Science postgrad with a GPA of 8.51/10 — a rigorous programme spanning business strategy at IIM-C, engineering sciences at IIT-KGP, and statistical theory at ISI.`,
    tag: 'Postgrad',
  },
  {
    role: 'Business Consultant',
    org: 'Fractal Analytics',
    year: '2015 — 16',
    body: 'Tracked pricing & promotions for 66 brands, 200+ products at a Fortune 100 CPG firm. Formulated proposals that added $6M revenue through analytical solutions for two insurance clients.',
    tag: 'Analytics · CPG · Insurance',
  },
  {
    role: 'B.Tech (Honours)',
    org: 'IIT (BHU), Varanasi',
    year: '2011 — 15',
    body: 'Graduated with GPA 8.09/10 and organised events as Event Manager of the Entrepreneurship Cell — building the foundations in mathematics, algorithms, and systems thinking.',
    tag: 'Foundation',
  },
]

const PATENTS: Item[] = [
  {
    role: 'Jailbreaking LLMs by Inverting Intent of Query',
    org: 'Mastercard · P14273-US-UTIL',
    year: 'US Patent',
    body: 'A novel adversarial technique for surfacing LLM vulnerabilities by semantically inverting the intent of a query — the core of the LLM Security Suite built at Mastercard AI Garage.',
    tag: 'LLM Security · Adversarial AI',
  },
  {
    role: 'Methods and Systems for Prompts Related to Financial Events',
    org: 'Mastercard · P12849-US-UTIL',
    year: 'US Patent',
    body: 'Structured prompting systems that generate natural language explanations of complex financial events — core to the Know Your Transaction GenAI product.',
    tag: 'GenAI · FinTech · Explainability',
  },
  {
    role: 'Intelligent Payment Management to Mitigate Over-Credit-Limit Risks',
    org: 'Mastercard · P13984-IN-UTIL',
    year: 'IN Patent',
    body: 'AI-driven decisioning for transactions approaching credit limits — part of the Dynamic Decisioning Service leveraging Graph Neural Networks.',
    tag: 'GNN · Payments · Risk',
  },
  {
    role: 'AI Methods and Systems for Resolving Chargeback Disputes',
    org: 'Mastercard · P12514-IN-UTIL',
    year: 'IN Patent',
    body: 'Predictive models using boosting and GNN to proactively identify and resolve dispute scenarios before they escalate to full chargebacks.',
    tag: 'GNN · Dispute Resolution',
  },
  {
    role: 'Methods for Assigning Chargeback Liability to an Entity',
    org: 'Mastercard · P12130-IN-UTIL',
    year: 'IN Patent',
    body: 'Intelligently attributes chargeback liability across the payment chain using AI-based behavioural pattern analysis.',
    tag: 'Payments · Liability Attribution',
  },
  {
    role: 'Systems for Leveraging Data Aggregation to Define Actionable Insights',
    org: 'Mastercard · VAN14772-IN-PROV',
    year: 'IN Provisional',
    body: 'Framework aggregating multi-source data signals to surface actionable insights — enabling smarter stand-in decisioning during issuer unavailability.',
    tag: 'Data Aggregation · Decisioning',
  },
  {
    role: 'FgenXAI: A GenAI Framework for Explainable Financial Records',
    org: 'KDD Workshop · Publication',
    year: 'Paper',
    body: 'Published at KDD — presents a generative AI framework for producing human-readable explanations of financial records, bridging model transparency and regulatory compliance.',
    tag: 'KDD · XAI · FinTech',
  },
]

const HACKATHONS: Item[] = [
  {
    role: 'LLMs: You Can\'t Please Them All',
    org: 'Kaggle',
    year: '2025 · Gold',
    current: true,
    body: 'Gold medal on a competition focused on aligning LLM outputs to diverse, conflicting human preferences — directly tied to production GenAI safety work.',
    tag: 'Kaggle Gold · LLM Alignment',
    tagClass: 'tag-win',
  },
  {
    role: 'Jigsaw: Agile Community Rules Classification',
    org: 'Kaggle',
    year: '2025 · Silver',
    body: 'Silver medal classifying community content against evolving policy rules — a real-world challenge of keeping AI moderation adaptive and fair.',
    tag: 'NLP · Content Moderation',
  },
  {
    role: 'Competition for LLM and Agent Safety',
    org: 'NeurIPS',
    year: '2024 · Rank 2',
    body: 'Global Rank 2 at NeurIPS 2024\'s flagship safety competition — evaluated on robustness against adversarial prompts, jailbreaks, and unsafe instruction-following.',
    tag: 'NeurIPS · LLM Safety · Global #2',
    tagClass: 'tag-win',
  },
  {
    role: 'Fraud Model Optimization',
    org: 'Mastercard Internal Hackathon',
    year: '2023 · Rank 3',
    body: 'Placed 3rd in Mastercard\'s internal competition on fraud detection optimisation — applied GNN and boosting approaches to transaction graph analysis.',
    tag: 'Fraud Detection · GNN',
  },
  {
    role: 'Smart India Hackathon',
    org: 'Govt. of India — MHRD',
    year: '2017 · Silver',
    body: 'National-level hackathon by India\'s Ministry of Human Resource Development — silver medal building a data-driven civic solution.',
    tag: 'Civic Tech · National',
  },
  {
    role: 'The Analytics Challenge',
    org: 'NASSCOM',
    year: '2016 · Rank 3 / 143',
    body: '3rd out of 143 competing teams in NASSCOM\'s industry analytics challenge — one of the first signals that data science was the right path.',
    tag: 'Analytics · NASSCOM',
  },
  {
    role: 'Indian Case Challenge',
    org: 'IIT Kharagpur',
    year: '2014 · Top 10 / 600+',
    body: 'Top 10 out of 600+ teams — the competition that first sparked the journey toward data science and analytical problem-solving.',
    tag: 'Case Competition · IIT KGP',
  },
  {
    role: 'EXL Case Quotient',
    org: 'EXL Analytics',
    year: '2014 · Top 30 / 735',
    body: 'Top 30 out of 735 teams in EXL\'s analytics case competition — an early validation of structured analytical thinking under pressure.',
    tag: 'Analytics · EXL',
  },
]

const PANELS: Record<Tab, Item[]> = {
  experience: EXPERIENCE,
  patents: PATENTS,
  hackathons: HACKATHONS,
}

function TimelineItem({
  item,
  index,
  isEven,
}: {
  item: Item
  index: number
  isEven: boolean
}) {
  const [open, setOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const expandRef = useRef<HTMLDivElement>(null)

  function expand() {
    setOpen(true)
    if (expandRef.current) {
      gsap.to(expandRef.current, {
        maxHeight: 500,
        opacity: 1,
        marginTop: 14,
        duration: 0.4,
        ease: 'power3.out',
      })
    }
  }

  function collapse() {
    if (pinned) return
    if (expandRef.current) {
      gsap.to(expandRef.current, {
        maxHeight: 0,
        opacity: 0,
        marginTop: 0,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => setOpen(false),
      })
    }
  }

  function togglePin() {
    if (pinned) {
      setPinned(false)
      collapse()
    } else {
      setPinned(true)
      expand()
    }
  }

  const tagClass = item.tagClass || (isEven ? 'tag-yellow' : 'tag-green')

  return (
    <div
      className={`item${item.current ? ' current' : ''}${pinned ? ' pinned' : ''}`}
      onMouseEnter={expand}
      onMouseLeave={collapse}
      onClick={togglePin}
    >
      <div className="arc-card">
        <div className="arc-card-top">
          <div>
            <div className="arc-role">{item.role}</div>
            <div className="arc-org">{item.org}</div>
          </div>
          <div className="arc-year">{item.year}</div>
        </div>
        <div
          className="expand"
          ref={expandRef}
          style={{ maxHeight: 0, opacity: 0, overflow: 'hidden', marginTop: 0 }}
        >
          <div className="arc-divider" />
          <div className="ach-row">
            <div className="ach-text">
              {typeof item.body === 'string' ? item.body : item.body}
              <div>
                <span className={`tag ${item.tagClass || tagClass}`}>{item.tag}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<Tab>('experience')
  const pageRef = useRef<HTMLDivElement>(null)

  // Page entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.from('.arc-line-inner', {
        y: '105%',
        duration: 1.0,
        ease: 'power4.out',
        stagger: 0.12,
      })
      .from('.arc-sub', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .from('.arc-stats', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      .from('.arc-hint', { opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
    }, pageRef)

    return () => ctx.revert()
  }, [])

  // Stagger items when tab changes
  useEffect(() => {
    const items = document.querySelectorAll(`#panel-${activeTab} .item`)
    gsap.fromTo(
      items,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.07,
        clearProps: 'transform',
      }
    )
  }, [activeTab])

  const counts = { experience: '10yr', patents: '6', hackathons: '8' }
  const labels = { experience: 'Experience', patents: 'Patents', hackathons: 'Competitions' }

  return (
    <main className="page">
      <div className="arc-page" ref={pageRef}>

        <header className="arc-header">
          <h1 className="arc-h1">
            <span className="arc-line-wrap">
              <span className="arc-line-inner">A decade of</span>
            </span>
            <span className="arc-line-wrap">
              <em className="arc-line-inner arc-em">building with data</em>
            </span>
          </h1>
          <p className="arc-sub">
            From cracking algorithms at IIT to shipping GenAI products at scale — here&apos;s the story.
          </p>
        </header>

        <div className="arc-stats">
          {(['experience', 'patents', 'hackathons'] as Tab[]).map(tab => (
            <div
              key={tab}
              className={`arc-stat${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <div className="arc-stat-num">
                {tab === 'experience' ? <>10<span>yr</span></> : tab === 'patents' ? '6' : '8'}
              </div>
              <div className="arc-stat-lbl">{labels[tab]}</div>
            </div>
          ))}
        </div>

        <p className="arc-hint" id="hint">{HINT[activeTab]}</p>

        {(['experience', 'patents', 'hackathons'] as Tab[]).map(tab => (
          <div
            key={tab}
            className="panel"
            id={`panel-${tab}`}
            style={{ display: activeTab === tab ? 'block' : 'none' }}
          >
            <div className="timeline">
              {PANELS[tab].map((item, i) => (
                <TimelineItem
                  key={i}
                  item={item}
                  index={i}
                  isEven={i % 2 === 1}
                />
              ))}
            </div>
          </div>
        ))}

      </div>

      <style>{`
        .arc-page {
          position: relative;
          max-width: 760px;
          margin: 0 auto;
          padding: 56px 32px 120px;
        }
        .arc-page::before {
          content: '';
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, var(--dot-color) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
        }
        .arc-page > * { position: relative; z-index: 1; }

        .arc-header { margin-bottom: 40px; }
        .arc-h1 {
          font-family: var(--font-mono);
          font-size: clamp(34px, 6vw, 56px);
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: var(--fg-1);
          margin-bottom: 16px;
        }
        .arc-line-wrap {
          display: block;
          overflow: hidden;
          padding-bottom: 0.06em;
        }
        .arc-line-inner {
          display: block;
        }
        .arc-em {
          font-style: italic;
          font-weight: 300;
          color: var(--fg-2);
        }
        .arc-sub {
          font-family: var(--font-sans);
          font-size: 15px;
          color: var(--fg-2);
          line-height: 1.7;
          max-width: 460px;
        }

        .arc-stats {
          display: flex;
          border: 1px solid var(--border-default);
          margin-bottom: 36px;
        }
        .arc-stat {
          flex: 1;
          padding: 22px 16px 18px;
          border-right: 1px solid var(--border-default);
          text-align: center;
          cursor: pointer;
          position: relative;
          user-select: none;
          background: transparent;
          transition: background 160ms ease;
        }
        .arc-stat:last-child { border-right: none; }
        .arc-stat:hover { background: var(--surface-1); }
        .arc-stat.active { background: var(--surface-2); }
        .arc-stat.active::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 2px;
          background: var(--fg-1);
        }
        .arc-stat-num {
          font-family: var(--font-mono);
          font-size: 32px;
          font-weight: 300;
          color: var(--fg-3);
          line-height: 1;
          margin-bottom: 8px;
          transition: color 160ms ease;
          letter-spacing: -0.01em;
        }
        .arc-stat-num span { font-size: 16px; color: inherit; margin-left: 2px; }
        .arc-stat.active .arc-stat-num { color: var(--fg-1); }
        .arc-stat-lbl {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 1.4px;
          color: var(--fg-3);
          text-transform: uppercase;
          transition: color 160ms ease;
        }
        .arc-stat.active .arc-stat-lbl { color: var(--fg-1); }

        .arc-hint {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--fg-3);
          letter-spacing: 1px;
          margin-bottom: 28px;
          display: flex; align-items: center; gap: 10px;
          text-transform: uppercase;
        }
        .arc-hint::before { content: '↓'; color: var(--fg-1); font-size: 13px; }

        .timeline { position: relative; padding-left: 40px; }
        .timeline::before {
          content: '';
          position: absolute;
          left: 11px; top: 8px; bottom: 8px;
          width: 1px;
          background: linear-gradient(to bottom,
            transparent,
            var(--border-default) 8%,
            var(--border-default) 92%,
            transparent);
        }

        .item {
          position: relative;
          margin-bottom: 10px;
          cursor: pointer;
        }
        .item::before {
          content: '';
          position: absolute;
          left: -35px; top: 20px;
          width: 13px; height: 13px;
          background: var(--bg);
          border: 1px solid var(--fg-3);
          transition: border-color 200ms ease, background 200ms ease, box-shadow 300ms ease;
          z-index: 2;
        }
        .item:hover::before,
        .item.pinned::before {
          border-color: var(--fg-1);
          background: var(--fg-1);
        }
        .item.current::before {
          background: var(--fg-1);
          border-color: var(--fg-1);
          animation: arc-pulse 2.4s ease-in-out infinite;
        }
        @keyframes arc-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.45); }
          50%       { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
        }

        .arc-card {
          background: var(--surface-1);
          border: 1px solid var(--border-default);
          padding: 18px 20px;
          transition: border-color 200ms ease, background 200ms ease;
        }
        .item:hover .arc-card,
        .item.pinned .arc-card {
          border-color: var(--border-active);
          background: var(--surface-2);
        }
        .arc-card-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 12px;
        }
        .arc-role {
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 500;
          color: var(--fg-1);
          line-height: 1.3;
          margin-bottom: 4px;
        }
        .arc-org {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--fg-1);
          letter-spacing: 0.5px;
          opacity: 0.85;
        }
        .arc-year {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--fg-3);
          white-space: nowrap;
          padding-top: 2px;
          flex-shrink: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .arc-divider {
          height: 1px;
          background: var(--border-default);
          margin-bottom: 14px;
        }
        .ach-list {
          list-style: none;
          padding: 0; margin: 0 0 10px;
          display: flex; flex-direction: column; gap: 8px;
        }
        .ach-list li {
          display: flex; gap: 10px; align-items: flex-start;
          font-size: 13.5px;
          color: var(--fg-2);
          line-height: 1.6;
        }
        .ach-list li::before {
          content: '▸';
          color: var(--fg-1);
          margin-top: 1px;
          flex-shrink: 0;
          font-size: 11px;
          line-height: 1.5;
        }
        .ach-text {
          font-size: 13.5px;
          color: var(--fg-2);
          line-height: 1.65;
        }
        .ach-text strong { color: var(--fg-1); font-weight: 500; }

        .tag {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 10.5px;
          padding: 5px 11px;
          margin-top: 14px;
          letter-spacing: 1.3px;
          text-transform: uppercase;
          font-weight: 500;
        }
        .tag-green {
          border: 1px solid var(--status-ok);
          background: rgba(34,197,94,0.06);
          color: var(--status-ok);
        }
        .tag-yellow {
          border: 1px solid var(--status-warn);
          background: rgba(234,179,8,0.07);
          color: var(--status-warn);
        }
        .tag-win {
          border: 1px solid var(--status-warn);
          background: rgba(234,179,8,0.08);
          color: var(--status-warn);
        }
        .tag-cur {
          border: 1px solid var(--status-ok);
          background: rgba(34,197,94,0.10);
          color: var(--status-ok);
        }

        @media (max-width: 520px) {
          .arc-page { padding: 32px 20px 80px; }
          .arc-stat-num { font-size: 24px; }
          .timeline { padding-left: 32px; }
          .item::before { left: -30px; }
        }
      `}</style>
    </main>
  )
}

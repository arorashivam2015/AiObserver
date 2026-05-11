'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const COHORTS = [
  {
    tag: 'Cohort 04 · Americas',
    date: 'Jun 2 — Jun 27, 2026',
    schedule: 'Tue / Thu · 1:00pm ET',
    format: 'Live + recorded · Discord',
    seats: '12 of 24',
    seatsStatus: 'warn',
    price: '$1,800',
    cta: 'Enroll',
    ctaClass: 'primary',
  },
  {
    tag: 'Cohort 05 · EMEA',
    date: 'Sep 8 — Oct 3, 2026',
    schedule: 'Mon / Wed · 18:00 CET',
    format: 'Live + recorded · Discord',
    seats: '24 of 24',
    seatsStatus: 'ok',
    price: '€1,650',
    cta: 'Reserve a seat',
    ctaClass: '',
  },
  {
    tag: 'Cohort 06 · APAC',
    date: 'Oct 20 — Nov 14, 2026',
    schedule: 'Tue / Sat · 10:00 SGT',
    format: 'Live + recorded · Discord',
    seats: '24 of 24',
    seatsStatus: 'ok',
    price: '$1,800',
    cta: 'Notify me',
    ctaClass: '',
  },
]

const INSTRUCTORS = [
  {
    initials: 'SA',
    name: 'Shivam Arora',
    title: 'Director · AI Garage, Mastercard India',
    bio: 'Leads applied AI at Mastercard\'s flagship innovation lab. Brings the rigor of building production AI inside a regulated, global payments environment.',
  },
  {
    initials: 'KT',
    name: 'Kapil Tripathi',
    title: 'Director · Trading, ANZ',
    bio: 'Runs quantitative and AI-driven trading systems at ANZ. Teaches how to instrument, evaluate, and ship models where every basis point — and every millisecond — counts.',
  },
  {
    initials: 'SM',
    name: 'Shrey Manish',
    title: 'Engagement Manager · McKinsey QuantumBlack',
    bio: 'Leads AI transformation engagements across Fortune 500 clients. Brings the operating-model lens — how to embed observability and evals into how teams actually work.',
  },
]

export default function WorkshopPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section 1 entrance
      gsap.from('#cohorts-section .section-eyebrow, #cohorts-section .section-headline', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.1,
      })

      gsap.from('.cohort', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.35,
        clearProps: 'transform',
      })

      // Section 2 — scroll triggered
      ScrollTrigger.batch('.instr', {
        onEnter: (els) => {
          gsap.from(els, {
            y: 36,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.12,
            clearProps: 'transform',
          })
        },
        start: 'top 85%',
        once: true,
      })

      gsap.from('#instructors-section .section-eyebrow, #instructors-section .section-headline', {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '#instructors-section',
          start: 'top 85%',
          once: true,
        },
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className="page">
      <div className="container" ref={pageRef}>

        {/* COHORTS */}
        <section
          id="cohorts-section"
          style={{ borderTop: 0, paddingTop: 64, paddingBottom: 96 }}
        >
          <div className="section-eyebrow">01 · Upcoming cohorts</div>
          <h2 className="t-h1 section-headline" style={{ marginBottom: 64 }}>
            Three cohorts.{' '}
            <span style={{ color: 'var(--fg-3)' }}>Pick your timezone.</span>
          </h2>

          <div className="cohort-grid">
            {COHORTS.map((c, i) => (
              <div key={i} className="cohort">
                <div className="cohort-tag">{c.tag}</div>
                <div className="cohort-date">{c.date}</div>
                <div className="cohort-divider" />
                <div className="cohort-rows">
                  <div>
                    <span className="t-eyebrow">Schedule</span>
                    <span>{c.schedule}</span>
                  </div>
                  <div>
                    <span className="t-eyebrow">Format</span>
                    <span>{c.format}</span>
                  </div>
                  <div>
                    <span className="t-eyebrow">Seats</span>
                    <span>
                      <span style={{ color: `var(--status-${c.seatsStatus})` }}>{c.seats}</span>
                      {' '}remaining
                    </span>
                  </div>
                  <div>
                    <span className="t-eyebrow">Price</span>
                    <span>{c.price}</span>
                  </div>
                </div>
                <button className={`btn ${c.ctaClass} cohort-cta`}>
                  <span>{c.cta}</span>
                  <span className="arrow">→</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* INSTRUCTORS */}
        <section id="instructors-section" className="section">
          <div className="section-eyebrow">02 · Instructors</div>
          <h2 className="t-h1 section-headline" style={{ marginBottom: 48 }}>
            Taught by practitioners{' '}
            <span style={{ color: 'var(--fg-3)' }}>who ship AI at scale.</span>
          </h2>

          <div className="instr-grid">
            {INSTRUCTORS.map((inst, i) => (
              <div key={i} className="instr">
                <div className="avatar"><span>{inst.initials}</span></div>
                <div>
                  <div className="team-name">{inst.name}</div>
                  <div
                    className="t-mono fg-3"
                    style={{ fontSize: 12 }}
                  >
                    {inst.title}
                  </div>
                  <p className="fg-2" style={{ fontSize: 14, marginTop: 12 }}>
                    {inst.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      <style>{`
        .cohort-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          border: 1px solid var(--border-default);
          border-bottom: 0; border-right: 0;
        }
        .cohort {
          padding: 28px;
          border-right: 1px solid var(--border-default);
          border-bottom: 1px solid var(--border-default);
          display: flex; flex-direction: column;
          transition: background 140ms ease;
        }
        .cohort:hover { background: var(--surface-1); }
        .cohort-tag {
          font-family: var(--font-mono);
          font-size: 11px; letter-spacing: 1.4px;
          text-transform: uppercase;
          color: var(--fg-3);
        }
        .cohort-date {
          font-family: var(--font-mono);
          font-size: 22px;
          margin-top: 8px;
          font-weight: 300;
          color: var(--fg-1);
        }
        .cohort-divider { height: 1px; background: var(--border-default); margin: 20px 0; }
        .cohort-rows { display: flex; flex-direction: column; gap: 12px; flex: 1; }
        .cohort-rows > div { display: flex; justify-content: space-between; font-size: 14px; }
        .cohort-cta { margin-top: 24px; justify-content: center; }
        @media (max-width: 880px) { .cohort-grid { grid-template-columns: 1fr; } }

        .instr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .instr { display: flex; gap: 20px; align-items: flex-start; }
        .avatar {
          width: 52px; height: 52px;
          flex-shrink: 0;
          border: 1px solid var(--border-default);
          background: var(--surface-2);
          display: grid; place-items: center;
          font-family: var(--font-mono);
          font-size: 13px;
          letter-spacing: 1.4px;
          color: var(--fg-3);
          text-transform: uppercase;
        }
        .team-name { font-family: var(--font-sans); font-size: 18px; color: var(--fg-1); }
        @media (max-width: 880px) { .instr-grid { grid-template-columns: 1fr; } }

        .section-headline { font-family: var(--font-sans); }
      `}</style>
    </main>
  )
}

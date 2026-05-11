'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TOPICS = ['All', 'Engineering', 'Evals', 'Postmortems', 'Research', 'Product']
const SORTS = ['Latest', 'Most read']

const POSTS = [
  {
    date: { year: '2026', day: '05.06' },
    topic: 'Engineering',
    readTime: '9 min',
    title: 'Why we replaced our trace database three times in two years.',
    excerpt: 'From Postgres to ClickHouse to a custom columnar store. Each migration earned its keep. The numbers, in the order we learned them.',
  },
  {
    date: { year: '2026', day: '04.29' },
    topic: 'Evals',
    readTime: '6 min',
    title: 'Pairwise model judging is statistically dishonest. Here\'s the fix.',
    excerpt: 'I re-ran 38,000 evals with a confidence-interval-first methodology. 22% of "wins" became ties. Publishing the protocol.',
  },
  {
    date: { year: '2026', day: '04.18' },
    topic: 'Postmortems',
    readTime: '11 min',
    title: 'A two-hour outage caused by a single tokenizer regex.',
    excerpt: 'The cost-aggregation pipeline silently dropped 0.3% of spans. The trace pattern that exposed it and the property test written in response.',
  },
  {
    date: { year: '2026', day: '04.10' },
    topic: 'Research',
    readTime: '18 min',
    title: 'Drift detection without ground truth.',
    excerpt: 'A practical walkthrough of distributional, behavioral, and self-consistency drift signals — with reference implementations.',
  },
  {
    date: { year: '2026', day: '03.31' },
    topic: 'Engineering',
    readTime: '7 min',
    title: 'Streaming traces at 14k/sec on a single Postgres replica.',
    excerpt: 'A surprisingly long-lived architecture, the bottlenecks hit along the way, and the indexes that earned their salary.',
  },
  {
    date: { year: '2026', day: '03.21' },
    topic: 'Product',
    readTime: '4 min',
    title: 'Why my dashboard has no charts on the homepage.',
    excerpt: 'A short essay on signal-to-noise and the costs of pretty data viz that doesn\'t change anyone\'s behavior.',
  },
  {
    date: { year: '2026', day: '03.14' },
    topic: 'Postmortems',
    readTime: '8 min',
    title: 'Token counts lie. Here\'s how I measure spend now.',
    excerpt: 'Reconciling provider invoices against my own counters surfaced a 1.7% gap. The story of where the missing tokens went.',
  },
]

export default function BlogPage() {
  const [activeTopic, setActiveTopic] = useState('All')
  const [activeSort, setActiveSort] = useState('Latest')
  const pageRef = useRef<HTMLDivElement>(null)

  const filtered = POSTS.filter(p => activeTopic === 'All' || p.topic === activeTopic)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.filter-bar', {
        y: -24,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.15,
      })

      gsap.from('.post-row', {
        y: 32,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.35,
        clearProps: 'transform',
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  // Re-animate when filter changes
  useEffect(() => {
    gsap.fromTo(
      '.post-row',
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.45,
        ease: 'power3.out',
        stagger: 0.06,
        clearProps: 'transform',
      }
    )
  }, [activeTopic])

  return (
    <main className="page">
      <div className="blog-wrap" ref={pageRef}>

        <div className="filter-bar">
          <div className="filter-group">
            <span className="t-eyebrow">Topic</span>
            <div className="chips">
              {TOPICS.map(t => (
                <button
                  key={t}
                  className={`chip${activeTopic === t ? ' active' : ''}`}
                  onClick={() => setActiveTopic(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="t-eyebrow">Sort</span>
            {SORTS.map(s => (
              <button
                key={s}
                className={`chip${activeSort === s ? ' active' : ''}`}
                onClick={() => setActiveSort(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="post-list">
          {filtered.map((post, i) => (
            <a key={i} href="#" className="post-row">
              <div className="post-date">
                <span>{post.date.year}</span>
                <span>{post.date.day}</span>
              </div>
              <div className="post-meta">
                <div className="t-eyebrow">{post.topic} · {post.readTime}</div>
                <h3 className="t-h3">{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
              <div className="post-arrow">→</div>
            </a>
          ))}
        </div>

      </div>

      <style>{`
        .blog-wrap {
          max-width: var(--container);
          margin: 0 auto;
          padding: 32px 32px 96px;
        }
        .filter-bar {
          display: flex; justify-content: space-between; align-items: center;
          border-top: 1px solid var(--border-default);
          border-bottom: 1px solid var(--border-default);
          padding: 16px 0;
          flex-wrap: wrap; gap: 16px;
          margin-bottom: 32px;
        }
        .filter-group { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .chips { display: flex; gap: 8px; flex-wrap: wrap; }
        .chip {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          padding: 8px 14px;
          border: 1px solid var(--border-default);
          color: var(--fg-2);
          cursor: pointer;
          background: transparent;
          transition: color 140ms ease, border-color 140ms ease, background 140ms ease;
        }
        .chip:hover { color: var(--fg-1); border-color: var(--border-strong); }
        .chip.active { color: var(--on-fg); background: var(--inverse-bg); border-color: var(--inverse-bg); }

        .post-list { display: flex; flex-direction: column; }
        .post-row {
          display: grid;
          grid-template-columns: 100px 1fr 40px;
          gap: 32px; align-items: center;
          padding: 28px 0;
          border-bottom: 1px solid var(--border-default);
          color: var(--fg-1);
          transition: background 140ms ease, padding 200ms ease;
        }
        .post-row:hover { background: var(--surface-1); padding-left: 16px; padding-right: 16px; color: var(--fg-1); }
        .post-date {
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 1px;
          color: var(--fg-3);
          display: flex; flex-direction: column;
        }
        .post-meta { display: flex; flex-direction: column; gap: 8px; }
        .post-meta p { font-size: 14px; max-width: 720px; color: var(--fg-2); margin: 0; }
        .post-arrow {
          font-family: var(--font-mono);
          color: var(--fg-3); font-size: 18px;
          transition: color 140ms ease, transform 160ms ease;
        }
        .post-row:hover .post-arrow { color: var(--fg-1); transform: translateX(4px); }
        @media (max-width: 720px) {
          .post-row { grid-template-columns: 1fr; gap: 8px; }
          .post-arrow { display: none; }
        }
      `}</style>
    </main>
  )
}

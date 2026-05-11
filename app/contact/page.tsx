'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 })

      tl.from('.contact-line-inner', {
        y: '105%',
        duration: 0.9,
        ease: 'power4.out',
      })
      .from('.contact-subtext', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      }, '-=0.4')
      .from('.contact-form', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.4')
    }, pageRef)

    return () => ctx.revert()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status !== 'idle') return
    setStatus('sending')

    const btn = document.querySelector('.submit-btn') as HTMLButtonElement
    if (btn) {
      gsap.to(btn, { opacity: 0.6, duration: 0.2 })
    }

    setTimeout(() => {
      setStatus('sent')
      if (btn) {
        gsap.to(btn, {
          opacity: 1,
          duration: 0.3,
          onComplete: () => {
            btn.style.background = 'var(--status-ok)'
            btn.style.borderColor = 'var(--status-ok)'
          },
        })
      }
    }, 700)
  }

  return (
    <main className="page">
      <div className="contact-wrap" ref={pageRef}>

        <section className="contact-intro">
          <h1 className="contact-h1">
            <span className="contact-line-wrap">
              <span className="contact-line-inner">Say hello.</span>
            </span>
          </h1>
          <p className="contact-subtext fg-2">
            A note, a question, a thought — whatever it is, send it along.
          </p>
        </section>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Write something."
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>

          <div className="form-foot">
            <span className="t-mono fg-3" style={{ fontSize: 12 }}>
              I read every message.
            </span>
            <button
              className="btn primary submit-btn"
              type="submit"
              disabled={status === 'sent'}
            >
              <span>
                {status === 'idle' ? 'Send' : status === 'sending' ? 'Sending' : 'Sent ✓'}
              </span>
              {status !== 'sent' && <span className="arrow">→</span>}
            </button>
          </div>
        </form>

      </div>

      <style>{`
        .contact-wrap {
          max-width: 880px;
          margin: 0 auto;
          padding: 96px 32px 128px;
        }
        .contact-intro { margin-bottom: 48px; }
        .contact-h1 {
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: clamp(36px, 5vw, 64px);
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin: 0 0 16px;
        }
        .contact-line-wrap {
          display: block;
          overflow: hidden;
          padding-bottom: 0.06em;
        }
        .contact-line-inner { display: block; }
        .contact-subtext {
          font-size: 16px;
          max-width: 560px;
          line-height: 1.6;
        }

        .contact-form {
          border: 1px solid var(--border-default);
          padding: 40px;
          display: flex; flex-direction: column; gap: 24px;
        }
        .form-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
        }
        .form-foot {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 16px; border-top: 1px solid var(--border-default);
          flex-wrap: wrap; gap: 16px;
        }
        .submit-btn { transition: background 300ms ease, border-color 300ms ease, opacity 200ms ease; }

        @media (max-width: 720px) {
          .form-grid { grid-template-columns: 1fr; }
          .contact-form { padding: 24px; }
        }
      `}</style>
    </main>
  )
}

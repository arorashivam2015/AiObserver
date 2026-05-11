'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const homeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Lock scroll to viewport on home page only
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  // GSAP entrance — animate TO visible. Initial hidden state is set in styles below
  // so content never flashes visible before GSAP kicks in.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.to('.line-inner', {
        y: 0,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.12,
      })
      .to('.home-sub', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.5')
      .to('.home-cta', {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
      }, '-=0.5')
      .to('.home-secondary', {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
      }, '-=0.55')
      .to('.corner', {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.15,
      }, '-=0.3')
    }, homeRef)

    return () => ctx.revert()
  }, [])

  // Token rain canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const glyphs = (
      '01234567890' +
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
      '{}[]()<>/\\=+-_*#@$%&|;:.,' +
      'λ∇∂∑→←↑↓·•◆◇○●'
    ).split('')

    const words = [
      'trace', 'span', 'tok', 'ctx', 'embed', 'logit',
      'attn', 'head', 'layer', 'step', 'loss', 'drift',
      'eval', 'true', 'null', 'p99', 'ok', 'obs',
      'model', '0.87', '1.42', 'log', 'warn', 'ack',
    ]

    const FONT_SIZE = 14
    const COL_WIDTH = 18
    const ROW_HEIGHT = 18

    type Col = {
      x: number; y: number; speed: number; len: number
      next: number; chars: { ch: string; age: number }[]
    }

    let DPR = Math.min(window.devicePixelRatio || 1, 2)
    let cols: Col[] = []
    let W = 0, H = 0

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      canvas!.style.width = W + 'px'
      canvas!.style.height = H + 'px'
      canvas!.width = W * DPR
      canvas!.height = H * DPR
      ctx!.scale(DPR, DPR)
      ctx!.font = `300 ${FONT_SIZE}px var(--font-mono, "Geist Mono", monospace)`
      ctx!.textBaseline = 'top'
      const colCount = Math.ceil(W / COL_WIDTH)
      cols = []
      for (let i = 0; i < colCount; i++) {
        cols.push({
          x: i * COL_WIDTH + 6,
          y: Math.random() * -H,
          speed: 0.6 + Math.random() * 1.4,
          len: 8 + Math.floor(Math.random() * 22),
          next: 0,
          chars: [],
        })
      }
    }

    function pickChar(): string {
      if (Math.random() < 0.04) return words[Math.floor(Math.random() * words.length)]
      return glyphs[Math.floor(Math.random() * glyphs.length)]
    }

    function themeColors() {
      const light = document.documentElement.getAttribute('data-theme') === 'light'
      return light
        ? { trail: 'rgba(246,244,239,0.20)', prefill: '#f6f4ef', glyph: '31,34,40' }
        : { trail: 'rgba(31,34,40,0.18)', prefill: '#1f2228', glyph: '255,255,255' }
    }

    function frame() {
      const tc = themeColors()
      ctx!.fillStyle = tc.trail
      ctx!.fillRect(0, 0, W, H)

      for (const col of cols) {
        col.y += col.speed
        col.next -= col.speed
        if (col.next <= 0) {
          col.chars.unshift({ ch: pickChar(), age: 0 })
          if (col.chars.length > col.len) col.chars.pop()
          col.next = ROW_HEIGHT
        }
        for (let i = 0; i < col.chars.length; i++) {
          const y = col.y - i * ROW_HEIGHT
          if (y < -ROW_HEIGHT || y > H) continue
          let alpha: number
          if (i === 0) alpha = 0.95
          else if (i === 1) alpha = 0.55
          else alpha = Math.max(0, 0.40 * (1 - i / col.len))
          ctx!.fillStyle = `rgba(${tc.glyph},${alpha})`
          ctx!.fillText(col.chars[i].ch, col.x, y)
        }
        if (col.y - col.chars.length * ROW_HEIGHT > H) {
          col.y = -ROW_HEIGHT * (5 + Math.random() * 20)
          col.speed = 0.6 + Math.random() * 1.4
          col.len = 8 + Math.floor(Math.random() * 22)
          col.chars = []
        }
      }
      rafRef.current = requestAnimationFrame(frame)
    }

    resize()
    const tc = themeColors()
    ctx.fillStyle = tc.prefill
    ctx.fillRect(0, 0, W, H)
    rafRef.current = requestAnimationFrame(frame)

    // Repaint on theme change
    const obs = new MutationObserver(() => {
      const tc2 = themeColors()
      ctx!.fillStyle = tc2.prefill
      ctx!.fillRect(0, 0, W, H)
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    let resizeT: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeT)
      resizeT = setTimeout(resize, 120)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      obs.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <main ref={homeRef} style={styles.home}>
      <canvas ref={canvasRef} style={styles.rain} aria-hidden="true" />

      {/* Radial vignette — fades rain around center content */}
      <div style={styles.vignette} />

      <div style={styles.content} className="home-content">
        {/* Scrim behind text for readability */}
        <div style={styles.scrim} />

        <h1 style={styles.headline} className="home-headline">
          <span style={styles.lineWrap}>
            <span className="line-inner" style={styles.lineInner}>
              Watching machines
            </span>
          </span>
          <span style={styles.lineWrap}>
            <span className="line-inner" style={styles.lineInner}>
              think{' '}
              <em style={styles.ital}>out loud.</em>
            </span>
          </span>
        </h1>

        <p className="home-sub" style={styles.sub}>
          A field notebook on AI, data science, and the things I&apos;ve broken
          — and quietly fixed — in production.
        </p>

        <div style={styles.actions}>
          <Link href="/blog" className="home-cta" style={styles.cta}>
            <span>Read the notebook</span>
            <span className="arrow" style={styles.arrow}>→</span>
          </Link>
          <Link href="/about" className="home-secondary" style={styles.secondary}>
            <span>About me</span>
          </Link>
        </div>
      </div>

      <div className="corner bl" style={{ ...styles.corner, left: 32, bottom: 24 }}>
        <span className="status-dot" />
        <span>signal · live</span>
      </div>
      <div className="corner br" style={{ ...styles.corner, right: 32, bottom: 24 }}>
        <span>v2.6 · last entry 3d ago</span>
      </div>

      <style>{`
        .home-cta:hover .arrow { transform: translateX(3px); }
        [data-theme="light"] .home-headline { font-weight: 400; }
        @media (max-width: 720px) {
          .corner.bl { display: none; }
        }
      `}</style>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  home: {
    flex: 1,
    position: 'relative',
    display: 'grid',
    placeItems: 'center',
    height: '100vh',
    overflow: 'hidden',
    padding: '0 32px',
  },
  rain: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    opacity: 0.85,
  },
  vignette: {
    position: 'absolute',
    inset: 0,
    background: `radial-gradient(ellipse 65% 65% at 50% 50%,
      rgba(31,34,40,0.88) 0%,
      rgba(31,34,40,0.65) 40%,
      rgba(31,34,40,0.20) 75%,
      transparent 100%)`,
    zIndex: 1,
    pointerEvents: 'none',
  },
  content: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 32,
    maxWidth: 1100,
    isolation: 'isolate',
  },
  scrim: {
    position: 'absolute',
    zIndex: -1,
    inset: '-20% -25%',
    background: `radial-gradient(ellipse 70% 65% at center,
      var(--bg) 0%,
      color-mix(in srgb, var(--bg) 85%, transparent) 45%,
      transparent 80%)`,
    pointerEvents: 'none',
  },
  headline: {
    fontWeight: 300,
    fontSize: 'clamp(40px, 7vw, 104px)',
    lineHeight: 0.95,
    letterSpacing: '-0.025em',
    color: 'var(--fg-1)',
    margin: 0,
  },
  lineWrap: {
    display: 'block',
    overflow: 'hidden',
    paddingBottom: '0.08em',
  },
  lineInner: {
    display: 'block',
    transform: 'translateY(110%)',
  },
  ital: {
    fontStyle: 'italic',
    fontWeight: 300,
  },
  sub: {
    fontFamily: 'var(--font-sans)',
    fontSize: 'clamp(15px, 1.4vw, 17px)',
    lineHeight: 1.55,
    color: 'var(--fg-2)',
    maxWidth: 540,
    margin: 0,
    opacity: 0,
    transform: 'translateY(24px)',
  },
  actions: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
  },
  cta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    letterSpacing: '1.6px',
    textTransform: 'uppercase',
    color: 'var(--on-fg)',
    background: 'var(--inverse-bg)',
    padding: '14px 22px',
    border: '1px solid var(--inverse-bg)',
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'background 140ms ease, color 140ms ease',
  },
  arrow: {
    display: 'inline-block',
    transition: 'transform 160ms ease',
  },
  secondary: {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    letterSpacing: '1.6px',
    textTransform: 'uppercase',
    color: 'var(--fg-2)',
    padding: '14px 18px',
    border: '1px solid var(--border-default)',
    transition: 'border-color 140ms ease, color 140ms ease, background 140ms ease',
    opacity: 0,
    transform: 'translateY(20px)',
  },
  corner: {
    position: 'absolute',
    zIndex: 3,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '1.4px',
    textTransform: 'uppercase',
    color: 'var(--fg-3)',
    opacity: 0,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  },
}

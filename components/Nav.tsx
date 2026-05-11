'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import gsap from 'gsap'

export default function Nav() {
  const pathname = usePathname()

  useEffect(() => {
    gsap.from('.nav', {
      y: -80,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      clearProps: 'transform',
    })
  }, [])

  function applyTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('aio-theme', theme) } catch (_) {}
    document.querySelectorAll<HTMLButtonElement>('[data-theme-btn]').forEach(b => {
      const isActive = b.getAttribute('data-theme-btn') === theme
      b.classList.toggle('active', isActive)
      b.setAttribute('aria-pressed', String(isActive))
    })
  }

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <span className="brand-mark" />
          <span>AIObserver</span>
        </Link>

        <div className="nav-links">
          {[
            { href: '/', label: 'Home' },
            { href: '/about', label: 'About' },
            { href: '/blog', label: 'Blog' },
            { href: '/workshop', label: 'Workshop' },
            { href: '/contact', label: 'Contact' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? 'active' : ''}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <div className="theme-toggle" role="group" aria-label="Theme">
            <button
              data-theme-btn="light"
              aria-pressed="false"
              title="Light mode"
              onClick={() => applyTheme('light')}
            >
              ☀
            </button>
            <button
              data-theme-btn="dark"
              aria-pressed="true"
              title="Dark mode"
              onClick={() => applyTheme('dark')}
            >
              ☾
            </button>
          </div>
          <Link href="/blog" className="btn">
            <span>Latest post</span>
            <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

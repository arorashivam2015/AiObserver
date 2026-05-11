import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'AIObserver — Watching machines think.',
  description: 'A field notebook on AI, data science, and the things I\'ve broken — and quietly fixed — in production.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent flash of wrong theme by reading localStorage before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('aio-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        <style>{`
          :root {
            --font-sans: var(--font-geist-sans, "Geist", system-ui, sans-serif);
            --font-mono: var(--font-geist-mono, "Geist Mono", ui-monospace, monospace);
          }
          body { font-family: var(--font-sans); }
          .brand, .nav-links a, .theme-toggle button, .btn, .t-eyebrow,
          .t-mono, .t-tag, .t-button, .t-display { font-family: var(--font-mono); }
          .t-h1, .t-h2, .t-h3, .t-h4, .t-body { font-family: var(--font-sans); }
        `}</style>
      </head>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  )
}

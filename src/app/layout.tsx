import type { Metadata } from 'next'
import { Pixelify_Sans, Playfair_Display } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

/**
 * Font Configuration
 *
 * Pixelify Sans: Pixel art font for gamepad/dialogue box mode
 * Playfair Display: Elegant serif font for footer version badge
 */
const pixelifySans = Pixelify_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pixelify-sans'
})

const playfairDisplay = Playfair_Display({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair'
})

/**
 * Application Metadata
 * Used for SEO and browser tab information
 */
export const metadata: Metadata = {
  title: 'AM Translations Helper',
  description: 'A React TypeScript application for assisting with translation workflows, supporting Excel file uploads and manual text input.',
}

/**
 * Root Layout Component
 * 
 * Provides the base HTML structure for the entire application.
 * Handles:
 * - Font loading and application
 * - Dark mode class management (via Tailwind)
 * - Global styles import
 * 
 * @param children - Child components to render within the layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${pixelifySans.variable} ${playfairDisplay.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const randomBg = 'bg-random-' + (Math.floor(Math.random() * 10) + 1);
              document.body.classList.add(randomBg);
            })();
          `
        }} />
      </head>
      <body className="antialiased" style={{ position: 'relative', zIndex: 0 }}>
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              zIndex: 99999,
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              border: '1px solid var(--toast-border)',
              borderRadius: '3px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: 500,
            },
            className: 'toast-custom'
          }}
        />
      </body>
    </html>
  )
} 
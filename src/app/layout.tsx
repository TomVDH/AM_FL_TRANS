import type { Metadata } from 'next'
import { Pixelify_Sans } from 'next/font/google'
import './globals.css'

/**
 * Font Configuration
 * 
 * Pixelify Sans: Pixel art font for gamepad/dialogue box mode
 */
const pixelifySans = Pixelify_Sans({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pixelify-sans'
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
    <html lang="en" className={pixelifySans.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
} 
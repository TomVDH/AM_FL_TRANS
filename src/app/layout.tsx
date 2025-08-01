import type { Metadata } from 'next'
import { Inter, VT323, Pixelify_Sans } from 'next/font/google'
import './globals.css'

/**
 * Font Configuration
 * 
 * Inter: Main UI font for clean, modern interface
 * VT323: Retro terminal font (kept for backward compatibility)
 * Pixelify_Sans: Pixel art font for gamepad/dialogue box mode
 */
const inter = Inter({ subsets: ['latin'] })
const pixelFont = VT323({ weight: '400', subsets: ['latin'] })
const pixelifySans = Pixelify_Sans({ weight: ['400', '500', '600', '700'], subsets: ['latin'] })

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
    <html lang="en" className="">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
} 
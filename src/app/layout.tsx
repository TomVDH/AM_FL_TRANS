import type { Metadata } from 'next'
import { Inter, VT323, Pixelify_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const pixelFont = VT323({ weight: '400', subsets: ['latin'] })
const pixelifySans = Pixelify_Sans({ weight: ['400', '500', '600', '700'], subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AM Translations Helper',
  description: 'A React TypeScript application for assisting with translation workflows, supporting Excel file uploads and manual text input.',
}

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
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Neon Tetris',
  description: 'A modern Tetris game with neon lights and smooth animations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
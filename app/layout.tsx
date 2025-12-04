import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/lib/context/theme-context"
import { ProjectProvider } from "@/lib/context/project-context"
import { InstallPrompt } from "@/components/pwa/install-prompt"
import { OfflineIndicator } from "@/components/pwa/offline-indicator"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nicole Architect | Field • Studio • Design",
  description: "Suite de herramientas profesionales para arquitectura - Levantamientos, Planos, Moodboards y más",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nicole Architect",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.jpg", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.jpg", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-icon-180.jpg",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1f2e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Nicole Architect" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nicole Architect" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.jpg" />
      </head>
      <body className={`font-sans antialiased`}>
        <ThemeProvider>
          <ProjectProvider>
            <OfflineIndicator />
            {children}
            <InstallPrompt />
          </ProjectProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

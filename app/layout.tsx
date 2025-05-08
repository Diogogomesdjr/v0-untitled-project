import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Matriz de Habilidades",
  description: "Gerencie as habilidades dos colaboradores da sua empresa",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Adicione o script do Recharts para garantir que ele funcione corretamente */}
        <script src="https://unpkg.com/recharts/umd/Recharts.js"></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

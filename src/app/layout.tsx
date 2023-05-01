import { Chat } from "@/components"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Gazali Book Store",
  description: "Gazali book store for all scientific books.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} w-full min-h-screen`}>
        {children}
        <Chat />
      </body>
    </html>
  )
}

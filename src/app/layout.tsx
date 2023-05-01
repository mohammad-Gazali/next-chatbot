import { Chat } from "@/components";
import { Inter } from "next/font/google";
import { Providers } from "@/components";
import { Toaster } from "react-hot-toast"
import "./globals.css"



const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Gazali Book Store",
  description: "Gazali book store for all kinds of books.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Providers>
        <body className={`${inter.className} w-full min-h-screen`}>
          {children}
          <Chat />
          <Toaster />
        </body>
      </Providers>
    </html>
  )
}

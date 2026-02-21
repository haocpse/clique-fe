import type { ReactNode } from 'react'
import { Header, Footer } from '@/components/common'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden luxury-gradient text-white font-display">
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default MainLayout

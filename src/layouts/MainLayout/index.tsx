import type { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="main-layout">
      {/* <Header /> */}
      <main className="main-content">
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  )
}

export default MainLayout

import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import { DashboardStats } from '../types'

export default function Layout({ children, stats }: { children: ReactNode; stats?: DashboardStats }) {
  return (
    <div className="min-h-screen bg-sand-100 flex">
      <Sidebar stats={stats} />
      <div className="flex-1 ml-60 min-w-0">
        {children}
      </div>
    </div>
  )
}

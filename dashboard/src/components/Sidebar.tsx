import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, ShieldAlert, AlarmClock } from 'lucide-react'
import { DashboardStats } from '../types'

export default function Sidebar({ stats }: { stats?: DashboardStats }) {
  const navigate = useNavigate()

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-white border-r border-sand-200 flex flex-col z-40">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-sand-200">
        <Link to="/dashboard" className="flex items-baseline gap-0.5 mb-0.5">
          <span
            className="font-display font-bold leading-none text-ocean-700"
            style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}
          >
            Kasa
          </span>
          <span className="text-[10px] font-bold font-sans ml-0.5 mb-1.5 text-terra-500">
            UG
          </span>
        </Link>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-sans">
          Committee Portal
        </div>
        <div className="text-[10px] text-gray-300 font-sans">
          Anti-Sexual Harassment
        </div>
      </div>

      {/* Alert badges */}
      <div className="px-4 py-4 space-y-2 border-b border-sand-200">
        {(stats?.overdue_count ?? 0) > 0 && (
          <div className="flex items-center gap-2.5 px-3 py-2 bg-red-50 border border-red-100 rounded-xl">
            <AlarmClock className="w-3.5 h-3.5 text-red-500 flex-shrink-0" strokeWidth={1.75} />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-red-700 font-sans">{stats!.overdue_count} overdue</div>
              <div className="text-[10px] text-red-400 font-sans truncate">Past 60-day window</div>
            </div>
          </div>
        )}
        {(stats?.retaliation_flags ?? 0) > 0 && (
          <div className="flex items-center gap-2.5 px-3 py-2 bg-terra-50 border border-terra-100 rounded-xl">
            <ShieldAlert className="w-3.5 h-3.5 text-terra-500 flex-shrink-0" strokeWidth={1.75} />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-terra-700 font-sans">{stats!.retaliation_flags} retaliation</div>
              <div className="text-[10px] text-terra-400 font-sans truncate">Pending review</div>
            </div>
          </div>
        )}
      </div>

      {/* Spacer — nav links go here when implemented */}
      <div className="flex-1" />

      {/* Bottom — notifications + user + logout */}
      <div className="border-t border-sand-200">
        {/* Notification row */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-sand-100">
          <button className="relative flex items-center gap-2 text-gray-400 hover:text-ocean-600 transition-colors">
            <Bell className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-xs font-medium font-sans">Notifications</span>
            <span className="absolute -top-0.5 -left-0.5 w-2 h-2 bg-terra-500 rounded-full" />
          </button>
        </div>

        {/* User chip */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-ocean-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-ocean-700">CM</span>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-gray-700 truncate font-sans">Committee Member</div>
              <div className="text-[10px] text-gray-400 truncate font-sans">UG · ASHC</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="p-1.5 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

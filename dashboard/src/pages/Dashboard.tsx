import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity, AlarmClock, Hourglass, Inbox, Archive,
  Landmark, ShieldAlert, Search, Download, FilePen
} from 'lucide-react'
import Layout from '../components/Layout'
import CaseCard from '../components/CaseCard'
import api from '../lib/api'
import { mapIncident } from '../lib/mapIncident'
import { Case, CaseStatus, DashboardStats } from '../types'

type FilterStatus = CaseStatus | 'all'


function computeStats(cases: Case[]): DashboardStats {
  const closed = ['closed', 'withdrawn'] as CaseStatus[]
  return {
    active_total: cases.filter(c => !closed.includes(c.status)).length,
    overdue_count: cases.filter(c => c.is_overdue).length,
    awaiting_response: cases.filter(c => c.status === 'awaiting_response').length,
    new_submissions: cases.filter(c => c.status === 'submitted').length,
    closed_total: cases.filter(c => closed.includes(c.status)).length,
    appealed_total: cases.filter(c => c.status === 'appealed').length,
    retaliation_flags: cases.filter(c => c.retaliation_flagged).length,
  }
}

const STATUS_FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All Cases' },
  { value: 'submitted', label: 'New' },
  { value: 'awaiting_response', label: 'Awaiting Response' },
  { value: 'under_investigation', label: 'Investigating' },
  { value: 'hearing_scheduled', label: 'Hearing' },
  { value: 'sanctioned', label: 'Sanctioned' },
  { value: 'appealed', label: 'Appealed' },
  { value: 'closed', label: 'Closed' },
]

export default function Dashboard() {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [search, setSearch] = useState('')
  const [showOverdueOnly, setShowOverdueOnly] = useState(false)
  const [cases, setCases] = useState<Case[]>([])
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    api.get('/api/incidents?limit=100')
      .then(res => setCases(res.data.incidents.map(mapIncident)))
      .catch(() => setLoadError('Failed to load cases. Check your connection or sign in again.'))
  }, [])

  const stats = computeStats(cases)

  const filtered = cases.filter((c: Case) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (showOverdueOnly && !c.is_overdue) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        c.case_number.toLowerCase().includes(q) ||
        c.incident_description.toLowerCase().includes(q) ||
        (c.respondent_department ?? '').toLowerCase().includes(q) ||
        (c.respondent_name ?? '').toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <Layout stats={stats}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {loadError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-sans">
            {loadError}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-xl font-bold text-gray-800">Committee Dashboard</h1>
            <p className="text-sm text-gray-400 font-sans mt-0.5">Anti-Sexual Harassment Committee — Case Management</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-ghost text-sm border border-sand-200">
              <Download className="w-4 h-4" strokeWidth={1.75} />
              Export
            </button>
            <Link to="/report" className="btn-primary text-sm">
              <FilePen className="w-4 h-4" strokeWidth={1.75} />
              New Case
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {[
            { label: 'Active Cases',     value: stats.active_total,     Icon: Activity,    color: 'text-ocean-600',  bg: 'bg-ocean-50' },
            { label: 'Overdue',          value: stats.overdue_count,    Icon: AlarmClock,  color: 'text-red-600',    bg: 'bg-red-50',    urgent: true },
            { label: 'Awaiting Response',value: stats.awaiting_response,Icon: Hourglass,   color: 'text-amber-600',  bg: 'bg-amber-50' },
            { label: 'New Submissions',  value: stats.new_submissions,  Icon: Inbox,       color: 'text-blue-600',   bg: 'bg-blue-50' },
            { label: 'Closed',           value: stats.closed_total,     Icon: Archive,     color: 'text-gray-400',   bg: 'bg-gray-50' },
            { label: 'Under Appeal',     value: stats.appealed_total,   Icon: Landmark,    color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Retaliation Flags',value: stats.retaliation_flags,Icon: ShieldAlert, color: 'text-terra-600',  bg: 'bg-terra-50',  urgent: true },
          ].map(s => (
            <div key={s.label} className={`card py-4 flex flex-col gap-2 ${s.urgent ? 'ring-1 ring-red-200' : 'border border-sand-200'}`}>
              <div className={`flex items-center gap-2 text-xs font-semibold ${s.color} font-sans`}>
                <div className={`p-1 rounded-lg ${s.bg}`}>
                  <s.Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                </div>
                {s.label}
              </div>
              <div className={`text-2xl font-bold ${s.color} font-sans`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Alert banners */}
        {stats.overdue_count > 0 && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
            <AlarmClock className="w-5 h-5 text-red-500 flex-shrink-0" strokeWidth={1.75} />
            <div className="flex-1 font-sans text-sm">
              <span className="font-semibold text-red-700">{stats.overdue_count} case{stats.overdue_count > 1 ? 's have' : ' has'} exceeded the 60-working-day investigation window.</span>
              <span className="text-red-500"> Extension approval from the Vice-Chancellor's office is required per §III.iii.g.</span>
            </div>
            <button onClick={() => setShowOverdueOnly(true)} className="text-xs font-semibold text-red-600 hover:text-red-800 whitespace-nowrap font-sans">
              View overdue
            </button>
          </div>
        )}

        {stats.retaliation_flags > 0 && (
          <div className="flex items-center gap-3 p-4 bg-terra-50 border border-terra-200 rounded-xl mb-6">
            <ShieldAlert className="w-5 h-5 text-terra-500 flex-shrink-0" strokeWidth={1.75} />
            <span className="text-sm text-terra-700 font-sans">
              <strong>{stats.retaliation_flags} retaliation report</strong> pending review. Per §III.iii.j, retaliation is treated as new misconduct.
            </span>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" strokeWidth={1.75} />
            <input
              type="text"
              placeholder="Search cases, respondents, departments..."
              className="input pl-9 text-sm font-sans"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors font-sans ${
                  statusFilter === f.value
                    ? 'bg-ocean-500 text-white'
                    : 'bg-white text-gray-500 border border-sand-200 hover:border-ocean-200 hover:text-ocean-600'
                }`}
              >
                {f.label}
              </button>
            ))}

            {showOverdueOnly ? (
              <button
                onClick={() => setShowOverdueOnly(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white font-sans"
              >
                <AlarmClock className="w-3 h-3" />
                Overdue only ✕
              </button>
            ) : (
              <button
                onClick={() => setShowOverdueOnly(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-red-600 border border-red-200 hover:bg-red-50 font-sans"
              >
                <AlarmClock className="w-3 h-3" />
                Overdue only
              </button>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-300 mb-5 font-sans">
          Showing {filtered.length} of {cases.length} cases
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-300">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-40" strokeWidth={1.5} />
            <p className="font-medium font-sans">No cases match your filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(c => (
              <CaseCard key={c.id} caseData={c} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

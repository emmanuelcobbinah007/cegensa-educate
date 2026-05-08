import { Link } from 'react-router-dom'
import { AlertTriangle, Paperclip, Flag, Scale } from 'lucide-react'
import { Case } from '../types'
import StatusBadge from './StatusBadge'
import Timeline60Day from './Timeline60Day'

const MISCONDUCT_LABELS: Record<string, string> = {
  sexual_harassment: 'Sexual Harassment',
  sexual_abuse: 'Sexual Abuse',
  sexual_assault: 'Sexual Assault',
  sexual_exploitation: 'Sexual Exploitation',
  sexual_intimidation: 'Sexual Intimidation',
  quid_pro_quo: 'Quid Pro Quo',
  hostile_environment: 'Hostile Environment',
  retaliation: 'Retaliation',
  other: 'Other Misconduct',
}

interface CaseCardProps {
  caseData: Case
}

export default function CaseCard({ caseData: c }: CaseCardProps) {
  return (
    <Link
      to={`/case/${c.id}`}
      className="card hover:shadow-elevated transition-all duration-200 block group border border-sand-200 hover:border-ocean-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono text-sand-400 tracking-wide">{c.case_number}</span>
            {c.is_anonymous && (
              <span className="badge bg-sand-100 text-sand-400 font-semibold">Anonymous</span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-ocean-600 transition-colors truncate font-sans">
            {MISCONDUCT_LABELS[c.misconduct_type] ?? c.misconduct_type}
          </h3>
          {c.respondent_department && (
            <p className="text-xs text-gray-400 mt-0.5">{c.respondent_department}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <StatusBadge status={c.status} size="sm" />
          {/* Severity dots */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(n => (
              <div
                key={n}
                className={`w-1.5 h-1.5 rounded-full ${
                  n <= c.severity
                    ? c.severity >= 4 ? 'bg-red-500' : c.severity >= 3 ? 'bg-amber-500' : 'bg-ocean-400'
                    : 'bg-sand-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Blurb */}
      <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
        {c.incident_description}
      </p>

      {/* 60-day tracker */}
      {c.formal_investigation_filed_at && c.working_days_elapsed !== undefined && (
        <div className="mb-4">
          <Timeline60Day
            workingDaysElapsed={c.working_days_elapsed}
            investigationDeadline={c.investigation_deadline}
            extendedDeadline={c.extended_deadline}
            extensionGranted={c.extension_granted}
            isOverdue={c.is_overdue}
            compact
          />
        </div>
      )}

      {/* Flags + meta */}
      <div className="flex flex-wrap items-center gap-2">
        {c.response_overdue && (
          <div className="flex items-center gap-1 text-xs text-red-500 font-medium">
            <AlertTriangle className="w-3 h-3" />
            Response overdue
          </div>
        )}
        {c.retaliation_flagged && (
          <div className="flex items-center gap-1 text-xs text-terra-600 font-medium">
            <Flag className="w-3 h-3" />
            Retaliation flagged
          </div>
        )}
        {c.appeal_filed && (
          <div className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
            <Scale className="w-3 h-3" strokeWidth={1.75} />
            Under appeal
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          {c.evidence_files.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-300">
              <Paperclip className="w-3 h-3" />
              {c.evidence_files.length}
            </div>
          )}
          <span className="text-xs text-gray-300">
            {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>
    </Link>
  )
}

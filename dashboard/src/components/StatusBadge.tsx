import { CaseStatus } from '../types'

const STATUS_CONFIG: Record<CaseStatus, { label: string; className: string }> = {
  submitted:           { label: 'New Submission',         className: 'bg-blue-50 text-blue-700' },
  intake_review:       { label: 'Intake Review',          className: 'bg-purple-50 text-purple-700' },
  mediation_offered:   { label: 'Mediation Offered',      className: 'bg-amber-50 text-amber-700' },
  mediation_active:    { label: 'Mediation Active',       className: 'bg-amber-50 text-amber-700' },
  mediation_failed:    { label: 'Mediation Failed',       className: 'bg-orange-50 text-orange-700' },
  respondent_notified: { label: 'Respondent Notified',    className: 'bg-sky-50 text-sky-700' },
  awaiting_response:   { label: 'Awaiting Response',      className: 'bg-yellow-50 text-yellow-700' },
  response_received:   { label: 'Response Received',      className: 'bg-teal-50 text-teal-700' },
  under_investigation: { label: 'Under Investigation',    className: 'bg-ocean-50 text-ocean-700' },
  hearing_scheduled:   { label: 'Hearing Scheduled',      className: 'bg-violet-50 text-violet-700' },
  hearing_complete:    { label: 'Hearing Complete',       className: 'bg-violet-50 text-violet-700' },
  deliberation:        { label: 'In Deliberation',        className: 'bg-fuchsia-50 text-fuchsia-700' },
  decided:             { label: 'Decision Made',          className: 'bg-ocean-100 text-ocean-800' },
  sanctioned:          { label: 'Sanctioned',             className: 'bg-ocean-100 text-ocean-800' },
  appealed:            { label: 'Under Appeal',           className: 'bg-terra-100 text-terra-700' },
  closed:              { label: 'Closed',                 className: 'bg-gray-100 text-gray-500' },
  withdrawn:           { label: 'Withdrawn',              className: 'bg-gray-100 text-gray-400' },
  referred_to_police:  { label: 'Referred to Police',     className: 'bg-red-50 text-red-700' },
}

interface StatusBadgeProps {
  status: CaseStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: 'bg-gray-100 text-gray-500' }
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${sizeClass} ${config.className}`}>
      {config.label}
    </span>
  )
}

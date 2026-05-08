import { AlertTriangle, Clock, CheckCircle } from 'lucide-react'

interface Timeline60DayProps {
  workingDaysElapsed: number
  investigationDeadline?: string
  extendedDeadline?: string
  extensionGranted: boolean
  isOverdue: boolean
  compact?: boolean
}

export default function Timeline60Day({
  workingDaysElapsed,
  investigationDeadline,
  extendedDeadline,
  extensionGranted,
  isOverdue,
  compact = false,
}: Timeline60DayProps) {
  const totalDays = 60
  const effectiveDeadline = extendedDeadline || investigationDeadline
  const pct = Math.min(100, Math.round((workingDaysElapsed / totalDays) * 100))
  const daysRemaining = totalDays - workingDaysElapsed
  const isUrgent = daysRemaining <= 10 && daysRemaining > 0

  const barColor = isOverdue
    ? 'bg-red-500'
    : isUrgent
    ? 'bg-amber-500'
    : pct < 50
    ? 'bg-ocean-400'
    : 'bg-ocean-600'

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {isOverdue
          ? <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
          : <Clock className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" strokeWidth={1.75} />
        }
        <div className="flex-1 h-1.5 bg-sand-200 rounded-full overflow-hidden">
          <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
        </div>
        <span className={`text-xs font-semibold tabular-nums ${isOverdue ? 'text-red-600' : isUrgent ? 'text-amber-600' : 'text-gray-500'}`}>
          {isOverdue ? 'Overdue' : `${daysRemaining}d left`}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOverdue
            ? <AlertTriangle className="w-4 h-4 text-red-500" />
            : workingDaysElapsed >= totalDays
            ? <CheckCircle className="w-4 h-4 text-ocean-500" />
            : <Clock className="w-4 h-4 text-ocean-500" strokeWidth={1.75} />
          }
          <span className="text-sm font-medium text-gray-600">60-Day Investigation Window</span>
          {extensionGranted && (
            <span className="badge bg-amber-50 text-amber-700 font-semibold">Extended</span>
          )}
        </div>
        <span className={`text-sm font-bold tabular-nums ${isOverdue ? 'text-red-600' : isUrgent ? 'text-amber-600' : 'text-ocean-600'}`}>
          {workingDaysElapsed} / {totalDays}
        </span>
      </div>

      <div className="h-2 bg-sand-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-300 font-medium">
        <span>Filed</span>
        {effectiveDeadline && (
          <span className={isOverdue ? 'text-red-500' : 'text-gray-400'}>
            Deadline: {new Date(effectiveDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>

      {isOverdue && (
        <div className="flex items-start gap-2 mt-1 p-3 bg-red-50 rounded-xl">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-px" />
          <p className="text-xs text-red-700 font-medium leading-snug">
            Investigation window exceeded. VC office extension required per §III.iii.g.
          </p>
        </div>
      )}

      {isUrgent && !isOverdue && (
        <div className="flex items-start gap-2 mt-1 p-3 bg-amber-50 rounded-xl">
          <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-px" strokeWidth={1.75} />
          <p className="text-xs text-amber-700 font-medium leading-snug">
            {daysRemaining} working days remaining — expedite proceedings.
          </p>
        </div>
      )}
    </div>
  )
}

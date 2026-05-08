import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, FileText, Download, User, MapPin, Calendar,
  MessageSquare, Paperclip, Scale, Flag, Clock, AlertTriangle,
  CheckCircle, ChevronRight, ShieldCheck,
  FileImage, Music, Film, Activity, UserRound, Microscope,
  FilePen, Eye, Send, BellOff, Search, CalendarClock, ScrollText,
  Landmark, ShieldAlert, CalendarPlus, HeartHandshake, Undo2, LockKeyhole,
  type LucideIcon,
} from 'lucide-react'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import Timeline60Day from '../components/Timeline60Day'
import api from '../lib/api'
import { mapIncident } from '../lib/mapIncident'
import { Case, EvidenceFile, Sanction } from '../types'

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

const EVIDENCE_ICONS: Record<string, LucideIcon> = {
  document:                 FileText,
  image:                    FileImage,
  audio:                    Music,
  video:                    Film,
  electronic_communication: MessageSquare,
  medical_report:           Activity,
  witness_statement:        UserRound,
  dna_result:               Microscope,
  other:                    Paperclip,
}

const SANCTION_LABELS: Record<string, string> = {
  formal_apology:      'Formal Apology',
  written_warning:     'Written Warning',
  leave_without_pay:   'Leave Without Pay',
  denial_of_promotion: 'Denial of Promotion',
  demotion:            'Demotion',
  suspension:          'Suspension',
  transfer:            'Transfer',
  dismissal:           'Dismissal',
  referral_to_police:  'Referral to Police',
  counselling_referral:'Counselling Referral',
}

const EVENT_LABELS: Record<string, { label: string; Icon: LucideIcon; color: string }> = {
  case_submitted:         { label: 'Complaint Filed',             Icon: FilePen,        color: 'text-blue-600' },
  intake_reviewed:        { label: 'Intake Reviewed',             Icon: Eye,            color: 'text-gray-600' },
  respondent_notified:    { label: 'Respondent Notified',         Icon: Send,           color: 'text-sky-600' },
  respondent_responded:   { label: 'Respondent Filed Response',   Icon: FileText,       color: 'text-teal-600' },
  respondent_no_response: { label: 'No Response from Respondent', Icon: BellOff,        color: 'text-red-600' },
  investigation_started:  { label: 'Investigation Commenced',     Icon: Search,         color: 'text-indigo-600' },
  evidence_uploaded:      { label: 'Evidence Uploaded',           Icon: Paperclip,      color: 'text-gray-600' },
  hearing_scheduled:      { label: 'Hearing Scheduled',           Icon: CalendarClock,  color: 'text-violet-600' },
  hearing_conducted:      { label: 'Hearing Conducted',           Icon: Scale,          color: 'text-violet-600' },
  decision_made:          { label: 'Decision Made',               Icon: CheckCircle,    color: 'text-ocean-600' },
  sanctions_recommended:  { label: 'Sanctions Recommended',       Icon: ScrollText,     color: 'text-ocean-600' },
  appeal_filed:           { label: 'Appeal Filed',                Icon: Landmark,       color: 'text-orange-600' },
  retaliation_reported:   { label: 'Retaliation Reported',        Icon: ShieldAlert,    color: 'text-red-600' },
  extension_granted:      { label: 'Timeline Extended',           Icon: CalendarPlus,   color: 'text-amber-600' },
  mediation_accepted:     { label: 'Mediation Accepted',          Icon: HeartHandshake, color: 'text-amber-600' },
  case_withdrawn:         { label: 'Case Withdrawn',              Icon: Undo2,          color: 'text-gray-500' },
  case_closed:            { label: 'Case Closed',                 Icon: LockKeyhole,    color: 'text-gray-600' },
}

const QUICK_ACTIONS: { label: string; Icon: LucideIcon }[] = [
  { label: 'Schedule Hearing',          Icon: CalendarClock },
  { label: 'Add Committee Note',        Icon: FilePen },
  { label: 'Request Extension (VC)',    Icon: CalendarPlus },
  { label: 'Recommend Sanctions',       Icon: Scale },
  { label: 'Log Retaliation Report',    Icon: ShieldAlert },
  { label: 'Refer Counselling (CEGENSA)', Icon: HeartHandshake },
]

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>()
  const [caseData, setCaseData] = useState<Case | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    api.get(`/api/incidents/${id}`)
      .then(res => setCaseData(mapIncident(res.data)))
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-6 py-20 text-center text-gray-400 font-sans text-sm">
          Loading case…
        </div>
      </Layout>
    )
  }

  if (notFound || !caseData) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <p className="text-gray-500 text-lg font-sans">Case not found.</p>
          <Link to="/dashboard" className="btn-primary mt-4 inline-flex">Back to Dashboard</Link>
        </div>
      </Layout>
    )
  }

  const c = caseData

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Back + Header */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-ocean-600 transition-colors mb-6 font-sans">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Case banner */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-mono text-gray-400">{c.case_number}</span>
                {c.is_anonymous && <span className="badge bg-sand-200 text-sand-500 font-semibold">Anonymous</span>}
              </div>
              <h1 className="text-xl font-bold text-gray-800 mb-1 font-sans">
                {MISCONDUCT_LABELS[c.misconduct_type] ?? c.misconduct_type}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={c.status} />
                {c.severity >= 4 && <span className="badge bg-red-50 text-red-700">High Severity</span>}
                {c.retaliation_flagged && <span className="badge bg-orange-50 text-orange-700"><Flag className="w-3 h-3 inline mr-1" />Retaliation Flagged</span>}
                {c.appeal_filed && <span className="badge bg-indigo-50 text-indigo-700"><Scale className="w-3 h-3 inline mr-1" />Under Appeal</span>}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <button className="btn-outline text-sm">
                <MessageSquare className="w-4 h-4" />
                Add Note
              </button>
              <button className="btn-primary text-sm">
                Update Status
              </button>
            </div>
          </div>

          {/* 60-day tracker */}
          {c.formal_investigation_filed_at && c.working_days_elapsed !== undefined && (
            <div className="mt-5 pt-5 border-t border-sand-200">
              <Timeline60Day
                workingDaysElapsed={c.working_days_elapsed}
                investigationDeadline={c.investigation_deadline}
                extendedDeadline={c.extended_deadline}
                extensionGranted={c.extension_granted}
                isOverdue={c.is_overdue}
              />
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Main column */}
          <div className="md:col-span-2 space-y-6">

            {/* Incident Details */}
            <div className="card">
              <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2 font-sans">
                <FileText className="w-4 h-4 text-ocean-500" />
                Incident Details
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="label">Description</div>
                  <p className="text-sm text-gray-700 leading-relaxed bg-sand-50 p-3 rounded-xl font-sans">{c.incident_description}</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {c.incident_location && (
                    <div>
                      <div className="label flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</div>
                      <p className="text-sm text-gray-700 font-sans">{c.incident_location}</p>
                    </div>
                  )}
                  <div>
                    <div className="label flex items-center gap-1"><Calendar className="w-3 h-3" /> Date(s)</div>
                    <p className="text-sm text-gray-700 font-sans">
                      {c.incident_date_from}{c.incident_date_to ? ` → ${c.incident_date_to}` : ''}
                    </p>
                  </div>
                  {c.incident_frequency && (
                    <div>
                      <div className="label">Frequency</div>
                      <p className="text-sm text-gray-700 capitalize font-sans">{c.incident_frequency.replace('_', ' ')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Evidence Vault */}
            <div className="card">
              <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2 font-sans">
                <Paperclip className="w-4 h-4 text-ocean-500" />
                Evidence Vault
                <span className="badge bg-ocean-50 text-ocean-700">{c.evidence_files.length} files</span>
              </h2>

              {c.evidence_files.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6 font-sans">No evidence files uploaded yet.</p>
              ) : (
                <div className="space-y-2">
                  {c.evidence_files.map((f: EvidenceFile) => {
                    const EvidenceIcon = EVIDENCE_ICONS[f.evidence_type] ?? Paperclip
                    return (
                      <div key={f.id} className="flex items-center gap-3 p-3 bg-sand-50 rounded-xl border border-sand-200 group hover:border-ocean-300 transition-colors">
                        <EvidenceIcon className="w-5 h-5 text-ocean-400 flex-shrink-0" strokeWidth={1.75} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-700 truncate font-sans">{f.original_filename}</div>
                          <div className="text-xs text-gray-400 font-sans">
                            {f.evidence_type.replace(/_/g, ' ')} · {(f.file_size_bytes / 1024).toFixed(0)} KB ·{' '}
                            {new Date(f.uploaded_at).toLocaleDateString('en-GB')}
                          </div>
                          {f.description && <div className="text-xs text-gray-500 mt-0.5 font-sans">{f.description}</div>}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-gray-400 font-sans">{f.is_from_complainant ? 'Complainant' : 'Respondent'}</span>
                          <button className="p-1.5 text-gray-400 hover:text-ocean-600 transition-colors">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <button className="btn-ghost text-sm mt-3 w-full justify-center border border-sand-300 border-dashed">
                <Paperclip className="w-4 h-4" />
                Upload Evidence
              </button>
            </div>

            {/* Sanctions (if any) */}
            {c.sanctions.length > 0 && (
              <div className="card">
                <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2 font-sans">
                  <Scale className="w-4 h-4 text-ocean-500" />
                  Recommended Sanctions
                </h2>
                <div className="space-y-3">
                  {c.sanctions.map((s: Sanction) => (
                    <div key={s.id} className="p-3 bg-sand-50 rounded-xl border border-sand-200">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-gray-700 font-sans">{SANCTION_LABELS[s.sanction_type]}</div>
                        {s.approved_by_vc && (
                          <span className="badge bg-ocean-50 text-ocean-700">
                            <CheckCircle className="w-3 h-3 inline mr-1" />VC Approved
                          </span>
                        )}
                      </div>
                      {s.description && <p className="text-xs text-gray-500 font-sans">{s.description}</p>}
                      <div className="text-xs text-gray-400 mt-1 font-sans">
                        Recommended {new Date(s.recommended_at).toLocaleDateString('en-GB')}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-xs text-amber-700 font-sans">
                    Sanctions do not prejudice criminal action in serious cases under the Laws of Ghana (§III.iii.h).
                  </p>
                </div>
              </div>
            )}

            {/* Audit Timeline */}
            <div className="card">
              <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2 font-sans">
                <Clock className="w-4 h-4 text-ocean-500" />
                Case Timeline
              </h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-sand-200" />
                <div className="space-y-4">
                  {[...c.timeline_events].reverse().map((evt, i) => {
                    const config = EVENT_LABELS[evt.event_type] ?? { label: evt.event_type, Icon: Clock, color: 'text-gray-500' }
                    return (
                      <div key={evt.id} className="relative pl-10">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-sand-200 ${i === 0 ? 'border-ocean-300' : ''}`}>
                          <config.Icon className={`w-4 h-4 ${config.color}`} strokeWidth={1.75} />
                        </div>
                        <div className="pb-1">
                          <div className={`text-sm font-medium font-sans ${config.color}`}>{config.label}</div>
                          {evt.description && (
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed font-sans">{evt.description}</p>
                          )}
                          <div className="text-xs text-gray-300 mt-1 font-sans">
                            {new Date(evt.occurred_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Parties */}
            <div className="card">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 font-sans">
                <User className="w-4 h-4 text-ocean-500" />
                Parties
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-sand-50 rounded-xl">
                  <div className="text-xs text-gray-400 mb-1 font-sans">Complainant</div>
                  <div className="text-sm font-medium text-gray-700 font-sans">{c.complainant_name || 'Anonymous'}</div>
                  {c.complainant_affiliation && (
                    <div className="text-xs text-gray-400 mt-0.5 capitalize font-sans">{c.complainant_affiliation.replace(/_/g, ' ')}</div>
                  )}
                </div>
                <div className="p-3 bg-sand-50 rounded-xl">
                  <div className="text-xs text-gray-400 mb-1 font-sans">Respondent</div>
                  <div className="text-sm font-medium text-gray-700 font-sans">{c.respondent_name || 'Not named'}</div>
                  {c.respondent_department && (
                    <div className="text-xs text-gray-400 mt-0.5 font-sans">{c.respondent_department}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Respondent Response Window */}
            <div className="card">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 font-sans">
                <MessageSquare className="w-4 h-4 text-ocean-500" />
                Respondent Response (7-day window)
              </h3>
              {c.respondent_notified_at ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-sans">Notified</span>
                    <span className="text-gray-600 font-sans">{new Date(c.respondent_notified_at).toLocaleDateString('en-GB')}</span>
                  </div>
                  {c.respondent_response_deadline && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-sans">Deadline</span>
                      <span className={`font-sans ${c.response_overdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {new Date(c.respondent_response_deadline).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 mt-2">
                    {c.respondent_responded ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-ocean-500" />
                        <span className="text-xs text-ocean-600 font-medium font-sans">Response received</span>
                      </>
                    ) : c.response_overdue ? (
                      <>
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-xs text-red-600 font-medium font-sans">No response — overdue</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span className="text-xs text-amber-600 font-medium font-sans">Awaiting response</span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-gray-400 mb-3 font-sans">Respondent has not yet been notified.</p>
                  <button className="btn-primary text-xs w-full justify-center">
                    Send Notification
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Policy Reminders */}
            <div className="card bg-ocean-50 border border-ocean-100">
              <h3 className="text-sm font-semibold text-ocean-700 mb-3 flex items-center gap-2 font-sans">
                <ShieldCheck className="w-4 h-4" />
                Policy Reminders
              </h3>
              <div className="space-y-2 text-xs text-ocean-600 font-sans">
                <p>• Investigation must conclude within <strong>60 working days</strong> of formal filing (§III.iii.g)</p>
                <p>• Respondent has <strong>7 days</strong> to file written response (§III.II.f)</p>
                <p>• All proceedings must remain <strong>confidential</strong> (§III.iii.k)</p>
                <p>• Retaliation must be monitored and treated as <strong>new misconduct</strong> (§III.iii.j)</p>
                <p>• Either party may <strong>appeal</strong> to the UG Appeals Board (§III.iii.i)</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 font-sans">Quick Actions</h3>
              <div className="space-y-2">
                {QUICK_ACTIONS.map(action => (
                  <button key={action.label} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-sand-100 transition-colors font-sans">
                    <action.Icon className="w-4 h-4 text-ocean-400 flex-shrink-0" strokeWidth={1.75} />
                    {action.label}
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 ml-auto" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

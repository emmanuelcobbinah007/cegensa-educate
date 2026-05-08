import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ShieldCheck, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import Navbar from '../components/Navbar'
import api from '../lib/api'

const STATUS_INFO: Record<string, { label: string; description: string; color: string; bg: string; Icon: typeof Clock }> = {
  submitted:            { label: 'New Submission',        description: 'Your complaint has been received and is pending intake review by the Committee.',                          color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',   Icon: Clock },
  intake_review:        { label: 'Under Intake Review',   description: 'The Committee is reviewing your complaint to determine the appropriate course of action.',               color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',   Icon: Clock },
  mediation_offered:    { label: 'Mediation Offered',     description: 'The Committee has offered mediation as a resolution pathway. Both parties must consent to proceed.',     color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200', Icon: Clock },
  mediation_active:     { label: 'Mediation in Progress', description: 'Mediation sessions are currently ongoing between the parties.',                                          color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200', Icon: Clock },
  mediation_failed:     { label: 'Mediation Unsuccessful',description: 'Mediation did not reach a resolution. The case will proceed to formal investigation.',                  color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', Icon: AlertTriangle },
  respondent_notified:  { label: 'Respondent Notified',   description: 'The respondent has been formally notified and has 7 working days to file a written response.',          color: 'text-sky-700',    bg: 'bg-sky-50 border-sky-200',     Icon: Clock },
  awaiting_response:    { label: 'Awaiting Response',     description: 'The Committee is awaiting the respondent\'s written response within the 7-day window.',                 color: 'text-sky-700',    bg: 'bg-sky-50 border-sky-200',     Icon: Clock },
  response_received:    { label: 'Response Received',     description: 'The respondent has filed their response. The Committee will now commence formal investigation.',        color: 'text-teal-700',   bg: 'bg-teal-50 border-teal-200',   Icon: Clock },
  under_investigation:  { label: 'Under Investigation',   description: 'A formal investigation is underway. This process takes up to 60 working days per university policy.',   color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', Icon: Clock },
  hearing_scheduled:    { label: 'Hearing Scheduled',     description: 'An adjudication hearing has been scheduled. Both parties will be notified of the date and time.',       color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200', Icon: Clock },
  hearing_complete:     { label: 'Hearing Concluded',     description: 'The hearing has concluded. The Committee is now deliberating.',                                         color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200', Icon: Clock },
  deliberation:         { label: 'In Deliberation',       description: 'The Committee is deliberating on the evidence and will issue a decision.',                              color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', Icon: Clock },
  decided:              { label: 'Decision Reached',      description: 'The Committee has reached a decision. Sanctions will be communicated to the relevant parties.',         color: 'text-ocean-700',  bg: 'bg-ocean-50 border-ocean-200',  Icon: CheckCircle },
  sanctioned:           { label: 'Sanctions Imposed',     description: 'The Committee has recommended sanctions, which are pending approval from the Vice-Chancellor\'s office.',color: 'text-ocean-700',  bg: 'bg-ocean-50 border-ocean-200',  Icon: CheckCircle },
  appealed:             { label: 'Under Appeal',          description: 'A party has filed an appeal to the UG Appeals Board. The decision is under review.',                   color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', Icon: AlertTriangle },
  closed:               { label: 'Case Closed',           description: 'This case has been fully resolved and closed.',                                                         color: 'text-gray-600',   bg: 'bg-gray-50 border-gray-200',    Icon: CheckCircle },
  withdrawn:            { label: 'Case Withdrawn',        description: 'This complaint was withdrawn by the complainant.',                                                       color: 'text-gray-500',   bg: 'bg-gray-50 border-gray-200',    Icon: CheckCircle },
  referred_to_police:   { label: 'Referred to Police',    description: 'This case has been referred to the Ghana Police Service for criminal investigation.',                   color: 'text-red-700',    bg: 'bg-red-50 border-red-200',      Icon: AlertTriangle },
}

interface TrackResult {
  caseNumber: string
  status: string
  misconductType: string
  createdAt: string
  updatedAt: string
}

const MISCONDUCT_LABELS: Record<string, string> = {
  sexual_harassment:  'Sexual Harassment',
  sexual_abuse:       'Sexual Abuse',
  sexual_assault:     'Sexual Assault',
  sexual_exploitation:'Sexual Exploitation',
  sexual_intimidation:'Sexual Intimidation',
  quid_pro_quo:       'Quid Pro Quo',
  hostile_environment:'Hostile Environment',
  retaliation:        'Retaliation',
  other:              'Other Misconduct',
}

export default function TrackCase() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TrackResult | null>(null)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    const caseNumber = input.trim().toUpperCase()
    if (!caseNumber) return
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await api.get(`/api/incidents/track/${caseNumber}`)
      setResult(res.data)
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } }).response?.status
      setError(status === 404 ? 'No case found with that reference number.' : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const statusInfo = result ? (STATUS_INFO[result.status] ?? {
    label: result.status.replace(/_/g, ' '),
    description: 'Status information is being updated.',
    color: 'text-gray-600',
    bg: 'bg-gray-50 border-gray-200',
    Icon: Clock,
  }) : null

  return (
    <div className="min-h-screen bg-sand-100">
      <Navbar role="public" />

      <div className="max-w-xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-ocean-50 rounded-2xl mb-5">
            <Search className="w-7 h-7 text-ocean-500" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-2xl font-bold text-ocean-900 mb-2">Track Your Case</h1>
          <p className="text-sm text-gray-400 font-sans leading-relaxed">
            Enter the reference number you received when you filed your complaint.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleTrack} className="card mb-6">
          <label className="label">Case Reference Number</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="input font-mono flex-1 uppercase tracking-wider"
              placeholder="UG-SH-2026-0001"
              value={input}
              onChange={e => setInput(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`btn-primary px-5 ${(loading || !input.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? '…' : 'Track'}
            </button>
          </div>
          {error && (
            <p className="text-xs text-red-600 mt-3 font-sans">{error}</p>
          )}
        </form>

        {/* Result */}
        {result && statusInfo && (
          <div className="space-y-4">
            {/* Status card */}
            <div className={`rounded-2xl border p-5 ${statusInfo.bg}`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <statusInfo.Icon className={`w-5 h-5 ${statusInfo.color}`} strokeWidth={1.75} />
                </div>
                <div>
                  <div className={`text-sm font-bold mb-1 font-sans ${statusInfo.color}`}>{statusInfo.label}</div>
                  <p className={`text-xs leading-relaxed font-sans ${statusInfo.color} opacity-80`}>
                    {statusInfo.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Details card */}
            <div className="card space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-sans">Case number</span>
                <span className="font-mono font-semibold text-ocean-700">{result.caseNumber}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-sans">Type</span>
                <span className="font-sans text-gray-700">{MISCONDUCT_LABELS[result.misconductType] ?? result.misconductType}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-sans">Filed on</span>
                <span className="font-sans text-gray-700">
                  {new Date(result.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-sans">Last updated</span>
                <span className="font-sans text-gray-700">
                  {new Date(result.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Reassurance */}
            <div className="flex items-start gap-2.5 p-4 bg-ocean-50 border border-ocean-100 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-ocean-500 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
              <p className="text-xs text-ocean-600 font-sans leading-relaxed">
                All proceedings are strictly confidential. You will not face retaliation for filing this complaint (§5.3). Contact the Committee directly if you have concerns about your case.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/" className="text-xs text-gray-400 hover:text-ocean-600 transition-colors font-sans">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

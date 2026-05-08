import { useState, useEffect } from 'react'
import { ShieldCheck, Clock, AlertTriangle, CheckCircle, FileText, ChevronRight, Upload } from 'lucide-react'

// The respondent arrives via a secure tokenised link: /respondent/:token
// In production, the token is validated server-side against respondent_access_tokens table.

interface ResponseFormData {
  denies_all: boolean | null
  response_text: string
  additional_info: string
  has_evidence: boolean
  rights_acknowledged: boolean
}

function useCountdown(deadlineISO: string) {
  const [remaining, setRemaining] = useState({ hours: 0, minutes: 0, expired: false })

  useEffect(() => {
    const tick = () => {
      const diff = new Date(deadlineISO).getTime() - Date.now()
      if (diff <= 0) {
        setRemaining({ hours: 0, minutes: 0, expired: true })
        return
      }
      setRemaining({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        expired: false,
      })
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [deadlineISO])

  return remaining
}

// Simulated case info delivered via the secure token (in prod: fetched from API using the token)
const MOCK_NOTICE = {
  case_number: 'UG-SH-2026-0002',
  notified_at: '2026-04-11T09:00:00Z',
  response_deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now (demo)
  misconduct_category: 'Sexual Harassment',
}

export default function RespondentPortal() {
  const [form, setForm] = useState<ResponseFormData>({
    denies_all: null,
    response_text: '',
    additional_info: '',
    has_evidence: false,
    rights_acknowledged: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const countdown = useCountdown(MOCK_NOTICE.response_deadline)

  const set = (key: keyof ResponseFormData, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const canSubmit =
    form.denies_all !== null &&
    form.response_text.length >= 20 &&
    form.rights_acknowledged

  const handleSubmit = () => {
    if (!canSubmit) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-sand-100 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-ocean-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-ocean-500" />
          </div>
          <h1 className="text-2xl font-bold text-ocean-800 mb-3 font-sans">Response Submitted</h1>
          <p className="text-gray-500 mb-6 leading-relaxed font-sans">
            Your written response has been securely delivered to the Anti-Sexual Harassment Committee. You will be contacted regarding the next steps in the process.
          </p>
          <div className="card border border-sand-200 text-left mb-6">
            <div className="text-xs text-gray-400 mb-1 font-sans">Case Reference</div>
            <div className="text-lg font-mono font-semibold text-ocean-700">{MOCK_NOTICE.case_number}</div>
            <div className="text-xs text-gray-400 mt-2 font-sans">Submitted: {new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</div>
          </div>
          <div className="text-sm text-gray-500 bg-ocean-50 rounded-2xl p-5 text-left space-y-2">
            <div className="font-semibold text-ocean-700 flex items-center gap-2 font-sans">
              <ShieldCheck className="w-4 h-4" />
              Your Rights
            </div>
            <p className="font-sans">• You are presumed innocent until the Committee makes a final finding (§5.4).</p>
            <p className="font-sans">• You have the right to legal representation during all proceedings (§5.5).</p>
            <p className="font-sans">• A hearing will be scheduled where you will have the opportunity to present your case.</p>
            <p className="font-sans">• If unsatisfied with the outcome, you may appeal to the UG Appeals Board (§III.iii.i).</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand-100">
      {/* Simple header — no full nav for respondent portal (confidentiality) */}
      <header className="bg-white border-b border-sand-200 shadow-soft">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center gap-3">
          <div className="flex items-baseline">
            <span className="font-display font-bold text-ocean-700 leading-none" style={{ fontSize: '1.4rem', letterSpacing: '-0.02em' }}>
              Kasa
            </span>
            <span className="text-[10px] font-bold text-terra-500 font-sans ml-0.5 mb-1.5">UG</span>
          </div>
          <div className="h-4 w-px bg-sand-200" />
          <div>
            <div className="text-xs font-semibold text-gray-500 font-sans">Respondent Portal</div>
            <div className="text-[10px] text-gray-300 font-sans">Confidential · Secure Link</div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Notice card */}
        <div className={`flex items-start gap-4 p-5 rounded-2xl border mb-6 ${
          countdown.expired
            ? 'bg-red-50 border-red-200'
            : countdown.hours < 24
            ? 'bg-amber-50 border-amber-200'
            : 'bg-sky-50 border-sky-200'
        }`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            countdown.expired ? 'bg-red-100' : countdown.hours < 24 ? 'bg-amber-100' : 'bg-sky-100'
          }`}>
            {countdown.expired
              ? <AlertTriangle className="w-5 h-5 text-red-600" />
              : <Clock className={`w-5 h-5 ${countdown.hours < 24 ? 'text-amber-600' : 'text-sky-600'}`} strokeWidth={1.75} />
            }
          </div>
          <div>
            <div className={`text-sm font-semibold font-sans ${countdown.expired ? 'text-red-700' : countdown.hours < 24 ? 'text-amber-700' : 'text-sky-700'}`}>
              {countdown.expired
                ? 'Response window has closed'
                : `Response due in ${countdown.hours}h ${countdown.minutes}m`
              }
            </div>
            <div className="text-xs text-gray-500 mt-0.5 font-sans">
              Deadline: {new Date(MOCK_NOTICE.response_deadline).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })} · Per Policy §III.II.f (7 calendar days)
            </div>
          </div>
        </div>

        {/* Notice of complaint */}
        <div className="card mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-1 font-sans">Notice of Complaint</h1>
          <p className="text-sm text-gray-500 mb-5 font-sans">
            A formal complaint of sexual harassment or misconduct has been filed against you under the University of Ghana Sexual Harassment and Misconduct Policy (2017). You are required to file a written response within 7 days of this notice.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 p-4 bg-sand-50 rounded-xl text-sm">
            <div>
              <div className="text-xs text-gray-400 mb-0.5 font-sans">Case Reference</div>
              <div className="font-mono font-semibold text-ocean-700">{MOCK_NOTICE.case_number}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-0.5 font-sans">Category</div>
              <div className="font-medium text-gray-700 font-sans">{MOCK_NOTICE.misconduct_category}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-0.5 font-sans">Notice Issued</div>
              <div className="text-gray-700 font-sans">{new Date(MOCK_NOTICE.notified_at).toLocaleDateString('en-GB', { dateStyle: 'long' })}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-0.5 font-sans">Response Deadline</div>
              <div className="text-gray-700 font-medium font-sans">{new Date(MOCK_NOTICE.response_deadline).toLocaleDateString('en-GB', { dateStyle: 'long' })}</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-ocean-50 border border-ocean-100 rounded-xl space-y-2">
            <div className="text-sm font-semibold text-ocean-700 flex items-center gap-2 font-sans">
              <ShieldCheck className="w-4 h-4" />
              Your Rights as Respondent
            </div>
            <div className="text-xs text-ocean-600 space-y-1 font-sans">
              <p>• You are presumed innocent of the charge unless a finding of culpability is made or you admit to the charge (§5.4).</p>
              <p>• You have the right to representation by legal counsel during all proceedings (§5.5).</p>
              <p>• You are required to cooperate with the investigation — failure may result in disciplinary action (§5.6).</p>
              <p>• The Committee may investigate even if you do not respond (§III.iii.c).</p>
            </div>
          </div>
        </div>

        {/* Response form */}
        {countdown.expired ? (
          <div className="card text-center py-8">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2 font-sans">Response Window Closed</h2>
            <p className="text-sm text-gray-400 font-sans">The 7-day response window has expired. The Adjudication Committee will proceed with the investigation per §III.iii.c. Please contact your legal counsel.</p>
          </div>
        ) : (
          <div className="card space-y-5">
            <h2 className="text-base font-semibold text-gray-700 font-sans">Your Written Response</h2>

            {/* Deny or admit */}
            <div>
              <label className="label">In response to these allegations, I: <span className="text-red-500">*</span></label>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { value: true,  label: 'Deny the allegations',     sub: 'I dispute the claims made in this complaint.',   color: 'border-ocean-400 bg-ocean-50' },
                  { value: false, label: 'Acknowledge some conduct', sub: 'I acknowledge that some conduct occurred.',       color: 'border-amber-400 bg-amber-50' },
                ].map(opt => (
                  <label
                    key={String(opt.value)}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      form.denies_all === opt.value ? opt.color : 'border-sand-200 bg-sand-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="denies_all"
                      checked={form.denies_all === opt.value}
                      onChange={() => set('denies_all', opt.value)}
                      className="mt-0.5 accent-ocean-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-700 font-sans">{opt.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5 font-sans">{opt.sub}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Main response */}
            <div>
              <label className="label">
                Written Statement <span className="text-red-500">*</span>
              </label>
              <textarea
                className="textarea"
                rows={8}
                placeholder="Please provide your full written response to the allegations. Include relevant context, dates, and any information that you believe is important for the Committee to consider. Your statement will be taken and considered carefully."
                value={form.response_text}
                onChange={e => set('response_text', e.target.value)}
              />
              <div className="text-xs text-gray-400 mt-1 font-sans">{form.response_text.length} characters (minimum 20)</div>
            </div>

            {/* Additional info */}
            <div>
              <label className="label">Witnesses or Additional Information (optional)</label>
              <textarea
                className="textarea"
                rows={3}
                placeholder="If you have witnesses who can corroborate your account, or any additional context, please include it here."
                value={form.additional_info}
                onChange={e => set('additional_info', e.target.value)}
              />
            </div>

            {/* Evidence */}
            <div>
              <label className="label">Supporting Evidence (optional)</label>
              <div className="border-2 border-dashed border-sand-300 rounded-xl p-6 text-center cursor-pointer hover:border-ocean-300 hover:bg-ocean-50/30 transition-colors">
                <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2" strokeWidth={1.75} />
                <p className="text-sm text-gray-400 font-sans">Upload supporting documents, communications, or other evidence</p>
                <p className="text-xs text-gray-300 mt-1 font-sans">PDF, JPG, PNG, MP3, MP4, DOCX · Max 25 MB per file</p>
              </div>
            </div>

            {/* Acknowledgement */}
            <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
              form.rights_acknowledged ? 'border-ocean-400 bg-ocean-50' : 'border-sand-200 bg-sand-50'
            }`}>
              <input
                type="checkbox"
                checked={form.rights_acknowledged}
                onChange={e => set('rights_acknowledged', e.target.checked)}
                className="mt-0.5 accent-ocean-500"
              />
              <span className="text-sm text-gray-700 font-sans">
                I confirm that this is my written response to the complaint filed under Case {MOCK_NOTICE.case_number}. I understand that my response will be shared with the Anti-Sexual Harassment Committee and that all proceedings are confidential. I acknowledge my right to legal representation (§5.5) and my obligation to cooperate with the investigation (§5.6).
              </span>
            </label>

            {/* Submit */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-sans">
                <FileText className="w-3.5 h-3.5" />
                Response is end-to-end encrypted
              </div>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`btn-primary ${!canSubmit ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Submit Response
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-300 font-sans">
          University of Ghana · Anti-Sexual Harassment Committee · Strictly Confidential
        </div>
      </div>
    </div>
  )
}

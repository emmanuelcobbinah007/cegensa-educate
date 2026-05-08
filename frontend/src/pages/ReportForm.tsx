import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight, ChevronLeft, Upload, X, CheckCircle,
  ShieldCheck, AlertTriangle, FileText
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { ReportFormData, MisconductType } from '../types'
import api from '../lib/api'

const STEPS = ['Incident Type', 'What Happened', 'People Involved', 'Evidence', 'Rights & Submit']

const MISCONDUCT_OPTIONS: { value: MisconductType; label: string; desc: string }[] = [
  { value: 'sexual_harassment', label: 'Sexual Harassment', desc: 'Unwelcome advances, comments, or requests conditioning academic/employment decisions on sexual compliance.' },
  { value: 'quid_pro_quo', label: 'Quid Pro Quo', desc: 'Grades, promotions, or opportunities offered in exchange for sexual favours.' },
  { value: 'sexual_assault', label: 'Sexual Assault', desc: 'Unwanted sexual contact or intercourse without consent.' },
  { value: 'sexual_abuse', label: 'Sexual Abuse', desc: 'Forceful or degrading sexual contact that violates sexual integrity.' },
  { value: 'sexual_intimidation', label: 'Sexual Intimidation', desc: 'Threats, indecent exposure, or stalking causing fear.' },
  { value: 'sexual_exploitation', label: 'Sexual Exploitation', desc: 'Taking sexual advantage of another without consent, including non-consensual recording.' },
  { value: 'hostile_environment', label: 'Hostile Environment', desc: 'Pervasive behaviour creating an intimidating or offensive educational or work environment.' },
  { value: 'retaliation', label: 'Retaliation', desc: 'Threats or adverse actions against someone who filed or assisted with a complaint.' },
  { value: 'other', label: 'Other Misconduct', desc: 'Other sexual misconduct not listed above.' },
]

const INITIAL_FORM: ReportFormData = {
  step: 1,
  misconduct_type: '',
  severity: 3,
  incident_description: '',
  incident_location: '',
  incident_date_from: '',
  incident_date_to: '',
  incident_frequency: 'single_incident',
  is_anonymous: true,
  complainant_name: '',
  complainant_email: '',
  complainant_affiliation: '',
  respondent_name: '',
  respondent_department: '',
  respondent_affiliation: '',
  has_witnesses: false,
  witness_names: '',
  mediation_requested: false,
  evidence_files: [],
  rights_acknowledged: false,
  confidentiality_acknowledged: false,
}

export default function ReportForm() {
  const [form, setForm] = useState<ReportFormData>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [caseNumber, setCaseNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const set = (key: keyof ReportFormData, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const next = () => setForm(prev => ({ ...prev, step: Math.min(5, prev.step + 1) }))
  const back = () => setForm(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }))

  const handleFileAdd = (files: FileList | null) => {
    if (!files) return
    set('evidence_files', [...form.evidence_files, ...Array.from(files)])
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await api.post('/api/incidents', {
        misconductType: form.misconduct_type,
        severity: form.severity,
        incidentDescription: form.incident_description,
        incidentLocation: form.incident_location || undefined,
        incidentDateFrom: form.incident_date_from || undefined,
        incidentDateTo: form.incident_date_to || undefined,
        incidentFrequency: form.incident_frequency,
        isAnonymous: form.is_anonymous,
        complainantName: form.is_anonymous ? undefined : form.complainant_name,
        complainantEmail: form.is_anonymous ? undefined : form.complainant_email,
        complainantAffiliation: form.complainant_affiliation || undefined,
        respondentName: form.respondent_name || undefined,
        respondentDepartment: form.respondent_department || undefined,
        respondentAffiliation: form.respondent_affiliation || undefined,
        hasWitnesses: form.has_witnesses,
        witnessNames: form.witness_names || undefined,
        mediationRequested: form.mediation_requested,
        rightsAcknowledged: form.rights_acknowledged,
        confidentialityAcknowledged: form.confidentiality_acknowledged,
      })
      setCaseNumber(res.data.caseNumber)
      setSubmitted(true)
    } catch {
      setSubmitError('Failed to submit your report. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const canProceed = () => {
    if (form.step === 1) return form.misconduct_type !== ''
    if (form.step === 2) return form.incident_description.length > 30 && form.incident_date_from !== ''
    if (form.step === 3) return form.is_anonymous || (form.complainant_name !== '' && form.complainant_email !== '')
    if (form.step === 5) return form.rights_acknowledged && form.confidentiality_acknowledged
    return true
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-sand-100">
        <Navbar role="public" />
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <div className="w-20 h-20 bg-ocean-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-ocean-500" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-2xl font-bold text-ocean-800 mb-3">Report Submitted</h1>
          <p className="text-gray-400 mb-8 leading-relaxed font-sans text-sm">
            Your complaint has been received by the Anti-Sexual Harassment Committee. All proceedings are strictly confidential.
          </p>
          <div className="card border border-sand-200 text-left mb-8">
            <div className="text-xs text-gray-400 mb-1 font-sans font-semibold uppercase tracking-wider">Case Reference Number</div>
            <div className="text-xl font-mono font-bold text-ocean-700">{caseNumber}</div>
            <p className="text-xs text-gray-400 mt-2 font-sans">Save this number to track your case. The Committee will contact you within 5 working days.</p>
          </div>
          <div className="space-y-2.5 text-sm text-gray-500 bg-ocean-50 rounded-2xl p-5 text-left mb-8 font-sans">
            <div className="font-semibold text-ocean-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" strokeWidth={1.75} /> What Happens Next
            </div>
            <p>• The Committee will review your complaint within 5 working days.</p>
            <p>• The respondent will be notified and given 7 days to file a written response.</p>
            <p>• A formal investigation will be completed within 60 working days.</p>
            <p>• You will not face any retaliation for filing this complaint.</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="btn-outline text-sm">Back to Home</Link>
            <Link to="/track" className="btn-primary text-sm">Track Your Case</Link>
          </div>
          <div className="text-center mt-3">
            <button onClick={() => { setSubmitted(false); setForm(INITIAL_FORM) }} className="text-xs text-gray-400 hover:text-ocean-600 transition-colors font-sans">
              Submit another report
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand-100">
      <Navbar role="public" />

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Confidentiality notice */}
        <div className="flex items-center gap-2.5 px-4 py-3 bg-ocean-50 border border-ocean-200 rounded-xl mb-6 text-sm text-ocean-700 font-sans">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
          <span>This report is strictly confidential. Only authorised Committee members have access.</span>
        </div>

        {/* Progress steps */}
        <div className="flex items-center mb-8 overflow-x-auto pb-2">
          {STEPS.map((label, idx) => {
            const n = idx + 1
            const done = form.step > n
            const active = form.step === n
            return (
              <div key={n} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 font-sans transition-colors
                    ${done ? 'bg-ocean-500 text-white' : active ? 'bg-ocean-500 text-white ring-4 ring-ocean-100' : 'bg-sand-200 text-gray-400'}`}>
                    {done ? '✓' : n}
                  </div>
                  <span className={`text-xs mt-1 text-center leading-tight hidden sm:block font-sans ${active ? 'text-ocean-600 font-semibold' : 'text-gray-300'}`}>
                    {label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 rounded-full ${done ? 'bg-ocean-400' : 'bg-sand-200'}`} />
                )}
              </div>
            )
          })}
        </div>

        <div className="card">
          {/* Step 1: Incident Type */}
          {form.step === 1 && (
            <div>
              <h2 className="section-title">What type of incident occurred?</h2>
              <p className="section-subtitle">Select the category that best describes what happened.</p>
              <div className="space-y-2">
                {MISCONDUCT_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all font-sans ${
                      form.misconduct_type === opt.value
                        ? 'border-ocean-400 bg-ocean-50'
                        : 'border-sand-200 hover:border-sand-300 bg-sand-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="misconduct_type"
                      value={opt.value}
                      checked={form.misconduct_type === opt.value}
                      onChange={() => set('misconduct_type', opt.value)}
                      className="mt-0.5 accent-ocean-500"
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-700">{opt.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              {(form.misconduct_type === 'sexual_assault' || form.misconduct_type === 'sexual_abuse') && (
                <div className="mt-4 flex items-start gap-2.5 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-sans leading-relaxed">
                    For severe incidents including sexual assault, the Committee advises reporting to the Ghana Police Service (191) in addition to this complaint. Medical evidence should be preserved.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: What Happened */}
          {form.step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Describe what happened</h2>
                <p className="section-subtitle">Include dates, locations, and what was said or done. More detail helps the investigation.</p>
              </div>
              <div>
                <label className="label">Description of incident <span className="text-red-400">*</span></label>
                <textarea
                  className="textarea font-sans"
                  rows={6}
                  placeholder="Describe the incident(s) in detail — what was said or done, and how it made you feel."
                  value={form.incident_description}
                  onChange={e => set('incident_description', e.target.value)}
                />
                <div className="text-xs text-gray-300 mt-1 font-sans">{form.incident_description.length} characters (minimum 30)</div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Date of incident <span className="text-red-400">*</span></label>
                  <input type="date" className="input font-sans" value={form.incident_date_from} onChange={e => set('incident_date_from', e.target.value)} max={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="label">End date (if ongoing)</label>
                  <input type="date" className="input font-sans" value={form.incident_date_to} onChange={e => set('incident_date_to', e.target.value)} max={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div>
                <label className="label">Location</label>
                <input type="text" className="input font-sans" placeholder="e.g. Lecture Hall 2, Legon Campus; WhatsApp" value={form.incident_location} onChange={e => set('incident_location', e.target.value)} />
              </div>
              <div>
                <label className="label">How often did this occur?</label>
                <select className="select font-sans" value={form.incident_frequency} onChange={e => set('incident_frequency', e.target.value)}>
                  <option value="single_incident">Single incident</option>
                  <option value="repeated">Repeated (multiple times)</option>
                  <option value="ongoing">Ongoing / still happening</option>
                </select>
              </div>
              <div>
                <label className="label">Severity</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={1} max={5} value={form.severity} onChange={e => set('severity', Number(e.target.value))} className="flex-1 accent-ocean-500" />
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => (
                      <div key={n} className={`w-2.5 h-2.5 rounded-full ${n <= form.severity ? n >= 4 ? 'bg-red-500' : n >= 3 ? 'bg-amber-500' : 'bg-ocean-400' : 'bg-sand-200'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 font-sans w-16">
                    {['', 'Low', 'Moderate', 'Serious', 'Severe', 'Critical'][form.severity]}
                  </span>
                </div>
              </div>
              <div>
                <label className="label">Are there witnesses?</label>
                <div className="flex gap-4">
                  {[{v: true, l: 'Yes'}, {v: false, l: 'No'}].map(o => (
                    <label key={String(o.v)} className="flex items-center gap-2 cursor-pointer font-sans text-sm">
                      <input type="radio" name="witnesses" checked={form.has_witnesses === o.v} onChange={() => set('has_witnesses', o.v)} className="accent-ocean-500" />
                      {o.l}
                    </label>
                  ))}
                </div>
                {form.has_witnesses && (
                  <textarea className="textarea mt-3 font-sans" rows={2} placeholder="Names of witnesses (optional)" value={form.witness_names} onChange={e => set('witness_names', e.target.value)} />
                )}
              </div>
            </div>
          )}

          {/* Step 3: People Involved */}
          {form.step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">People involved</h2>
                <p className="section-subtitle">Your details are optional — you may report anonymously.</p>
              </div>

              <div className="p-5 bg-sand-50 rounded-xl border border-sand-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 font-sans">Your Details (Complainant)</h3>
                  <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-gray-500">
                    <input type="checkbox" checked={form.is_anonymous} onChange={e => set('is_anonymous', e.target.checked)} className="accent-ocean-500" />
                    Remain anonymous
                  </label>
                </div>
                {!form.is_anonymous ? (
                  <div className="space-y-3">
                    <div>
                      <label className="label">Full Name <span className="text-red-400">*</span></label>
                      <input type="text" className="input font-sans" placeholder="Your full name" value={form.complainant_name} onChange={e => set('complainant_name', e.target.value)} />
                    </div>
                    <div>
                      <label className="label">UG Email Address <span className="text-red-400">*</span></label>
                      <input type="email" className="input font-sans" placeholder="you@ug.edu.gh" value={form.complainant_email} onChange={e => set('complainant_email', e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Affiliation</label>
                      <select className="select font-sans" value={form.complainant_affiliation} onChange={e => set('complainant_affiliation', e.target.value)}>
                        <option value="">Select...</option>
                        <option value="undergraduate_student">Undergraduate Student</option>
                        <option value="graduate_student">Graduate Student</option>
                        <option value="academic_staff">Academic Staff</option>
                        <option value="administrative_staff">Administrative Staff</option>
                        <option value="contract_worker">Contract Worker</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">Your identity will not be recorded. The Committee will investigate based on the details you provide.</p>
                )}
              </div>

              <div className="p-5 bg-sand-50 rounded-xl border border-sand-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-4 font-sans">About the Respondent</h3>
                <div className="space-y-3">
                  <div>
                    <label className="label">Name (if known)</label>
                    <input type="text" className="input font-sans" placeholder="Respondent's full name" value={form.respondent_name} onChange={e => set('respondent_name', e.target.value)} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="label">Department / Unit</label>
                      <input type="text" className="input font-sans" placeholder="e.g. Dept. of Economics" value={form.respondent_department} onChange={e => set('respondent_department', e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Role / Affiliation</label>
                      <input type="text" className="input font-sans" placeholder="e.g. Lecturer, TA, Staff" value={form.respondent_affiliation} onChange={e => set('respondent_affiliation', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-amber-50 rounded-xl border border-amber-200">
                <h3 className="text-sm font-semibold text-amber-800 mb-2 font-sans">Informal Resolution (Optional)</h3>
                <p className="text-xs text-amber-600 mb-3 font-sans leading-relaxed">
                  Per §III.I.c, you may request mediation. A mutually agreed mediator will facilitate discussion — not suitable for severe cases (e.g. assault).
                </p>
                <label className="flex items-center gap-2 cursor-pointer font-sans text-sm text-amber-700">
                  <input type="checkbox" checked={form.mediation_requested} onChange={e => set('mediation_requested', e.target.checked)} className="accent-amber-600" />
                  I would like to explore mediation first
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Evidence */}
          {form.step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Evidence Vault</h2>
                <p className="section-subtitle">Upload supporting evidence. All files are encrypted and accessible only to authorised Committee members.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-xs text-gray-400 font-sans mb-1">
                {['Screenshots (WhatsApp, emails, SMS)', 'Audio or video recordings', 'Written notes or letters', 'Medical reports', 'Witness statements', 'Any other documents'].map(t => (
                  <div key={t} className="flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-ocean-300" />
                    {t}
                  </div>
                ))}
              </div>
              <div
                className="border-2 border-dashed border-sand-300 rounded-2xl p-10 text-center cursor-pointer hover:border-ocean-300 hover:bg-ocean-50/40 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); handleFileAdd(e.dataTransfer.files) }}
              >
                <Upload className="w-8 h-8 text-sand-300 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-sm text-gray-400 mb-1 font-sans">Drag and drop files here, or click to browse</p>
                <p className="text-xs text-gray-300 font-sans">JPG, PNG, PDF, MP3, MP4, DOC · Max 25 MB per file</p>
                <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.mp3,.mp4,.wav" className="hidden" onChange={e => handleFileAdd(e.target.files)} />
              </div>
              {form.evidence_files.length > 0 && (
                <div className="space-y-2">
                  {form.evidence_files.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-sand-50 rounded-xl border border-sand-200">
                      <FileText className="w-4 h-4 text-ocean-300 flex-shrink-0" strokeWidth={1.75} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-600 truncate font-sans">{file.name}</div>
                        <div className="text-xs text-gray-300 font-sans">{(file.size / 1024).toFixed(0)} KB</div>
                      </div>
                      <button onClick={() => set('evidence_files', form.evidence_files.filter((_, j) => j !== i))} className="p-1 text-gray-300 hover:text-red-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-300 font-sans">Evidence is optional. Files are encrypted and checksummed for integrity.</p>
            </div>
          )}

          {/* Step 5: Rights & Submit */}
          {form.step === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Your Rights & Submission</h2>
                <p className="section-subtitle">Please read and acknowledge the following before submitting.</p>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'rights_acknowledged' as const, text: 'I understand that I have the right not to be retaliated against for filing this complaint in good faith. Any retaliation will itself be treated as new misconduct (§5.3, §III.iii.j).' },
                  { key: 'confidentiality_acknowledged' as const, text: 'I understand that all proceedings are strictly confidential. Information will only be shared with authorised Anti-Sexual Harassment Committee members.' },
                ].map(item => (
                  <label key={item.key} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all font-sans text-sm text-gray-600 ${form[item.key] ? 'border-ocean-400 bg-ocean-50' : 'border-sand-200 bg-sand-50'}`}>
                    <input type="checkbox" checked={form[item.key]} onChange={e => set(item.key, e.target.checked)} className="mt-0.5 accent-ocean-500 flex-shrink-0" />
                    <span>{item.text}</span>
                  </label>
                ))}
              </div>
              <div className="p-4 bg-ocean-50 rounded-xl border border-ocean-200 space-y-2 text-xs font-sans text-gray-600">
                <div className="font-semibold text-ocean-700">Summary</div>
                <p><span className="font-medium">Type:</span> {MISCONDUCT_OPTIONS.find(o => o.value === form.misconduct_type)?.label ?? '—'}</p>
                <p><span className="font-medium">Date:</span> {form.incident_date_from || '—'}</p>
                <p><span className="font-medium">Location:</span> {form.incident_location || '—'}</p>
                <p><span className="font-medium">Filing as:</span> {form.is_anonymous ? 'Anonymous' : form.complainant_name}</p>
                <p><span className="font-medium">Evidence files:</span> {form.evidence_files.length}</p>
                <p><span className="font-medium">Mediation requested:</span> {form.mediation_requested ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-600 font-sans leading-relaxed">
                  <strong>Note:</strong> Deliberately malicious complaints are subject to formal disciplinary action (§5.7). Please ensure this report is made in good faith.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-sand-200">
            <button onClick={form.step === 1 ? () => navigate('/') : back} className="btn-ghost text-sm">
              <ChevronLeft className="w-4 h-4" />
              {form.step === 1 ? 'Cancel' : 'Back'}
            </button>
            <div className="text-xs text-gray-300 font-sans">Step {form.step} of {STEPS.length}</div>
            {form.step < 5 ? (
              <button onClick={next} disabled={!canProceed()} className={`btn-primary text-sm ${!canProceed() ? 'opacity-40 cursor-not-allowed' : ''}`}>
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!canProceed() || submitting} className={`btn-secondary text-sm ${(!canProceed() || submitting) ? 'opacity-40 cursor-not-allowed' : ''}`}>
                {submitting ? 'Submitting…' : 'Submit Report'} <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
          {submitError && (
            <p className="text-xs text-red-600 font-sans mt-3 text-center">{submitError}</p>
          )}
        </div>
      </div>
    </div>
  )
}

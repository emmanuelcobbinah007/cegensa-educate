export type UserRole =
  | 'complainant'
  | 'respondent'
  | 'committee_member'
  | 'adjudication_member'
  | 'cegensa_staff'
  | 'admin'
  | 'vc_office'

export type CaseStatus =
  | 'submitted'
  | 'intake_review'
  | 'mediation_offered'
  | 'mediation_active'
  | 'mediation_failed'
  | 'respondent_notified'
  | 'awaiting_response'
  | 'response_received'
  | 'under_investigation'
  | 'hearing_scheduled'
  | 'hearing_complete'
  | 'deliberation'
  | 'decided'
  | 'sanctioned'
  | 'appealed'
  | 'closed'
  | 'withdrawn'
  | 'referred_to_police'

export type MisconductType =
  | 'sexual_harassment'
  | 'sexual_abuse'
  | 'sexual_assault'
  | 'sexual_exploitation'
  | 'sexual_intimidation'
  | 'quid_pro_quo'
  | 'hostile_environment'
  | 'retaliation'
  | 'other'

export type EvidenceType =
  | 'document'
  | 'image'
  | 'audio'
  | 'video'
  | 'electronic_communication'
  | 'medical_report'
  | 'witness_statement'
  | 'dna_result'
  | 'other'

export type SanctionType =
  | 'formal_apology'
  | 'written_warning'
  | 'leave_without_pay'
  | 'denial_of_promotion'
  | 'demotion'
  | 'suspension'
  | 'transfer'
  | 'dismissal'
  | 'referral_to_police'
  | 'counselling_referral'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  department?: string
}

export interface EvidenceFile {
  id: string
  case_id: string
  evidence_type: EvidenceType
  original_filename: string
  file_size_bytes: number
  mime_type: string
  description?: string
  is_from_complainant: boolean
  uploaded_at: string
}

export interface TimelineEvent {
  id: string
  case_id: string
  event_type: string
  actor_name?: string
  description?: string
  occurred_at: string
}

export interface Sanction {
  id: string
  sanction_type: SanctionType
  description?: string
  recommended_at: string
  approved_by_vc?: boolean
  implemented_at?: string
}

export interface Case {
  id: string
  case_number: string
  status: CaseStatus
  misconduct_type: MisconductType
  severity: 1 | 2 | 3 | 4 | 5

  complainant_name?: string
  complainant_affiliation?: string
  is_anonymous: boolean

  respondent_name?: string
  respondent_department?: string

  incident_description: string
  incident_location?: string
  incident_date_from?: string
  incident_date_to?: string
  incident_frequency?: 'single_incident' | 'repeated' | 'ongoing'

  formal_investigation_filed_at?: string
  investigation_deadline?: string
  working_days_elapsed?: number
  is_overdue: boolean
  extension_granted: boolean
  extended_deadline?: string

  respondent_notified_at?: string
  respondent_response_deadline?: string
  respondent_responded: boolean
  response_overdue: boolean

  mediation_requested: boolean
  mediation_consented_both?: boolean

  appeal_filed: boolean
  retaliation_flagged: boolean

  evidence_files: EvidenceFile[]
  timeline_events: TimelineEvent[]
  sanctions: Sanction[]

  created_at: string
  updated_at: string
}

export interface DashboardStats {
  active_total: number
  overdue_count: number
  awaiting_response: number
  new_submissions: number
  closed_total: number
  appealed_total: number
  retaliation_flags: number
}

export interface ReportFormData {
  step: number
  misconduct_type: MisconductType | ''
  severity: number
  incident_description: string
  incident_location: string
  incident_date_from: string
  incident_date_to: string
  incident_frequency: string
  is_anonymous: boolean
  complainant_name: string
  complainant_email: string
  complainant_affiliation: string
  respondent_name: string
  respondent_department: string
  respondent_affiliation: string
  has_witnesses: boolean
  witness_names: string
  mediation_requested: boolean
  evidence_files: File[]
  rights_acknowledged: boolean
  confidentiality_acknowledged: boolean
}

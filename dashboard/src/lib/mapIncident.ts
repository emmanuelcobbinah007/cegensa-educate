import { Case, CaseStatus, MisconductType } from '../types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapIncident(i: any): Case {
  return {
    id: i.id,
    case_number: i.caseNumber,
    status: i.status as CaseStatus,
    misconduct_type: i.misconductType as MisconductType,
    severity: i.severity as 1 | 2 | 3 | 4 | 5,
    is_anonymous: i.isAnonymous,
    complainant_name: i.complainantName ?? undefined,
    complainant_affiliation: i.complainantAffiliation ?? undefined,
    respondent_name: i.respondentName ?? undefined,
    respondent_department: i.respondentDepartment ?? undefined,
    incident_description: i.incidentDescription,
    incident_location: i.incidentLocation ?? undefined,
    incident_date_from: i.incidentDateFrom ?? undefined,
    incident_date_to: i.incidentDateTo ?? undefined,
    incident_frequency: i.incidentFrequency ?? undefined,
    mediation_requested: i.mediationRequested,
    is_overdue: false,
    extension_granted: false,
    respondent_responded: false,
    response_overdue: false,
    appeal_filed: i.status === 'appealed',
    retaliation_flagged: false,
    evidence_files: [],
    timeline_events: [],
    sanctions: [],
    created_at: i.createdAt,
    updated_at: i.updatedAt,
  }
}

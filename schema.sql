-- ============================================================
-- University of Ghana — Sexual Harassment CMS
-- PostgreSQL Database Schema
-- Policy Reference: UG Sexual Harassment and Misconduct Policy (2017)
-- ============================================================
-- SECURITY NOTE: Columns marked [ENCRYPT] must be encrypted at
-- rest using pgcrypto or application-level AES-256 before storage.
-- Enable pgcrypto: CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- ENUMS
-- ──────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM (
  'complainant',
  'respondent',
  'committee_member',
  'adjudication_member',
  'cegensa_staff',
  'admin',
  'vc_office'        -- Vice-Chancellor's office: receives final reports
);

CREATE TYPE case_status AS ENUM (
  'submitted',                -- Complaint just filed
  'intake_review',            -- Committee reviewing admissibility
  'mediation_offered',        -- Informal resolution offered (Annex III §I.c)
  'mediation_active',         -- Mediation in progress
  'mediation_failed',         -- Mediation unsuccessful → formal
  'respondent_notified',      -- Respondent informed, 7-day clock started
  'awaiting_response',        -- Within 7-day respondent window
  'response_received',        -- Respondent filed statement
  'under_investigation',      -- Formal investigation active
  'hearing_scheduled',        -- Adjudication hearing date set
  'hearing_complete',         -- Hearing concluded
  'deliberation',             -- Adjudication Committee deciding
  'decided',                  -- Decision made
  'sanctioned',               -- Sanctions recommended
  'appealed',                 -- Appeal filed to UG Appeals Board (§III.i)
  'closed',                   -- Case fully resolved
  'withdrawn',                -- Complainant withdrew (§III.iii.b)
  'referred_to_police'        -- Severe case referred to Police (§III.I.d)
);

CREATE TYPE misconduct_type AS ENUM (
  'sexual_harassment',
  'sexual_abuse',
  'sexual_assault',
  'sexual_exploitation',
  'sexual_intimidation',
  'quid_pro_quo',
  'hostile_environment',
  'retaliation',
  'other'
);

CREATE TYPE incident_frequency AS ENUM (
  'single_incident',
  'repeated',
  'ongoing'
);

CREATE TYPE complainant_affiliation AS ENUM (
  'undergraduate_student',
  'graduate_student',
  'academic_staff',
  'administrative_staff',
  'contract_worker',
  'other'
);

CREATE TYPE sanction_type AS ENUM (
  'formal_apology',
  'written_warning',
  'leave_without_pay',
  'denial_of_promotion',
  'demotion',
  'suspension',
  'transfer',
  'dismissal',
  'referral_to_police',
  'counselling_referral'
);

CREATE TYPE evidence_type AS ENUM (
  'document',
  'image',
  'audio',
  'video',
  'electronic_communication',  -- emails, WhatsApp, texts
  'medical_report',
  'witness_statement',
  'dna_result',
  'other'
);

CREATE TYPE notification_channel AS ENUM (
  'in_app',
  'email',
  'sms'
);

CREATE TYPE event_type AS ENUM (
  'case_submitted',
  'intake_reviewed',
  'mediation_offered',
  'mediation_accepted',
  'mediation_rejected',
  'mediation_outcome',
  'respondent_notified',
  'respondent_responded',
  'respondent_no_response',
  'investigation_started',
  'evidence_uploaded',
  'witness_added',
  'hearing_scheduled',
  'hearing_conducted',
  'decision_made',
  'sanctions_recommended',
  'appeal_filed',
  'appeal_decided',
  'retaliation_reported',
  'case_withdrawn',
  'case_closed',
  'extension_granted',
  'referral_to_police',
  'counselling_referred'
);


-- ──────────────────────────────────────────────────────────────
-- USERS & AUTHENTICATION
-- ──────────────────────────────────────────────────────────────

CREATE TABLE users (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email               TEXT UNIQUE NOT NULL,               -- [ENCRYPT]
  password_hash       TEXT NOT NULL,
  role                user_role NOT NULL DEFAULT 'complainant',
  full_name           TEXT NOT NULL,                      -- [ENCRYPT]
  staff_or_student_id TEXT,                               -- [ENCRYPT]
  department          TEXT,
  phone               TEXT,                               -- [ENCRYPT]
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  last_login          TIMESTAMPTZ,
  mfa_secret          TEXT,                               -- [ENCRYPT] TOTP secret
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);


-- ──────────────────────────────────────────────────────────────
-- COMMITTEE MEMBERSHIP (Anti-Sexual Harassment Committee)
-- Policy §4.4 — 14 members, gender parity
-- ──────────────────────────────────────────────────────────────

CREATE TABLE committee_members (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID NOT NULL REFERENCES users(id),
  representing_institution  TEXT NOT NULL,   -- e.g. "School of Law"
  is_chair                  BOOLEAN NOT NULL DEFAULT FALSE,
  is_vice_chair             BOOLEAN NOT NULL DEFAULT FALSE,
  is_secretary              BOOLEAN NOT NULL DEFAULT FALSE,
  is_adjudication_member    BOOLEAN NOT NULL DEFAULT FALSE,
  gender                    CHAR(1) CHECK (gender IN ('M', 'F', 'O')),
  term_start                DATE NOT NULL,
  term_end                  DATE NOT NULL,   -- 2-year terms per §4.4(v)
  is_active                 BOOLEAN NOT NULL DEFAULT TRUE,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_committee_user ON committee_members(user_id);
CREATE INDEX idx_committee_active ON committee_members(is_active);


-- ──────────────────────────────────────────────────────────────
-- CASES (Core Entity)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE cases (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number                 TEXT UNIQUE NOT NULL,   -- e.g. "UG-SH-2026-001"
  status                      case_status NOT NULL DEFAULT 'submitted',
  misconduct_type             misconduct_type NOT NULL,
  severity                    SMALLINT CHECK (severity BETWEEN 1 AND 5),

  -- Complainant (may be anonymous at intake)
  complainant_user_id         UUID REFERENCES users(id),
  complainant_affiliation     complainant_affiliation,
  is_anonymous                BOOLEAN NOT NULL DEFAULT FALSE,

  -- Respondent
  respondent_user_id          UUID REFERENCES users(id),
  respondent_name             TEXT,                   -- [ENCRYPT] if no user account
  respondent_affiliation      TEXT,
  respondent_department       TEXT,

  -- Incident details  [ENCRYPT all narrative fields]
  incident_description        TEXT NOT NULL,          -- [ENCRYPT]
  incident_location           TEXT,                   -- [ENCRYPT]
  incident_date_from          DATE,
  incident_date_to            DATE,
  incident_frequency          incident_frequency,
  witnesses_mentioned         TEXT,                   -- [ENCRYPT] names from complaint

  -- Informal resolution tracking (Annex III §I)
  informal_attempted          BOOLEAN NOT NULL DEFAULT FALSE,
  mediation_requested         BOOLEAN NOT NULL DEFAULT FALSE,
  mediation_consented_both    BOOLEAN,

  -- 60-working-day investigation window (§III.iii.g)
  formal_investigation_filed_at  TIMESTAMPTZ,        -- clock starts here
  investigation_deadline         DATE,               -- computed: +60 working days
  extension_granted              BOOLEAN NOT NULL DEFAULT FALSE,
  extension_approved_by          UUID REFERENCES users(id), -- VC office
  extended_deadline              DATE,

  -- Respondent 7-day response window (Annex III §II.f)
  respondent_notified_at         TIMESTAMPTZ,
  respondent_response_deadline   TIMESTAMPTZ,        -- +7 calendar days
  respondent_responded           BOOLEAN NOT NULL DEFAULT FALSE,

  -- Adjudication
  adjudication_started_at        TIMESTAMPTZ,
  decision_made_at               TIMESTAMPTZ,
  decision_summary               TEXT,               -- [ENCRYPT]
  policy_violated                BOOLEAN,

  -- Appeal (§III.iii.i)
  appeal_filed                   BOOLEAN NOT NULL DEFAULT FALSE,
  appeal_filed_at                TIMESTAMPTZ,
  appeal_decided_at              TIMESTAMPTZ,
  appeal_outcome                 TEXT,

  -- Retaliation monitoring (§III.iii.j)
  retaliation_flagged            BOOLEAN NOT NULL DEFAULT FALSE,

  -- Meta
  assigned_committee_member_id   UUID REFERENCES committee_members(id),
  referred_to_police             BOOLEAN NOT NULL DEFAULT FALSE,
  police_report_number           TEXT,
  created_at                     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_complainant ON cases(complainant_user_id);
CREATE INDEX idx_cases_respondent ON cases(respondent_user_id);
CREATE INDEX idx_cases_deadline ON cases(investigation_deadline);
CREATE INDEX idx_cases_number ON cases(case_number);

-- Auto-generate case numbers: UG-SH-YYYY-NNN
CREATE SEQUENCE case_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.case_number := 'UG-SH-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' ||
                     LPAD(nextval('case_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_case_number
  BEFORE INSERT ON cases
  FOR EACH ROW
  WHEN (NEW.case_number IS NULL)
  EXECUTE FUNCTION generate_case_number();

-- Compute investigation deadline (+60 working days, Mon–Fri, excl. UG holidays)
-- This function should be called when formal_investigation_filed_at is set.
CREATE OR REPLACE FUNCTION compute_investigation_deadline(start_date DATE, working_days INT)
RETURNS DATE AS $$
DECLARE
  current_day DATE := start_date;
  days_counted INT := 0;
BEGIN
  WHILE days_counted < working_days LOOP
    current_day := current_day + 1;
    -- Skip weekends
    IF EXTRACT(DOW FROM current_day) NOT IN (0, 6) THEN
      -- Skip UG public holidays (check ug_holidays table)
      IF NOT EXISTS (SELECT 1 FROM ug_holidays WHERE holiday_date = current_day) THEN
        days_counted := days_counted + 1;
      END IF;
    END IF;
  END LOOP;
  RETURN current_day;
END;
$$ LANGUAGE plpgsql;


-- ──────────────────────────────────────────────────────────────
-- UG HOLIDAYS (for 60-day working day calculation)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE ug_holidays (
  id            SERIAL PRIMARY KEY,
  holiday_date  DATE NOT NULL UNIQUE,
  description   TEXT NOT NULL,
  is_recurring  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ──────────────────────────────────────────────────────────────
-- EVIDENCE VAULT (§III.iii.a — Evidence)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE evidence_files (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id           UUID NOT NULL REFERENCES cases(id) ON DELETE RESTRICT,
  uploaded_by       UUID NOT NULL REFERENCES users(id),
  evidence_type     evidence_type NOT NULL,
  original_filename TEXT NOT NULL,                  -- [ENCRYPT]
  storage_key       TEXT NOT NULL,                  -- encrypted S3/storage reference
  file_size_bytes   BIGINT,
  mime_type         TEXT,
  description       TEXT,                           -- [ENCRYPT]
  is_from_complainant  BOOLEAN NOT NULL DEFAULT TRUE,
  checksum_sha256   TEXT NOT NULL,                  -- integrity verification
  uploaded_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_deleted        BOOLEAN NOT NULL DEFAULT FALSE,  -- soft delete only
  deleted_at        TIMESTAMPTZ,
  deleted_by        UUID REFERENCES users(id)
);

CREATE INDEX idx_evidence_case ON evidence_files(case_id);
CREATE INDEX idx_evidence_type ON evidence_files(evidence_type);


-- ──────────────────────────────────────────────────────────────
-- RESPONDENT RESPONSES (7-day window per §III.II.f)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE respondent_responses (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id               UUID NOT NULL REFERENCES cases(id),
  respondent_user_id    UUID REFERENCES users(id),
  response_text         TEXT NOT NULL,              -- [ENCRYPT]
  admits_conduct        BOOLEAN,
  submitted_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_within_deadline    BOOLEAN,                    -- computed on insert
  notified_complainant  BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_responses_case ON respondent_responses(case_id);


-- ──────────────────────────────────────────────────────────────
-- CASE PARTICIPANTS (Witnesses, Support Persons)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE case_participants (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id           UUID NOT NULL REFERENCES cases(id),
  user_id           UUID REFERENCES users(id),
  participant_type  TEXT NOT NULL CHECK (participant_type IN
                      ('witness', 'legal_counsel_complainant',
                       'legal_counsel_respondent', 'support_person',
                       'expert_witness')),
  full_name         TEXT,                           -- [ENCRYPT] if no user account
  contact_info      TEXT,                           -- [ENCRYPT]
  statement         TEXT,                           -- [ENCRYPT]
  statement_date    DATE,
  added_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_participants_case ON case_participants(case_id);


-- ──────────────────────────────────────────────────────────────
-- MEDIATION RECORDS (Annex III §I.c)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE mediation_records (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id               UUID NOT NULL REFERENCES cases(id),
  mediator_name         TEXT NOT NULL,              -- [ENCRYPT]
  mediator_external     BOOLEAN NOT NULL DEFAULT FALSE,
  started_at            TIMESTAMPTZ,
  concluded_at          TIMESTAMPTZ,
  outcome               TEXT CHECK (outcome IN ('resolved', 'failed', 'withdrawn')),
  outcome_summary       TEXT,                       -- [ENCRYPT]
  reported_to_committee_at  TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mediation_case ON mediation_records(case_id);


-- ──────────────────────────────────────────────────────────────
-- HEARING RECORDS (Adjudication Committee hearings)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE hearing_records (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id                   UUID NOT NULL REFERENCES cases(id),
  hearing_date              TIMESTAMPTZ NOT NULL,
  location                  TEXT,
  complainant_present       BOOLEAN NOT NULL DEFAULT FALSE,
  respondent_present        BOOLEAN NOT NULL DEFAULT FALSE,
  recording_reference       TEXT,                   -- encrypted storage key
  notes                     TEXT,                   -- [ENCRYPT]
  presided_by               UUID REFERENCES committee_members(id),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hearings_case ON hearing_records(case_id);


-- ──────────────────────────────────────────────────────────────
-- SANCTIONS (§III.iii.h)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE sanctions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id               UUID NOT NULL REFERENCES cases(id),
  respondent_user_id    UUID REFERENCES users(id),
  sanction_type         sanction_type NOT NULL,
  description           TEXT,                       -- [ENCRYPT]
  recommended_by        UUID NOT NULL REFERENCES committee_members(id),
  recommended_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_by_vc        BOOLEAN,
  approved_at           TIMESTAMPTZ,
  implemented_at        TIMESTAMPTZ,
  dissenting_opinion    TEXT                        -- [ENCRYPT] per §III.II.m
);

CREATE INDEX idx_sanctions_case ON sanctions(case_id);


-- ──────────────────────────────────────────────────────────────
-- APPEALS (§III.iii.i — UG Appeals Board)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE appeals (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id           UUID NOT NULL REFERENCES cases(id),
  filed_by          UUID NOT NULL REFERENCES users(id),
  filed_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  grounds           TEXT NOT NULL,                 -- [ENCRYPT]
  appeals_board_ref TEXT,                          -- external reference number
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'under_review', 'upheld',
                                      'dismissed', 'remitted')),
  decided_at        TIMESTAMPTZ,
  outcome           TEXT,                          -- [ENCRYPT]
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appeals_case ON appeals(case_id);


-- ──────────────────────────────────────────────────────────────
-- RETALIATION REPORTS (§III.iii.j — treated as new misconduct)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE retaliation_reports (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_case_id      UUID NOT NULL REFERENCES cases(id),
  new_case_id         UUID REFERENCES cases(id),   -- created when treated as new case
  reporter_user_id    UUID NOT NULL REFERENCES users(id),
  retaliation_type    TEXT NOT NULL,               -- threats, reprisals, adverse actions
  description         TEXT NOT NULL,               -- [ENCRYPT]
  reported_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed           BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_retaliation_parent ON retaliation_reports(parent_case_id);


-- ──────────────────────────────────────────────────────────────
-- CASE TIMELINE EVENTS (Immutable Audit Trail)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE case_timeline_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id       UUID NOT NULL REFERENCES cases(id),
  event_type    event_type NOT NULL,
  actor_user_id UUID REFERENCES users(id),         -- who triggered event
  description   TEXT,                              -- [ENCRYPT] if sensitive
  metadata      JSONB,                             -- additional structured data
  occurred_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_case ON case_timeline_events(case_id);
CREATE INDEX idx_events_type ON case_timeline_events(event_type);
CREATE INDEX idx_events_occurred ON case_timeline_events(occurred_at);


-- ──────────────────────────────────────────────────────────────
-- NOTIFICATIONS
-- ──────────────────────────────────────────────────────────────

CREATE TABLE notifications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id UUID NOT NULL REFERENCES users(id),
  case_id           UUID REFERENCES cases(id),
  channel           notification_channel NOT NULL DEFAULT 'in_app',
  subject           TEXT NOT NULL,
  body              TEXT NOT NULL,                 -- [ENCRYPT]
  sent_at           TIMESTAMPTZ,
  read_at           TIMESTAMPTZ,
  is_urgent         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_user_id);
CREATE INDEX idx_notifications_unread ON notifications(recipient_user_id, read_at)
  WHERE read_at IS NULL;


-- ──────────────────────────────────────────────────────────────
-- CONFLICT OF INTEREST DECLARATIONS (§III.iii.e)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE conflict_declarations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_member_id   UUID NOT NULL REFERENCES committee_members(id),
  case_id               UUID NOT NULL REFERENCES cases(id),
  has_conflict          BOOLEAN NOT NULL,
  description           TEXT,                      -- [ENCRYPT]
  declared_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  recused               BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (committee_member_id, case_id)
);


-- ──────────────────────────────────────────────────────────────
-- COUNSELLING REFERRALS (§III.iii.l)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE counselling_referrals (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id           UUID NOT NULL REFERENCES cases(id),
  referred_user_id  UUID NOT NULL REFERENCES users(id),
  referred_to       TEXT NOT NULL,                 -- e.g. "CEGENSA Crisis Unit"
  referred_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attended          BOOLEAN,
  attended_at       TIMESTAMPTZ
);


-- ──────────────────────────────────────────────────────────────
-- RESPONDENT ACCESS TOKENS (for secure respondent portal link)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE respondent_access_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id     UUID NOT NULL REFERENCES cases(id),
  token_hash  TEXT NOT NULL UNIQUE,               -- hashed token (bcrypt)
  expires_at  TIMESTAMPTZ NOT NULL,               -- 7 days from notification
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tokens_case ON respondent_access_tokens(case_id);


-- ──────────────────────────────────────────────────────────────
-- ROW-LEVEL SECURITY POLICIES
-- ──────────────────────────────────────────────────────────────

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE respondent_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sanctions ENABLE ROW LEVEL SECURITY;

-- Complainants see only their own cases
CREATE POLICY cases_complainant_policy ON cases
  FOR SELECT TO app_complainant
  USING (complainant_user_id = current_setting('app.current_user_id')::UUID);

-- Respondents see only cases where they are named
CREATE POLICY cases_respondent_policy ON cases
  FOR SELECT TO app_respondent
  USING (respondent_user_id = current_setting('app.current_user_id')::UUID);

-- Committee members see all active cases
CREATE POLICY cases_committee_policy ON cases
  FOR ALL TO app_committee
  USING (TRUE);


-- ──────────────────────────────────────────────────────────────
-- UPDATED_AT TRIGGERS
-- ──────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_cases_updated BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_appeals_updated BEFORE UPDATE ON appeals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ──────────────────────────────────────────────────────────────
-- VIEWS FOR DASHBOARD
-- ──────────────────────────────────────────────────────────────

-- Active cases with days elapsed and days remaining
CREATE VIEW v_active_cases AS
SELECT
  c.id,
  c.case_number,
  c.status,
  c.misconduct_type,
  c.severity,
  c.formal_investigation_filed_at,
  c.investigation_deadline,
  c.extended_deadline,
  COALESCE(c.extended_deadline, c.investigation_deadline) AS effective_deadline,
  -- Working days elapsed (approximation; exact uses compute_investigation_deadline)
  GREATEST(0,
    (CURRENT_DATE - c.formal_investigation_filed_at::DATE)
    - (FLOOR((CURRENT_DATE - c.formal_investigation_filed_at::DATE) / 7) * 2)
  ) AS working_days_elapsed,
  -- Is overdue?
  CURRENT_DATE > COALESCE(c.extended_deadline, c.investigation_deadline) AS is_overdue,
  -- Respondent response status
  c.respondent_notified_at,
  c.respondent_response_deadline,
  c.respondent_responded,
  NOW() > c.respondent_response_deadline
    AND NOT c.respondent_responded AS response_overdue,
  c.appeal_filed,
  c.retaliation_flagged,
  c.created_at
FROM cases c
WHERE c.status NOT IN ('closed', 'withdrawn');

-- Case count summary for dashboard stats
CREATE VIEW v_case_stats AS
SELECT
  COUNT(*) FILTER (WHERE status NOT IN ('closed','withdrawn'))           AS active_total,
  COUNT(*) FILTER (WHERE CURRENT_DATE > COALESCE(extended_deadline, investigation_deadline)
                    AND status NOT IN ('closed','withdrawn','decided','sanctioned'))
                                                                          AS overdue_count,
  COUNT(*) FILTER (WHERE status = 'awaiting_response'
                    AND NOW() <= respondent_response_deadline)            AS awaiting_response,
  COUNT(*) FILTER (WHERE status = 'submitted')                           AS new_submissions,
  COUNT(*) FILTER (WHERE status IN ('closed','withdrawn'))               AS closed_total,
  COUNT(*) FILTER (WHERE appeal_filed = TRUE)                            AS appealed_total,
  COUNT(*) FILTER (WHERE retaliation_flagged = TRUE)                     AS retaliation_flags
FROM cases;

-- ──────────────────────────────────────────────────────────────
-- SEED: Sample UG Holidays (Ghana public holidays)
-- ──────────────────────────────────────────────────────────────

INSERT INTO ug_holidays (holiday_date, description) VALUES
  ('2026-01-01', 'New Year''s Day'),
  ('2026-03-06', 'Independence Day'),
  ('2026-04-03', 'Good Friday'),
  ('2026-04-06', 'Easter Monday'),
  ('2026-05-01', 'May Day / Workers Day'),
  ('2026-07-01', 'Republic Day'),
  ('2026-12-25', 'Christmas Day'),
  ('2026-12-26', 'Boxing Day');

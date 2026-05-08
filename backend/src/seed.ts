import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { prisma } from './lib/prisma'

async function seed() {
  // ── Committee member ────────────────────────────────────────
  const passwordHash = await bcrypt.hash('committee2026', 10)
  const member = await prisma.committeeMember.upsert({
    where: { email: 'committee@ug.edu.gh' },
    update: {},
    create: {
      email: 'committee@ug.edu.gh',
      passwordHash,
      fullName: 'Committee Administrator',
      role: 'chair',
      department: 'Anti-Sexual Harassment Committee',
    },
  })
  console.log('✓ Committee member:', member.email)

  // ── Incidents ────────────────────────────────────────────────
  const incidents = [
    {
      caseNumber: 'UG-SH-2026-0001',
      status: 'under_investigation',
      misconductType: 'quid_pro_quo',
      severity: 4,
      isAnonymous: true,
      respondentName: 'Respondent A',
      respondentDepartment: 'Department of Economics',
      respondentAffiliation: 'Lecturer',
      incidentDescription:
        'Lecturer repeatedly conditioned grade improvement on personal meetings outside office hours. Explicit reference to sexual favours in a WhatsApp message.',
      incidentLocation: 'Balme Library, Room 204; WhatsApp',
      incidentDateFrom: '2026-02-10',
      incidentDateTo: '2026-03-15',
      incidentFrequency: 'repeated',
      hasWitnesses: false,
      mediationRequested: false,
      rightsAcknowledged: true,
      confidentialityAcknowledged: true,
    },
    {
      caseNumber: 'UG-SH-2026-0002',
      status: 'awaiting_response',
      misconductType: 'sexual_harassment',
      severity: 3,
      isAnonymous: false,
      complainantName: 'Complainant B',
      complainantEmail: 'complainantb@ug.edu.gh',
      complainantAffiliation: 'graduate_student',
      respondentName: 'Respondent B',
      respondentDepartment: 'School of Public Health',
      respondentAffiliation: 'Senior Researcher',
      incidentDescription:
        'Supervisor made repeated unwelcome comments about physical appearance during lab sessions. Also sent an unsolicited gift with a personal note.',
      incidentLocation: 'Research Lab 3, Noguchi Memorial Institute',
      incidentDateFrom: '2026-01-15',
      incidentFrequency: 'repeated',
      hasWitnesses: true,
      witnessNames: 'Lab colleague (name withheld)',
      mediationRequested: false,
      rightsAcknowledged: true,
      confidentialityAcknowledged: true,
    },
    {
      caseNumber: 'UG-SH-2026-0003',
      status: 'sanctioned',
      misconductType: 'sexual_intimidation',
      severity: 3,
      isAnonymous: false,
      complainantName: 'Complainant C',
      complainantEmail: 'complainantc@ug.edu.gh',
      complainantAffiliation: 'administrative_staff',
      respondentName: 'Respondent C',
      respondentDepartment: 'Registry',
      respondentAffiliation: 'Senior Administrative Officer',
      incidentDescription:
        'Senior colleague engaged in persistent stalking behaviour — following complainant to parking lot, leaving notes on car, and sending unwanted messages on university email.',
      incidentLocation: 'Main Registry; University parking lot',
      incidentDateFrom: '2025-11-01',
      incidentDateTo: '2026-01-20',
      incidentFrequency: 'ongoing',
      hasWitnesses: false,
      mediationRequested: false,
      rightsAcknowledged: true,
      confidentialityAcknowledged: true,
    },
    {
      caseNumber: 'UG-SH-2026-0004',
      status: 'submitted',
      misconductType: 'sexual_harassment',
      severity: 2,
      isAnonymous: true,
      respondentName: 'Respondent D',
      respondentDepartment: 'Department of Psychology',
      respondentAffiliation: 'Teaching Assistant',
      incidentDescription:
        'Teaching assistant made repeated sexualised jokes during tutorial sessions and displayed offensive cartoons in course materials shared via the LMS.',
      incidentLocation: 'Tutorial Room 12, Legon',
      incidentDateFrom: '2026-04-20',
      incidentFrequency: 'repeated',
      hasWitnesses: false,
      mediationRequested: false,
      rightsAcknowledged: true,
      confidentialityAcknowledged: true,
    },
    {
      caseNumber: 'UG-SH-2026-0005',
      status: 'mediation_active',
      misconductType: 'hostile_environment',
      severity: 2,
      isAnonymous: false,
      complainantName: 'Complainant E',
      complainantEmail: 'complainante@ug.edu.gh',
      complainantAffiliation: 'academic_staff',
      respondentName: 'Respondent E',
      respondentDepartment: 'Department of History',
      respondentAffiliation: 'Associate Professor',
      incidentDescription:
        'Colleague consistently undermined complainant in departmental meetings with gendered language, and shared demeaning jokes about women academics in the department WhatsApp group.',
      incidentLocation: 'Department of History, Level 3',
      incidentDateFrom: '2025-10-01',
      incidentFrequency: 'ongoing',
      hasWitnesses: true,
      witnessNames: 'Multiple department colleagues',
      mediationRequested: true,
      rightsAcknowledged: true,
      confidentialityAcknowledged: true,
    },
    {
      caseNumber: 'UG-SH-2025-0041',
      status: 'appealed',
      misconductType: 'sexual_assault',
      severity: 5,
      isAnonymous: false,
      complainantName: 'Complainant F',
      complainantEmail: 'complainantf@ug.edu.gh',
      complainantAffiliation: 'undergraduate_student',
      respondentName: 'Respondent F',
      respondentDepartment: 'Department of Engineering',
      respondentAffiliation: 'Student',
      incidentDescription:
        'Physical assault occurred after a departmental social event. Medical report and witness statements submitted.',
      incidentLocation: 'Commonwealth Hall vicinity',
      incidentDateFrom: '2025-09-14',
      incidentFrequency: 'single_incident',
      hasWitnesses: true,
      witnessNames: 'Two hall mates present at the event',
      mediationRequested: false,
      rightsAcknowledged: true,
      confidentialityAcknowledged: true,
    },
  ]

  for (const data of incidents) {
    await prisma.incident.upsert({
      where: { caseNumber: data.caseNumber },
      update: {},
      create: data,
    })
    console.log('✓ Incident:', data.caseNumber, `(${data.status})`)
  }

  await prisma.$disconnect()
  console.log('\nSeed complete.')
}

seed().catch(e => {
  console.error(e)
  process.exit(1)
})

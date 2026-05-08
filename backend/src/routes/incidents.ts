import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'

const router = Router()

// Generate case number: UG-SH-YYYY-NNNN
async function generateCaseNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `UG-SH-${year}-`
  const count = await prisma.incident.count({
    where: { caseNumber: { startsWith: prefix } },
  })
  return `${prefix}${String(count + 1).padStart(4, '0')}`
}

// ── Public ────────────────────────────────────────────────────

// POST /api/incidents — submit a new incident report (from report form)
router.post('/', async (req: Request, res: Response) => {
  const body = req.body as {
    misconductType: string
    severity: number
    incidentDescription: string
    incidentLocation?: string
    incidentDateFrom?: string
    incidentDateTo?: string
    incidentFrequency?: string
    isAnonymous: boolean
    complainantName?: string
    complainantEmail?: string
    complainantAffiliation?: string
    respondentName?: string
    respondentDepartment?: string
    respondentAffiliation?: string
    hasWitnesses?: boolean
    witnessNames?: string
    mediationRequested?: boolean
    rightsAcknowledged: boolean
    confidentialityAcknowledged: boolean
  }

  if (!body.misconductType || !body.incidentDescription) {
    res.status(400).json({ error: 'misconductType and incidentDescription are required' })
    return
  }

  if (!body.rightsAcknowledged || !body.confidentialityAcknowledged) {
    res.status(400).json({ error: 'Acknowledgements are required' })
    return
  }

  const caseNumber = await generateCaseNumber()

  const incident = await prisma.incident.create({
    data: {
      caseNumber,
      misconductType: body.misconductType,
      severity: body.severity ?? 1,
      incidentDescription: body.incidentDescription,
      incidentLocation: body.incidentLocation,
      incidentDateFrom: body.incidentDateFrom,
      incidentDateTo: body.incidentDateTo,
      incidentFrequency: body.incidentFrequency,
      isAnonymous: body.isAnonymous ?? false,
      complainantName: body.isAnonymous ? null : body.complainantName,
      complainantEmail: body.isAnonymous ? null : body.complainantEmail,
      complainantAffiliation: body.complainantAffiliation,
      respondentName: body.respondentName,
      respondentDepartment: body.respondentDepartment,
      respondentAffiliation: body.respondentAffiliation,
      hasWitnesses: body.hasWitnesses ?? false,
      witnessNames: body.witnessNames,
      mediationRequested: body.mediationRequested ?? false,
      rightsAcknowledged: body.rightsAcknowledged,
      confidentialityAcknowledged: body.confidentialityAcknowledged,
    },
  })

  res.status(201).json({
    caseNumber: incident.caseNumber,
    id: incident.id,
    status: incident.status,
    createdAt: incident.createdAt,
  })
})

// ── Public case tracking ──────────────────────────────────────

// GET /api/incidents/track/:caseNumber — minimal public status for complainants
router.get('/track/:caseNumber', async (req: Request, res: Response) => {
  try {
    const incident = await prisma.incident.findFirst({
      where: { caseNumber: req.params.caseNumber.toUpperCase() },
      select: {
        caseNumber: true,
        status: true,
        misconductType: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!incident) {
      res.status(404).json({ error: 'Case not found' })
      return
    }

    res.json(incident)
  } catch (err) {
    console.error('Track error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ── Protected (committee only) ────────────────────────────────

// GET /api/incidents — list all incidents with optional filters
router.get('/', requireAuth, async (req: Request, res: Response) => {
  const { status, search, page = '1', limit = '20' } = req.query as Record<string, string>

  const skip = (parseInt(page) - 1) * parseInt(limit)

  const where = {
    ...(status && status !== 'all' ? { status } : {}),
    ...(search
      ? {
          OR: [
            { caseNumber:          { contains: search, mode: 'insensitive' as const } },
            { incidentDescription: { contains: search, mode: 'insensitive' as const } },
            { respondentName:      { contains: search, mode: 'insensitive' as const } },
            { respondentDepartment:{ contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [incidents, total] = await Promise.all([
    prisma.incident.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
    }),
    prisma.incident.count({ where }),
  ])

  res.json({ incidents, total, page: parseInt(page), limit: parseInt(limit) })
})

// GET /api/incidents/:id — single incident
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const incident = await prisma.incident.findFirst({
      where: { id: req.params.id },
    })

    if (!incident) {
      res.status(404).json({ error: 'Incident not found' })
      return
    }

    res.json(incident)
  } catch (err) {
    console.error('Fetch incident error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PATCH /api/incidents/:id/status — update status
router.patch('/:id/status', requireAuth, async (req: Request, res: Response) => {
  const { status } = req.body as { status: string }

  if (!status) {
    res.status(400).json({ error: 'status is required' })
    return
  }

  const incident = await prisma.incident.update({
    where: { id: req.params.id },
    data: { status },
  })

  res.json(incident)
})

export default router

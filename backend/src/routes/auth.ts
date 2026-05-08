import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

const router = Router()

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' })
    return
  }

  const member = await prisma.committeeMember.findUnique({
    where: { email: email.toLowerCase().trim() },
  })

  if (!member || !member.isActive) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const valid = await bcrypt.compare(password, member.passwordHash)
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  // Update last login timestamp
  await prisma.committeeMember.update({
    where: { id: member.id },
    data: { lastLogin: new Date() },
  })

  const token = jwt.sign(
    { id: member.id, email: member.email, role: member.role },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '8h' }
  )

  res.json({
    token,
    member: {
      id: member.id,
      email: member.email,
      fullName: member.fullName,
      role: member.role,
      department: member.department,
    },
  })
})

// POST /api/auth/logout  (client just drops the token — this is a no-op stub)
router.post('/logout', (_req, res) => {
  res.json({ message: 'Logged out' })
})

export default router

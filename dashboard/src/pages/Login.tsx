import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import api from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('kasa_token', res.data.token)
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        .response?.data?.error
      setError(msg ?? 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sand-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-baseline gap-0.5 mb-2">
            <span
              className="font-display font-bold leading-none text-ocean-700"
              style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}
            >
              Kasa
            </span>
            <span className="text-sm font-bold font-sans ml-1 mb-2 text-terra-500">UG</span>
          </div>
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 font-sans">
            Committee Portal
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-card border border-sand-200 p-8">
          <div className="mb-6">
            <h1 className="font-display text-xl font-bold text-ocean-800 mb-1">
              Sign in
            </h1>
            <p className="text-sm text-gray-400 font-sans">
              Restricted to authorized committee members.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                className="input"
                placeholder="you@ug.edu.gh"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 font-sans">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary justify-center py-3 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-ocean-400" strokeWidth={1.75} />
          Protected access · University of Ghana
        </div>
      </div>
    </div>
  )
}

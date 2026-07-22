import { useState, useEffect, useRef } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import './login.css'

function LoginPage({ onBack, onLoginSuccess, onSignUp }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Sun class
    class Sun {
      constructor() {
        this.x = canvas.width * 0.15
        this.y = canvas.height * 0.12
        this.radius = 60
        this.pulse = 0
      }

      draw(ctx) {
        this.pulse += 0.01
        
        // Glow
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius * 4
        )
        gradient.addColorStop(0, 'rgba(255, 200, 50, 0.4)')
        gradient.addColorStop(0.3, 'rgba(255, 180, 50, 0.2)')
        gradient.addColorStop(1, 'rgba(255, 180, 50, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2)
        ctx.fill()

        // Sun body
        const pulseRadius = this.radius + Math.sin(this.pulse) * 3
        ctx.shadowColor = 'rgba(255, 200, 50, 0.5)'
        ctx.shadowBlur = 40
        ctx.beginPath()
        ctx.arc(this.x, this.y, pulseRadius, 0, Math.PI * 2)
        ctx.fillStyle = '#FFD93D'
        ctx.fill()
        ctx.shadowBlur = 0

        // Sun rays
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2 + this.pulse * 0.1
          const rayLength = this.radius * 1.6 + Math.sin(this.pulse + i) * 5
          ctx.beginPath()
          ctx.moveTo(
            this.x + Math.cos(angle) * this.radius * 0.9,
            this.y + Math.sin(angle) * this.radius * 0.9
          )
          ctx.lineTo(
            this.x + Math.cos(angle) * rayLength,
            this.y + Math.sin(angle) * rayLength
          )
          ctx.strokeStyle = 'rgba(255, 200, 50, 0.6)'
          ctx.lineWidth = 3
          ctx.stroke()
        }

        // Inner highlight
        ctx.beginPath()
        ctx.arc(this.x - this.radius * 0.2, this.y - this.radius * 0.2, this.radius * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.fill()
      }
    }

    const sun = new Sun()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      skyGradient.addColorStop(0, '#87CEEB')
      skyGradient.addColorStop(0.3, '#B5E8F7')
      skyGradient.addColorStop(0.6, '#D4F1F9')
      skyGradient.addColorStop(1, '#E8F8FF')
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw sun
      sun.draw(ctx)

      // Draw clouds (fluffy white clouds)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      const cloudPositions = [
        { x: canvas.width * 0.3, y: canvas.height * 0.08, size: 1 },
        { x: canvas.width * 0.5, y: canvas.height * 0.15, size: 0.8 },
        { x: canvas.width * 0.7, y: canvas.height * 0.05, size: 1.2 },
        { x: canvas.width * 0.85, y: canvas.height * 0.12, size: 0.7 },
        { x: canvas.width * 0.1, y: canvas.height * 0.2, size: 0.6 },
      ]

      cloudPositions.forEach((cloud, index) => {
        const offsetX = (index * 20 + Date.now() * 0.005) % 100 - 50
        const x = cloud.x + offsetX
        const y = cloud.y
        const size = cloud.size * 40

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.arc(x + size * 0.8, y - size * 0.3, size * 0.7, 0, Math.PI * 2)
        ctx.arc(x + size * 1.4, y, size * 0.6, 0, Math.PI * 2)
        ctx.arc(x + size * 0.6, y + size * 0.2, size * 0.5, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    setIsLoading(true)
    console.log('Logging in with:', { email, password })
    
    setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess({
        name: email.split('@')[0],
        email: email,
        picture: null,
        googleId: null
      })
    }, 1000)
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true)
      setError('')
      
      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch Google profile')
        }
        
        const profile = await response.json()
        console.log('Google profile:', profile)
        
        onLoginSuccess({
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          googleId: profile.sub,
          accessToken: tokenResponse.access_token
        })
      } catch (err) {
        setError('Google login failed. Please try again.')
        console.error('Google login error:', err)
      } finally {
        setIsLoading(false)
      }
    },
    onError: () => {
      setError('Google login failed. Please try again.')
      setIsLoading(false)
    },
    scope: 'https://www.googleapis.com/auth/calendar'
  })

  return (
    <section id="login">
      <canvas ref={canvasRef} className="canvas"></canvas>
      <div className="login-card">
        <button onClick={onBack} className="back-button-home">
          ← Back to Home
        </button>
        <h1>Welcome back</h1>

        <button 
          onClick={() => googleLogin()}
          disabled={isLoading}
          className="google-login-btn"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="google-icon"
          />
          {isLoading ? 'Signing in...' : 'Login with Google'}
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={isLoading}
          />
          
          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isLoading}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="signup-link">
          New? <a href="#" onClick={(e) => { e.preventDefault(); onSignUp(); }}>Click me to start building a profile</a>
        </p>
      </div>
    </section>
  )
}

export default LoginPage
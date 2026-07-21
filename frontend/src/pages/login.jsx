import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import './login.css'

function LoginPage({ onBack, onLoginSuccess, onSignUp }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
import { useState } from 'react'
import LoginPage from './pages/login'
import UserPage from './pages/user'
import PlanPage from './pages/plan'
import AgenaPage from './pages/agenda'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null)
  const [scheduleData, setScheduleData] = useState(null)

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setCurrentPage('plan')
  }

  const handleBackToHome = () => {
    setCurrentPage('home')
  }

  const handleBackToPlan = () => {
    setCurrentPage('plan')
  }

  const handleProfileClick = () => {
    setCurrentPage('profile')
  }

  const handleScheduleCreated = (schedule) => {
    console.log('Schedule received in App:', schedule)
    setScheduleData(schedule)
    setCurrentPage('agenda')
  }

  if (currentPage === 'login') {
    return (
      <LoginPage
        onBack={handleBackToHome}
        onLoginSuccess={handleLoginSuccess}
        onSignUp={() => setCurrentPage('profile')}
      />
    )
  }

  if (currentPage === 'profile') {
    return (
      <UserPage
        onBack={handleBackToHome}
        onComplete={handleBackToPlan}
      />
    )
  }

  if (currentPage === 'plan') {
    return (
      <PlanPage 
        onBack={handleBackToHome}
        user={user}
        onProfileClick={handleProfileClick}
        onScheduleCreated={handleScheduleCreated}
      />
    )
  }

  if (currentPage === 'agenda') {
    return (
      <AgenaPage
        onBack={handleBackToPlan}
        schedule={scheduleData}
        user={user}
      />
    )
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-left">
          <h1 className="logo">Today</h1>
        </div>
        <div className="nav-right">
          <img 
            src="/tdy.png" 
            alt="Today Logo" 
            className="nav-logo-image"
          />
        </div>
      </nav>

      <section className="growing-decor">
        <div className="growing-decor-left">
          <div className="growing-leaf leaf-1">
            <svg viewBox="0 0 100 130" width="70" height="91" className="leaf-stem-svg">
              <path d="M50 130 Q42 95 48 70 Q52 50 50 30" stroke="#2d8a4e" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M47 85 Q20 74 24 58 Q38 64 47 80" fill="#4CAF50" stroke="#2d8a4e" strokeWidth="1.5"/>
              <path d="M51 65 Q78 54 74 38 Q60 44 51 60" fill="#66BB6A" stroke="#2d8a4e" strokeWidth="1.5"/>
              <path d="M50 40 Q44 25 50 8 Q56 25 50 40Z" fill="#81C784" stroke="#2d8a4e" strokeWidth="1.5"/>
            </svg>
          </div>

          <div className="growing-leaf leaf-2">
            <svg viewBox="0 0 100 130" width="80" height="104" className="leaf-stem-svg">
              <path d="M50 130 Q42 95 48 70 Q52 50 50 30" stroke="#2d8a4e" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M47 85 Q20 74 24 58 Q38 64 47 80" fill="#66BB6A" stroke="#2d8a4e" strokeWidth="1.5"/>
              <path d="M51 65 Q78 54 74 38 Q60 44 51 60" fill="#4CAF50" stroke="#2d8a4e" strokeWidth="1.5"/>
              <path d="M50 40 Q44 25 50 8 Q56 25 50 40Z" fill="#81C784" stroke="#2d8a4e" strokeWidth="1.5"/>
            </svg>
          </div>

          <div className="growing-leaf leaf-3 has-bee">
            <svg viewBox="0 0 100 130" width="80" height="104" className="leaf-stem-svg">
              <path d="M50 130 Q42 95 48 70 Q52 50 50 30" stroke="#2d8a4e" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M47 85 Q20 74 24 58 Q38 64 47 80" fill="#4CAF50" stroke="#2d8a4e" strokeWidth="1.5"/>
              <path d="M51 65 Q78 54 74 38 Q60 44 51 60" fill="#66BB6A" stroke="#2d8a4e" strokeWidth="1.5"/>
              <path d="M50 40 Q44 25 50 8 Q56 25 50 40Z" fill="#81C784" stroke="#2d8a4e" strokeWidth="1.5"/>
              <g className="bee-on-leaf">
                <ellipse cx="66" cy="42" rx="11" ry="4.5" fill="#81C784" stroke="#2d8a4e" strokeWidth="1"/>
                <ellipse cx="70" cy="42" rx="7" ry="6.5" fill="#F4C542" stroke="#2d8a4e" strokeWidth="1.4"/>
                <path d="M64 37V47M67 36V48M70 36V48M73 37V47" stroke="#2d8a4e" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="78" cy="39" r="2.6" fill="var(--paper-raised)" stroke="#2d8a4e" strokeWidth="1"/>
              </g>
            </svg>
          </div>
        </div>

        <div className="growing-decor-right">
          <div className="growing-leaf leaf-4">
            <svg viewBox="0 0 100 130" width="60" height="78" className="leaf-stem-svg">
              <path d="M50 130 Q42 95 48 70 Q52 50 50 30" stroke="#2d8a4e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M47 85 Q20 74 24 58 Q38 64 47 80" fill="#81C784" stroke="#2d8a4e" strokeWidth="1.5"/>
              <path d="M51 65 Q78 54 74 38 Q60 44 51 60" fill="#66BB6A" stroke="#2d8a4e" strokeWidth="1.5"/>
              <path d="M50 40 Q44 25 50 8 Q56 25 50 40Z" fill="#4CAF50" stroke="#2d8a4e" strokeWidth="1.5"/>
            </svg>
          </div>

          <div className="growing-leaf leaf-5">
            <svg viewBox="0 0 100 130" width="55" height="71" className="leaf-stem-svg">
              <path d="M50 130 Q42 95 48 70 Q52 50 50 30" stroke="#2d8a4e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M47 85 Q20 74 24 58 Q38 64 47 80" fill="#4CAF50" stroke="#2d8a4e" strokeWidth="1.5"/>
              <path d="M51 65 Q78 54 74 38 Q60 44 51 60" fill="#81C784" stroke="#2d8a4e" strokeWidth="1.5"/>
              <path d="M50 40 Q44 25 50 8 Q56 25 50 40Z" fill="#66BB6A" stroke="#2d8a4e" strokeWidth="1.5"/>
            </svg>
          </div>

          <div className="growing-leaf leaf-6">
            <svg viewBox="0 0 100 130" width="65" height="84" className="leaf-stem-svg">
              <path d="M50 130 Q42 95 48 70 Q52 50 50 30" stroke="#2d8a4e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M47 85 Q20 74 24 58 Q38 64 47 80" fill="#66BB6A" stroke="#2d8a4e" strokeWidth="1.5"/>
              <path d="M51 65 Q78 54 74 38 Q60 44 51 60" fill="#4CAF50" stroke="#2d8a4e" strokeWidth="1.5"/>
              <path d="M50 40 Q44 25 50 8 Q56 25 50 40Z" fill="#81C784" stroke="#2d8a4e" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>
      </section>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Today</h1>
          <p className="hero-subtitle">
          Our mission is to prove that high achievement doesn't have to come at the cost of well-being. We help students navigate overwhelming coursework and packed schedules by generating personalized, stress-free daily plans.
          </p>
          <div className="hero-buttons">
            <button 
              onClick={() => setCurrentPage('login')} 
              className="hero-btn primary"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-header">
              <h3>Focused on your mental health</h3>
            </div>
            <div className="feature-preview">
              <p>Today's mission: More time to study. More time to live. More time for you.</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <h3>Today's agenda</h3>
            </div>
            <div className="feature-preview">
              <div className="flashcard-preview">
                <span className="flashcard-term">You have a meeting with the boss at 2pm</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
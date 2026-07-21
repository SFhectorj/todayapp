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


  if (currentPage === 'login') {
    return <LoginPage
      onBack={() => setCurrentPage('home')}
      onLoginSuccess={handleLoginSuccess}  // Changed
      onSignUp={() => setCurrentPage('profile')}
    />
  }

  if (currentPage === 'profile') {
    return <UserPage
      onBack={() => setCurrentPage('home')}
      onComplete={() => setCurrentPage('plan')}
    />
  }

  if (currentPage === 'plan') {
    return <PlanPage 
      onBack={() => setCurrentPage('home')} 
      user={user}
      onProfileClick={() => setCurrentPage('profile')}
      onScheduleCreated={(schedule) => {
        console.log('Schedule received in App:', schedule);
        setScheduleData(schedule);
        setCurrentPage('agenda');
      }}
    />
  }
  if (currentPage === 'agenda') {
    return <AgenaPage
    onBack={() => setCurrentPage('plan')}
    schedule={scheduleData}
    user={user}
    />
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-left">
          <h1 className="logo">Today</h1>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Today</h1>
          <p className="hero-subtitle">
            A useful app for students to lock in while being stress free
          </p>
          <div className="hero-buttons">
            <button onClick={() => setCurrentPage('login')} className="hero-btn primary">
              Login in
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
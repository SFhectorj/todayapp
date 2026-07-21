import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import './plan.css';

function PlanPage({ onBack, onProfileClick, user, onScheduleCreated }) {
  const [vibe, setVibe] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [schedule, setSchedule] = useState(null);
  const [calendarStatus, setCalendarStatus] = useState(null);
  const [vibeSubmitted, setVibeSubmitted] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await createPlan(tokenResponse.access_token);
    },
    onError: () => {
      setError('Failed to get Google access. Please try again.');
      setIsLoading(false);
    },
    scope: 'https://www.googleapis.com/auth/calendar'
  });

  const createPlan = async (accessToken) => {
    if (!selectedFile) {
      setError('Please upload a file');
      setIsLoading(false);
      return null;
    }

    const formData = new FormData();
    formData.append('vibe', vibe || 'Feeling okay');
    formData.append('syllabusPdf', selectedFile);
    if (accessToken) {
      formData.append('googleAccessToken', accessToken);
    }

    try {
      const response = await fetch('http://localhost:5001/api/plan-my-day', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to plan your day');
      }

      const result = await response.json();
      console.log('Schedule created:', result);
      
      if (result.success) {
        setSchedule(result.schedule);
        setCalendarStatus(result.calendar_status);
        setError('');
        
        if (onScheduleCreated && result.schedule) {
          console.log('Sending schedule to Agenda page:', result.schedule);
          onScheduleCreated(result.schedule);
        }
        
        return result;
      } else {
        setError(result.error || 'Failed to create schedule');
        return null;
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Error creating plan:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please upload a syllabus or document');
      return;
    }

    if (!vibe.trim()) {
      setError('Please set your vibe first');
      return;
    }

    setIsLoading(true);
    setError('');
    setSchedule(null);

    try {
      let result;
      if (user?.accessToken) {
        result = await createPlan(user.accessToken);
      } else if (user?.googleId) {
        googleLogin();
        return;
      } else {
        result = await createPlan(null);
      }

      if (result && result.schedule && onScheduleCreated) {
        onScheduleCreated(result.schedule);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  const handleVibeSubmit = (e) => {
    e.preventDefault();
    if (vibe.trim()) {
      console.log('Vibe submitted:', vibe);
      setVibeSubmitted(true);
      setError('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      console.log('File selected:', file.name);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      console.log('File dropped:', file.name);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <section id="plan-page">
      <div className="plan-header">
        <div className="plan-header-left">
          <button onClick={onBack} className="back-button-plan">
            Back
          </button>
          <h1>Today</h1>
        </div>
        
        <div className="plan-header-right">
          <span className="my-plan-label">My Plan</span>
          <button 
            className="profile-nav-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="User menu"
          >
            <span className="profile-name">{user?.name || 'User'}</span>
            <span className="profile-arrow">{showProfileMenu ? '▲' : '▼'}</span>
          </button>
          
          {showProfileMenu && (
            <div className="profile-dropdown">
              <button 
                className="dropdown-item"
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onProfileClick) onProfileClick();
                }}
              >
                My Profile
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  setShowProfileMenu(false);
                  console.log('Settings clicked');
                }}
              >
                Settings
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  setShowProfileMenu(false);
                  console.log('Logout clicked');
                  if (onBack) onBack();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="plan-card">
        <div className="welcome-section">
          <h2>Welcome {user?.name || 'User'}!</h2>
          {user?.email && <p className="user-email">{user.email}</p>}
          {user?.googleId && (
            <div className="google-badge">Connected to Google Calendar</div>
          )}
        </div>
        
        {error && <div className="error-message">{error}</div>}

        {isLoading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Creating your personalized schedule...</p>
          </div>
        )}

        <div className="vibe-section">
          <label htmlFor="vibe-input">What is the vibe today?</label>
          <form className="vibe-input-container" onSubmit={handleVibeSubmit}>
            <input
              id="vibe-input"
              type="text"
              placeholder="e.g., Focused, Creative, Chill, Stressed..."
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className="vibe-submit-btn" disabled={isLoading}>
              Set Vibe
            </button>
          </form>
          {vibeSubmitted && vibe && (
            <p className="vibe-confirmation">Vibe is: "{vibe}"</p>
          )}
        </div>

        <div className="upload-section">
          <label>Upload here (course syllabus, job schedule):</label>
          <div 
            className={`upload-area ${isDragging ? 'dragover' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
              disabled={isLoading}
            />

            <p className="upload-text">
              <strong>Click to upload</strong> or drag and drop
            </p>
            <p className="upload-subtext">
              PDF, DOC, TXT, PNG, JPG (Max 10MB)
            </p>
          </div>

          {selectedFile && (
            <div className="file-preview">
              <div className="file-info">
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">({formatFileSize(selectedFile.size)})</span>
              </div>
              <button className="file-remove" onClick={handleFileRemove} disabled={isLoading}>
                ×
              </button>
            </div>
          )}

          <div className="flower-submit-wrapper">
            <button
              className="plan-submit-btn"
              onClick={handlePlanSubmit}
              disabled={isLoading || !selectedFile || !vibe.trim()}
            >
              <span className="btn-text">
                {isLoading ? 'Planning...' : 'Create my schedule'}
              </span>
            </button>
          </div>
        </div>

        {schedule && (
          <div className="schedule-result">
            <h3>Your Personalized Schedule</h3>
            {calendarStatus && (
              <div className="calendar-status">
                {calendarStatus.success ? (
                  <p className="calendar-success">Events added to Google Calendar!</p>
                ) : (
                  <p className="calendar-error">Failed to add events: {calendarStatus.error}</p>
                )}
              </div>
            )}
            <div className="schedule-list">
              {schedule.map((item, index) => (
                <div key={index} className="schedule-item">
                  <h4>{item.title}</h4>
                  <p className="schedule-time">
                    {new Date(item.startTime).toLocaleTimeString()} - {new Date(item.endTime).toLocaleTimeString()}
                  </p>
                  {item.healthTip && (
                    <p className="health-tip">{item.healthTip}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="growing-flower flower-1">
        <svg viewBox="0 0 100 130" width="70" height="91" className="flower-stem-svg">
          <path d="M50 130 Q42 95 48 70 Q52 50 50 30" stroke="#2d8a4e" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M47 85 Q28 72 32 60 Q40 66 47 80" fill="#3ca55c" opacity="0.9"/>
          <path d="M51 65 Q72 52 66 40 Q58 46 51 60" fill="#3ca55c" opacity="0.9"/>
          <circle cx="50" cy="25" r="8" fill="#FF5C8A"/>
          <circle cx="58" cy="30" r="8" fill="#FF7BA0"/>
          <circle cx="58" cy="19" r="8" fill="#FF3D6B"/>
          <circle cx="42" cy="30" r="8" fill="#FF7BA0"/>
          <circle cx="42" cy="19" r="8" fill="#FF3D6B"/>
          <circle cx="50" cy="14" r="8" fill="#FF5C8A"/>
          <circle cx="50" cy="25" r="5" fill="#FFD166"/>
          <circle cx="50" cy="25" r="2.5" fill="#FFEAA7"/>
        </svg>
      </div>

      <div className="growing-flower flower-2">
        <svg viewBox="0 0 100 130" width="65" height="84" className="flower-stem-svg">
          <path d="M50 130 Q42 95 48 70 Q52 50 50 30" stroke="#2d8a4e" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M47 85 Q28 72 32 60 Q40 66 47 80" fill="#3ca55c" opacity="0.9"/>
          <path d="M51 65 Q72 52 66 40 Q58 46 51 60" fill="#3ca55c" opacity="0.9"/>
          <circle cx="50" cy="25" r="8" fill="#9B59B6"/>
          <circle cx="58" cy="30" r="8" fill="#AF7AC5"/>
          <circle cx="58" cy="19" r="8" fill="#8E44AD"/>
          <circle cx="42" cy="30" r="8" fill="#AF7AC5"/>
          <circle cx="42" cy="19" r="8" fill="#8E44AD"/>
          <circle cx="50" cy="14" r="8" fill="#9B59B6"/>
          <circle cx="50" cy="25" r="5" fill="#F9E79F"/>
          <circle cx="50" cy="25" r="2.5" fill="#FFF9C4"/>
        </svg>
      </div>

      <div className="growing-flower flower-3">
        <svg viewBox="0 0 100 130" width="60" height="78" className="flower-stem-svg">
          <path d="M50 130 Q42 95 48 70 Q52 50 50 30" stroke="#2d8a4e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M47 85 Q28 72 32 60 Q40 66 47 80" fill="#3ca55c" opacity="0.9"/>
          <path d="M51 65 Q72 52 66 40 Q58 46 51 60" fill="#3ca55c" opacity="0.9"/>
          <circle cx="50" cy="25" r="7" fill="#F1C40F"/>
          <circle cx="57" cy="30" r="7" fill="#F4D03F"/>
          <circle cx="57" cy="19" r="7" fill="#F39C12"/>
          <circle cx="43" cy="30" r="7" fill="#F4D03F"/>
          <circle cx="43" cy="19" r="7" fill="#F39C12"/>
          <circle cx="50" cy="14" r="7" fill="#F1C40F"/>
          <circle cx="50" cy="25" r="4.5" fill="#E67E22"/>
          <circle cx="50" cy="25" r="2" fill="#F5B041"/>
        </svg>
      </div>

      <div className="growing-flower flower-4">
        <svg viewBox="0 0 100 130" width="55" height="71" className="flower-stem-svg">
          <path d="M50 130 Q42 95 48 70 Q52 50 50 30" stroke="#2d8a4e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M47 85 Q28 72 32 60 Q40 66 47 80" fill="#3ca55c" opacity="0.9"/>
          <path d="M51 65 Q72 52 66 40 Q58 46 51 60" fill="#3ca55c" opacity="0.9"/>
          <circle cx="50" cy="25" r="7" fill="#3498DB"/>
          <circle cx="57" cy="30" r="7" fill="#5DADE2"/>
          <circle cx="57" cy="19" r="7" fill="#2E86C1"/>
          <circle cx="43" cy="30" r="7" fill="#5DADE2"/>
          <circle cx="43" cy="19" r="7" fill="#2E86C1"/>
          <circle cx="50" cy="14" r="7" fill="#3498DB"/>
          <circle cx="50" cy="25" r="4.5" fill="#F9E79F"/>
          <circle cx="50" cy="25" r="2" fill="#FFF9C4"/>
        </svg>
      </div>

      <div className="growing-flower flower-5">
        <svg viewBox="0 0 100 130" width="70" height="91" className="flower-stem-svg">
          <path d="M50 130 Q42 95 48 70 Q52 50 50 30" stroke="#2d8a4e" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M47 85 Q28 72 32 60 Q40 66 47 80" fill="#3ca55c" opacity="0.9"/>
          <path d="M51 65 Q72 52 66 40 Q58 46 51 60" fill="#3ca55c" opacity="0.9"/>
          <circle cx="50" cy="25" r="8" fill="#E67E22"/>
          <circle cx="58" cy="30" r="8" fill="#EB984E"/>
          <circle cx="58" cy="19" r="8" fill="#D35400"/>
          <circle cx="42" cy="30" r="8" fill="#EB984E"/>
          <circle cx="42" cy="19" r="8" fill="#D35400"/>
          <circle cx="50" cy="14" r="8" fill="#E67E22"/>
          <circle cx="50" cy="25" r="5" fill="#F1C40F"/>
          <circle cx="50" cy="25" r="2.5" fill="#F9E79F"/>
        </svg>
      </div>
    </section>
  );
}

export default PlanPage;
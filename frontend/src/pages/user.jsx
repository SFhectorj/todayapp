import { useState } from 'react'
import './user.css'

function UserPage({ onBack, onComplete }) {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    university: '',
    major: '',
    school_level: '',
    graduation_year: '',
    job: '',
    extracurriculars: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!profile.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!profile.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!profile.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (profile.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }
    if (!profile.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Email is invalid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccess(false)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      console.log('Student profile data submitted:', profile)
      setIsSubmitting(false)
      setSuccess(true)

      if (onComplete) {
        onComplete(profile)
      }

      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    }, 1500)
  }

  const handleReset = () => {
    setProfile({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      university: '',
      major: '',
      school_level: '',
      graduation_year: '',
      job: '',
      extracurriculars: ''
    })
    setErrors({})
    setSuccess(false)
  }

  const currentYear = new Date().getFullYear()
  const graduationYears = []
  for (let i = 0; i <= 6; i++) {
    graduationYears.push(currentYear + i)
  }

  return (
    <section id="user-profile">
      <div className="user-card">
        <div className="profile-header">
          <button onClick={onBack} className="back-button">
            ← Back to Login
          </button>
          <h3>Student Profile</h3>
        </div>

        {success && (
          <div className="success-message">
            Profile saved successfully
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={profile.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={profile.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              id="username"
              name="username"
              type="text"
              value={profile.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="university">University / College *</label>
            <input
              id="university"
              name="university"
              type="text"
              value={profile.university}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="major">Major *</label>
              <input
                id="major"
                name="major"
                type="text"
                value={profile.major}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="school_level">School Level *</label>
              <select
                id="school_level"
                name="school_level"
                value={profile.school_level}
                onChange={handleChange}
              >
                <option value="">Select school level *</option>
                <option value="freshman">Freshman</option>
                <option value="sophomore">Sophomore</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
                <option value="masters">Master's Student</option>
                <option value="phd">PhD Student</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="graduation_year">Expected Graduation Year *</label>
              <select
                id="graduation_year"
                name="graduation_year"
                value={profile.graduation_year}
                onChange={handleChange}
              >
                <option value="">Select graduation year</option>
                {graduationYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="job">Current Job / Internship</label>
            <input
              id="job"
              name="job"
              type="text"
              value={profile.job}
              onChange={handleChange}
            />
          </div>


          <div className="form-group">
            <label htmlFor="extracurriculars">Extracurricular Activities </label>
            <input
              id="extracurriculars"
              name="extracurriculars"
              type="text"
              value={profile.extracurriculars}
              onChange={handleChange}
            />
          </div>



          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default UserPage
# Today App

Today App is a lifestyle and wellness planning app for students. It generates personalized daily plans from a student's coursework, schedule, and mood, so staying on top of classes, jobs, and extracurriculars doesn't come at the cost of health and well-being.

Students take an average of 5 classes a semester, requiring roughly 60 hours a week of study time on top of jobs and extracurriculars. That workload is a major contributor to student stress and mental health challenges (see [NEA: Mental Health Crisis on College Campuses](https://www.nea.org/nea-today/all-news-articles/mental-health-crisis-college-campuses)). Today App helps by turning syllabi, assignments, and daily check-ins into a manageable, personalized schedule, with wellness nudges built in.

## Features

### User
- User login and authentication
- User profile: description, school, year, job, extracurriculars, etc.
- Profile data is used as context for Claude to personalize recommendations

### Main Page
- **Check-in prompt**: "How are you feeling? What kind of day is today? What's today's vibe?" — used as context to prepare the day's plan
- **Add todo context**: upload a file or copy/paste content directly
- **Document intake**: accepts syllabi, assignments, and other course materials
- **Output**:
  - Optionally redirects to a dedicated plan/results page
  - Text-based study plan derived from the syllabus
  - Text-based plan with specific topics to review, based on assignments/tests
  - Extracurricular and job schedule analysis, integrated into the daily plan
  - Health guidance based on syllabus/assignment workload, prioritizing mental health (e.g., "This is a difficult topic; pace yourself, take breaks, try deep breathing" generated via Claude)
- **Progress tracking**: context on what has already been completed

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Flask |
| Database | SQLite |
| Deployment | Vercel |

## Integrations

- **Google Calendar API** — sync and schedule daily plans
- **Claude AI** — generate personalized study plans and wellness/mental health guidance
- **Google Fonts CSS API** — typography

## Installation

> Setup instructions coming soon as development progresses.

```bash
# Clone the repo
git clone https://github.com/your-org/today-app.git
cd today-app

# Backend setup
cd backend
pip install -r requirements.txt
flask run

# Frontend setup
cd ../frontend
npm install
npm start
```

## Usage

1. Sign up and complete your profile (school, year, job, extracurriculars).
2. On the main page, share how you're feeling and what kind of day it is.
3. Upload a syllabus, assignment, or other course material.
4. Review your generated daily plan, complete with study topics, schedule integration, and wellness recommendations.
5. Track completed tasks and check back in daily.

## Roadmap

- [ ] User authentication and profile management
- [ ] File upload and parsing (syllabus/assignments)
- [ ] Claude-powered plan generation
- [ ] Google Calendar sync
- [ ] Wellness recommendation engine
- [ ] Deployment to Vercel

## Status

Early-stage project / concept documentation.

## References

- [NEA: Mental Health Crisis on College Campuses](https://www.nea.org/nea-today/all-news-articles/mental-health-crisis-college-campuses)
<img width="461" height="400" alt="app-flow-wireframe" src="https://github.com/user-attachments/assets/8f576203-d496-4af4-96ad-6a73c75bbc3c" />

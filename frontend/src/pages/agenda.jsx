import { useState } from 'react'
import './agenda.css'

const START_HOUR = 8
const END_HOUR = 22
const HOUR_HEIGHT = 110 
const SHORT_EVENT_MINUTES = 30
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i)

function formatHourLabel(hour) {
  const period = hour < 12 || hour === 24 ? 'AM' : 'PM'
  let displayHour = hour % 12
  if (displayHour === 0) displayHour = 12
  return `${displayHour} ${period}`
}

// Convert the time into hours
function getHourFromISO(isoString) {
  const date = new Date(isoString)
  return date.getHours() + date.getMinutes() / 60
}

//Formats the time for display
function formatTimeDisplay(isoString) {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}


function layoutEvents(events) {
  const sorted = [...events].sort((a, b) => a.start - b.start || a.end - b.end)

  const clusters = []
  let currentCluster = []
  let clusterEnd = -Infinity

  for (const evt of sorted) {
    if (currentCluster.length === 0 || evt.start < clusterEnd) {
      currentCluster.push(evt)
      clusterEnd = Math.max(clusterEnd, evt.end)
    } else {
      clusters.push(currentCluster)
      currentCluster = [evt]
      clusterEnd = evt.end
    }
  }
  if (currentCluster.length) clusters.push(currentCluster)

  const laidOut = []

  for (const cluster of clusters) {
    const columns = [] 
    const withColumns = cluster.map((evt) => {
      let colIndex = columns.findIndex((endTime) => endTime <= evt.start)
      if (colIndex === -1) {
        colIndex = columns.length
        columns.push(evt.end)
      } else {
        columns[colIndex] = evt.end
      }
      return { ...evt, column: colIndex }
    })

    const columnCount = columns.length
    withColumns.forEach((evt) => laidOut.push({ ...evt, columnCount }))
  }

  return laidOut
}

function AgendaPage({ onBack, schedule, user }) {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const dayStart = START_HOUR
  const totalHours = END_HOUR - START_HOUR + 1

  console.log('AgendaPage received schedule:', schedule)

  const hasSchedule = schedule && Array.isArray(schedule) && schedule.length > 0

  const events = hasSchedule
    ? schedule.map((item, index) => {
        const startHour = getHourFromISO(item.startTime)
        const endHour = getHourFromISO(item.endTime)
        const durationMinutes = (endHour - startHour) * 60
        let type = 'focus'
        const titleLower = item.title.toLowerCase()
        if (titleLower.includes('break') || titleLower.includes('rest') || titleLower.includes('lunch')) {
          type = 'break'
        } else if (titleLower.includes('meeting') || titleLower.includes('call') || titleLower.includes('appointment')) {
          type = 'meeting'
        } else if (titleLower.includes('exercise') || titleLower.includes('gym') || titleLower.includes('walk')) {
          type = 'break'
        }

        const titleLength = item.title.length

        return {
          id: index + 1,
          title: item.title,
          start: startHour,
          end: endHour,
          type: type,
          isShort: durationMinutes < SHORT_EVENT_MINUTES,
          titleSizeClass:
            titleLength > 70 ? 'title-xs' : titleLength > 45 ? 'title-sm' : '',
          healthTip: item.healthTip || null,
          startTime: item.startTime,
          endTime: item.endTime,
          startDisplay: formatTimeDisplay(item.startTime),
          endDisplay: formatTimeDisplay(item.endTime)
        }
      })
    : []

  console.log('Processed events:', events)

  // Show message if no schedule
  if (!hasSchedule) {
    return (
      <div className="agenda-page">
        <header className="agenda-header">
          <button onClick={onBack} className="agenda-back">
            ← Back
          </button>
        </header>
        <div className="empty-state">
          <p> Go back to the Plan page and create your schedule</p>
        </div>
      </div>
    )
  }

  return (
    <div className="agenda-page">
      <header className="agenda-header">
        <button onClick={onBack} className="agenda-back">
          ← Back
        </button>
        <div className="agenda-title-block">
          <h1> Today is your day!</h1>
          {user && user.name && <p className="agenda-subtitle">Welcome, {user.name}!</p>}
          <p className="agenda-subtitle">{events.length} tasks planned for today</p>
        </div>
      </header>

      <div className="agenda-grid-wrapper">
        <div
          className="agenda-grid"
          style={{ '--total-hours': totalHours, '--hour-height': `${HOUR_HEIGHT}px` }}
        >

          <div className="time-column">
            {HOURS.map((hour) => (
              <div key={hour} className="time-slot">
                <span className="time-label">{formatHourLabel(hour)}</span>
              </div>
            ))}
          </div>

          <div className="events-column">
            {HOURS.map((hour) => (
              <div key={hour} className="hour-row" />
            ))}

            {layoutEvents(
              events.filter((evt) => evt.start >= dayStart && evt.start <= END_HOUR + 1)
            ).map((evt) => {
                const top = (evt.start - dayStart) * HOUR_HEIGHT
                const height = Math.max((evt.end - evt.start) * HOUR_HEIGHT - 4, 30)


                const columnGapPx = 6
                const widthPercent = 100 / evt.columnCount
                const leftPercent = widthPercent * evt.column

                const positionStyle =
                  evt.columnCount > 1
                    ? {
                        top: `${top}px`,
                        height: `${height}px`,
                        left: `calc(${leftPercent}% + ${evt.column === 0 ? 10 : columnGapPx / 2}px)`,
                        right: 'auto',
                        width: `calc(${widthPercent}% - ${
                          evt.column === 0 || evt.column === evt.columnCount - 1
                            ? 10 + columnGapPx / 2
                            : columnGapPx
                        }px)`
                      }
                    : { top: `${top}px`, height: `${height}px` }

                return (
                  <button
                    key={evt.id}
                    className={`agenda-event event-${evt.type} ${evt.isShort ? 'event-short' : ''} ${evt.titleSizeClass} ${evt.columnCount > 1 ? 'event-overlapping' : ''}`}
                    style={positionStyle}
                    onClick={() => setSelectedEvent(evt)}
                  >
                    <span className="event-title">{evt.title}</span>
                    <span className="event-time">
                      {evt.startDisplay} – {evt.endDisplay}
                    </span>
                  </button>
                )
              })}
          </div>
        </div>
      </div>


      {selectedEvent && (
        <div className="event-detail-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className="event-detail-card" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedEvent.title}</h3>
            <p className="event-detail-time">
              {selectedEvent.startDisplay} – {selectedEvent.endDisplay}
            </p>
            {selectedEvent.healthTip && (
              <div className="event-tip-container">
                <p className="event-tip"> {selectedEvent.healthTip}</p>
              </div>
            )}
            <button onClick={() => setSelectedEvent(null)} className="event-detail-close">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgendaPage
import React, { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import {
  createCalendarCells,
  getDateKey,
  months,
  moveMonth,
  weekdays,
} from '../utils/calendar'

const initialView = { year: 2026, month: 8 }

export default function Calendar({
  entries,
  isUploader,
  onEntrySelect,
  onNewEntry,
  onMessage,
}) {
  const [view, setView] = useState(initialView)
  const cells = useMemo(
    () => createCalendarCells(view.year, view.month),
    [view.month, view.year],
  )
  const todayKey = getDateKey(new Date())

  const showToday = () => {
    const today = new Date()
    setView({ year: today.getFullYear(), month: today.getMonth() })
  }

  const selectDate = (date, key, entry) => {
    if (!date) return
    if (entry) {
      onEntrySelect({ key, ...entry })
      return
    }
    if (isUploader) onNewEntry(date)
  }

  return (
    <section className="calendar-card">
      <div className="calendar-heading">
        <div>
          <p className="section-kicker">Kalender</p>
          <h2>{months[view.month]} {view.year}</h2>
        </div>
        <div className="calendar-controls">
          <button className="today-button" onClick={showToday}>Heute</button>
          <button
            className="round-button"
            onClick={() => setView((current) => moveMonth(current, -1))}
            aria-label="Vorheriger Monat"
          >
            <ChevronLeft />
          </button>
          <button
            className="round-button"
            onClick={() => setView((current) => moveMonth(current, 1))}
            aria-label="Nächster Monat"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="weekday-row">
        {weekdays.map((day) => <div key={day}>{day}</div>)}
      </div>
      <div className="calendar-grid">
        {cells.map((date, index) => {
          const key = date ? getDateKey(date) : null
          const entry = key ? entries[key] : null
          const className = [
            'day-cell',
            !date && 'empty',
            entry && 'has-entry',
            key === todayKey && 'today',
          ].filter(Boolean).join(' ')

          return (
            <div
              key={key ?? `empty-${index}`}
              className={className}
              onClick={() => selectDate(date, key, entry)}
            >
              {date && (
                <>
                  <span className="day-number">{date.getDate()}</span>
                  {entry && (
                    <>
                      <img src={entry.image} alt="" />
                      <span className="entry-dot" />
                    </>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
      <div className="calendar-footer">
        <span><i className="legend-dot" /> Mit Inhalt</span>
        <span><i className="legend-today" /> Heute</span>
        {isUploader && (
          <button
            className="add-entry"
            onClick={() => onMessage('Wähle einen freien Tag im Kalender aus.')}
          >
            <Plus size={16} /> Eintrag hinzufügen
          </button>
        )}
      </div>
    </section>
  )
}

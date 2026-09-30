import React from 'react'
import { X } from 'lucide-react'
import { formatLongDate } from '../utils/calendar'

export default function EntryDetailModal({
  entry,
  isUploader,
  onClose,
  onEdit,
}) {
  if (!entry) return null

  const entryDate = new Date(`${entry.key}T12:00:00`)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <article
        className="detail-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="close-button" onClick={onClose} aria-label="Schließen">
          <X />
        </button>
        <img className="hero-image" src={entry.image} alt="" />
        <div className="modal-body">
          <p className="modal-date">{formatLongDate(entryDate)}</p>
          <h2>{entry.title}</h2>
          <div className="modal-meta">
            <span>Von {entry.ownerName || 'Unbekannt'}</span>
            {isUploader && <button onClick={onEdit}>Eintrag bearbeiten</button>}
          </div>
        </div>
      </article>
    </div>
  )
}

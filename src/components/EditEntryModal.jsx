import React, { useState } from 'react'
import { X } from 'lucide-react'
import { formatLongDate } from '../utils/calendar'

export default function EditEntryModal({ entry, onClose, onSubmit }) {
  const [file, setFile] = useState(null)
  const [text, setText] = useState(entry?.text || entry?.title || '')
  const [saving, setSaving] = useState(false)

  if (!entry) return null

  const entryDate = new Date(`${entry.key}T12:00:00`)

  const close = () => {
    if (!saving) onClose()
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!text.trim()) return

    setSaving(true)
    try {
      await onSubmit({ key: entry.key, file, text })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={close}>
      <form
        className="upload-modal edit-modal"
        onClick={(event) => event.stopPropagation()}
        onSubmit={submit}
      >
        <button
          type="button"
          className="close-button"
          onClick={close}
          aria-label="Schließen"
        >
          <X />
        </button>
        <div className="upload-body">
          <p className="modal-date">Eintrag bearbeiten</p>
          <h2>{formatLongDate(entryDate)}</h2>
          {entry.image && (
            <img className="edit-image-preview" src={entry.image} alt="Aktuelles Bild" />
          )}
          <label>
            Bild ersetzen <span className="optional-label">(optional)</span>
            <input
              type="file"
              accept="image/jpeg,image/png,.jpg,.jpeg,.png"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
          </label>
          <label>
            Freitext
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Was ist an diesem Tag passiert?"
              maxLength={500}
              required
            />
          </label>
          <button className="submit-upload" type="submit" disabled={saving}>
            {saving ? 'Wird gespeichert …' : 'Änderungen speichern'}
          </button>
        </div>
      </form>
    </div>
  )
}

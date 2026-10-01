import React, { useState } from 'react'
import { X } from 'lucide-react'
import { formatLongDate } from '../utils/calendar'

export default function UploadModal({ date, onClose, onSubmit }) {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [uploading, setUploading] = useState(false)

  if (!date) return null

  const close = () => {
    if (!uploading) onClose()
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!file || !text.trim()) return

    setUploading(true)
    try {
      await onSubmit({ date, file, text })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={close}>
      <form
        className="upload-modal"
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
          <p className="modal-date">Neuer Eintrag</p>
          <h2>{formatLongDate(date)}</h2>
          <label>
            Bild
            <input
              type="file"
              accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              required
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
          <button className="submit-upload" type="submit" disabled={uploading}>
            {uploading ? 'Wird hochgeladen …' : 'Bild hochladen'}
          </button>
        </div>
      </form>
    </div>
  )
}

import React, { useState } from 'react'
import { CloudSun, ImagePlus, Sparkles, X } from 'lucide-react'
import Calendar from './components/Calendar'
import EntryDetailModal from './components/EntryDetailModal'
import Header from './components/Header'
import UploadModal from './components/UploadModal'
import { useAuth } from './hooks/useAuth'
import { useCalendarEntries } from './hooks/useCalendarEntries'
import { createCalendarEntry } from './services/calendarService'
import { getUserDisplayName } from './utils/user'

export default function App() {
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [uploadDate, setUploadDate] = useState(null)
  const [message, setMessage] = useState('')
  const { user, profile, login, logout } = useAuth(setMessage)
  const entries = useCalendarEntries(user, setMessage)
  const userDisplayName = getUserDisplayName(user, profile)
  const isUploader = (
    profile?.role === 'uploader' || user?.email === 'demo@example.com'
  )
  const roleLabel = profile?.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : user
      ? 'Keine Rolle'
      : 'Wird geladen …'

  const uploadEntry = async ({ date, file, text }) => {
    if (!user) {
      setMessage('Bitte melde dich vor dem Hochladen an.')
      return
    }

    try {
      await createCalendarEntry({
        date,
        file,
        text,
        userId: user.uid,
        ownerName: userDisplayName,
      })
      setUploadDate(null)
      setMessage('Bild wurde erfolgreich hochgeladen.')
    } catch (error) {
      console.error('Upload fehlgeschlagen:', error)
      setMessage('Der Upload konnte nicht abgeschlossen werden.')
    }
  }

  return (
    <div className="app-shell">
      <Header
        user={user}
        roleLabel={roleLabel}
        onLogin={login}
        onLogout={logout}
      />

      <main id="top" className="main-content">

        <Calendar
          entries={entries}
          isUploader={isUploader}
          onEntrySelect={setSelectedEntry}
          onNewEntry={setUploadDate}
          onMessage={setMessage}
        />
      </main>
      <EntryDetailModal
        entry={selectedEntry}
        isUploader={isUploader}
        onClose={() => setSelectedEntry(null)}
        onEdit={() => setMessage(
          'Bearbeitung ist bereit für deinen Firebase-Eintrag.',
        )}
      />
      <UploadModal
        date={uploadDate}
        onClose={() => setUploadDate(null)}
        onSubmit={uploadEntry}
      />

      {message && (
        <div className="toast" onClick={() => setMessage('')}>
          {message}
          <X size={15} />
        </div>
      )}
    </div>
  )
}

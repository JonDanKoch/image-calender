import { useEffect, useState } from 'react'
import { demoEntries } from '../data/demoEntries'
import { firebaseEnabled } from '../firebase'
import { subscribeToCalendarEntries } from '../services/calendarService'

export function useCalendarEntries(user, onMessage) {
  const [entries, setEntries] = useState(firebaseEnabled ? {} : demoEntries)

  useEffect(() => {
    if (!firebaseEnabled) return undefined
    if (!user) {
      setEntries({})
      return undefined
    }

    return subscribeToCalendarEntries(setEntries, (error) => {
      console.error('Kalendereinträge konnten nicht geladen werden:', error)
      onMessage('Die Kalendereinträge konnten nicht geladen werden.')
    })
  }, [onMessage, user])

  return entries
}

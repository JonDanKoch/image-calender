import { useEffect, useState } from 'react'
import {
  getAuthErrorMessage,
  loginWithGoogle,
  logout as logoutUser,
  subscribeToAuth,
  subscribeToProfile,
} from '../services/authService'

export function useAuth(onMessage) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => subscribeToAuth(setUser), [])

  useEffect(() => {
    setProfile(null)
    if (!user) return undefined

    return subscribeToProfile(user.uid, setProfile, (error) => {
      console.error('Profil konnte nicht geladen werden:', error)
      onMessage('Das Benutzerprofil konnte nicht geladen werden.')
    })
  }, [onMessage, user])

  const login = async () => {
    try {
      const firebaseAvailable = await loginWithGoogle()

      if (!firebaseAvailable) {
        onMessage('Demo-Modus: Firebase ist noch nicht konfiguriert.')
      }
    } catch (error) {
      console.error('Anmeldung fehlgeschlagen:', error)
      onMessage(getAuthErrorMessage(error))
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error('Abmeldung fehlgeschlagen:', error)
      onMessage('Die Abmeldung konnte nicht abgeschlossen werden.')
    }
  }

  return { user, profile, login, logout }
}

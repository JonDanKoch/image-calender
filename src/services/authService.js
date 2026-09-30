import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase'

export function subscribeToAuth(callback) {
  if (!auth) return () => {}

  return onAuthStateChanged(auth, callback)
}

export function subscribeToProfile(userId, onProfile, onError) {
  if (!db || !userId) return () => {}

  return onSnapshot(
    doc(db, 'users', userId),
    (snapshot) => onProfile(snapshot.exists() ? snapshot.data() : null),
    onError,
  )
}

export async function loginWithGoogle() {
  if (!auth) return false

  await signInWithPopup(auth, googleProvider)
  return true
}

export function getAuthErrorMessage(error) {
  const hostname = typeof window === 'undefined' ? '' : window.location.hostname

  const messages = {
    'auth/operation-not-allowed': 'Google ist in Firebase nicht als Anmeldemethode aktiviert.',
    'auth/popup-blocked': 'Der Browser hat das Anmeldefenster blockiert. Bitte Popups für diese Seite erlauben.',
    'auth/popup-closed-by-user': 'Das Anmeldefenster wurde geschlossen.',
    'auth/unauthorized-domain': `Die Domain ${hostname || 'dieser Seite'} ist in Firebase nicht freigegeben.`,
    'auth/web-storage-unsupported': 'Der Browser blockiert den für die Anmeldung benötigten Speicher.',
    'auth/network-request-failed': 'Firebase konnte nicht erreicht werden. Bitte die Internetverbindung prüfen.',
  }

  return messages[error?.code]
    ?? `Anmeldung fehlgeschlagen (${error?.code || 'unbekannter Fehler'}).`
}

export async function logout() {
  if (auth) await signOut(auth)
}

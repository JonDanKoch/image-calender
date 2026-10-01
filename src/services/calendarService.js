import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '../firebase'
import { getDateKey } from '../utils/calendar'

function createUploadId() {
  const browserCrypto = globalThis.crypto

  if (typeof browserCrypto?.randomUUID === 'function') {
    return browserCrypto.randomUUID()
  }

  if (typeof browserCrypto?.getRandomValues === 'function') {
    const randomValues = new Uint32Array(4)
    browserCrypto.getRandomValues(randomValues)
    return Array.from(randomValues, (value) => value.toString(16)).join('-')
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function getImageContentType(file) {
  if (file.type) return file.type.toLowerCase()

  const extension = file.name.split('.').pop()?.toLowerCase()
  const contentTypes = {
    heic: 'image/heic',
    heif: 'image/heif',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
  }

  return contentTypes[extension] || 'application/octet-stream'
}

function mapEntries(snapshot) {
  const entries = {}

  snapshot.forEach((entryDocument) => {
    const data = entryDocument.data()

    entries[entryDocument.id] = {
      ...data,
      image: data.image || data.images?.[0] || '',
      title: data.title || data.text || '',
      place: data.place || '',
      ownerName: data.ownerName || data.authorName || data.author?.name || '',
    }
  })

  return entries
}

export function subscribeToCalendarEntries(onEntries, onError) {
  if (!db) return () => {}

  const entriesQuery = query(
    collection(db, 'calendarEntries'),
    orderBy('date'),
  )

  return onSnapshot(
    entriesQuery,
    (snapshot) => onEntries(mapEntries(snapshot)),
    onError,
  )
}

export async function createCalendarEntry({
  date,
  file,
  text,
  userId,
  ownerName,
}) {
  if (!db || !storage) {
    throw new Error('Firebase ist nicht konfiguriert.')
  }

  const key = getDateKey(date)
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const imageReference = ref(
    storage,
    `calendar/${key}/${createUploadId()}-${safeName}`,
  )

  await uploadBytes(imageReference, file, {
    contentType: getImageContentType(file),
  })
  const imageUrl = await getDownloadURL(imageReference)
  const trimmedText = text.trim()

  await setDoc(doc(db, 'calendarEntries', key), {
    ownerId: userId,
    ownerName,
    date: key,
    images: [imageUrl],
    text: trimmedText,
    title: trimmedText,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateCalendarEntry({ key, file, text }) {
  if (!db || !storage) {
    throw new Error('Firebase ist nicht konfiguriert.')
  }

  const trimmedText = text.trim()
  const changes = {
    text: trimmedText,
    title: trimmedText,
    updatedAt: serverTimestamp(),
  }

  if (file) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const imageReference = ref(
      storage,
      `calendar/${key}/${createUploadId()}-${safeName}`,
    )

    await uploadBytes(imageReference, file, {
      contentType: getImageContentType(file),
    })
    const imageUrl = await getDownloadURL(imageReference)
    changes.images = [imageUrl]
  }

  await setDoc(doc(db, 'calendarEntries', key), changes, { merge: true })
}

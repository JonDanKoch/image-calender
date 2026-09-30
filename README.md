# Bildkalender

Responsive Kalender-PWA mit React, Vite und Firebase Authentication, Firestore und Storage.

## Start

```bash
npm install
copy .env.example .env.local
npm run dev
```

Ohne Firebase-Variablen startet die Anwendung im Demo-Modus mit Beispielbildern. Für den Produktivbetrieb die Variablen in `.env.local` setzen, Google als Sign-in Provider aktivieren und die Regeln aus `firestore.rules` sowie `storage.rules` deployen.

## Freigabe und Rollen

Der Admin legt Benutzer manuell in `users/{uid}` an. Das Dokument darf ausschließlich serverseitig oder über die Firebase Console erstellt werden:

```json
{ "role": "viewer" }
```

Für Upload-Rechte wird `role` auf `uploader` gesetzt. Der Client kann Rollen nicht schreiben; die Security Rules prüfen die Rolle bei jedem Zugriff. Ein Eintrag wird als Dokument mit dem Tages-Key `YYYY-MM-DD` in `calendarEntries` gespeichert und enthält mindestens `ownerId`, `date`, `images`, `text`, `createdAt` und `updatedAt`.

## PWA

Die Anwendung ist für die PWA-Nutzung vorbereitet (responsives Layout, Touch-Flächen, installierbare Vite-Basis). Für die eigentliche Offline-Cache-Strategie kann im Hosting-Projekt noch `vite-plugin-pwa` ergänzt werden, sobald das gewünschte Cache-Verhalten feststeht.

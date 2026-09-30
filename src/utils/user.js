function getEmailName(email) {
  const localPart = email?.split('@')[0]

  if (!localPart) return ''

  return localPart
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export function getUserDisplayName(user, profile) {
  const profileFullName = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .join(' ')

  return (
    profile?.displayName?.trim()
    || profile?.name?.trim()
    || profileFullName.trim()
    || user?.displayName?.trim()
    || getEmailName(user?.email)
    || 'Unbekannt'
  )
}

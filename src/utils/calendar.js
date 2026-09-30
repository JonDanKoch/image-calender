export const months = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]

export const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

export function getDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function createCalendarCells(year, month) {
  const firstDay = new Date(year, month, 1)
  const offset = (firstDay.getDay() + 6) % 7
  const numberOfDays = new Date(year, month + 1, 0).getDate()
  const cells = Array.from({ length: offset }, () => null)

  for (let day = 1; day <= numberOfDays; day += 1) {
    cells.push(new Date(year, month, day))
  }

  while (cells.length % 7 !== 0) cells.push(null)

  return cells
}

export function moveMonth(view, delta) {
  const date = new Date(view.year, view.month + delta, 1)

  return { year: date.getFullYear(), month: date.getMonth() }
}

export function formatLongDate(date) {
  return date.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

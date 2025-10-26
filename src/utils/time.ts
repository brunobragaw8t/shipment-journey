export function formatDuration(duration: number): string {
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  return `${hours}h ${minutes}m`
}

export function formatMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`
}

export function calcTravelMinutes(distanceKm: number, velocityKmH: number): number {
  return (distanceKm / velocityKmH) * 60
}

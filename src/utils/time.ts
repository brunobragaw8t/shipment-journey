export function formatDuration(duration: number): string {
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  return `${hours}h ${minutes}m`
}

export function calcTravelMinutes(distanceKm: number, velocityKmH: number): number {
  return (distanceKm / velocityKmH) * 60
}

import { useMemo } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Marker } from 'react-leaflet'
import { divIcon } from 'leaflet'
import type { LucideIcon } from 'lucide-react'

type LocationMarkerData = {
  categoryid: number
  id: number
  image: string
  images: string[]
  name: string
  type: string
  lat: number | null
  lng: number | null
}

type MapLocationMarkerProps = {
  Icon: LucideIcon
  location: LocationMarkerData
  onSelect: (location: LocationMarkerData) => void
}

function MapLocationMarker({
  Icon,
  location,
  onSelect,
}: MapLocationMarkerProps) {
  const icon = useMemo(
    () =>
      divIcon({
        className: 'map-location-icon',
        html: renderToStaticMarkup(
          <span className="flex h-8 w-10 items-center justify-center rounded-full bg-sidebar px-2 text-sidebar-foreground shadow-lg ring-1 ring-inset ring-sidebar-border">
            <Icon aria-hidden="true" className="size-4" strokeWidth={2} />
          </span>,
        ),
        iconAnchor: [20, 16],
        iconSize: [40, 32],
      }),
    [Icon],
  )

  if (location.lat === null || location.lng === null) return null

  return (
    <Marker
      eventHandlers={{ click: () => onSelect(location) }}
      icon={icon}
      position={[location.lat, location.lng]}
    >
    </Marker>
  )
}

export { MapLocationMarker }

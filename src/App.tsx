import { useEffect, useMemo, useState } from 'react'
import type { Layer, LatLngBoundsExpression } from 'leaflet'
import { MapContainer, useMap } from 'react-leaflet'
import { leafletLayer } from 'protomaps-leaflet'
import {
  Bike,
  Dumbbell,
  Droplets,
  HeartPulse,
  House,
  Info,
  Landmark,
  MapPin,
  ShieldCheck,
  ShoppingCart,
  Zap,
  type LucideIcon,
} from 'lucide-react'

import { MapAttribution } from '@/components/map-attribution'
import { MapLocationMarker } from '@/components/map-location-marker'
import { MapResizeHandler } from '@/components/map-resize-handler'
import { MapZoomControls } from '@/components/map-zoom-controls'
import { LocationDetailsSheet } from '@/components/location-details-sheet'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import categoriesJson from '@/data/categories.json'
import locationsJson from '@/data/locations.json'
import {
  translateCategoryName,
  translateLocationName,
  translateLocationType,
} from '@/lib/translations'

type Category = {
  id: number
  name: string
}

type LocationItem = {
  id: number
  name: string
  image: string
  images: string[]
  imageSourceUrl?: string
  imageLicense?: string
  imageAttribution?: string
  imageDistanceMeters?: number
  imageCoordinates?: [number, number]
  imageCapturedAt?: string | null
  categoryid: number
  type: string
  lat: number | null
  lng: number | null
}

const categories = (categoriesJson as Category[]).map((category) => ({
  ...category,
  name: translateCategoryName(category.name),
}))
type RawLocationItem = Omit<LocationItem, 'image' | 'images'> & {
  image?: string
  images?: string[]
}

const locations: LocationItem[] = (
  locationsJson as RawLocationItem[]
).map((location) => {
  const images = (location.images ?? [])
    .map((image) => image.trim())
    .filter(Boolean)
  const image = location.image?.trim() || images[0] || '/location-placeholder.svg'

  return {
    ...location,
    name: translateLocationName(location.name),
    image,
    images: images.length > 0 ? images : [image],
    type: translateLocationType(location.type),
  }
})
const mapCenter: [number, number] = [51.4436, 5.4791]
const offlineMapBounds: LatLngBoundsExpression = [
  [51.2, 5.15],
  [51.68, 5.8],
]
const offlineMapUrl = `${import.meta.env.BASE_URL}maps/eindhoven.pmtiles`

const categoryIcons: Record<number, LucideIcon> = {
  1: HeartPulse,
  2: ShoppingCart,
  3: Droplets,
  4: Zap,
  5: Info,
  6: House,
  7: ShieldCheck,
  8: Bike,
  9: Dumbbell,
  10: Landmark,
}

function OfflineMapLayer() {
  const map = useMap()

  useEffect(() => {
    const layer = leafletLayer({
      attribution:
        'Protomaps © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      bounds: offlineMapBounds,
      flavor: 'light',
      lang: 'en',
      maxNativeZoom: 15,
      maxZoom: 15,
      minZoom: 12,
      noWrap: true,
      updateWhenIdle: true,
      url: offlineMapUrl,
    }) as unknown as Layer

    layer.addTo(map)

    return () => {
      map.removeLayer(layer)
    }
  }, [map])

  return null
}

function App() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  )
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(
    null,
  )

  const visibleLocations = useMemo(
    () =>
      selectedCategoryId === null
        ? locations
        : locations.filter(
            (location) => location.categoryid === selectedCategoryId,
          ),
    [selectedCategoryId],
  )

  const categoryNameById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [],
  )

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh" defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarHeader className="gap-0 py-1">
            <div className="flex min-h-10 min-w-0 items-center justify-center gap-2 px-1.5 py-1 group-data-[collapsible=icon]:min-h-12 group-data-[collapsible=icon]:px-0">
              <img
                alt="ECM — Emergency Crisis Map"
                className="hidden size-7 shrink-0 aspect-square object-contain group-data-[collapsible=icon]:block"
                src="/ecm-network-mark-white.svg"
              />
              <img
                alt="ECM — Emergency Crisis Map"
                className="h-7 w-auto max-w-full object-contain group-data-[collapsible=icon]:hidden"
                src="/ecm-wordmark-white.svg"
              />
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Locations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      type="button"
                      isActive={selectedCategoryId === null}
                      onClick={() => setSelectedCategoryId(null)}
                      tooltip="All locations"
                    >
                      <MapPin />
                      <span>All locations</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{locations.length}</SidebarMenuBadge>
                  </SidebarMenuItem>

                  {categories.map((category) => {
                    const Icon = categoryIcons[category.id] ?? MapPin
                    const count = locations.filter(
                      (location) => location.categoryid === category.id,
                    ).length

                    return (
                      <SidebarMenuItem key={category.id}>
                        <SidebarMenuButton
                          type="button"
                          isActive={selectedCategoryId === category.id}
                          onClick={() => setSelectedCategoryId(category.id)}
                          tooltip={category.name}
                        >
                          <Icon />
                          <span>{category.name}</span>
                        </SidebarMenuButton>
                        <SidebarMenuBadge>{count}</SidebarMenuBadge>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarRail />
        </Sidebar>

        <SidebarInset className="relative min-h-svh min-w-0 overflow-hidden">
          <div className="pointer-events-none absolute top-3 left-3 z-[1001]">
            <div className="pointer-events-auto flex size-9 overflow-hidden rounded-full bg-sidebar shadow-lg ring-1 ring-inset ring-sidebar-border">
              <SidebarTrigger
                aria-label="Open or close sidebar"
                className="!size-9 rounded-full bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground"
                tooltip="Open or close sidebar"
              />
            </div>
          </div>

          <MapContainer
            attributionControl={false}
            center={mapCenter}
            className="z-0 h-svh min-h-svh w-full font-sans"
            maxBounds={offlineMapBounds}
            maxBoundsViscosity={1}
            maxZoom={15}
            minZoom={12}
            zoomControl={false}
            scrollWheelZoom
            zoom={13}
          >
            <MapResizeHandler />

            <OfflineMapLayer />

            <MapZoomControls />

            {visibleLocations.map((location) => {
              const Icon = categoryIcons[location.categoryid] ?? MapPin

              return (
                <MapLocationMarker
                  Icon={Icon}
                  key={location.id}
                  location={location}
                  onSelect={setSelectedLocation}
                />
              )
            })}
          </MapContainer>

          <MapAttribution />
        </SidebarInset>

        <LocationDetailsSheet
          categoryName={
            selectedLocation
              ? categoryNameById.get(selectedLocation.categoryid)
              : undefined
          }
          location={selectedLocation}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedLocation(null)
            }
          }}
          open={selectedLocation !== null}
        />
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default App

import { useMemo, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
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

type Category = {
  id: number
  name: string
}

type LocationItem = {
  id: number
  name: string
  image: string
  images: string[]
  categoryid: number
  type: string
  lat: number | null
  lng: number | null
}

const categories = categoriesJson as Category[]
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
    image,
    images: images.length > 0 ? images : [image],
  }
})
const mapCenter: [number, number] = [51.4436, 5.4791]

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
                alt="EmergencyCrisisMap"
                className="hidden size-7 shrink-0 aspect-square object-contain group-data-[collapsible=icon]:block"
                src="/ecm-network-mark-white.svg"
              />
              <span className="truncate text-lg font-semibold tracking-[-0.01em] text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                EmergencyCrisisMap
              </span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Locaties</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      type="button"
                      isActive={selectedCategoryId === null}
                      onClick={() => setSelectedCategoryId(null)}
                      tooltip="Alle locaties"
                    >
                      <MapPin />
                      <span>Alle locaties</span>
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
                aria-label="Zijbalk openen of sluiten"
                className="!size-9 rounded-full bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground"
                tooltip="Zijbalk openen of sluiten"
              />
            </div>
          </div>

          <MapContainer
            attributionControl={false}
            center={mapCenter}
            className="z-0 h-svh min-h-svh w-full font-sans"
            zoomControl={false}
            scrollWheelZoom
            zoom={13}
          >
            <MapResizeHandler />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

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

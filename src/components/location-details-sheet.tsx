import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

type LocationDetails = {
  id: number
  image: string
  images: string[]
  name: string
  type: string
  lat: number
  lng: number
}

type LocationDetailsSheetProps = {
  categoryName: string | undefined
  location: LocationDetails | null
  onOpenChange: (open: boolean) => void
  open: boolean
}

const fallbackImage = '/location-placeholder.svg'

function LocationDetailsSheet({
  categoryName,
  location,
  onOpenChange,
  open,
}: LocationDetailsSheetProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const imageCount = location?.images.length ?? 0

  useEffect(() => {
    setActiveImageIndex(0)
  }, [location?.id])

  const changeImage = (direction: -1 | 1) => {
    if (imageCount < 2) return

    setActiveImageIndex((currentIndex) => {
      return (currentIndex + direction + imageCount) % imageCount
    })
  }

  return (
    <Sheet
      disablePointerDismissal
      modal={false}
      onOpenChange={onOpenChange}
      open={open}
    >
      <SheetContent
        className="!inset-y-3 !right-3 !h-[calc(100svh-1.5rem)] !w-[min(27rem,calc(100vw-1.5rem))] !max-w-none gap-0 overflow-hidden rounded-2xl border border-border bg-popover p-0 text-popover-foreground shadow-2xl [&>button]:size-9 [&>button]:rounded-full [&>button]:bg-sidebar [&>button]:text-sidebar-foreground [&>button]:shadow-lg [&>button]:ring-1 [&>button]:ring-inset [&>button]:ring-sidebar-border [&>button]:hover:bg-sidebar-accent [&>button]:hover:text-sidebar-accent-foreground"
        side="right"
        showOverlay={false}
      >
        {location && (
          <>
            <div className="relative h-[21rem] w-full shrink-0 overflow-hidden bg-muted">
              <div
                className="flex h-full w-full transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${activeImageIndex * 100}%)`,
                }}
              >
                {location.images.map((image, index) => (
                  <img
                    alt={index === activeImageIndex ? location.name : ''}
                    aria-hidden={index === activeImageIndex ? undefined : true}
                    className="block h-full w-full shrink-0 object-cover"
                    key={`${image}-${index}`}
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = fallbackImage
                    }}
                    src={image || fallbackImage}
                  />
                ))}
              </div>

              {imageCount > 1 && (
                <>
                  {activeImageIndex > 0 && (
                    <button
                      aria-label="Vorige afbeelding"
                      className="absolute top-1/2 left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-sidebar/85 text-sidebar-foreground shadow-lg ring-1 ring-inset ring-sidebar-border transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                      onClick={() => changeImage(-1)}
                      title="Vorige afbeelding"
                      type="button"
                    >
                      <ChevronLeft aria-hidden="true" className="size-5" />
                    </button>
                  )}
                  <button
                    aria-label="Volgende afbeelding"
                    className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-sidebar/85 text-sidebar-foreground shadow-lg ring-1 ring-inset ring-sidebar-border transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                    onClick={() => changeImage(1)}
                    title="Volgende afbeelding"
                    type="button"
                  >
                    <ChevronRight aria-hidden="true" className="size-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-sidebar/85 px-2.5 py-1.5 shadow-lg ring-1 ring-inset ring-sidebar-border">
                    {location.images.map((image, index) => (
                      <button
                        aria-current={
                          index === activeImageIndex ? 'true' : undefined
                        }
                        aria-label={`Afbeelding ${index + 1} van ${imageCount}`}
                        className="flex size-2.5 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                        key={`${image}-${index}`}
                        onClick={() => setActiveImageIndex(index)}
                        title={`Afbeelding ${index + 1}`}
                        type="button"
                      >
                        <span
                          className={`size-2 rounded-full transition-colors ${index === activeImageIndex ? 'bg-sidebar-foreground' : 'bg-sidebar-foreground/45'}`}
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <SheetHeader className="p-5 pr-14">
              <div className="min-w-0">
                <SheetTitle className="text-lg leading-6 tracking-[-0.02em]">
                  {location.name}
                </SheetTitle>
                <SheetDescription className="mt-1">
                  {location.type}
                  {categoryName ? ` · ${categoryName}` : ''}
                </SheetDescription>
              </div>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-5">
              <section className="flex flex-col gap-3">
                <h2 className="text-sm font-medium text-popover-foreground">
                  Locatiegegevens
                </h2>
                <dl className="divide-y divide-border rounded-lg border border-border bg-muted/30 text-sm">
                  <div className="flex items-center justify-between gap-4 px-3 py-2.5">
                    <dt className="text-muted-foreground">Type</dt>
                    <dd className="text-right font-medium text-popover-foreground">
                      {location.type}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 px-3 py-2.5">
                    <dt className="text-muted-foreground">Categorie</dt>
                    <dd className="text-right font-medium text-popover-foreground">
                      {categoryName ?? 'Onbekend'}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 px-3 py-2.5">
                    <dt className="text-muted-foreground">Latitude</dt>
                    <dd className="font-mono text-xs text-popover-foreground">
                      {location.lat.toFixed(5)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 px-3 py-2.5">
                    <dt className="text-muted-foreground">Longitude</dt>
                    <dd className="font-mono text-xs text-popover-foreground">
                      {location.lng.toFixed(5)}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

export { LocationDetailsSheet }

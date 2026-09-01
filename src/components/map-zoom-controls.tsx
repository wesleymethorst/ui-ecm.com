import { useMap } from 'react-leaflet'
import { Minus, Plus } from 'lucide-react'

function MapZoomControls() {
  const map = useMap()

  return (
    <div className="absolute top-14 left-3 z-[1000] flex w-9 flex-col overflow-hidden rounded-full bg-sidebar shadow-lg ring-1 ring-inset ring-sidebar-border">
      <button
        aria-label="Zoom in"
        className="inline-flex size-9 items-center justify-center bg-transparent p-0 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sidebar-foreground"
        onClick={() => map.zoomIn()}
        title="Zoom in"
        type="button"
      >
        <Plus aria-hidden="true" className="size-[18px]" strokeWidth={2} />
      </button>
      <button
        aria-label="Zoom out"
        className="inline-flex size-9 items-center justify-center bg-transparent p-0 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sidebar-foreground"
        onClick={() => map.zoomOut()}
        title="Zoom out"
        type="button"
      >
        <Minus aria-hidden="true" className="size-[18px]" strokeWidth={2} />
      </button>
    </div>
  )
}

export { MapZoomControls }

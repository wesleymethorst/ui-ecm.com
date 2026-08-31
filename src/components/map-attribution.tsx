import { useState } from 'react'
import { Info, X } from 'lucide-react'

import { cn } from '@/lib/utils'

function MapAttribution() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="absolute top-3 left-3 z-[1000]">
      <div
        className={cn(
          'inline-flex h-9 items-center overflow-hidden rounded-full bg-sidebar text-sidebar-foreground shadow-lg ring-1 ring-inset ring-sidebar-border transition-[width] duration-200 ease-out',
          isOpen ? 'w-fit max-w-[calc(100vw-1.5rem)] pr-2' : 'w-9',
        )}
      >
        <button
          aria-expanded={isOpen}
          aria-label={
            isOpen
              ? 'Kaartbronvermelding sluiten'
              : 'Kaartbronvermelding openen'
          }
          className="group inline-flex size-9 shrink-0 items-center justify-center p-0 text-sidebar-foreground focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sidebar-foreground"
          onClick={() => setIsOpen((open) => !open)}
          title="Kaartbronvermelding"
          type="button"
        >
          {isOpen ? (
            <X
              aria-hidden="true"
              className="size-[18px] transition-colors duration-150 group-hover:text-sidebar-foreground/60"
            />
          ) : (
            <Info
              aria-hidden="true"
              className="size-[18px] transition-colors duration-150 group-hover:text-sidebar-foreground/60"
            />
          )}
          <span className="sr-only">
            {isOpen
              ? 'Kaartbronvermelding sluiten'
              : 'Kaartbronvermelding openen'}
          </span>
        </button>

        {isOpen && (
          <div className="flex min-w-0 items-center whitespace-nowrap pl-1 text-[0.6875rem] font-normal leading-none text-sidebar-foreground">
            <span aria-hidden="true" className="mr-0.5 select-none">
              ©
            </span>
            <a
              href="https://leafletjs.com/"
              className="text-sidebar-foreground no-underline hover:underline hover:underline-offset-2"
              rel="noreferrer"
              target="_blank"
            >
              Leaflet
            </a>
            <span className="px-1 text-sidebar-foreground/45">|</span>
            <span aria-hidden="true" className="mr-0.5 select-none">
              ©
            </span>
            <a
              href="https://www.openstreetmap.org/copyright"
              className="text-sidebar-foreground no-underline hover:underline hover:underline-offset-2"
              rel="noreferrer"
              target="_blank"
            >
              OpenStreetMap
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export { MapAttribution }

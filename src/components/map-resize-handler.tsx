import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

function MapResizeHandler() {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()
    let frameId = 0

    const invalidateMapSize = () => {
      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(() => {
        map.invalidateSize({ pan: false, debounceMoveend: true })
      })
    }

    const resizeObserver = new ResizeObserver(invalidateMapSize)
    resizeObserver.observe(container)
    invalidateMapSize()

    return () => {
      resizeObserver.disconnect()
      window.cancelAnimationFrame(frameId)
    }
  }, [map])

  return null
}

export { MapResizeHandler }

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const locationsPath = path.join(projectRoot, 'src/data/locations.json')
const imageDirectory = path.join(projectRoot, 'public/location-images')
const apiUrl = 'https://api.openstreetcam.org/2.0/photo/'
const attribution = '© Grab and KartaView Contributors'
const license = 'CC BY-SA 4.0'

// These six entries did not have coordinates in the source dataset. The
// coordinates below are only used to find a nearby street-level image; the
// original location coordinates remain unchanged in locations.json.
const imageLookupCoordinates = {
  78: [51.447187, 5.4533841], // Frits - S-West
  79: [51.447187, 5.4533841], // Frederik - S-West
  80: [51.447187, 5.4533841], // Maria - S-West
  81: [51.447187, 5.4533841], // Benjamin - S-West
  82: [51.4477825, 5.493174], // Spectrum - TU/e
  83: [51.4513869, 5.4873172], // Student Sports Centre - TU/e
}

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

function distanceInMeters(firstLat, firstLng, secondLat, secondLng) {
  const earthRadius = 6371e3
  const toRadians = (value) => (value * Math.PI) / 180
  const latitudeDelta = toRadians(secondLat - firstLat)
  const longitudeDelta = toRadians(secondLng - firstLng)
  const firstLatitude = toRadians(firstLat)
  const secondLatitude = toRadians(secondLat)
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDelta / 2) ** 2

  return 2 * earthRadius * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

function getImageLookupCoordinates(location) {
  if (location.lat !== null && location.lng !== null) {
    return [location.lat, location.lng]
  }

  return imageLookupCoordinates[location.id] ?? null
}

function getImageUrl(photo) {
  return (
    photo.fileurlLTh ??
    photo.fileurlProc ??
    photo.fileurl?.replace('{{sizeprefix}}', 'lth') ??
    photo.fileurl?.replace('{{sizeprefix}}', 'proc') ??
    null
  )
}

function getSourceUrl(photo) {
  const sequenceId = photo.sequence?.id ?? photo.sequenceId
  const sequenceIndex = photo.sequenceIndex

  if (sequenceId && sequenceIndex !== undefined && sequenceIndex !== null) {
    return `https://kartaview.org/details/${sequenceId}/${sequenceIndex}/track-info`
  }

  return `https://kartaview.org/details/${photo.id}/track-info`
}

async function fetchJson(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 35_000)

  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
        'user-agent': 'ui-ecm.com location image enrichment/1.0',
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`KartaView API returned ${response.status}`)
    }

    return await response.json()
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchNearestPhoto(lat, lng) {
  const parameters = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    zoomLevel: '18',
    join: 'sequence',
    orderBy: 'id',
    orderDirection: 'desc',
    radius: '2000',
  })
  const response = await fetchJson(`${apiUrl}?${parameters.toString()}`)
  const photos = response?.result?.data ?? []

  return photos
    .map((photo) => {
      const photoLat = Number(photo.lat)
      const photoLng = Number(photo.lng)

      if (!Number.isFinite(photoLat) || !Number.isFinite(photoLng)) return null

      return {
        ...photo,
        distanceMeters: distanceInMeters(lat, lng, photoLat, photoLng),
        imageUrl: getImageUrl(photo),
      }
    })
    .filter((photo) => photo?.imageUrl)
    .sort((first, second) => first.distanceMeters - second.distanceMeters)[0] ?? null
}

async function downloadImage(url, destinationPath) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'ui-ecm.com location image enrichment/1.0',
    },
  })

  if (!response.ok) {
    throw new Error(`Image download returned ${response.status}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  await writeFile(destinationPath, buffer)
}

async function mapWithConcurrency(items, concurrency, callback) {
  const results = new Array(items.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex
      nextIndex += 1
      results[currentIndex] = await callback(items[currentIndex], currentIndex)
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  )

  return results
}

const rawLocations = JSON.parse(await readFile(locationsPath, 'utf8'))
await mkdir(imageDirectory, { recursive: true })

const enrichedLocations = await mapWithConcurrency(rawLocations, 5, async (location, index) => {
  const coordinates = getImageLookupCoordinates(location)

  if (!coordinates) {
    console.warn(`[${index + 1}/${rawLocations.length}] ${location.name}: no coordinates`)
    return location
  }

  try {
    const [lookupLat, lookupLng] = coordinates
    const photo = await fetchNearestPhoto(lookupLat, lookupLng)

    if (!photo) {
      console.warn(`[${index + 1}/${rawLocations.length}] ${location.name}: no KartaView image found`)
      return {
        ...location,
        image: '/location-placeholder.svg',
        images: ['/location-placeholder.svg'],
      }
    }

    const imagePath = `/location-images/${location.id}.jpg`
    await downloadImage(photo.imageUrl, path.join(projectRoot, 'public', imagePath.slice(1)))

    console.log(
      `[${index + 1}/${rawLocations.length}] ${location.name}: ${Math.round(photo.distanceMeters)} m`,
    )

    return {
      ...location,
      image: imagePath,
      images: [imagePath],
      imageSourceUrl: getSourceUrl(photo),
      imageLicense: license,
      imageAttribution: attribution,
      imageDistanceMeters: Math.round(photo.distanceMeters),
      imageCoordinates: [Number(photo.lat), Number(photo.lng)],
      imageCapturedAt: photo.shotDate ?? photo.dateAdded ?? null,
    }
  } catch (error) {
    console.warn(
      `[${index + 1}/${rawLocations.length}] ${location.name}: ${error instanceof Error ? error.message : String(error)}`,
    )
    return {
      ...location,
      image: '/location-placeholder.svg',
      images: ['/location-placeholder.svg'],
    }
  } finally {
    await sleep(150)
  }
})

await writeFile(locationsPath, `${JSON.stringify(enrichedLocations, null, 2)}\n`)

const successfulImages = enrichedLocations.filter(
  (location) => location.image?.startsWith('/location-images/'),
).length

await writeFile(
  path.join(imageDirectory, 'ATTRIBUTION.md'),
  `# Location imagery\n\n${successfulImages} images were retrieved from [KartaView](https://kartaview.org/) on ${new Date().toISOString().slice(0, 10)}.\n\nThe images are available under the [Creative Commons Attribution-ShareAlike 4.0 International license](https://creativecommons.org/licenses/by-sa/4.0/). Please keep the attribution “${attribution}” and the source link stored with each location.\n`,
)

console.log(`Enriched ${successfulImages}/${enrichedLocations.length} locations with KartaView images.`)

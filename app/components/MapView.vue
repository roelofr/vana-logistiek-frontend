<script setup lang="ts">
import type {Location} from "~/types";
import {useOidcAuth} from "#imports";
import {default as MapLibre, ResourceType} from 'maplibre-gl'

export type MapType = 'picker' | 'display';

interface MapEvent extends Event {
  lngLat: {
    lat: number;
    lng: number;
  },
  point: { x: number, y: number }
}

interface NamedLocation extends Location {
  name: string;
}

const {user} = useOidcAuth()

const {type = 'display', markers = []} = defineProps<{ type?: MapType, markers?: NamedLocation[] }>()
const chosenLocation = defineModel<Location | null>()

const mapInstance = ref<MapLibre.Map | null>(null);
const mapRef = useTemplateRef('map');
const mapMarkerInstance = ref(null);

const authenticatedResources = ['Style', 'Tile', 'Sprite', 'Source']
const authenticatedDomains = ['https://map.logistiek.myvana.dev/', document.location.origin];

const mapProps = ref({
  interactive: type != 'display',
  style: 'https://map.logistiek.myvana.dev/styles/castlefest/style.json',
  center: [4.540827673262811, 52.268359222840786],
  maxBounds: [4.526901644057006, 52.26344783696234, 4.558530252760903, 52.27387403440119],
  zoom: 17,
  minZoom: 14,
  maxZoom: 20,
})

const clickMap = (event: MapEvent) => {
  if (type !== 'picker')
    return;

  chosenLocation.value = {
    lat: event.lngLat.lat,
    lng: event.lngLat.lng
  }

  console.log('Click on point %o', event.lngLat)
}

const renderMap = () => {
  if (mapInstance.value != null)
    mapInstance.value.remove()

  const map = mapInstance.value = new MapLibre.Map({
    container: mapRef.value!,
    interactive: type != 'display',
    style: 'https://map.logistiek.myvana.dev/styles/castlefest/style.json',
    center: [4.54307, 52.27004],
    // maxBounds: [4.531109, 52.264237, 4.548113, 52.272678],
    zoom: 15,
    minZoom: 14,
    maxZoom: 20,
    attributionControl: {
      compact: false,
      customAttribution: '<a href="https://vana-events.nl/">© Vana Events B.V.</a>'
    },
    transformRequest: (url, resourceType) => {
      if (authenticatedResources.includes(resourceType! as string) && authenticatedDomains.some(domain => url.startsWith(domain))) {
        return {
          url,
          headers: {'authorization': `Bearer ${user.value?.accessToken}`},
          credentials: 'include'  // Include cookies for cross-origin requests
        }
      }
    }
  })
  // disable map rotation using right click + drag
  // map.dragRotate.disable();

// disable map rotation using keyboard
  map.keyboard.disable();

// disable map rotation using touch rotation gesture
  map.touchZoomRotate.disableRotation();

  map.on('click', clickMap)
}

const spriteMap = new Map<Location, string>();
const allMarkers = computed<Location[]>(() => {
  return [
    ...markers,
    ...(chosenLocation.value ? [chosenLocation.value] : [])
  ] as Location[]
})
const updateMarkers = () => {
  for (const marker of allMarkers.value) {
    if (! spriteMap.has(marker)) {

    }
  }
}

watch(() => type, () => renderMap())

watch(() => [markers, mapInstance], () => {
  if (!mapInstance.value)
    return
})

onMounted(() => {
  renderMap()
})

onUnmounted(() => {
  if (mapInstance.value) {
    mapInstance.value.remove()
    mapInstance.value = null
  }
})
</script>

<template>
  <div ref="map" class="h-full w-full bg-muted" />
</template>

<style scoped>
:host {
  width: 100%;
  height: 100%;
}
</style>

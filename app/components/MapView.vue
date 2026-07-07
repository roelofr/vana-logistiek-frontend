<script setup lang="ts">
import type {Location} from "~/types";
import {useOidcAuth} from "#imports";
import MapLibre from 'maplibre-gl'

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

const {type = 'display', markers = [], disabled = false} = defineProps<{ type?: MapType, markers?: NamedLocation[], disabled?: boolean }>()
const chosenLocation = defineModel<Location | null>()

const mapInstance = ref<MapLibre.Map | undefined>();
const mapRef = useTemplateRef('map');
const mapMarkerInstance = ref<MapLibre.Marker | undefined>();

const authenticatedDomains = ['https://map.logistiek.myvana.dev/', document.location.origin];

const clickMap = (event: MapEvent) => {
  if (type !== 'picker')
    return;

  chosenLocation.value = {
    lat: event.lngLat.lat,
    lng: event.lngLat.lng
  }

  if (mapMarkerInstance.value)
    mapMarkerInstance.value.remove();

  mapMarkerInstance.value = new MapLibre.Marker()
    .setLngLat([event.lngLat.lng, event.lngLat.lat])
    .addTo(mapInstance.value!);
}

function renderMap() {
  if (mapInstance.value != null)
    mapInstance.value.remove()

  const map = mapInstance.value = new MapLibre.Map({
    container: mapRef.value!,
    interactive: type != 'display',
    style: {
      version: 8,
      sources: {
        castlefest: {
          type: 'raster',
          url: 'https://map.logistiek.myvana.dev/data/castlefest.json',
          tileSize: 256,
          maxzoom: 20
        }
      },
      layers: [
        {
          id: 'castlefest',
          type: 'raster',
          source: 'castlefest'
        }
      ]
    },
    center: [4.54307, 52.27004],
    maxBounds: [4.525850, 52.262308, 4.560406, 52.273979],
    zoom: 15,
    minZoom: 14,
    maxZoom: 20,
    attributionControl: false,
    transformRequest: (url) => {
      if (authenticatedDomains.some(domain => url.startsWith(domain))) {
        return {
          url,
          headers: {'Authorization': `Bearer ${user.value?.accessToken}`},
          credentials: 'include'
        }
      }
    }
  })

  // Add Vana attribution
  map.addControl(new MapLibre.AttributionControl({compact: true}), 'bottom-right')
  map.addControl(new MapLibre.GeolocateControl({showUserLocation: true}), 'top-right')

  // Disable rotation
  map.dragRotate.disable();
  map.keyboard.disable();
  map.touchZoomRotate.disableRotation();


  map.on('click', clickMap)
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
    mapInstance.value = undefined
  }
})
</script>

<template>
  <div ref="map" class="h-full w-full bg-muted relative" :class="{'opacity-50': disabled}" />
</template>

<style scoped>
:host {
  width: 100%;
  height: 100%;
}
</style>

/* eslint-disable no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js')

caches.keys().then((cacheNames) => {
  cacheNames.forEach((cacheName) => {
    caches.delete(cacheName)
  })
})

// When widget is installed/pinned, push initial state.
self.addEventListener('widgetinstall', (event) => {
  event.waitUntil(updateWidget(event))
})

// When widget is shown, update content to ensure it is up-to-date.
self.addEventListener('widgetresume', (event) => {
  event.waitUntil(updateWidget(event))
})

// handle according to the 'verb' in event.action.
self.addEventListener('widgetclick', (event) => {
  if (event.action === 'updateName') {
    event.waitUntil(updateName(event))
  }
})

// periodic sync or widget-related state.
self.addEventListener('widgetuninstall', (event) => {})

const updateWidget = async (event) => {
  // The widget definition represents the fields specified in the manifest.
  const widgetDefinition = event.widget.definition

  // Fetch the template and data defined in the manifest to generate the payload.
  const payload = {
    template: JSON.stringify(await (await fetch(widgetDefinition.msAcTemplate)).json()),
    data: JSON.stringify(await (await fetch(widgetDefinition.data)).json())
  }

  // Push payload to widget.
  await self.widgets.updateByInstanceId(event.instanceId, payload)
}

const updateName = async (event) => {
  const name = event.data.json().name

  // The widget definition represents the fields specified in the manifest.
  const widgetDefinition = event.widget.definition

  // Fetch the template and data defined in the manifest to generate the payload.
  const payload = {
    template: JSON.stringify(await (await fetch(widgetDefinition.msAcTemplate)).json()),
    data: JSON.stringify({ name })
  }

  // Push payload to widget.
  await self.widgets.updateByInstanceId(event.instanceId, payload)
}

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || [])

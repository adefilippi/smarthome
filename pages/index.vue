<template>
  <masonry-wall :items="devices" :ssr-columns="1" maxColumns="3" :gap="16">
    <template #default="{ item, index }">
      <clock v-if="item.model === 'clock'"></clock>
      <light-switch v-else-if="item.model === 'miio:gateway-light'" :device="item" @state-changed="onStateChanged"></light-switch>
      <temperature v-else-if="item.model === 'lumi.weather'" :device="item"></temperature>
      <div v-else></div>
    </template>
  </masonry-wall>
</template>

<script setup>
import {useMiioStore} from '@/stores/miio'
import Clock from '@/components/clock.vue'
import MasonryWall from "@yeger/vue-masonry-wall";
import LightSwitch from "~/components/lightSwitch.vue";


const disabled = ref(false)
const color = ref('#318CE7FF')
const hue = ref(100)
const store = useMiioStore()
const devices = ref([])
onMounted(async () => {
  try {
    devices.value = await getDevices()
  } catch (e) {}

  var timerID = setInterval( async function() {
    devices.value = await getDevices()

  }, 300000);

})

async function getDevices() {
  const {data} = await useFetch('/api/miio/discover', {})

  return data.value
}
async function onStateChanged(state) {
  const {data} = await useFetch('/api/miio/update', {
    method: 'POST',
    body: state
  })
}
</script>
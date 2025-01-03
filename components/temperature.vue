<template>
  <div class="h-96">
    <div class="text-3xl text-center my-6">{{ device.name }}</div>
    <div class="flex justify-center items-center text-center">
    <div class="w-72 h-72 rounded-full flex flex-col justify-center items-center" :style="`background: ${color}`">
      <p class="text-2xl py-2">{{ comment }}</p>
      <div>
        <p class="text-5xl p-2"><Icon :name="`uil:${icon}`" class="text-4xl" />{{ temperature }}{{ temperatureUnit }} </p>
        <p class="text-5xl p-2"><Icon name="uil:tear" class="text-4xl" />{{ humidity }}{{ humidityUnit }}</p>
        <p v-if="props.showPressure" class="text-5xl p-2">{{ pressure }}{{ pressureUnit }}</p>
      </div>
    </div>
    </div>
  </div>
</template>
<script setup>
const icon = ref('temperature-empty')
const color = ref("#206091")
const comment = ref('Trop froid')
const temperature = ref(0)
const temperatureUnit = ref('°C')
const humidity = ref(0)
const humidityUnit = ref('%')
const pressure = ref(0)
const pressureUnit = ref('hPa')
const props = defineProps({
  device: {
    default: null
  },
  showPressure: {
    default: false
  }
})

onMounted(() => {
  nextTick(() => {
    if (props.device !== null) {
      const h = props.device.values.filter((v) => v.name === 'temperature')[0]
      temperature.value = Math.round(h.value * 10) / 10
      temperatureUnit.value = h.unit

      const hum = props.device.values.filter((v) => v.name === 'relative-humidity')[0]
      humidity.value = Math.round(hum.value * 10) / 10
      humidityUnit.value = hum.unit

      const p = props.device.values.filter((v) => v.name === 'atmospheric-pressure')[0]
      pressure.value = Math.round(p.value / 1000 * 10) / 10
      pressureUnit.value = 'k ' + p.unit

      if(temperature.value < 21){
        icon.value = 'temperature-empty'
        color.value = "#206091"
        if (humidity.value < 30) {
          comment.value = 'froid et sec'
        }
        else if (humidity.value > 70) {
          comment.value = 'froid et humide'
        } else {
          comment.value = 'Trop froid'
        }
      }
      else if (temperature.value >= 21 && temperature.value < 25) {
        icon.value = 'temperature-half'
        color.value = "#21A38B"
        if (humidity.value < 30) {
          comment.value = 'Confortable et sec'
        }
        else if (humidity.value > 70) {
          comment.value = 'Confortable et humide'
        } else {
          comment.value = 'Confortable'
        }
      }
      else if (temperature.value >= 25) {
        icon.value = 'temperature-full'
        color.value = "#E06E27"
        if (humidity.value < 30) {
          comment.value = 'Chaud et sec'
        }
        else if (humidity.value > 70) {
          comment.value = 'Chaud et humide'
        } else {
          comment.value = 'Plutôt chaud'
        }
      }
    }
  })
})

</script>
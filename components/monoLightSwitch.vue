<template>
  <h1>Toto></h1>
</template>

<script setup>
const on = ref(true)
const color = ref('#FF0000')
const luminosity = ref(20)
const hue = ref(0)
const expanded = ref(false)

const props = defineProps({
  device: {
    default: null
  },
})

</script>
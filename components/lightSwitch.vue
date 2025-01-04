<template>
  <div class="w-auto" style="background: rgba(32, 96, 145, 0.5)">
    <div v-if="expanded" class="p-6">
    <div class="text-3xl text-center my-6">{{ device.name }}</div>
    <div class="flex justify-center items-center flex-col">
      <div class="light-switch">
        <colorpicker :hue="hue" saturation="100" luminosity="50" :initiallyCollapsed="!on" @state="updateDeviceState"
                     @change="updateColor"></colorpicker>

        <div class="custom-slider mt-4 h-8" :style="{ '--ProgressPercent': luminosity + '%', '--ProgressColor': color }">
          <input v-model="luminosity" type="range" min="0" max="100" class="slider" v-if="on"/>
        </div>
      </div>
    </div>
  </div>
    <div v-else class="p-6 rounded-lg">
      <div class="flex flex-row">
        <div class="basis-3/4" @click="expanded = true">
          <div class="text-3xl text-center my-6">{{ device.name }}</div>
        </div>
        <div class="basis-1/4">
          <div class="flex flex-col justify-center items-center h-20 w-20 rounded-full" :style="`background: ${color}`"
          :class="on ? 'opacity-100' : 'opacity-50'" >
            <button
                class="rcp-btn"
                type="button"
                @click.prevent="on = !on"
            ><Icon name="uil:lightbulb-alt" class="text-5xl" /></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import colorpicker from "~/components/controls/colorpicker.vue";

const emit = defineEmits(['stateChanged'])


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
watch(luminosity, (newValue) => {
  emit('stateChanged', {
    id: props.device.id,
    call: 'brightness',
    value: newValue,
  });
});

if (props.device !== null) {
  const o = props.device.values.filter((v) => v.name === 'switchable-power')[0]
  on.value = o.value

  const d = props.device.values.filter((v) => v.name === 'dimmable')[0]
  luminosity.value = d.value

  const c = props.device.values.filter((v) => v.name === 'color')[0]
  color.value = c.value

  const {h} = hexToHSL(color.value)
  hue.value = h
}

function updateDeviceState(state) {
  on.value = state
  emit('stateChanged', {
    id: props.device.id,
    call: 'power',
    value: on.value,
  });
}

function updateColor(c) {
  color.value = HSLToHex(c, 100, 50) // update color
  emit('stateChanged', {
    id: props.device.id,
    call: 'color',
    value: color.value,
  });
}


// Convertir Hex en HSL
function hexToHSL(hex) {
  // Enlever le # si présent
  hex = hex.replace(/^#/, '');

  // Convertir en RGB
  let r = parseInt(hex.slice(0, 2), 16) / 255;
  let g = parseInt(hex.slice(2, 4), 16) / 255;
  let b = parseInt(hex.slice(4, 6), 16) / 255;

  // Trouver min et max
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);

  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatique
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  // Convertir en degrés et pourcentages
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return {h, s, l};
}

// Convertir HSL en Hex
function HSLToHex(h, s, l) {
  // Convertir en décimales
  s /= 100;
  l /= 100;
  h = h % 360;

  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatique
  } else {
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;

    r = hue2rgb(p, q, (h / 360) + 1 / 3);
    g = hue2rgb(p, q, h / 360);
    b = hue2rgb(p, q, (h / 360) - 1 / 3);
  }

  // Convertir en hex
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}


</script>
<style scoped>
.light-switch {
  width: 280px;
}

.custom-slider {
  --trackHeight: 2rem;
  --thumbRadius: 2rem;
  width: 100%;
}

/* style the input element with type "range" */
.custom-slider input[type="range"] {
  position: relative;
  appearance: none;
  /* pointer-events: none; */
  border-radius: 999px;
  z-index: 0;
  width: 100%;
}

/* ::before element to replace the slider track */
.custom-slider input[type="range"]::before {
  content: "";
  position: absolute;
  width: var(--ProgressPercent, 50%);
  height: 100%;
  background: var(--ProgressColor, #AAAAAA);
  /* z-index: -1; */
  pointer-events: none;
  border-radius: 999px;
}


/* `::-webkit-slider-runnable-track` targets the track (background) of a range slider in chrome and safari browsers. */
.custom-slider input[type="range"]::-webkit-slider-runnable-track {
  appearance: none;
  background: #AAAAAA;
  height: var(--trackHeight);
  border-radius: 999px;
}

/* `::-moz-range-track` targets the track (background) of a range slider in Mozilla Firefox. */
.custom-slider input[type="range"]::-moz-range-track {
  appearance: none;
  background: #AAAAAA;
  height: var(--trackHeight);
  border-radius: 999px;
}

.custom-slider input[type="range"]::-webkit-slider-thumb {
  position: relative;
  top: 50%;
  transform: translate(0, -50%);
  width: var(--thumbRadius);
  height: var(--thumbRadius);
  background: transparent;
  border-radius: 999px;
  pointer-events: all;
  appearance: none;
  z-index: 1;
}
</style>
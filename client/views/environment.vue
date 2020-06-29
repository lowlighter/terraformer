<template>
  <div class="panel environment" v-if="sensehat||sds011">
    <header>{{ lang.environment }}</header>
    <div class="body">
      <table>
        <tr v-if="sensehat">
          <td class="c">🧭</td>
          <td class="r">{{ sensehat.compass.value.toFixed() }}°</td>
        </tr>
        <tr v-if="sensehat">
          <td class="c">🌡️</td>
          <td class="r">{{ ((sensehat.temperature.humidity + sensehat.temperature.pressure)/2).toFixed(1) }} °C</td>
        </tr>
        <tr v-if="sensehat">
          <td class="c">💧</td>
          <td class="r">{{ sensehat.humidity.toFixed() }}%</td>
        </tr>
        <tr v-if="sensehat">
          <td class="c">🕰️</td>
          <td class="r">{{ sensehat.pressure.toFixed(2) }} hPa</td>
        </tr>
        <tr v-if="sds011">
          <td class="c">🦠</td>
          <td class="r">{{ sds011.pm25 }} PM₂.₅ (µg/m³)</td>
        </tr>
        <tr v-if="sds011">
          <td class="c" style="filter: hue-rotate(70deg);">🦠</td>
          <td class="r">{{ sds011.pm10 }} PM₁₀ (µg/m³)</td>
        </tr>
        <tr>
          <td class="c">🔆</td>
          <td class="r">N/A</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  //Exports
    module.exports = {
      //Properties
        props:["lang", "sensehat", "sds011"]
    }
</script>
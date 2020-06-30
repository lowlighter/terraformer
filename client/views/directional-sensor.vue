<template>
  <div class="panel" v-if="sensehat">
    <header>{{ lang[sensor] }}</header>
    <div class="body">
      <table>
        <tr v-for="axis in ['roll', 'pitch', 'yaw']" :key="axis">
          <td>{{ lang[axis] }}</td>
          <td class="r">{{ sensehat[sensor].value[axis].toFixed() }}°</td>
          <td class="r">{{ (sensehat[sensor].value[axis] * Math.PI/180).toFixed(2) }} rad</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  //Exports
    module.exports = {
      //Properties
        props:["lang", "sensor", "sensehat"]
    }
</script>
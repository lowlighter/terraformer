<template>
  <div class="panel" :key="sensor">
    <header>{{ lang[sensor] }}</header>
    <div class="body">
      <table>
        <tr v-for="axis in ['roll', 'pitch', 'yaw']" :key="axis">
          <td>{{ lang[axis] }}</td>
          <td class="r">{{ sensehat.orientation.degrees[axis].toFixed() }}°</td>
          <td class="r">{{ sensehat.orientation.radians[axis].toFixed(2) }} rad</td>
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
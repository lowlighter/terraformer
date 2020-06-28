<template>
  <div class="panel">
    <header>{{ lang.ledmatrix }}</header>
    <div class="body">
      <div class="ledmatrix">
        <div class="pixels">
          <div class="pixel" v-for="(pixel, i) in sensehat.pixels" :style="{backgroundColor:`rgba(${pixel.join(',')},.4)`}" :key="i"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  //Exports
    module.exports = {
      //Properties
        props:["lang", "sensehat"]
    }
</script>
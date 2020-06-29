<template>
  <div class="panel" v-if="sensehat">
    <header>{{ lang.ledmatrix }}</header>
    <div class="body">
      <div class="ledmatrix">
        <div class="pixels">
          <div class="pixel" v-for="(pixel, i) in sensehat.pixels" :style="{backgroundColor:`rgba(${pixel.join(',')},.4)`}" :key="i" @click="pixel(i)"></div>
        </div>
      </div>
      <div class="controls">
        <input type="text" v-model="colour">
      </div>
    </div>
  </div>
</template>

<script>
  //Exports
    module.exports = {
      //Properties
        props:["lang", "sensehat"],
      //Data
        data() {
          return {colour:"#FFFFFF"}
        },
      //Methods
        methods:{
          async pixel(i) {
            let {colour} = this.$data
            const hex = parseInt(colour.substr(1), 16)
            const r = (hex >> 16) && 0xFF
            const g = (hex >> 8) && 0xFF
            const b = (hex >> 0) && 0xFF
            await axios.post("/ledmatrix", {x:i%8, y:(i/8)|0, r, g, b})
          }
        }
    }
</script>
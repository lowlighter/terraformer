<template>
  <div class="panel" v-if="sensehat">
    <header>{{ lang.ledmatrix }}</header>
    <div class="body">
      <div class="ledmatrix">
        <div class="pixels">
          <div class="pixel" v-for="(pixel, i) in sensehat.pixels" :style="{backgroundColor:`rgb(${pixel.join(',')})`}" :key="i" @click="setpixel(i)"></div>
        </div>
      </div>
      <div class="controls">
        <input type="text" maxlength="6" v-model="colour" :class="{error:!rgb.valid}">
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
          return {colour:"FFFFFF"}
        },
        computed:{
          rgb() {
            const {colour} = this.$data
            const hex = parseInt(colour, 16)
            const valid = (colour.toString().length === 6)&&(!Number.isNaN(hex))
            const r = ((hex & 0xFF0000) >> 16) & 0xFF
            const g = ((hex & 0x00FF00) >> 8) & 0xFF
            const b = ((hex & 0x0000FF) >> 0) & 0xFF
            return {valid, r, g, b}
          }
        },
      //Methods
        methods:{
          async setpixel(i) {
            const {r, g, b} = this.rgb
            await axios.post("/ledmatrix", {x:i%8, y:(i/8)|0, r, g, b})
          }
        }
    }
</script>

<style scoped>
  .body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .ledmatrix {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pixels {
    display: flex;
    flex-wrap: wrap;
    width: 6rem;
    padding: .5rem;
  }

  .pixel {
    height: .5rem;
    width: .5rem;
    margin: .125rem;
    border-radius: .125rem;
    flex-shrink: 0;
    cursor: pointer;
    opacity: .4;
    transition: opacity .4s;
  }

  .pixel:hover {
    opacity: .7;
  }

  input {
    font-weight: bold;
    letter-spacing: .1rem;
    text-align: center;
    width: 6rem;
  }

  input.error {
    color: darkred;
    border: 2px solid darkred;
  }

</style>
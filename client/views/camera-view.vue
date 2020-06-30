<template>
  <div class="panel">
    <header>{{ lang.camera }}</header>
    <div class="body">
      <div class="camera">
        <img :class="[uid]">
      </div>
    </div>
  </div>
</template>

<script>
  //Exports
    module.exports = {
      //Properties
        props:["lang"],
      //Data
        data() {
          return {
            uid:`camera-view-${Math.random().toString().substring(2)}`,
          }
        },
      //Computed
        computed:{
          //Image element
            img() {
              const {uid} = this.$data
              return document.querySelector(`.${uid}`)
            }
        },
      //Methods
        methods:{
          //Reload image
            async reload({delay = 0} = {}) {
              if (delay)
                await new Promise(solve => setTimeout(solve, delay))
              this.img.src = `/camera.jpg?t=${Date.now()}`
            },
        },
      //Mounted
        mounted() {
          this.img.onload = this.reload.bind(null, {delay:1000})
          this.img.onerror = this.reload.bind(null, {delay:250})
          this.reload()
        }
    }
</script>

<style scoped>
  .camera {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .camera img {
    border-radius: .5rem;
  }
</style>
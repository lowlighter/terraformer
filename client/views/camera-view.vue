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
        props:["lang", "endpoint"],
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
            reload() {
              const time = new Date().getTime()
              this.img.src = `${this.endpoint}/cam_pic.php?time=${time}`
            },
        },
      //Mounted
        mounted() {
          this.img.onerror = this.img.onload = this.reload
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
<template>
  <div class="panel">
    <header></header>
    <div class="body">
      <img :class="[uid]">
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
              this.img.src = `cam_pic.php?time=${time}`
            },
        },
      //Mounted
        mounted() {
          this.img.onload = this.reload
          this.img.onerror = () => setTimeout(() => this.reload(), 100)
        }
    }
</script>

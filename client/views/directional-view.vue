<template>
  <div class="panel" v-if="sensehat">
    <header>{{ "" }}</header>
    <div class="body">
      <div class="view">
        <div class="cube" :style="{transform:`rotateX(${p.x}deg) rotateY(${p.y}deg) rotateZ(${p.z}deg)`}">
          <div class="front">front</div>
          <div class="back">back</div>
          <div class="top">top</div>
          <div class="bottom">bottom</div>
          <div class="left">left</div>
          <div class="right">right</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  //Exports
    module.exports = {
      //Properties
        props:["lang", "sensehat"],
      //Computed
        computed:{
          p() {
            const {value} = this.sensehat.gyroscope
            return {x:-90+value.roll, y:-180+value.yam, z:0+value.pitch}
          }
        }
    }
</script>

<style scoped>
  .view {
    width: 8rem;
    height: 8rem;
    perspective: 64rem;
    perspective-origin: 50% 8rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .cube {
    position: relative;
    width: 4rem;
    transform-style: preserve-3d;
    transform-origin: center;
  }
  .cube div {
    position: absolute;
    width: 4rem;
    height: 4rem;
    border: 1px solid gray;
  }
  .cube .back {
    transform: translateZ(-2rem) rotateY(180deg);
  }
  .cube .right {
    transform: rotateY(-270deg) translateX(2rem);
    transform-origin: top right;
  }
  .cube .left {
    transform: rotateY(270deg) translateX(-2rem);
    transform-origin: center left;
  }
  .cube .front {
    transform: translateZ(2rem);
  }
  .cube .top {
    transform: rotateX(-90deg) translateY(-2rem);
    transform-origin: top center;
  }
  .cube .bottom {
    transform: rotateX(90deg) translateY(2rem);
    transform-origin: bottom center;
  }
</style>
;(async function () {

  //Load server location and connect to sockets
    const server = (await axios.get("/server")).data || location.href.replace(/\/$/, "")
    const socket = io(server)

  //Lang and initial data
    const {data:lang} = await axios.get("/lang/fr.json")
    const {data:init} = await axios.get("/data")
    const data = {lang, ...init}

  //Components
    Vue.component("v-environment", httpVueLoader("views/environment.vue"))
    Vue.component("v-graphs", httpVueLoader("views/graphs.vue"))
    Vue.component("v-directional-sensor", httpVueLoader("views/directional-sensor.vue"))
    Vue.component("v-ledmatrix", httpVueLoader("views/ledmatrix.vue"))
    Vue.component("v-camera-view", httpVueLoader("views/camera-view.vue"))

  //App
    const app = new Vue({
      el:"main",
      data,
      computed:{
        sensehat() { return this.$data.dump.sensehat },
        sds011() { return this.$data.dump.sds011 },
      }
    })

  //Sockets events
    socket.on("joystick", data => console.log(data))
    socket.on("data", ({dump, records}) => { data.dump = dump ; data.records = records })

})()
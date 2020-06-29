//Imports
  import Sds011 from "./lib/sds011.js"
  import SenseHat from "./lib/sensehat.js"
  import express from "express"
  import path from "path"
  import http from "http"
  import socketio from "socket.io"
  import url from "url"
  import cors from "cors"
  import data from "./data.js"
  import sleep from "./lib/sleep.js"

/** Server app */
  export default async function ({log = false, port = 3000, sensors = "", ip = null, refresh = 5}) {
    //Setup server
      const app = express()
      const server = http.createServer(app)

    //Static resources
      const dirname = path.dirname(url.fileURLToPath(import.meta.url))
      ;[
        {uri:"/", location:path.join(dirname, "../client")},
        {uri:"/lang", location:path.join(dirname, "lang")},
        {uri:"/js", location:path.join(dirname, "../node_modules", "/socket.io-client/dist")},
        {uri:"/js", location:path.join(dirname, "../node_modules", "/vue/dist")},
        {uri:"/js", location:path.join(dirname, "../node_modules", "/axios/dist")},
        {uri:"/js", location:path.join(dirname, "../node_modules", "/chart.js/dist")},
        {uri:"/js", location:path.join(dirname, "../node_modules", "/http-vue-loader/src")},
      ].forEach(({uri, location}) => app.use(uri, express.static(location)))
      server.listen(port, () => console.log(`Listening on ${port}`))

    //Other data source server
      if (ip) {
        console.log(`Will tell clients to redirect /data calls to ${ip}`)
        app.get("/server", (req, res) => res.send(`http://${ip}`))
      }
      else
        app.get("/server", (req, res) => res.send(""))

    //Enable sensors
      sensors = sensors.split(",")
      if (sensors) {
        //Wait for sensors to be ready
          console.log("Loading sensors")
          const sensehat = sensors.includes("sensehat") ? new SenseHat({log}) : null
          const sds011 = sensors.includes("sds011") ? new Sds011({dev:"/dev/ttyUSB0", log}) : null
          await Promise.all([sensehat.ready, sds011.ready])
          console.log("Loaded sensors")

        //Additional routes
          app.get("/data", cors(), async (req, res) => res.json(data.zip))
          app.get("/data/dump", cors(), async (req, res) => res.json(data.dump))
          app.get("/data/records", cors(), async (req, res) => res.json(data.records))
          console.log(`Refreshing sensors data each ${refresh} seconds`)

        //Socket server
          const io = socketio(server)
          sensehat.event.on("joystick", data => io.emit("joystick", data))
          while (true) {
            await data.refresh({sds011, sensehat, log})
            io.emit("data", data.zip)
            await sleep(refresh)
          }
      }
  }
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
  import axios from "axios"

/** Server app */
  export default async function ({log = false, port = 3000, sensors = null, camera = null, ip = null, refresh = 5}) {
    //Setup server
      const app = express()
      const server = http.createServer(app)
      const io = socketio(server)

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

    //Enable camera
      if (camera) {
        const [_, username, password, server, port] = camera.match(/(\w+):(\w+)@([\w.]+):(\d+)/)
        console.log(`Loaded camera on ${server}:${port}`)
        app.get("/camera.jpg", cors(), async (req, res) => {
          const {data} = await axios.get(`http://${server}:${port}/cam_pic.php`, {auth:{username, password}, responseType:"stream"})
          data.pipe(res)
        })
      }

    //Enable sensors
      sensors = sensors?.split(",")?.filter(sensor => sensor.length)
      if (sensors) {
        //Wait for sensors to be ready
          console.log(`Loading sensors : ${sensors.join(", ")}`)
          const sensehat = sensors.includes("sensehat") ? new SenseHat({log}) : null
          const sds011 = sensors.includes("sds011") ? new Sds011({dev:"/dev/ttyUSB0", log}) : null
          await Promise.all([sensehat?.ready, sds011?.ready])
          console.log("Loaded sensors")

        //Additional routes
          app.get("/data", cors(), async (req, res) => res.json(data.zip))
          app.get("/data/dump", cors(), async (req, res) => res.json(data.dump))
          app.get("/data/records", cors(), async (req, res) => res.json(data.records))

        //Sensehat
          if (sensors.includes("sensehat")) {
            sensehat.event.on("joystick", data => io.emit("joystick", data))
            app.post("/ledmatrix", async (req, res) => {
              const {x = NaN, y = NaN, r = NaN, g = NaN, b = NaN} = req.body
              if ([x, y, r, g, b].reduce((a, b) => a || Number.isNaN(b), false))
                return res.sendStatus(400)
              sensehat.pixel({x, y}, {r, g, b})
              res.sendStatus(200)
            })
          }

        //Loop refreshing
          console.log(`Refreshing sensors data each ${refresh} seconds`)
          while (true) {
            await data.refresh({sds011, sensehat, log})
            io.emit("data", data.zip)
            await sleep(refresh)
          }
      }

  }
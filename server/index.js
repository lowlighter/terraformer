//Imports
  import Sds011 from "./lib/sds011.js"
  import SenseHat from "./lib/sensehat.js"
  import express from "express"
  import path from "path"
  import http from "http"
  import socketio from "socket.io"
  import url from "url"
  import cors from "cors"
  import data from "./lib/data.js"
  import sleep from "./lib/sleep.js"
  import commander from "commander"

//Entry point
  ;(async () => {
    //Configuration
      const {verbose:log, port, sensors, ip} = commander.program
        .option("--port <port>", "HTTP server port", 3000)
        .option("-v | --verbose", "Verbose", false)
        .option("-s | --sensors", "Execution with sensors", true)
        .option("-S | --no-sensors", "Execution without sensors")
        .option("--ip <ip>", "Get data from another HTTP server", null)
        .parse(process.argv)

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
      if (sensors) {
        //Wait for sensors to be ready
          console.log("Loading sensors")
          const sensehat = new SenseHat({log})
          const sds011 = new Sds011({dev:"/dev/ttyUSB0", log})
          await Promise.all([sensehat.ready, sds011.ready])

          sensehat.letter("L", {colour:[0, 0, 0], background:[255, 255, 255]})

        //Additional routes
          app.get("/data", cors(), async (req, res) => res.json(data.zip))
          app.get("/data/dump", cors(), async (req, res) => res.json(data.dump))
          app.get("/data/records", cors(), async (req, res) => res.json(data.records))

        //Socket server
          const io = socketio(server)
          sensehat.event.on("joystick", data => io.emit("joystick", data))
          while (true) {
            await data.refresh({sds011, sensehat, log})
            io.emit("data", data.zip)
            await sleep(5)
          }
      }

  })()
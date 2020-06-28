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
      commander.program
        .option("-p --port", "HTTP server port", 3000)
        .option("-v --verbose", "Verbose", false)
        .option("-r --raspberry", "Execution on raspberry (may be disabled to develop on another computer instead)", true)
      const {verbose:log, port, raspberry} = commander.program.parse(process.argv)

    //Setup server
      const app = express()
      const server = http.createServer(app)

    //Static resources
      const dirname = path.dirname(url.fileURLToPath(import.meta.url))
      ;[
        {uri:"/", location:path.join(dirname, "../client")},
        {uri:"/js", location:path.join(dirname, "../node_modules", "/socket.io-client/dist")},
        {uri:"/js", location:path.join(dirname, "../node_modules", "/vue/dist")},
        {uri:"/js", location:path.join(dirname, "../node_modules", "/axios/dist")},
        {uri:"/js", location:path.join(dirname, "../node_modules", "/chart.js/dist")},
      ].forEach(({uri, location}) => app.use(uri, express.static(location)))

    //Raspberry mode
      if (raspberry) {
        //Wait for sensors to be ready
          const sensehat = new SenseHat({log})
          const sds011 = new Sds011({dev:"/dev/ttyUSB0", log})
          await Promise.all([sensehat.ready, sds011.ready])

        //Additional routes
          app.get("/data", cors({origin:"*"}), async (req, res) => res.json(data.dump))

        //Socket server
          const io = socketio(server)
          sensehat.event.on("joystick", data => io.emit("joystick", data))
          while (true) {
            await data.refresh({sds011, sensehat, log})
            await sleep(5)
          }
      }

    //Start server
      server.listen(port, () => console.log(`Listening on ${port}`))

  })()
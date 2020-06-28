//Imports
  import Sds011 from "./lib/sds011.js"
  import SenseHat from "./lib/sensehat.js"
  import express from "express"
  import path from "path"
  import http from "http"
  import socketio from "socket.io"
  import url from "url"

//Entry point
  ;(async () => {
    //Configuration
      const log = true
      const port = 3000

    //Wait for sensors to be ready
      const sensehat = new SenseHat({log})
      const sds011 = new Sds011({dev:"/dev/ttyUSB0", log})
      await Promise.all([sensehat.ready, sds011.ready])

    //Setup server
      const app = express()
      const server = http.createServer(app)
      app.get("/data", async (req, res) => res.json({sds011:await sds011.dump(), sensehat:await sensehat.dump({ledmatrix:true})}))

    //Static resources
      const dirname = path.dirname(url.fileURLToPath(import.meta.url))
      ;[
        {uri:"/", location:path.join(dirname, "../client")},
        {uri:"/js", location:path.join(dirname, "../node_modules", "/socket.io-client/dist")},
        {uri:"/js", location:path.join(dirname, "../node_modules", "/vue/dist")},
        {uri:"/js", location:path.join(dirname, "../node_modules", "/axios/dist")},
        {uri:"/js", location:path.join(dirname, "../node_modules", "/chart.js/dist")},
      ].forEach(({uri, location}) => app.use(uri, express.static(location)))

    //Socket server
      const io = socketio(server)
      sensehat.event.on("joystick", data => io.emit("joystick", data))

    //Start server
      server.listen(port, () => console.log(`Listening on ${port}`))

  })()
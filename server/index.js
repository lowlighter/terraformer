//Imports
  //import Sds011 from "./lib/sds011.js"
  import SenseHat from "./lib/sensehat.js"
  import path from "path"
  import express from "express"

;(async function () {

  //const app = express()
  //app.get("/")

  //app.listen(3000, () => console.log(`Listening on 3000`))

  //const sds011 = new Sds011({dev:"/dev/ttyUSB0"})
  //await sds011.ready
  const sense = new SenseHat()
  sense.string("Hello world")
})()


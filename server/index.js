//Imports
  import Sds011 from "./lib/sds011"


;(async function () {
  console.log("Opening...")
  const sds011 = new Sds011({dev:"/dev/ttyUSB0"})
  await sds011.ready
  console.log("Opened")
})()


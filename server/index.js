//Imports
  import Sds011 from "./lib/sds011.js"
  import SenseHat from "./lib/sensehat.js"

;(async function () {

  //const app = express()
  //app.get("/")

  //app.listen(3000, () => console.log(`Listening on 3000`))

  //const sds011 = new Sds011({dev:"/dev/ttyUSB0"})
  //await sds011.ready


  /*async function dump() {
    console.log(await sensehat.dump())
    setTimeout(dump, 10 *1000)
  }

  sensehat.string("Hello world")
  dump()*/



  const size = 8

  let map = []

  function init() {
    for (let x = 0; x < 8; x++) {
      map[x] = []
      for (let y = 0; y < 8; y++) {
        map[x][y] = Math.round(Math.random())
      }
    }
  }

  init()

  function neighbors({x, y}) {
    return [
      {x:((x-1)+size)%size, y:((y-1)+size)%size}, {x, y:((y-1)+size)%size}, {x:((x+1)+size)%size, y:((y-1)+size)%size},
      {x:((x-1)+size)%size, y}, {x:((x+1)+size)%size, y},
      {x:((x-1)+size)%size, y:((y+1)+size)%size}, {x, y:((y+1)+size)%size}, {x:((x+1)+size)%size, y:((y+1)+size)%size}
    ].map(({x, y}) => map[x][y]).filter(c => c).length
  }

  function next(map) {
    const nmap = JSON.parse(JSON.stringify(map))
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const n = neighbors({x, y})
        const a = map[x][y]

        if ((a)&&((n === 2)||(n === 3)))
          continue
        if ((!a)&&(n === 3)) {
          nmap[x][y] = 1
          continue
        }
        nmap[x][y] = 0
      }
    }
    return nmap
  }

  const sensehat = new SenseHat({log:false})


  function sleep(t) {
    return new Promise(solve => setTimeout(solve, t*1000))
  }


  while (true) {
    map = next(map)
    const imap = JSON.parse(JSON.stringify(map))
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        imap[x][y] = map[x][y] ? [255, 255, 255] : [0, 0, 0]
      }
    }
    sensehat.pixels(imap.flat(1))
    await sleep(2)

    if (map.flat().reduce((a, b) => a+b, 0) === 0) {
      init()
      await sleep(2)
    }

    //sensehat.pixel({x:Math.floor(8*Math.random()), y:Math.floor(8*Math.random())}, {r:Math.floor(255*Math.random()), g:Math.floor(255*Math.random()), b:Math.floor(255*Math.random())})

  }






})()


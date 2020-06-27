/** Imports */
  import path from "path"
  import pyshell from "python-shell"

/** Bindings */
  export default class SenseHat {

    /** Rotation */
      async rotation(r, {redraw = true} = {}) {
        r = (r+360)%360
        if (![0, 90, 180, 270].includes(r))
          throw new Error(`Invalid rotation ${r}`)
        return await this.call({func:"set_rotation", r, redraw})
      }

    /** Flip */
      async flip(o, {redraw = true} = {}) {
        o = {"h":"h", "v":"v", "horizontal":"h", "vertical":"v"}[o]
        if (!o)
          throw new Error(`Invalid orientation <${o}>`)
        return await this.call({func:`flip_${o}`, redraw})
      }

    /** Set pixels */
      async pixels(pixels = null) {
        if (arguments.length)
          return await this.call({func:`set_pixels`, pixels})
        return await this.call({func:`get_pixels`})
      }

    /** Set pixel */
      async pixel({x, y}, {r, g, b, colour} = {}) {
        if (arguments.length > 1)
          return await this.call({func:`set_pixel`, x, y, r, g, b, pixel:colour})
        return await this.call({func:`get_pixel`, x, y})
      }

    /** Draw image */
      async draw(image, {redraw = true} = {}) {
        image = path.relative(path.dirname(SenseHat.py), image)
        return await this.call({func:`load_image`, file_path:image, redraw})
      }

    /** Clear */
      async clear({r, g, b, colour} = {}) {
        return await this.call({func:`clear`, r, g, b, colour})
      }

    /** Show string  */
      async string(text, {speed, colour, background}) {
        return await this.call({func:`show_message`, text_string:text, scroll_speed:speed, text_colour:colour, back_colour:background})
      }

    /** Show letter  */
      async letter(text, {colour, background}) {
        return await this.call({func:`show_letter`, s:text, text_colour:colour, back_colour:background})
      }

    /** Get humidity */
      async humidity() {
        return await this.call({func:`get_humidity`})
      }

    /** Get pressure */
      async pressure() {
        return await this.call({func:`get_pressure`})
      }

    /** Get temperature */
      async temperature({from = "humidity"} = {}) {
        let func = null
        if (["h", "humidity"].includes(from))
          func = "get_temperature_from_humidity"
        if (["p", "pressure"].includes(from))
          func = "get_temperature_from_pressure"
        if (!func)
          throw new Error(`Invalid source ${from}`)
        return await this.call({func})
      }

    /** IMU configuration */
      async imu({compass = false, gyroscope = false, accelerometer = false} = {}) {
        return await this.call({func:"set_imu_config", compass_enabled:compass, gyro_enabled:gyroscope, accel_enabled:accelerometer})
      }

    /** Orientation */
      async orientation({unit = "d"} = {}) {
        let func = null
        if (["d", "deg", "degree", "degrees"].includes(unit))
          func = "get_orientation_degrees"
        if (["r", "rad", "radian", "radians"].includes(unit))
          func = "get_orientation_radians"
        if (!func)
          throw new Error(`Invalid unit ${unit}`)
        return await this.call({func})
      }

    /** Compass */
      async compass({raw = false} = {}) {
        return await this.call({func:`get_compass${raw ? "_raw" : ""}`})
      }

    /** Gyroscope */
      async gyroscope({raw = false} = {}) {
        return await this.call({func:`get_gyroscope${raw ? "_raw" : ""}`})
      }

    /** Accelerometer */
      async accelerometer({raw = false} = {}) {
        return await this.call({func:`get_accelerometer${raw ? "_raw" : ""}`})
      }

    /** Constructor */
      constructor() {
        this.python = new pyshell.PythonShell(SenseHat.py)
        //Result and messages handlers
          this.python.on("message", message => {
            console.log(`>>> ${message}`)
            try {
              const {uid = null, error = null, result = null} = JSON.parse(message)
              this.calls.get(uid)?.[!error ? "solve" : "reject"]?.(result)
            }
            catch (error) {
              console.error(error)
            }
          })
          this.python.on("stderr", message => console.error(`SenseHat stderr >>> ${message}`))
      }

    /** Close */
      close() {
        this.python.end()
      }

    /** Calls map */
      calls = new Map()

    /** Call a function */
      async call({func, ...args}) {
        //Generate uid
          const uid = Math.random()
        //Create promise and call python
          return await new Promise((solve, reject) => {
            this.calls.set(uid, {solve, reject})
            this.python.send(JSON.stringify({uid, func, ...args}))
          })
      }

    /** Python binding file */
      static py = path.join(path.dirname(import.meta.url.replace(/file:[/]{2}/, "")), "sensehat.py")

  }

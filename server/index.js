
const SerialPort = require("serialport")
class Sds011 {

  //Baudrate
    baudrate = 9600

  //Frequency
    frequency = 1

  //Packets
    packet = {
      index:{HEADER:0, COMMANDER:1, DATA1:2, DATA2:3, DATA3:4, DATA4:5, DATA5:6, DATA6:7, CHECKSUM:8, TAIL:9},
      value:{HEADER:0xAA, COMMANDER:0xC0, TAIL:0xAB},
      id:0
    }

  //Checksum
    checksum(buffer) {
      const checksum = buffer[this.packet.index.CHECKSUM]
      const hash = (buffer.slice(this.packet.index.DATA1, this.packet.index.DATA6+1).reduce((a, b) => a + b, 0) & 0xFF)
      return {hash, checksum, ok:(checksum === hash)}
    }

  //Parse buffer
    parse(buffer, log = false) {
      //Compute checksum
        const {hash, checksum, ok} = this.checksum(buffer)
      //Update values if ok
        if (ok) {
          this.pm25 = ((buffer[this.packet.index.DATA2] << 8) + buffer[this.packet.index.DATA1])/10
          this.pm10 = ((buffer[this.packet.index.DATA4] << 8) + buffer[this.packet.index.DATA3])/10
          this.uid = (buffer[this.packet.index.DATA6] << 8) + buffer[this.packet.index.DATA5]
          this.updated = Date.now()
          this.packet.id++
        }
      //Log if needed
        if (log)
          console.log(ok ? `${this.dev} : UID = 0x${this.uid.toString(16)} ; PM2.5 = ${this.pm25} ug/m3 ; PM10 = ${this.pm10} ug/m3` : `${this.dev} : invalid checksum, expected 0x${checksum.toString(16)} but got 0x${hash.toString(16)}`)
    }

  //Constructor
    constructor({dev}) {
      //Device
        this.dev = dev
        this.pm25 = NaN
        this.pm10 = NaN
        this.updated = NaN
        this.uid = null
      //Configure serial port
        this.serial = new SerialPort(this.dev, {baudrate:this.baudRate})
        this.ready = new Promise((solve, reject) => {
          this.serial.on("open", solve)
          this.serial.on("error", reject)
          this.serial.on("data", buffer => this.parse(buffer, true))
        })
    }

  //Alias for data
    get data() {
      return {uid:this.uid, pm25:this.pm25, pm10:this.pm10, updated:this.updated, packet:this.packet.id}
    }

}

;(async function () {
  console.log("Opening...")
  const sds011 = new Sds011({dev:"/dev/ttyUSB0"})
  await sds011.ready
  console.log("Opened")
})()


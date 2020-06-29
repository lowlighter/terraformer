//Data
  const data = {
    //Last dumped data
      dump:{},
    //Recorded data
      records:{
        pm10:[],
        pm25:[],
        humidity:[],
        pressure:[],
        temperature:[],
        temperature_from_humidity:[],
        temperature_from_pressure:[],
      },
    /** Zipped data */
      get zip() {
        return {dump:this.dump, records:this.records}
      },
    /** Refresh data from sensors */
      async refresh({recording = true, sds011 = null, sensehat = null, log = false}) {
        //Dump sensors
          const t = Date.now()
          const {records} = data
          const d = {}
          if (log)
            console.log(`${t} : refreshing data`)
        //Save data
          if (sds011) {
            d.sds011 = await sds011.dump()
            if (records)
              ["pm10", "pm25"].forEach(k => records[k].push({t, y:d.sds011[k]}))
          }
          if (sensehat) {
            d.sensehat = await sensehat.dump({ledmatrix:true})
            if (recording) {
              ;["humidity", "pressure"].forEach(k => records[k].push({t, y:d.sensehat[k]}))
              records.temperature_from_humidity.push({t, y:d.sensehat.temperature.humidity})
              records.temperature_from_pressure.push({t, y:d.sensehat.temperature.pressure})
              records.temperature.push({t, y:.5*(d.sensehat.temperature.humidity+d.sensehat.temperature.pressure)})
            }
          }
          data.dump = d
        //Filter old data
          for (let [key, record] of Object.entries(records))
            records[key] = record.filter(r => r.t >= t - 12*60*60*1000)
      },
  }
export default data
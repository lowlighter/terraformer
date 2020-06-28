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
      async refresh({sds011, sensehat, log = false}) {
        //Dump sensors
          const t = new Date()
          if (log)
            console.log(`${t} : refreshing data`)
          const d = data.dump = {sds011:await sds011.dump(), sensehat:await sensehat.dump({ledmatrix:true})}
          const {records} = data
        //Save data
          ;["pm10", "pm25"].forEach(k => records[k].push({t, y:d.sds011[k]}))
          ;["humidity", "pressure"].forEach(k => records[k].push({t, y:d.sensehat[k]}))
          records.temperature_from_humidity.push({t, y:d.sensehat.temperature.humidity})
          records.temperature_from_pressure.push({t, y:d.sensehat.temperature.pretemperature_from_pressure})
          records.temperature.push({t, y:.5*(d.sensehat.temperature.humidity+sensehat.temperature.pretemperature_from_pressure)})
      },
  }
export default data
//Data
  const data = {
    //Saved data
      dump:{},
      pm10:[],
      pm25:[],
      humidity:[],
      pressure:[],
      temperature:[],
      temperature_from_humidity:[],
      temperature_from_pressure:[],
    /** Refresh data from sensors */
      async refresh({sds011, sensehat, log = false}) {
        //Dump sensors
          const t = new Date()
          if (log)
            console.log(`${t} : refreshing data`)
          const d = data.dump = {sds011:await sds011.dump(), sensehat:await sensehat.dump({ledmatrix:true})}
        //Save data
          ;["pm10", "pm25"].forEach(k => data[k].push({t, y:d.sds011[k]}))
          ;["humidity", "pressure"].forEach(k => data[k].push({t, y:d.sensehat[k]}))
          data.temperature_from_humidity.push({t, y:d.sensehat.temperature.humidity})
          data.temperature_from_pressure.push({t, y:d.sensehat.temperature.pretemperature_from_pressure})
          data.temperature.push({t, y:.5*(d.sensehat.temperature.humidity+sensehat.temperature.pretemperature_from_pressure)})
      },
  }
export default data
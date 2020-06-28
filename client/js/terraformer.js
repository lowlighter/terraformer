;(async function () {

  const lang = {
    gyroscope:"Gyroscope",
    accelerometer:"Accéléromètre",
    roll:"Roulis",
    pitch:"Tangage",
    yaw:"Lacet",
    air_quality:"Qualité de l'air",
    environment:"Environement",
    environment_over_24_hours:"Environement (dernières 24 heures)",
    temperature:"Temperature (°C)",
    temperature_from_humidity:"Par humidité",
    temperature_from_pressure:"Par pression",
    humidity:"Humidité (%)",
    pressure:"Pression (hPa)",
    pm25:"PM₂.₅ (µg/m³)",
    pm10:"PM₁₀ (µg/m³)",
    ledmatrix:"Matrice de LEDs",
  }

  const data = {
    lang,
    sensehat:{
      pixels:(new Array(64)).fill([0, 0, 255]),
      lowlight: false,
      gamma: [
         0,  0,  0,  0,  0,  0,  1,  1,  2,
         2,  3,  3,  4,  5,  6,  7,  8,  9,
        10, 11, 12, 14, 15, 17, 18, 20, 21,
        23, 25, 27, 29, 31
      ],
      humidity: 40.53026580810547,
      pressure: 1011.6826171875,
      temperature: { humidity: 35.329437255859375, pressure: 34.35416793823242 },
      orientation: {
        degrees: {
          roll: 356.64818071435144,
          pitch: 359.28328663924515,
          yaw: 173.26610784586242
        },
        radians: {
          roll: -0.05821419134736061,
          pitch: -0.012433450669050217,
          yaw: 3.0240633487701416
        }
      },
      compass: {
        value: 173.2605344114997,
        raw: {
          x: -77.80701446533203,
          y: -11.258152961730957,
          z: 27.509563446044922
        }
      },

      gyroscope: {
        value: {
          roll: 356.6581939851181,
          pitch: 359.2723504925277,
          yaw: 173.25952354350252
        },
        raw: {
          x: 0.001119786873459816,
          y: -0.010634476318955421,
          z: 0.003768390044569969
        }
      },
      accelerometer: {
        value: {
          roll: 356.6758707281335,
          pitch: 359.2635467522136,
          yaw: 173.2638129023013
        },
        raw: {
          x: 0.00630359398201108,
          y: -0.05499950423836708,
          z: 0.9689386487007141
        }
      }
    }
  }

  const socket = io(location.href)
  socket.on("joystick", data => console.log(data))
  const app = new Vue({el:"main", data})


  function graph({selector = "", title = "", data = []}) {
    const colors = ["#3480EA", "#2F3689", "#4E5FB7"]
    Chart.defaults.global.defaultFontColor = "#FFFFFF"
    return new Chart(document.querySelector(selector).getContext("2d"), {
      type:"line",
      data:{
        datasets:data.map(({label, values}, index) => { return {
            label,
            borderColor:colors[index],
            borderWidth:1,
            backgroundColor:`${colors[index]}69`,
            data:values
          }
        })
      },
      options:{
        responsive:true,
        title:{
          display:(title.length > 0),
          text:title,
        },
        scales:{
          xAxes:[{
            type:"time",
            distribution:"linear",
            time: {
              displayFormats:{
                hour:"H[h]"
              }
            }
          }]
        },
        legend:{
          display:true,
          position:"bottom",
        }
      }
    })
  }

  ;[
    {
      selector:".temperature.graph",
      data:[
        {
          label:lang.temperature,
          values:[{t:new Date("2015-3-15 13:3"), y:1}, {t:new Date("2015-3-25 14:2"), y:4}]
        },
        {
          label:lang.temperature_from_humidity,
          values:[{t:new Date("2015-3-15 13:3"), y:1}, {t:new Date("2015-3-25 14:2"), y:4}]
        },
        {
          label:lang.temperature_from_pressure,
          values:[{t:new Date("2015-3-15 13:3"), y:3}, {t:new Date("2015-3-25 14:2"), y:7}]
        },
      ]
    },
    {
      selector:".humidity.graph",
      data:[
        {
          label:lang.humidity,
          values:[{t:new Date("2015-3-15 13:3"), y:1}, {t:new Date("2015-3-25 14:2"), y:4}]
        },
      ]
    },
    {
      selector:".pressure.graph",
      data:[
        {
          label:lang.pressure,
          values:[{t:new Date("2015-3-15 13:3"), y:1}, {t:new Date("2015-3-25 14:2"), y:4}]
        },
      ]
    },
    {
      selector:".pm25.graph",
      data:[
        {
          label:lang.pm25,
          values:[{t:new Date("2015-3-15 13:3"), y:1}, {t:new Date("2015-3-25 14:2"), y:4}]
        },
      ]
    },
    {
      selector:".pm10.graph",
      data:[
        {
          label:lang.pm10,
          values:[{t:new Date("2015-3-15 13:3"), y:1}, {t:new Date("2015-3-25 14:2"), y:4}]
        },
      ]
    }
  ].map(graph)

  /*
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}
  */


			 /*{
				datasets: [{
            label:"Temperature °C (humidity)",
            borderColor:"#3480EA",
            data: datapoints,
          },
        ]
      }*/


})()
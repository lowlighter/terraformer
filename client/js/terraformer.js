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
    ...(await axios.get("/data")).data
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
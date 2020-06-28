;(async function () {

  //Load server location and connect to sockets
    const server = (await axios.get("/server")).data || location.href
    const socket = io(server)

  //Lang and initial data
    const {data:lang} = await axios.get("/lang/fr.json")
    const {data:init} = await axios.get(`${server}/data`)
    const data = {lang, ...init}

  //App
    const app = new Vue({
      el:"main",
      data,
      computed:{
        sensehat() { return this.$data.dump.sensehat },
        sds011() { return this.$data.dump.sds011 },
      }
    })


  socket.on("joystick", data => console.log(data))
  socket.on("data", ({dump, records}) => {
    data.dump = dump
    ;["humidity", "pressure", "pm25", "pm10"].forEach(id => graph.update({id, datasets:[records[id]]}))
    graph.update({id:"temperature", datasets:[records.temperature, records.temperature_from_humidity, records.temperature_from_pressure]})
  })

  //Graphs
    const graphs = new Map([
      {id:"temperature", selector:".temperature.graph", data:["temperature", "temperature_from_humidity", "temperature_from_pressure"].map(k => { return {label:lang[k], values:init.records[k]}})},
      {id:"humidity", selector:".humidity.graph", data:[{label:lang.humidity, values:init.records.pressure}]},
      {id:"pressure", selector:".pressure.graph", data:[{label:lang.pressure, values:init.records.pressure}]},
      {id:"pm25", selector:".pm25.graph", data:[{label:lang.pm25, values:init.records.pm25}]},
      {id:"pm10", selector:".pm10.graph", data:[{label:lang.pm10, values:init.records.pm10}]}
    ].map(({id, ...options}) => [id, graph(options)]))

  /** Grapher */
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

  /** Graph updater */
    graph.update = function ({id, datasets}) {
      const g = graphs.get(id)
      datasets.forEach(values => {
        g.data.datasets[0].data = values.map(({y}) => y)
        g.data.labels = values.map(({t}) => t)
        g.update()
      })
    }


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
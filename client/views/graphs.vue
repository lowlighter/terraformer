<template>
  <div class="panel">
    <header>
      <slot></slot>
    </header>
    <div class="body graphs">
      <canvas class="graph" :class="graph" :key="graph" v-for="graph in graphs"></canvas>
    </div>
  </div>
</template>

<script>
  //Exports
    module.exports = {
      //Properties
        props:["lang", "records", "graphs"],
      //Methods
        methods:{
          //Grapher
            graph({selector = "", title = "", data = []}) {
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
            },
          //Update
            update({id, datasets}) {
              const graph = this._graphs.get(id)
              if (graph) {
                datasets.forEach(values => {
                  graph.data.datasets[0].data = values.map(({y}) => y)
                  graph.data.labels = values.map(({t}) => t)
                  graph.update()
                })
              }
            }
        },
      //Updater
        updated() {
          ;["humidity", "pressure", "pm25", "pm10"].forEach(id => this.update({id, datasets:[this.records[id]]}))
          this.update({id:"temperature", datasets:[this.records.temperature, this.records.temperature_from_humidity, this.records.temperature_from_pressure]})
        },
      //Mounter
        mounted() {
          this.$nextTick(() =>
            this._graphs = new Map([
              {id:"temperature", selector:".temperature.graph", data:["temperature", "temperature_from_humidity", "temperature_from_pressure"].map(k => { return {label:this.lang[k], values:this.records[k]}})},
              {id:"humidity", selector:".humidity.graph", data:[{label:this.lang.humidity, values:this.records.pressure}]},
              {id:"pressure", selector:".pressure.graph", data:[{label:this.lang.pressure, values:this.records.pressure}]},
              {id:"pm25", selector:".pm25.graph", data:[{label:this.lang.pm25, values:this.records.pm25}]},
              {id:"pm10", selector:".pm10.graph", data:[{label:this.lang.pm10, values:this.records.pm10}]}
            ].filter(({id}) => this.graphs?.includes(id)).map(({id, ...options}) => [id, this.graph(options)]))
          )
        }
    }
</script>
//Imports
  import commander from "commander"
  import app from "./app.js"

//Entry point
  ;(() => {
    app(commander.program
      .option("--port <port>", "HTTP server port", 3000)
      .option("-v | --verbose", "Verbose", false)
      .option("--sensors <sensors>", "Execution with sensors", "")
      .option("--ip <ip>", "Get data from another HTTP server", null)
      .option("--refresh <refresh>", "Frequency of each data refres", 5)
      .parse(process.argv)
    )
  })()
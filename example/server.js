let express = require('express');

let app = express();



let config = {
  port: process.env.PORT || 8080,
}

function startServer(){

  app.get('/', (req, res) => {
    res.send('Good morning 😍')
  })
  app.get('/test', (req, res) => {
    res.send('Good morning 😍')
  })
  app.put('/test', (req, res) => {
    res.send('Good morning 😍')
  })
  app.post('/test2', (req, res) => {
    res.send('Good morning 😍')
  })
  app.get('/yolo55/:id', (req, res) => {
    res.send('Good morning 😍')
  })

  let swaggah = require('./swaggah');
  swaggah.register(app)


  app.listen(config.port, '0.0.0.0')
  console.log(`Served on http://localhost:${config.port}`)
}

startServer()
import express from 'express';

const nunjucks = require('nunjucks');

// initializing packages
const app = express();
const path = require('path');
var bodyParser = require('body-parser')
const parser = require('../gramatica'); 
nunjucks.configure(__dirname+'/client', {
  autoescape: true,
  express: app
});

 
// create application/json parser
var jsonParser = bodyParser.json()
// settings
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('port', process.env.PORT || 9000);

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS');
    next();
  });

// middlwares

// routes
app.get('/', (req, res) => {
  res.render(`prueba.html`, {foo:'holabb'});
});

app.get('/api', (req, res) => {
  res.json({api: 'works!'});
});

app.post('/prueba', urlencodedParser, (req, res) => {
  console.log('prueba de post')
  console.log(req.body.code);
  const codevalue = req.body.code;
  const resultado =  parser.parse(codevalue);
  
  res.status(200).json({exito: "exito"})
  
  
});

// starting the server
app.use("/client", express.static(__dirname + "/client"));

app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});
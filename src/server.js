import express from 'express';

const nunjucks = require('nunjucks');

// initializing packages
const app = express();
const path = require('path');
const {TablaErrores} = require('./Estructuras/ManejoErrores/TablaErrores.js') ;
var bodyParser = require('body-parser')
const parser = require('./gramatica'); 
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
function imprimir(raiz){
  var texto ="";
  var contador=1;
  texto+="digraph G{";
  texto+="Node0[label=\"" + escapar(raiz.name +" | "+raiz.value) + "\"];\n";

  recorrido("Node0",raiz);

  texto+= "}";

  return texto;

  function recorrido(padre,hijos){
    if(hijos === undefined || hijos === null) return;

    //console.log(typeof hijos);

    if(typeof hijos=="string")return;
    hijos.hijos.forEach(nodito=> {
      if(typeof nodito.name=="undefined")return;
      let nombrehijo="Node"+contador;
      texto+=nombrehijo+"[label=\"" + escapar(nodito.name +" | "+nodito.value) + "\"];\n";
      texto+=padre+"->"+nombrehijo+";\n";
      contador++;
      recorrido(nombrehijo,nodito);
    })

  }

  function escapar(cadena) {
    cadena = cadena.replace("\\", "\\\\");
    cadena = cadena.replace("\"", "\\\"");
    return cadena;
}


}
// routes
app.get('/', (req, res) => {
  res.render(`main.html`, {foo:'holabb'});
});

app.get('/api', (req, res) => {
  res.json({api: 'works!'});
});

app.post('/prueba', urlencodedParser, (req, res) => {
  console.log('prueba de post')
  console.log(req.body.code);
  const codevalue = req.body.code;
  try {
    const resultado =  parser.parse(codevalue);  
    var errores = TablaErrores.getInstance().getErrores();
    const dot = imprimir(resultado)
    res.status(200).json({exito: "exito", htmlErrores: errores ,dot: dot});
  } catch (error) {
    console.error(error);
    res.status(200).json({exito: "error"})
  }
  
});

// starting the server
app.use("/client", express.static(__dirname + "/client"));
app.use("/Estructuras", express.static(__dirname + "/Estructuras"));

app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});
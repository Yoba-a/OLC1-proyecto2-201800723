var dot = ""
var tblErrores = ""
var tblSimbolos = ""

const jsEditor = CodeMirror(document.querySelector(".editor .code .js-code"), {
  styleActiveLine: true,
  lineNumbers: true,
  tabSize:4,
  matchBrackets: true,
  mode:"text/x-ceylon"
});

const code_ouput = CodeMirror(document.querySelector(".editor .code .code_ouput"), {
  styleActiveLine: true,
  lineNumbers: true,
  tabSize:4,
  matchBrackets: true,
  mode:"text/x-ceylon"
});

$("#rep_errores").on("click", function () {
  if(tblErrores !== ""){
    document.getElementById("contenido").className ="card animate__animated animate__jackInTheBox";
    document.getElementById("contenido").innerHTML = tblErrores;
  }

});
$("#rep_ast").on("click", function () {
  if(dot !== ""){
    document.getElementById("contenido").className ="card animate__animated animate__jackInTheBox";
    var svg = Viz(dot, "svg");
    var data = `
    <div class="card-header" style = "border-bottom: 0px ">
        Arbol AST
    </div>
    <div class"card-body" > `
    data += svg ;
    data += `</div>`;
    document.getElementById("contenido").innerHTML = data;
  }

});

$("#run-btn").on("click", function () {
  const code = jsEditor.getValue();

  if( code.length !== 0){
    const data = {"code" : jsEditor.getValue()};
    console.log(jsEditor.getValue());
    fetch('/prueba',{
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json", 
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Origin": "*"
      }, body: JSON.stringify(data)

    })
    .then(res =>res.json())
    .then(datos =>{
      console.log(datos);
      if(datos.exito ==="exito"){
        //document.getElementById("contenido").className ="card animate__animated animate__jackInTheBox";
        Swal.fire({
          title: 'Codigo leido exitosamente',
          width: 600,
          padding: '3em',
          color: '#716add',
          background: '#fff url(/images/trees.png)',
          backdrop: `
            rgba(0,0,123,0.4)
            url("https://sweetalert2.github.io/images/nyan-cat.gif")
            left top
            no-repeat
          `
        })
        tblErrores = datos.htmlErrores;
        dot = datos.dot;
      }else{
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Ocurrio un error en la ejecucion del codigo, mira el reporte de errores!',
          showConfirmButton: false,
          timer: 1500
        })

      }
    })
  }else{
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Ingresa un codigo para ejecutarlo',
      showConfirmButton: false,
      timer: 1500
    })
  }
  
});

const jsEditor = CodeMirror(document.querySelector(".editor .code .js-code"), {
  styleActiveLine: true,
  lineNumbers: true,
  tabSize:4,
  matchBrackets: true,
  mode:"text/x-ceylon"
});


$("#run-btn").on("click", function () {
  document.getElementById("codevalue").value = jsEditor.getValue();
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
  })

  
});

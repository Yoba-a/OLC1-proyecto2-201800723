export var TablaErrores = (function(){
    var instancia;

    class Lista{
        constructor(){
            this.errores = [];
        }
        
        insertarError(Error){
            this.errores.push(Error);
        }

        getErrores(){
            var texto="";

            texto+=`
            <div class="card-header">
                Tabla de errores
            </div>
            <table class="table table-striped">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Tipo</th>
                    <th>Descripcion</th>
                    <th>Linea</th>
                    <th>Columna</th>
                </tr>
            </thead>
            <tbody>
            `;
            var cuenta=1;
            this.errores.forEach(_error =>{
                texto+="<tr>\n";
                texto+="<td>"+cuenta+"</td>\n";
                texto+="<td>"+_error.tipo+"</td>\n";
                texto+="<td>"+_error.descripcion+"</td>\n";
                texto+="<td>"+_error.fila+"</td>\n";
                texto+="<td>"+_error.columna+"</td>\n";
                texto+="</tr>";
                cuenta++;
            })
            texto+=`
            </tbody>
            </table>

            `;

            return texto;
        }

        reiniciar(){
            this.errores = [];
        }

    }

    function crearInstancia(){
        return new Lista()
    }

    return {
        getInstance:function(){
            if(!instancia){
                instancia=crearInstancia()
            }
            return instancia;
        }
    }

}());
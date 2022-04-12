export var TablaSimbolos = (function(){
    var instance;
    
    class TablaSimbolos{
        constructor(){
            this.simbolos = [];
        }

        insertarSimbolo(simbolos){
            this.simbolos.push(simbolos);
        }

        reiniciarTabla(){
            this.simbolos = [];
        }

        getSimbolo(nombre){
            let res = null;
            this.simbolos.forEach(simbolo => {
                if(simbolo.nombre == nombre){
                    res=simbolo;
                }
            });
            return res;
        }

        modificar(simbol_mod){
            this.simbolos.forEach(simbolo => {
                if(simbolo.nombre == nombre){
                    simbolo.valor = simbol_mod;
                }
            });
        }

        getsimbolos(){
            var texto="";

            texto+=`
            <div class="card-header">
                Tabla de Simbolos
            </div>
            <table class="table table-striped">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Entorno</th>
                    <th>Linea</th>
                    <th>Columna</th>
                </tr>
            </thead>
            <tbody>
            `;
            var cuenta=1;
            this.simbolos.forEach(simbolo =>{
                texto+="<tr>\n";
                texto+="<td>"+cuenta+"</td>\n";
                texto+="<td>"+simbolo.nombre+"</td>\n";
                texto+="<td>"+simbolo.tipo2+"</td>\n";
                texto+="<td>"+simbolo.tipo+"</td>\n";
                texto+="<td>"+simbolo.valor+"</td>\n";
                texto+="<td>"+simbolo.entorno+"</td>\n";
                texto+="<td>"+simbolo.linea+"</td>\n";
                texto+="<td>"+simbolo.columna+"</td>\n";
                texto+="</tr>";
                cuenta++;
            })
            texto+=`
            </tbody>
            </table>

            `;

            return texto;

        }  
    }

    function crearInstancia(){
        return new TablaSimbolos();
    }

    return{
        getInstance:function(){
            if(!instance){
                instance = crearInstancia();
            }
            return instance;
        }
    }
}());
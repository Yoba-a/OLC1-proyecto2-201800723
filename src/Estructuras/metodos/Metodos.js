export var TablaMetodos = (function(){
    var instance;
    
    class TablaMetodos{
        constructor(){
            this.metodos = [];
        }

        insertarMetodo(metodo){
            this.metodos.push(metodo);
        }

        reiniciar(){
            this.metodos = [];
        }

        getMetodo(nombre){
            let res = null;
            this.metodos.forEach(metodo => {
                if(metodo.nombre == nombre){
                    res=metodo;
                }
            });
            return res;
        }

        existe(nombre){
            let res = false;
            this.metodos.forEach(metodo => {
                if(metodo.nombre == nombre){
                    res = true;
                }
            });
            return res;
        }

        modificar(simbol_mod){
            this.metodos.forEach(simbolo => {
                if(simbolo.nombre == simbol_mod.nombre){
                    simbolo = simbol_mod;
                }
            });
        }

        
    }

    function crearInstancia(){
        return new TablaMetodos();
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
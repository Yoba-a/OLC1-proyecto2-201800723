class NodoEntorno{

    constructor(){
        this.anterior = null;
        this.simbolos = [];
    }

    insertarSimbolo(simbolo){
        this.simbolos.push(simbolo);
    }

    setAnterior(anterior){
        this.anterior = anterior;
    }

    getAnterior(){
        return this.anterior;
    }
    
    getSimbolo(nombre){
        let res = null;
        this.simbolos.forEach(simbolo => {
            if(simbolo.nombre == nombre){
                res = simbolo;
            }
        });

        if(res===null){
            if(this.anterior != null){
                res = this.anterior.getSimbolo(nombre);
            }else{
                res = null;
            }
        }
        return res;
    }

    existe(nombre){
        let res = false;
        this.simbolos.forEach(simbolo => {
            if(simbolo.nombre == nombre){
                res = true;
            }
        });

        if(res == false){
            if(this.anterior != null){
                res = this.anterior.existe(nombre);
            }else{
                res = false;
            }
        }
        return res;
    }
    
    getGlobal(nodo){
        if(nodo.anterior == null){
            return nodo;
        }else{
            nodo.getGlobal(nodo.anterior);
        }
    }
}


const {TablaSimbolos} = require('../Estructuras/TablaSimbolos/TablaSimbolos') ;
const {TablaErrores} = require('../Estructuras/ManejoErrores/TablaErrores.js');
const {_Error} = require('../Estructuras/ManejoErrores/_Error');
const {Simbolo} = require('../Estructuras/TablaSimbolos/Simbolo')
const {Operador} = require('./Operador.js') 
export class Interprete{
    constructor(){

    }
    analizar(root){
        return this.interpretar(root);
    }

    interpretar(root){
        let op;
        let result;
        let code = "";
        let simbolo;

        if(root === undefined || root === null) return;

        switch(root.name){
            case "RAIZ": 
                root.hijos.forEach(hijo => code+= this.interpretar(hijo)); 
                return code;
            case "SENTENCIAS":
                root.hijos.forEach(hijo=> code+=this.interpretar(hijo));
                return code;
            case "PRINT":
                op = new Operador();
                result = op.ejecutar(root.hijos[0]);
                code += result.valor;
                console.log("valor " +result.valor);
                return code;
            case "PRINTLN": 
                op = new Operador();
                result = op.ejecutar(root.hijos[0]);
                code += result.valor +"\n";
                return code;
            case "DECLARACION_INDV":
                let existe = TablaSimbolos.getInstance().existe(root.hijos[0].value);
                if(existe){
                    TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.hijos[0].value+"\" variable declarada con anterioridad"  ,root.hijos[0].fila,root.hijos[0].columna));
                    break;
                }else{
                    if(root.hijos.length ==3){
                        if(root.hijos[1].value === "VECTOR1D"){
                            switch (root.hijos[2].value) {
                                case "NEW":
                                    if(root.hijos[0].tipo == root.hijos[2].tipo){
                                        op = new Operador();
                                        result = op.ejecutar(root.hijos[2].hijos[0]);
                                        if(result.tipo == 'int'){
                                            simbolo = new Simbolo(root.hijos[0].value, //nombre
                                            root.hijos[0].tipo, // tipo
                                            root.hijos[0].entorno, // clasificacion
                                            root.hijos[0].entorno, // entorno
                                            {
                                                size : result.valor,
                                                array: new Array(result.valor),
                                            }, // valor 
                                            root.hijos[0].fila, 
                                            root.hijos[0].columna);
                                            TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                            console.log(simbolo.valor);
                                            break;                 
                                        }else{
                                            TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.hijos[0].value+"\" tipos no compatibles ingreso: "+result.tipo +" y se requiere: " + root.hijos[0].tipo ,root.hijos[2].fila,root.hijos[2].columna));
                                            break;    
                                        }    
                                    }else{
                                        TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.hijos[0].value+"\" tipos no compatibles ingreso: "+root.hijos[2].tipo +" y se requiere: " + root.hijos[0].tipo ,root.hijos[2].fila,root.hijos[2].columna));
                                        break;
                                    }        
                                case "LST_EXP":
                                    if(root.hijos[0].tipo == root.hijos[2].tipo){
                                        op = new Operador();
                                        result = op.ejecutar(root.hijos[2]);
                                            simbolo = new Simbolo(root.hijos[0].value, //nombre
                                            root.hijos[0].tipo, // tipo
                                            root.hijos[0].entorno, // clasificacion
                                            root.hijos[0].entorno, // entorno
                                            result.valor, // valor 
                                            root.hijos[0].fila, 
                                            root.hijos[0].columna);
                                            TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                            console.log(simbolo.valor);
                                            break;                 
                                    }else{
                                        TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.hijos[0].value+"\" tipos no compatibles ingreso: "+root.hijos[2].tipo +" y se requiere: " + root.hijos[0].tipo ,root.hijos[2].fila,root.hijos[2].columna));
                                        break;
                                    }
                            }
                            break;
                        }else if (root.hijos[1].value === "VECTOR2D"){
                            switch (root.hijos[2].value) {
                                case "NEW":
                                    if(root.hijos[0].tipo == root.hijos[2].tipo){
                                        op = new Operador();
                                        result = op.ejecutar(root.hijos[2].hijos[0]);
                                        var result2 = op.ejecutar(root.hijos[2].hijos[1]);
                                        if(result.tipo == 'int' && result2.tipo == "int"){
                                            var array = new Array(result.valor);
                                            for(var i = 0 ; i<array.length ; i++){
                                                array[i] = new Array(result2.valor);
                                            } 
                                            simbolo = new Simbolo(root.hijos[0].value, //nombre
                                            root.hijos[0].tipo, // tipo
                                            root.hijos[0].entorno, // clasificacion
                                            root.hijos[0].entorno, // entorno
                                            {
                                                sizex : result.valor,
                                                sizey : result2.valor,
                                                array: array
                                            }, // valor 
                                            root.hijos[0].fila, 
                                            root.hijos[0].columna);
                                            TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                            console.log(simbolo.valor);
                                            break;                 
                                        }else{
                                            TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.hijos[0].value+"\" tipos no compatibles ingreso: "+result.tipo +" y se requiere: " + root.hijos[0].tipo ,root.hijos[2].fila,root.hijos[2].columna));
                                            break;    
                                        }    
                                    }else{
                                        TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.hijos[0].value+"\" tipos no compatibles ingreso: "+root.hijos[2].tipo +" y se requiere: " + root.hijos[0].tipo ,root.hijos[2].fila,root.hijos[2].columna));
                                        break;
                                    }        
                                case "LST_EXP":
                                  
                            }
                            break;
                        }

                    }else if(root.hijos.length ==2){
                        op = new Operador();
                        result = op.ejecutar(root.hijos[1])
                        if(result.tipo == root.hijos[0].tipo.toLowerCase()){
                        simbolo = new Simbolo(root.hijos[0].value, //nombre
                            root.hijos[0].tipo, // tipo
                            root.hijos[0].entorno, // clasificacion
                            root.hijos[0].entorno, // entorno
                            result.valor, // valor 
                            root.hijos[0].fila, 
                            root.hijos[0].columna);
                        TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                        console.log("simbolo insertado");
                        }else if(root.hijos[0].tipo.toLowerCase() == 'int' && result.tipo=='boolean'){
                            simbolo = new Simbolo(root.hijos[0].value, //nombre
                            root.hijos[0].tipo, // tipo
                            root.hijos[0].entorno, // clasificacion
                            root.hijos[0].entorno, // entorno
                            result.valor ? 1 : 0, // valor 
                            root.hijos[0].fila, 
                            root.hijos[0].columna);
                        TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                        console.log("simbolo insertado");
                        }else{
                            TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.hijos[0].value+"\" tipos no compatibles ingreso: "+result.tipo +" y se requiere: " + root.hijos[0].tipo ,root.hijos[0].fila,root.hijos[0].columna));
                            break;
                        }
                    }else{
                        const tipo = root.hijos[0].tipo.toLowerCase();
                        switch(tipo){
                            case "int":
                                simbolo = new Simbolo(root.hijos[0].value, //nombre
                                root.hijos[0].tipo, // tipo
                                root.hijos[0].entorno, // clasificacion
                                root.hijos[0].entorno, // entorno
                                0, // valor 
                                root.hijos[0].fila, 
                                root.hijos[0].columna);
                                TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                break;
                            case "double":
                                simbolo = new Simbolo(root.hijos[0].value, //nombre
                                root.hijos[0].tipo, // tipo
                                root.hijos[0].entorno, // clasificacion
                                root.hijos[0].entorno, // entorno
                                0.0, // valor 
                                root.hijos[0].fila, 
                                root.hijos[0].columna);
                                TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                break;
                            case "string":
                                simbolo = new Simbolo(root.hijos[0].value, //nombre
                                root.hijos[0].tipo, // tipo
                                root.hijos[0].entorno, // clasificacion
                                root.hijos[0].entorno, // entorno
                                "", // valor 
                                root.hijos[0].fila, 
                                root.hijos[0].columna);
                                TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                break;
                            case "boolean":
                                simbolo = new Simbolo(root.hijos[0].value, //nombre
                                root.hijos[0].tipo, // tipo
                                root.hijos[0].entorno, // clasificacion
                                root.hijos[0].entorno, // entorno
                                true, // valor 
                                root.hijos[0].fila, 
                                root.hijos[0].columna);
                                TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                break;
                            case "char":
                                simbolo = new Simbolo(root.hijos[0].value, //nombre
                                root.hijos[0].tipo, // tipo
                                root.hijos[0].entorno, // clasificacion
                                root.hijos[0].entorno, // entorno
                                '\u0000', // valor 
                                root.hijos[0].fila, 
                                root.hijos[0].columna);
                                TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                break;
                        }
                    }
                }
            case "ASIGNAR":
                simbolo = TablaSimbolos.getInstance().getSimbolo(root.hijos[0].value);              
                if(simbolo !=null ){
                    if(root.hijos.length >= 3 ){
                        op = new Operador();
                        result = op.ejecutar(root);
                        console.log(result)
                        if(simbolo.tipo == result.tipo){
                            simbolo.valor = result.valor;
                            TablaSimbolos.getInstance().modificar(simbolo);
                        }else{
                            TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.hijos[0].value+"\" tipos no compatibles ingreso: "+result.tipo +" y se requiere: " + simbolo.tipo ,root.hijos[0].fila,root.hijos[0].columna));
                            break;
                        }
                    }else{
                        op = new Operador();
                        result = op.ejecutar(root.hijos[1]);
                        console.log(result)
                        if(simbolo.tipo == result.tipo){
                            simbolo.valor = result.valor;
                            TablaSimbolos.getInstance().modificar(simbolo);
                        }else if(simbolo.tipo == 'int' && result.tipo=='boolean'){
                            simbolo.valor = result.valor ? 1 : 0;
                            TablaSimbolos.getInstance().modificar(simbolo);
                        }else{
                            TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.hijos[0].value+"\" tipos no compatibles ingreso: "+result.tipo +" y se requiere: " + simbolo.tipo ,root.hijos[0].fila,root.hijos[0].columna));
                            break;
                        }
                    }
                }else{
                    TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.hijos[0].value+"\" variable no declarada"  ,root.hijos[0].fila,root.hijos[0].columna));
                    break;
                }
        }
        return code;
    }
}

/*      AST NODE 
        this.name = name;
        this.value = value;
        this.tipo = tipo;
        this.entorno = entorno;
        this.fila = fila;
        this.columna = columna;
        
        SIMBOLO 
        this.nombre = nombre;
        this.tipo = tipo;
        this.tipo2 = tipo2;
        this.entorno = entorno;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
        */
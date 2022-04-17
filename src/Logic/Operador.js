const {TablaErrores} = require('../Estructuras/ManejoErrores/TablaErrores.js') ;
const {_Error} = require('../Estructuras/ManejoErrores/_Error.js') ;
const {ResOperacion}  = require('./Resultado.js')
const {TablaSimbolos} = require('../Estructuras/TablaSimbolos/TablaSimbolos.js')
export class Operador{

    constructor(){

    }

    ejecutar(root){
        var Resultado1 = null;
        var Resultado2 = null;
        var Resultado = null;

        switch(root.name){
            case "EXP": 
                if(root.hijos.length == 3){
                    Resultado1=this.ejecutar(root.hijos[0]);
                    Resultado2=this.ejecutar(root.hijos[2]);
                    var operacion = root.hijos[1].value;
                    console.log(operacion);
                    switch (operacion) {
                        case "+":
                        case "-":
                        case "*":
                        case "/":
                        case "^":
                        case "%":    
                            return this.aritmetico(Resultado1,Resultado2,operacion,root.hijos[1].fila,root.hijos[1].columna);
                        case "==":
                        case "!=":
                            return this.igualdad(Resultado1,Resultado2,root.hijos[1].fila,root.hijos[1].columna,operacion);
                        case ">":
                        case ">=":
                        case "<":
                        case "<=":
                            return this.relacional(Resultado1,Resultado2,root.hijos[1].fila,root.hijos[1].columna,operacion);
                        case "&&":
                        case "||":
                            return this.logicos(Resultado1,Resultado2,root.hijos[1].fila,root.hijos[1].columna,operacion);
                        default:
                            break;  
                    } 

                }else if(root.hijos.length == 2){
                    if(root.hijos[0].value=="!"){
                        Resultado1=this.ejecutar(root.hijos[1])
                        if(Resultado1.tipo=="boolean"){
                            Resultado= new ResOperacion();
                            Resultado.tipo="boolean"
                            Resultado.valor=!Resultado1.valor
                            return Resultado
                        }
                    }else if(root.hijos[0].value=="-"){
                        Resultado1=this.ejecutar(root.hijos[1])
                        if(Resultado1.tipo=="int"  ){
                            Resultado= new ResOperacion();
                            Resultado.tipo="int"
                            Resultado.valor=-Resultado1.valor
                            return Resultado
                        }else if (Resultado1.tipo=="double"){
                            Resultado= new ResOperacion();
                            Resultado.tipo="double"
                            Resultado.valor=-Resultado1.valor
                            return Resultado
                        }else{
                            TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+Resultado1.tipo +' & '+"int o double",root.hijos[1].fila,root.hijos[1].columna)); 
                            Resultado.tipo = "error";
                            Resultado.valor = "error";
                            return Resultado;
                        }
                    }else if(root.hijos[0].value=="++" ){
                        Resultado1=this.ejecutar(root.hijos[1])
                        if(Resultado1.tipo=="int"  ){
                            Resultado= new ResOperacion();
                            Resultado.tipo="int";
                            Resultado1.valor++;
                            Resultado.valor= Resultado1.valor;
                            return Resultado
                        }else if (Resultado1.tipo=="double"){
                            Resultado= new ResOperacion();
                            Resultado.tipo="double"
                            Resultado1.valor++;
                            Resultado.valor= Resultado1.valor;
                            return Resultado
                        }else{
                            TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+Resultado1.tipo +' & '+"int o double",root.hijos[1].fila,root.hijos[1].columna)); 
                            Resultado.tipo = "error";
                            Resultado.valor = "error";
                            return Resultado;
                        }
                    }else if(root.hijos[0].value=="--" ){
                        Resultado1=this.ejecutar(root.hijos[1])
                        if(Resultado1.tipo=="int"  ){
                            Resultado= new ResOperacion();
                            Resultado.tipo="int"
                            Resultado1.valor--;
                            Resultado.valor= Resultado1.valor;
                            return Resultado;
                        }else if (Resultado1.tipo=="double"){
                            Resultado= new ResOperacion();
                            Resultado.tipo="double"
                            Resultado1.valor--;
                            Resultado.valor= Resultado1.valor;
                            return Resultado;
                        }else{
                            TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+Resultado1.tipo +' & '+"int o double",root.hijos[1].fila,root.hijos[1].columna)); 
                            Resultado.tipo = "error";
                            Resultado.valor = "error";
                            return Resultado;
                        }
                    }else if(root.hijos[0].name == "ID" && root.hijos[1].name == "EXP") { //iterar un arreglo
                        Resultado = new ResOperacion();
                        Resultado1 = this.ejecutar(root.hijos[0]);
                        Resultado2 = this.ejecutar(root.hijos[1]);
                        if(typeof Resultado1.valor === "object" ){
                            if(Resultado2.tipo =="int"){
                                if(Resultado2.valor < Resultado1.valor.size){
                                    Resultado.tipo = Resultado1.tipo;
                                    Resultado.valor = Resultado1.valor.array[Resultado2.valor];
                                    return Resultado;
                                }else{
                                    TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion, fuera de los limites del arreglo, tamaño definido:  " + Resultado1.valor.size  ,root.hijos[0].fila,root.hijos[0].columna)); 
                                    Resultado.tipo = "error";
                                    Resultado.valor = "error";
                                    return Resultado;
                                }
                            }else{
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion, para iterar un arreglo es necesario un entero  " ,root.hijos[1].fila,root.hijos[1].columna)); 
                                Resultado.tipo = "error";
                                Resultado.valor = "error";
                                return Resultado;
                            }
                        }else{
                            TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion, no puedes iterar la variable "+root.hijos[0].value +" dado que no es un arreglo"  ,root.hijos[0].fila,root.hijos[0].columna)); 
                            Resultado.tipo = "error";
                            Resultado.valor = "error";
                            return Resultado;
                        }
                    }
                }else{
                    return this.ejecutar(root.hijos[0]);
                }                
            case "string": 
                Resultado = new ResOperacion();
                Resultado.tipo = "string";
                Resultado.valor = root.value;
                return Resultado;
            case "char": 
                Resultado = new ResOperacion();
                Resultado.tipo = "char";
                Resultado.valor = root.value;
                return Resultado;
            case "numero": 
                Resultado = new ResOperacion();
                if(root.value.includes(".")){
                    Resultado.tipo = "double";
                    Resultado.valor = parseFloat(root.value);
                    return Resultado;
                }else{
                    Resultado.tipo = "int";
                    Resultado.valor =parseInt(root.value);
                    if(Resultado.valor >=  -2147483648 && Resultado.valor <= 2147483648){
                        return Resultado;
                    }else{
                        TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.value+"\" Exede el limite de : (-2147483648,2147483648) establecido",root.linea,root.columna)); 
                        let res = "error Semantico " + "en: \" "+root.value+"\" Exede el limite de : (-2147483648,2147483648) establecido, linea: " + root.linea+ " columna: " + root.columna
                        return res;
                    }
                }
            case "true":
                Resultado= new ResOperacion();
                Resultado.tipo="boolean";
                Resultado.valor=true;
                return Resultado;
            case "false":
                Resultado= new ResOperacion();
                Resultado.tipo="boolean";
                Resultado.valor=false;
                return Resultado;
            case "ID":
                Resultado= new ResOperacion();
                let simbolo = TablaSimbolos.getInstance().getSimbolo(root.value);
                if(simbolo==null || simbolo== undefined){
                    Resultado.tipo = "error";
                    Resultado.valor="Error semantico, no se le pudo asignar el valor deseado a la variable"
                    TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.value+"\" no se le pudo asignar el valor deseado a la variable",root.fila,root.columna)); 
                    return Resultado;
                }  
                Resultado.tipo = simbolo.tipo;
                Resultado.valor=simbolo.valor;
                return Resultado;
            case "ASIGNAR":
                if(root.hijos.length ==4){
                    if(root.hijos[0].name == "ID" && root.hijos[1].name == "EXP" && root.hijos[2].name == "EXP"){
                        Resultado= new ResOperacion();
                        Resultado1 = this.ejecutar(root.hijos[0]);
                        Resultado2 = this.ejecutar(root.hijos[1]);
                        let Resultado3 = this.ejecutar(root.hijos[2]);
                        let Resultado4 = this.ejecutar(root.hijos[3]);
                        if(typeof Resultado1.valor === "object" ){
                            if(Resultado2.tipo =="int" && Resultado3.tipo =="int"){
                                if(Resultado2.valor < Resultado1.valor.sizex && Resultado3.valor < Resultado1.valor.sizey){
                                    if( Resultado4.tipo == Resultado1.tipo){
                                        Resultado.tipo = Resultado1.tipo;
                                        Resultado1.valor.array[Resultado2.valor][Resultado3.valor] = Resultado4.valor;
                                        Resultado.valor = Resultado1.valor;
                                        return Resultado;
                                    }else if (Resultado1.tipo == "int" && Resultado4.tipo == "boolean" ){
                                        Resultado.tipo = Resultado1.tipo;
                                        Resultado1.valor.array[Resultado2.valor][Resultado3.valor] = Resultado4.valor ? 1: 0;
                                        Resultado.valor = Resultado1.valor;
                                        return Resultado;
                                    }else{
                                        TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.hijos[0].value+"\" tipos no compatibles ingreso: "+Resultado3.tipo +" y se requiere: " + Resultado1.tipo ,root.hijos[0].fila,root.hijos[0].columna));
                                        Resultado.tipo = "error";
                                        Resultado.valor = "error";
                                        return Resultado;
                                    }
                                }else{
                                    TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion, fuera de los limites del arreglo, tamaño definido:  " + Resultado1.valor.size  ,root.hijos[0].fila,root.hijos[0].columna)); 
                                    Resultado.tipo = "error";
                                    Resultado.valor = "error";
                                    return Resultado;
                                }
                            }else{
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion, para iterar un arreglo es necesario un entero  " ,root.hijos[1].fila,root.hijos[1].columna)); 
                                Resultado.tipo = "error";
                                Resultado.valor = "error";
                                return Resultado;
                            }
                        }else{
                            TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion, no puedes iterar la variable "+root.hijos[0].value +" dado que no es un arreglo"  ,root.hijos[0].fila,root.hijos[0].columna)); 
                            Resultado.tipo = "error";
                            Resultado.valor = "error";
                            return Resultado;
                        }
                    }
                }else if(root.hijos.length ==3){
                    if(root.hijos[0].name == "ID" && root.hijos[1].name == "EXP") {
                        Resultado= new ResOperacion();
                        Resultado1 = this.ejecutar(root.hijos[0]);
                        Resultado2 = this.ejecutar(root.hijos[1]);
                        let Resultado3 = this.ejecutar(root.hijos[2]);
                        if(typeof Resultado1.valor === "object" ){
                            if(Resultado2.tipo =="int"){
                                if(Resultado2.valor < Resultado1.valor.size){
                                    if(Resultado3.tipo == Resultado1.tipo){
                                        Resultado.tipo = Resultado1.tipo;
                                        Resultado1.valor.array[Resultado2.valor] = Resultado3.valor;
                                        Resultado.valor = Resultado1.valor;
                                        return Resultado;
                                    }else if (Resultado1.tipo == "int" && Resultado3.tipo == "boolean" ){
                                        Resultado.tipo = Resultado1.tipo;
                                        Resultado1.valor.array[Resultado2.valor] = Resultado3.valor ? 1: 0;
                                        Resultado.valor = Resultado1.valor;
                                        return Resultado;
                                    }else{
                                        TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.hijos[0].value+"\" tipos no compatibles ingreso: "+Resultado3.tipo +" y se requiere: " + Resultado1.tipo ,root.hijos[0].fila,root.hijos[0].columna));
                                        Resultado.tipo = "error";
                                        Resultado.valor = "error";
                                        return Resultado;
                                    }
                                }else{
                                    TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion, fuera de los limites del arreglo, tamaño definido:  " + Resultado1.valor.size  ,root.hijos[0].fila,root.hijos[0].columna)); 
                                    Resultado.tipo = "error";
                                    Resultado.valor = "error";
                                    return Resultado;
                                }
                            }else{
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion, para iterar un arreglo es necesario un entero  " ,root.hijos[1].fila,root.hijos[1].columna)); 
                                Resultado.tipo = "error";
                                Resultado.valor = "error";
                                return Resultado;
                            }
                        }else{
                            TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion, no puedes iterar la variable "+root.hijos[0].value +" dado que no es un arreglo"  ,root.hijos[0].fila,root.hijos[0].columna)); 
                            Resultado.tipo = "error";
                            Resultado.valor = "error";
                            return Resultado;
                        }
                    }
                }
                break;
            case "LST_EXP":
                Resultado = new ResOperacion();
                var arreglo = [];
                for(var i = 0 ; i<root.hijos.length; i++){
                    let hijo = root.hijos[i];
                    Resultado1 = this.ejecutar(hijo);
                    if(root.tipo == Resultado1.tipo){
                        arreglo.push(Resultado1.valor);
                        
                    }else{
                        TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.hijos[0].value+"\" tipos no compatibles ingreso: "+Resultado1.tipo +" y se requiere: " + root.tipo ,root.fila,root.columna));
                        break;
                    }
                }
                if(arreglo.length > 0){
                    Resultado.tipo = root.tipo;
                    Resultado.valor = {
                        size: arreglo.length,
                        array: arreglo
                    }
                    return Resultado;
                }
                break;
            default:
                break;
            
        }
    }
   
    aritmetico(R1,R2,operacion, fila, columna){
        let tipo1 = R1.tipo;
        let tipo2 = R2.tipo;
        var res = new ResOperacion();
        if(tipo1=="error"||tipo2=="error" ){
            res.tipo="error";
            return res;
        }else if(typeof R1.valor ==='object'|| typeof R2.valor ==='object'){
            res.tipo ="objeto";
            res.valor = "objeto";
            return res;
        }

        switch (operacion) {
            case "+":
                switch (tipo1.toLowerCase()) {
                    case "int":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "int";
                                res.valor = R1.valor + R2.valor;
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor = parseFloat(R1.valor) + parseFloat(R2.valor);
                                return res;
                            case "boolean":
                                res.tipo = "int"
                                res.valor = R2.valor ? R1.valor + 1 : R1.valor ;
                                return res;
                            case "char":
                                res.tipo = "int"
                                res.valor = R1.valor + R2.valor.charCodeAt(0);
                                return res;
                            case "string":
                                res.tipo = "string"
                                res.valor = R1.valor.toString() +  R2.valor;
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    case "double":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "double"
                                res.valor = parseFloat(R1.valor) + parseFloat(R2.valor);
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor = parseFloat(R1.valor) + parseFloat(R2.valor);
                                return res;
                            case "boolean":
                                res.tipo = "double"
                                res.valor = R2.valor ? parseFloat(R1.valor + 1 ): R1.valor ;
                                return res;
                            case "char":
                                res.tipo = "double"
                                res.valor = parseFloat(R1.valor) + parseFloat(R2.valor.charCodeAt(0));
                                return res;
                            case "string":
                                res.tipo = "string"
                                res.valor = R1.valor.toString() +  R2.valor;
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    case "boolean":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "int"
                                res.valor = R1.valor ? 1+R2.valor : 0+R2.valor;
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor = R1.valor ? parseFloat(  1 + R2.valor ): R2.valor ;
                                return res;
                            case "string":
                                res.tipo = "string"
                                res.valor = R1.valor.toString() +  R2.valor;
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    case "char":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "int"
                                res.valor =  R1.valor.charCodeAt(0) + R2.valor ;
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor =  R1.valor.charCodeAt(0) + parseFloat(R2.valor) ;
                                return res;
                            case "string":
                                res.tipo = "string"
                                res.valor = R1.valor.toString() +  R2.valor;
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    case "string":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "string";
                                res.valor = R1.valor + R2.valor.toString();
                                return res;
                            case "double":
                                res.tipo = "string"
                                res.valor = R1.valor + parseFloat(R2.valor).toString();
                                return res;
                            case "boolean":
                                res.tipo = "string"
                                res.valor = R1.valor + R2.valor; ;
                                return res;
                            case "char":
                                res.tipo = "string"
                                res.valor = R1.valor + R2.valor;
                                return res;
                            case "string":
                                res.tipo = "string"
                                res.valor = R1.valor +  R2.valor;
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    default:
                        TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                        res.tipo = "error";
                        res.valor = "error";
                        return res;
                }
            case "-":
                switch (tipo1.toLowerCase()) {
                    case "int":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "int";
                                res.valor = R1.valor - R2.valor;
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor = parseFloat(R1.valor) - parseFloat(R2.valor);
                                return res;
                            case "boolean":
                                res.tipo = "int"
                                res.valor = R2.valor ? R1.valor - 1 : R1.valor ;
                                return res;
                            case "char":
                                res.tipo = "int"
                                res.valor = R1.valor - R2.valor.charCodeAt(0);
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    case "double":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "double"
                                res.valor = parseFloat(R1.valor) - parseFloat(R2.valor);
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor = parseFloat(R1.valor) - parseFloat(R2.valor);
                                return res;
                            case "boolean":
                                res.tipo = "double"
                                res.valor = R2.valor ? parseFloat(R1.valor - 1 ): R1.valor ;
                                return res;
                            case "char":
                                res.tipo = "double"
                                res.valor = parseFloat(R1.valor) - parseFloat(R2.valor.charCodeAt(0));
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    case "boolean":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "int"
                                res.valor = R1.valor ? 1-R2.valor : 0-R2.valor;
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor = R1.valor ? parseFloat(  1 - R2.valor ): R2.valor ;
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    case "char":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "int"
                                res.valor =  R1.valor.charCodeAt(0) - R2.valor ;
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor =  R1.valor.charCodeAt(0) - parseFloat(R2.valor) ;
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    default:
                        TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                        res.tipo = "error";
                        res.valor = "error";
                        return res;
                }
            case "*":
                switch (tipo1.toLowerCase()) {
                    case "int":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "int";
                                res.valor = R1.valor * R2.valor;
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor = parseFloat(R1.valor) * parseFloat(R2.valor);
                                return res;
                            case "char":
                                res.tipo = "int"
                                res.valor = R1.valor * R2.valor.charCodeAt(0);
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    case "double":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "double"
                                res.valor = parseFloat(R1.valor) * parseFloat(R2.valor);
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor = parseFloat(R1.valor) * parseFloat(R2.valor);
                                return res;
                            case "char":
                                res.tipo = "double"
                                res.valor = parseFloat(R1.valor) * parseFloat(R2.valor.charCodeAt(0));
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    case "char":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "int"
                                res.valor =  R1.valor.charCodeAt(0) * R2.valor ;
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor =  R1.valor.charCodeAt(0) * parseFloat(R2.valor) ;
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    default:
                        TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                        res.tipo = "error";
                        res.valor = "error";
                        return res;
                }
            case "/":
                switch (tipo1.toLowerCase()) {
                    case "int":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "double";
                                res.valor = R1.valor / R2.valor;
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor = parseFloat(R1.valor) / parseFloat(R2.valor);
                                return res;
                            case "char":
                                res.tipo = "double"
                                res.valor = R1.valor / R2.valor.charCodeAt(0);
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    case "double":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "double"
                                res.valor = parseFloat(R1.valor) / parseFloat(R2.valor);
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor = parseFloat(R1.valor) / parseFloat(R2.valor);
                                return res;
                            case "char":
                                res.tipo = "double"
                                res.valor = parseFloat(R1.valor) / parseFloat(R2.valor.charCodeAt(0));
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    case "char":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "int"
                                res.valor =  R1.valor.charCodeAt(0) / R2.valor ;
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor =  R1.valor.charCodeAt(0) / parseFloat(R2.valor) ;
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    default:
                        TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                        res.tipo = "error";
                        res.valor = "error";
                        return res;
                }
            case "^":
                switch (tipo1.toLowerCase()) {
                    case "int":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "int";
                                res.valor = Math.pow( R1.valor , R2.valor);
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor = Math.pow(parseFloat(R1.valor) , parseFloat(R2.valor));
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    case "double":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "double"
                                res.valor = Math.pow( parseFloat(R1.valor) , parseFloat(R2.valor));
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor = Math.pow( parseFloat(R1.valor) , parseFloat(R2.valor));                                
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    default:
                        TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                        res.tipo = "error";
                        res.valor = "error";
                        return res;
                }
            case "%":
                switch (tipo1.toLowerCase()) {
                    case "int":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "int";
                                res.valor = R1.valor % R2.valor;
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor = parseFloat(R1.valor) % parseFloat(R2.valor);
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    case "double":
                        switch (tipo2.toLowerCase()) {
                            case "int":
                                res.tipo = "double"
                                res.valor =  parseFloat(R1.valor) % parseFloat(R2.valor);
                                return res;
                            case "double":
                                res.tipo = "double"
                                res.valor =  parseFloat(R1.valor) % parseFloat(R2.valor);                        
                                return res;
                            default:
                                TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                                res.tipo = "error";
                                res.valor = "error";
                                return res;
                        }
                    default:
                        TablaErrores.getInstance().insertarError(new _Error("Semantico","No es posible operacion entre: "+tipo1 +' & '+tipo2,fila,columna)); 
                        res.tipo = "error";
                        res.valor = "error";
                        return res;
                }                
        }

    }

}
        
    
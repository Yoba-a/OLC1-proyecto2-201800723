const {TablaSimbolos} = require('../Estructuras/TablaSimbolos/TablaSimbolos') ;
const {TablaErrores} = require('../Estructuras/ManejoErrores/TablaErrores.js');
const {_Error} = require('../Estructuras/ManejoErrores/_Error');
const {Simbolo} = require('../Estructuras/TablaSimbolos/Simbolo');
const {Operador} = require('./Operador.js') ;
const {Entorno} = require('../Estructuras/Entornos/Entorno');

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
                let resultado_sentencia;
                for(var i = 0; i <root.hijos.length; i++){
                    resultado_sentencia = this.interpretar(root.hijos[i]);
                    if(resultado_sentencia != "break"){
                        code+=resultado_sentencia;
                    }else{
                        
                        break;
                    }
                }
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
                                            "vector 1d", // clasificacion
                                            Entorno.getInstance().entorno(), // entorno
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
                                            "vector 1d", // clasificacion
                                            Entorno.getInstance().entorno(), // entorno
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
                                            "vector 2D", // clasificacion
                                            Entorno.getInstance().entorno(), // entorno
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
                                case "AUXVECTOR":
                                    op = new Operador();
                                    var primera_D = root.hijos[2].hijos.length; 
                                    var array = new Array(primera_D);
                                    var tamanios_hijos = []
                                    for(var i = 0; i < primera_D; i++){
                                        tamanios_hijos.push(root.hijos[2].hijos[i].hijos.length);                                        
                                    }
                                    var segunda_D = Math.max(...tamanios_hijos);
                                    let valida_error = true;
                                    for(var i = 0; i < primera_D; i++){
                                        var array2 = new Array(segunda_D);
                                        root.hijos[2].hijos[i].tipo = root.hijos[0].tipo;
                                        result = op.ejecutar(root.hijos[2].hijos[i]);
                                        if(result.tipo != "error"){
                                            var array_aux = result.valor.array;
                                            for(var j = 0; j < array_aux.length;  j++){
                                                array2[j] = array_aux[j];
                                            }
                                            array[i] = array2;
                                        }else{
                                            valida_error = false;
                                            break;
                                        }
                                        
                                    } 
                                    if(valida_error){
                                        simbolo = new Simbolo(root.hijos[0].value, //nombre
                                        root.hijos[0].tipo, // tipo
                                        "vector 2d", // clasificacion
                                        Entorno.getInstance().entorno(), // entorno
                                        {
                                            sizex : primera_D,
                                            sizey : segunda_D,
                                            array : array
                                        }, // valor 
                                        root.hijos[0].fila, 
                                        root.hijos[0].columna);
                                        TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                        console.log(simbolo.valor);
                                        break;                 
                                    }else{
                                        TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.hijos[0].value+"\" no se le pudo asignar los valores deseados al arreglo " ,root.hijos[2].fila,root.hijos[2].columna));
                                        break;
                                    }
                                  
                            }
                            break;
                        }

                    }else if(root.hijos.length ==2){
                        op = new Operador();
                        result = op.ejecutar(root.hijos[1])
                        if(result.tipo == root.hijos[0].tipo.toLowerCase()){
                            simbolo = new Simbolo(root.hijos[0].value, //nombre
                            root.hijos[0].tipo, // tipo
                            "variable", // clasificacion
                            Entorno.getInstance().entorno(), // entorno
                            result.valor, // valor 
                            root.hijos[0].fila, 
                            root.hijos[0].columna);
                            TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                            console.log("simbolo insertado");
                            break;
                        }else if(root.hijos[0].tipo.toLowerCase() == 'int' && result.tipo=='boolean'){
                            simbolo = new Simbolo(root.hijos[0].value, //nombre
                            root.hijos[0].tipo, // tipo
                            "variable", // clasificacion
                            Entorno.getInstance().entorno(), // entorno
                            result.valor ? 1 : 0, // valor 
                            root.hijos[0].fila, 
                            root.hijos[0].columna);
                            TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                            console.log("simbolo insertado");
                            break;
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
                                "variable", // clasificacion
                                Entorno.getInstance().entorno(), // entorno
                                0, // valor 
                                root.hijos[0].fila, 
                                root.hijos[0].columna);
                                TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                break;
                            case "double":
                                simbolo = new Simbolo(root.hijos[0].value, //nombre
                                root.hijos[0].tipo, // tipo
                                "variable", // clasificacion
                                Entorno.getInstance().entorno(), // entorno
                                0.0, // valor 
                                root.hijos[0].fila, 
                                root.hijos[0].columna);
                                TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                break;
                            case "string":
                                simbolo = new Simbolo(root.hijos[0].value, //nombre
                                root.hijos[0].tipo, // tipo
                                "variable", // clasificacion
                                Entorno.getInstance().entorno(), // entorno
                                "", // valor 
                                root.hijos[0].fila, 
                                root.hijos[0].columna);
                                TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                break;
                            case "boolean":
                                simbolo = new Simbolo(root.hijos[0].value, //nombre
                                root.hijos[0].tipo, // tipo
                                "variable", // clasificacion
                                Entorno.getInstance().entorno(), // entorno
                                true, // valor 
                                root.hijos[0].fila, 
                                root.hijos[0].columna);
                                TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                break;
                            case "char":
                                simbolo = new Simbolo(root.hijos[0].value, //nombre
                                root.hijos[0].tipo, // tipo
                                "variable", // clasificacion
                                Entorno.getInstance().entorno(), // entorno
                                '\u0000', // valor 
                                root.hijos[0].fila, 
                                root.hijos[0].columna);
                                TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                break;
                        }
                    }
                }
                break;
            case "ASIGNAR":
               /* if(root.hijos[0].hijos[0].name == "cast" &&  root.hijos[0].hijos[1].name == "ID"){
                    simbolo = TablaSimbolos.getInstance().getSimbolo(root.hijos[0].hijos[1].value);
                    op = new Operador();
                    result = op.ejecutar(root.hijos[0]);
                    console.log(result)
                    if(simbolo.tipo == result.tipo){
                        simbolo.valor = result.valor;
                        TablaSimbolos.getInstance().modificar(simbolo);
                    }else if(simbolo.tipo == 'int' && result.tipo=='boolean'){
                        simbolo.valor = result.valor ? 1 : 0;
                        TablaSimbolos.getInstance().modificar(simbolo);
                    }else{
                        TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.hijos[0].hijos[1].value+"\" tipos no compatibles ingreso: "+result.tipo +" y se requiere: " + simbolo.tipo ,root.hijos[0].hijos[1].fila,root.hijos[0].hijos[1].columna));
                        break;
                    }
                }else{
                    */
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
                    break;
               // }
            case "ID_LIST":
                if(root.hijos[root.hijos.length-1].value =="EXP"){
                    op = new Operador();
                    result = op.ejecutar(root.hijos[root.hijos.length-1])
                    if(result.tipo == root.hijos[0].tipo.toLowerCase()){
                        for(var i=0;i<root.hijos.length-1 ; i++){
                            simbolo = new Simbolo(root.hijos[i].value, //nombre
                            root.hijos[i].tipo, // tipo
                            "variable", // clasificacion
                            Entorno.getInstance().entorno(), // entorno
                            result.valor, // valor 
                            root.hijos[i].fila, 
                            root.hijos[i].columna);
                            TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                            console.log("simbolo insertado");
                        }
                    }else if(root.hijos[0].tipo.toLowerCase() == 'int' && result.tipo=='boolean'){
                        for(var i=0;i<root.hijos.length-1 ; i++){
                            simbolo = new Simbolo(root.hijos[i].value, //nombre
                            root.hijos[i].tipo, // tipo
                            "variable", // clasificacion
                            Entorno.getInstance().entorno(), // entorno
                            result.valor ? 1 : 0, // valor 
                            root.hijos[i].fila, 
                            root.hijos[i].columna);
                            TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                            console.log("simbolo insertado");
                        }
                    }else{
                        TablaErrores.getInstance().insertarError(new _Error("Semantico","Error en: \" "+root.hijos[0].value+"\" tipos no compatibles ingreso: "+result.tipo +" y se requiere: " + root.hijos[0].tipo ,root.hijos[0].fila,root.hijos[0].columna));
                        break;
                    }

                }else{
                    const tipo = root.hijos[0].tipo.toLowerCase();
                    for (var i = 1 ; i <root.hijos.length ;i++){
                        switch(tipo){
                            case "int":
                                simbolo = new Simbolo(root.hijos[i].value, //nombre
                                root.hijos[i].tipo, // tipo
                                "variable", // clasificacion
                                Entorno.getInstance().entorno(), // entorno
                                0, // valor 
                                root.hijos[i].fila, 
                                root.hijos[i].columna);
                                TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                break;
                            case "double":
                                simbolo = new Simbolo(root.hijos[i].value, //nombre
                                root.hijos[i].tipo, // tipo
                                "variable", // clasificacion
                                Entorno.getInstance().entorno(), // entorno
                                0.0, // valor 
                                root.hijos[i].fila, 
                                root.hijos[i].columna);
                                TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                break;
                            case "string":
                                simbolo = new Simbolo(root.hijos[i].value, //nombre
                                root.hijos[i].tipo, // tipo
                                "variable", // clasificacion
                                Entorno.getInstance().entorno(), // entorno
                                "", // valor 
                                root.hijos[i].fila, 
                                root.hijos[i].columna);
                                TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                break;
                            case "boolean":
                                simbolo = new Simbolo(root.hijos[i].value, //nombre
                                root.hijos[i].tipo, // tipo
                                "variable", // clasificacion
                                Entorno.getInstance().entorno(), // entorno
                                true, // valor 
                                root.hijos[i].fila, 
                                root.hijos[i].columna);
                                TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                break;
                            case "char":
                                simbolo = new Simbolo(root.hijos[0].value, //nombre
                                root.hijos[i].tipo, // tipo
                                "variable", // clasificacion
                                Entorno.getInstance().entorno(), // entorno
                                '\u0000', // valor 
                                root.hijos[i].fila, 
                                root.hijos[i].columna);
                                TablaSimbolos.getInstance().insertarSimbolo(simbolo);
                                break;
                        }
                    }
                }
            case "IF": 
                op = new Operador();
                result = op.ejecutar(root.hijos[0]);
                
                if(result.tipo == "boolean"){
                    if(result.valor){
                        Entorno.getInstance().if_entorno();
                        code += this.interpretar(root.hijos[1].hijos[0]);
                        console.log(code);
                        Entorno.getInstance().global();
                        return code;
                    }else{
                        if(root.hijos.length==3){
                            if(root.hijos[2].name == "ELSEIF"){
                                code +=this.interpretar(root.hijos[2].hijos[0])
                                return code;
                            }else{
                                Entorno.getInstance().else_entorno(2);
                                code +=this.interpretar(root.hijos[2].hijos[0].hijos[0])
                                Entorno.getInstance().global();
                                return code;
                            }
                        }
                    }
                }
                
                break;
            case "SWITCH":
                op = new Operador();
                result = op.ejecutar(root.hijos[0]);
                var case_switch = [] ;
                for(var i=0; i<root.hijos[1].hijos.length; i++){
                    if(i%2 == 0){
                        var result2 = op.ejecutar(root.hijos[1].hijos[i]);
                        if(result2.valor == result.valor && result2.tipo == result.tipo ){
                            case_switch.push(i);
                            let len = root.hijos[1].hijos[i+1].hijos.length;
                            var breaak = false
                            for(var it = 0 ; it < len; it++  ){
                                if(root.hijos[1].hijos[i+1].hijos[it].name == "break"){
                                    breaak = true;
                                    break; 
                                }     
                            }
                            if(breaak){
                                break;
                            }else{
                                for(var j=i+1; j<root.hijos[1].hijos.length; j++){
                                    if(j%2 == 0){
                                        case_switch.push(j);
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
                if(case_switch != -1 ){
                    console.log(case_switch);
                    Entorno.getInstance().switch_entorno();
                    for(var i =0; i<case_switch.length ; i++) {
                        code += this.interpretar(root.hijos[1].hijos[case_switch[i]+1]);
                        let len = root.hijos[1].hijos[case_switch[i]+1].hijos.length;
                        var breaak = false
                        for(var it = 0 ; it < len; it++  ){
                            if(root.hijos[1].hijos[case_switch[i]+1].hijos[it].name == "break"){
                                Entorno.getInstance().global();
                                breaak = true;
                                break; 
                            }     
                        }
                        if(breaak){
                            Entorno.getInstance().global();
                            break;
                        }
                    }
                    Entorno.getInstance().global();
                    console.log(code)
                    return code
                }else{
                    if(root.hijos.length ==3){
                        Entorno.getInstance().switch_entorno();
                        code += this.interpretar(root.hijos[2]);
                        Entorno.getInstance().global();
                        return code;
                    }
                }
                break;
            case "break": 
                code += "break";
                break;
            case "WHILE":
                op = new Operador();    
                result = op.ejecutar(root.hijos[0]);
                Entorno.getInstance().while_entorno();
                while(result.valor){
                    code += this.interpretar(root.hijos[1].hijos[0]);
                    result = op.ejecutar(root.hijos[0]);
                    let len = root.hijos[1].hijos[0].hijos.length;
                    var breaak = false
                    for(var it = 0 ; it < len; it++  ){
                        if(root.hijos[1].hijos[0].hijos[it].name == "break"){
                            breaak = true;
                            break; 
                        }     
                    }
                    if(breaak){
                        Entorno.getInstance().global();
                        break;
                    }
                }
                Entorno.getInstance().global();   
                break;
            case "DOWHILE":
                op = new Operador(); 
                result = op.ejecutar(root.hijos[1]);
                Entorno.getInstance().dowhile_entorno();
                do{
                    code += this.interpretar(root.hijos[0].hijos[0]);
                    result = op.ejecutar(root.hijos[1]);
                    let len = root.hijos[0].hijos[0].hijos.length;
                    var breaak = false
                    for(var it = 0 ; it < len; it++  ){
                        if(root.hijos[0].hijos[0].hijos[it].name == "break"){
                            Entorno.getInstance().global();
                            breaak = true;
                            break; 
                        }     
                    }
                    if(breaak){
                        Entorno.getInstance().global();
                        break;
                    }

                }while(result.valor);
                Entorno.getInstance().global();
                break;
            case "FOR":
                op = new Operador();
                let op2 = new Operador();
                code += this.interpretar(root.hijos[0]);
                console.log(result)
                let result2 = op.ejecutar(root.hijos[1]);
                Entorno.getInstance().for_entorno();
                while(result2.valor){
                    code += this.interpretar(root.hijos[3].hijos[0]);
                    let len = root.hijos[3].hijos[0].hijos.length;
                    var breaak = false
                    for(var it = 0 ; it < len; it++  ){
                        if(root.hijos[3].hijos[0].hijos[it].name == "break"){
                            breaak = true;
                            Entorno.getInstance.global();
                            break; 
                        }     
                    }
                    if(breaak){
                        Entorno.getInstance.global();
                        break;
                    }
                    

                    code +=this.interpretar(root.hijos[2]);
                    result2 = op.ejecutar(root.hijos[1]);
                    
                }
                Entorno.getInstance().global();
                break;
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
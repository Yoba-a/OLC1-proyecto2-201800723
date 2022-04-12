/**
 * Ejemplo mi primer proyecto con Jison utilizando Nodejs en Ubuntu
 */

/* Definición Léxica */

%lex

%options case-insensitive
%x string

%%

\/\/[^\n]* 	{/*comentario de linea*/}
\/\*((^\*)|\*(?!\/))*\*\/  {/*comentario de BODY*/}

[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]  {}
// operadores aritmeticos
"++"                return 'inc';
"+"                 return 'mas';
"--"                return 'dec';
"-"                 return 'menos';
"*"                 return 'mul';
"/"                 return 'div';
"^"					return 'pot';
"%"					return 'mod';
//operadores relacionales
"<="				return 'minEqual'
">="				return 'maxEqual'
"!="				return 'notEquals'
"=="				return 'equals'
"="					return 'igual'
"<"					return 'min'
">"					return 'max'
"?"					return 'opt'
"||"				return 'or'
"&&"				return 'and'
"!"					return 'not'
"("					return 'parA'
")"					return 'parC'
";"					return 'pcoma'
":"                 return 'dosPun'
"["                 return 'corA'
"]"                 return 'corC'
"{"					return 'llavA'
"}"					return 'llavC'
","					return 'coma'
"."                 return 'punto'
"int"				return 'Rint'
"char"				return 'Rchar'
"boolean"			return 'Rboolean'
"true"				return 'lit_boleanV'
"false"				return 'lit_boleanF'
"string"            return 'Rstring'
"Double"	        return 'Rdouble'
"new"               return 'Rnew'
//sentencias de transferencia
"break"             return 'Rbreak'
"continue"          return 'Rcontinue'
"return"            return 'Rreturn'
//bucles
"while"             return 'Rwhile'
"for"               return 'Rfor'
"do"                return 'Rdo'
"void"              return 'Rvoid'
//funciones nativas
"print"             return 'Rprint'
"println"           return 'Rprintln'
"toLower"           return 'RtoLower'
"toUpper"           return 'RtoUpper'
"round"             return 'Rround'
"length"            return 'Rlength'
"typeof"            return 'Rtypeof'
"toString"          return 'RtoStr'
"toCharArray"       return 'RtoCharArray'
"run"               return 'Rrun'

// sentencias de control de control

"if"                return 'Rif'
"else"              return 'Relse'
"switch"            return 'Rswitch'
"case"              return 'Rcase'
"default"           return 'Rdefault'


/* Espacios en blanco */
[ \r\t]+            {}
\n                  {}

[a-zA-Z][a-zA-Z0-9_]*   return 'ID';
[0-9]+("."[0-9]+)?\b    return 'decimal';
[0-9]+\b                return 'entero';

["]                             {cadena="";this.begin("string");}
<string>[^"\\]+                 {cadena+=yytext;}
<string>"\\\""                  {cadena+="\"";}
<string>"\\n"                   {cadena+="\n";}
<string>"\\t"                   {cadena+="\t";}
<string>"\\\\"                  {cadena+="\\";}
<string>"\\\'"                  {cadena+="\'";}
<string>["]                     {yytext=cadena; this.popState(); return 'Cadena';}
\'((\\\')|[^\n\'])*\'	{ yytext = yytext.substr(1,yyleng-2); return 'Char'; }
<<EOF>>                 return 'EOF';

.                       { console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
                        TablaErrores.getInstance().insertarError(new _Error("Lexico","Caracter: \" "+yytext+"\" no es valido" ,yylloc.first_line,yylloc.first_column));
                        return null; }
/lex

/* Asociación de operadores y precedencia */
%{
    const {TablaErrores} = require('./Estructuras/ManejoErrores/TablaErrores.js') ;
    const {_Error} = require('./Estructuras/ManejoErrores/_Error.js') ;
    
    
    var cadena =""
    var tipo_variable = ""
    function AST_Node(name, value, tipo,entorno, fila, columna ){
        this.name = name;
        this.value = value;
        this.tipo = tipo;
        this.entorno = entorno;
        this.fila = fila;
        this.columna = columna;

        this.hijos =[];
        this.addHijos = addHijos;    
        this.getHermano = getHermano;

        function addHijos(){
            for(var i=0; i<arguments.length; i++){
                this.hijos.push(arguments[i]);
                if(arguments[i == null]){
                    arguments[i].padre.this;
                }
            }
        }
        function getHermano(pos){
            if(pos>this._hijos.length-1) return null;
            return this._hijos[pos];
        }
    }
%}



%right opt
%left  or 
%left and
%right not
%left equals , notEquals , min , minEqual, max , maxEqual
%left mas, menos
%left mul, div , mod
%right ucast 
%nonassoc pot
%left unot umas, umenos
%right pre_inc pre_dec
%left inc dec 

%start INIT 
%% /* Definición de la gramática */

INIT 
    : LINS EOF  {$$=new AST_Node("RAIZ","RAIZ","palabra reservada","global",this.$first_line,this._$.last_column);$$.addHijos($1);return $$};

//Valores AST name, value, tipo,entorno, fila, columna
LINS
    : LINS INSTRUCC {$1.addHijos($2);$$=$1;}
    | INSTRUCC  {$$= new AST_Node("SENTENCIAS","SENTENCIAS","SENTENCIAS","global",this._$.first_line,this._$.last_column);
                      $$.addHijos($1);} 
    ;

INSTRUCC
    : Rprintln parA EXP parC pcoma {$$= new AST_Node("PRINTLN","PRINTLN"); $$.addHijos($3);}
    | Rprint parA EXP parC pcoma {$$= new AST_Node("PRINT","PRINT"); $$.addHijos($3);}
    | DECLARAR pcoma {$$=$1}
    | ASIGNAR pcoma {$$=$1} 
    | IF {$$=$1} 
    | DOWHILE pcoma {$$=$1}
    | WHILE {$$=$1}
    | FOR {$$=$1}
    | SWITCH {$$=$1}
    | Rbreak pcoma {$$=$1}
    | Rcontinue pcoma {$$=$1}
    | METODOS {$$=$1}
    | LLAMADA pcoma {$$=$1}
    | RUNMETOD {$$=$1}
    | RETORNAR {$$=$1}
    | error INSTRUCC {
     console.log("Sintactico","Error en : '"+yytext+"'",
     this._$.first_line,this._$.first_column);
     console.log("Se recupero en ",yytext," (",this._$.last_line,",",this._$.last_column,")");}
    ;

RETORNAR //Valores AST name, value, tipo,entorno, fila, columna
    : Rreturn EXP pcoma {$$= new AST_Node("RETURN","RETURN"); $$.addHijos(new AST_Node("return","return","return","return",this._$.first_line,this._$.first_column) ,$2) }
    | Rreturn pcoma {$$= new AST_Node("RETURN","RETURN"); $$.addHijos(new AST_Node("return","return","return","return",this._$.first_line,this._$.first_column)) }
    ;


DECLARAR // aqui inician las declaraciones de variables Valores AST name, value, tipo,entorno, fila, columna
    :  LST_IDS  {$$ = $1}
    | DECLARACION_INDV {$$= $1}
    ;


DECLARACION_INDV  // esta funciona para hacer una declaracion simple
    : TIPO ID igual EXP {$$= new AST_Node("DECLARACION_INDV","DECLARACION_INDV"); $$.addHijos(new AST_Node("ID",$2,tipo_variable,"VARIABLE",this._$.first_line,this._$.first_column),$4)}
    | TIPO ID igual CASTEO {$$= new AST_Node("DECLARACION_INDV","DECLARACION_INDV"); $$.addHijos(new AST_Node("ID",$2,tipo_variable,"VARIABLE",this._$.first_line,this._$.first_column),$4)}
    | TIPO ID {$$= new AST_Node("DECLARACION_INDV","DECLARACION_INDV"); $$.addHijos(new AST_Node("ID",$2,tipo_variable,"VARIABLE",this._$.first_line,this._$.first_column))}
    | TIPO ID corA corC  igual Rnew TIPO corA EXP corC {$$= new AST_Node("DECLARACION_INDV","DECLARACION_INDV");$6 = new AST_Node("NEW","NEW") ;
    $6.addHijos($7,$9);$$.addHijos(new AST_Node("ID",$2,tipo_variable,"VECTOR",this._$.first_line,this._$.first_column),$6)}
    | TIPO ID corA corC  igual  corA LST_EXP corC
    {$$= new AST_Node("DECLARACION_INDV","DECLARACION_INDV"); $$.addHijos(new AST_Node("ID",$2,tipo_variable,"VARIABLE",this._$.first_line,this._$.first_column),$7)}
    | TIPO ID corA corC corA corC igual Rnew TIPO corA EXP corC corA EXP corC
    {$$= new AST_Node("DECLARACION_INDV","DECLARACION_INDV");$8 = new AST_Node("NEW","NEW") ;
    $8.addHijos($9,$10,$13);$$.addHijos(new AST_Node("ID",$2,tipo_variable,"VECTOR",this._$.first_line,this._$.first_column),$8)}
    | TIPO ID corA corC corA corC igual  corA AUXVECTOR corC 
    {$$= new AST_Node("DECLARACION_INDV","DECLARACION_INDV"); $$.addHijos(new AST_Node("ID",$2,tipo_variable,"VECTOR",this._$.first_line,this._$.first_column,$9))}
    | TIPO error pcoma {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")")}
    ;
LST_IDS //esta funciona para devolver ,id,id ,id para declarar variables Valores AST name, value, tipo,entorno, fila, columna
    : LST_IDS coma ID {$1.addHijos(new AST_Node("ID",$3,tipo_variable,"VARIABLE",this._$.first_line,this._$.first_column)); $$=$1;}
    | LST_IDS coma ID igual EXP {$1.addHijos(new AST_Node("ID",$3,tipo_variable,"VARIABLE",this._$.first_line,this._$.first_column),$5); $$=$1;}
    | TIPO ID coma ID {$$= new AST_Node("ID_LIST","ID_LIST"); $$.addHijos(new AST_Node("ID",$2,tipo_variable,"VARIABLE",this._$.first_line,this._$.first_column));$$.addHijos(new AST_Node("ID",$4,tipo_variable,"VARIABLE",this._$.first_line,this._$.first_column))}
    | TIPO ID coma ID igual EXP {$$= new AST_Node("ID_LIST","ID_LIST"); $$.addHijos(new AST_Node("ID",$2,tipo_variable,"VARIABLE",this._$.first_line,this._$.first_column));$$.addHijos(new AST_Node("ID",$4,tipo_variable,"VARIABLE",this._$.first_line,this._$.first_column , $6))}
    ;

METODOS
    : ID parA parC dosPun TIPO BODY {$$= new AST_Node("METODOS","METODOS"); $$.addHijos(new AST_Node("ID",$1,"ID","",this._$.first_line,this._$.last_column), $5,$6);}            
    | ID parA parC dosPun Rvoid BODY {$$= new AST_Node("METODOS","METODOS"); $$.addHijos(new AST_Node("ID",$1,"ID","",this._$.first_line,this._$.last_column), $5,$6);}            
    | ID parA parC  BODY {$$= new AST_Node("METODOS","METODOS"); $$.addHijos(new AST_Node("ID",$1,"ID","",this._$.first_line,this._$.last_column), $4);}            
    | ID parA PARAMETROS parC dosPun TIPO BODY {$$= new AST_Node("METODOS","METODOS"); $$.addHijos(new AST_Node("ID",$1,"ID","",this._$.first_line,this._$.last_column),$3, $6,$7);}            
    | ID parA PARAMETROS parC dosPun Rvoid  BODY {$$= new AST_Node("METODOS","METODOS"); $$.addHijos(new AST_Node("ID",$1,"ID","",this._$.first_line,this._$.last_column),$3, $6,$7);}            
    | ID parA PARAMETROS parC  BODY  {$$= new AST_Node("METODOS","METODOS"); $$.addHijos(new AST_Node("ID",$1,"ID","",this._$.first_line,this._$.last_column), $3,$5);}            
    | ID parA error dosPun TIPO BODY  {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
    ;
PARAMETROS
    : PARAMETROS coma TIPO ID { $1.addHijos($3, new AST_Node("ID",$1,"ID","",this._$.first_line,this._$.last_column)); $$=$1}            
    | TIPO ID {$$= new AST_Node("PARAMETROS","PARAMETROS"); $$.addHijos($1,new AST_Node("ID",$1,"ID","",this._$.first_line,this._$.last_column));}            
    ;

ASIGNAR //Valores AST name, value, tipo,entorno, fila, columna
    : ID igual EXP {$$= new AST_Node("ASIGNAR","ASIGNAR"); $$.addHijos(new AST_Node("ID",$1,"ID","",this._$.first_line,this._$.last_column),$3);}                     
    | ID igual CASTEO {$$= new AST_Node("ASIGNAR","ASIGNAR"); $$.addHijos(new AST_Node("ID",$1,"ID","",this._$.first_line,this._$.last_column),$3);}    
    | ID INCorDEC {$$= new AST_Node("ASIGNAR","ASIGNAR"); $$.addHijos(new AST_Node("ID",$1,"ID","",this._$.first_line,this._$.last_column),$2);}    
    | ID corA EXP corC igual EXP {$$= new AST_Node("ASIGNAR","ASIGNAR"); $$.addHijos(new AST_Node("ID",$1,"ID","",this._$.first_line,this._$.last_column),$3,$6);}    
    | ID corA EXP corC  corA EXP corC igual corA EXP corC  corA EXP corC {$$= new AST_Node("ASIGNAR","ASIGNAR"); $$.addHijos(new AST_Node("ID",$1,"ID","",this._$.first_line,this._$.last_column),$3,$6,$10,$13);}    
    | ID error pcoma
        {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")")}
    ;



INCorDEC
    : inc {$$=$1}
    | dec {$$=$1}
    ;
IF
    : Rif parA EXP parC BODY  {$$= new AST_Node("IF","IF"); $$.addHijos($3,$5);}            
    | Rif parA EXP parC BODY Relse BODY {$$= new AST_Node("IF","IF");$6= new AST_Node("ELSE","ELSE");$6.addHijos($7); $$.addHijos($3,$5,$6);}            
    | Rif parA EXP parC BODY Relse IF {$$= new AST_Node("IF","IF");$6= new AST_Node("ELSEIF","ELSEIF");$6.addHijos($7); $$.addHijos($3,$5,$6);}            
    | Rif error llavA
        {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}                         
    ;
///////////////////    
SWITCH
    : Rswitch parA EXP parC llavA LCASOS Rdefault dosPun LINS llavC  {$$= new AST_Node("SWITCH","SWITCH");$7 =new AST_Node("DEFAULT","DEFAULT");$7.addHijos($9); $$.addHijos($3,$6,$7);}                     
    | Rswitch parA EXP parC llavA LCASOS llavC  {$$= new AST_Node("SWITCH","SWITCH"); $$.addHijos($3,$6);}  
    | Rswitch parA EXP parC llavA Rdefault dosPun LINS llavC {$$= new AST_Node("SWITCH","SWITCH");$6 =new AST_Node("DEFAULT","DEFAULT");$6.addHijos($8) ; $$.addHijos($3,$6);}                        
    | Rswitch error llavC  
        {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
    ;

ELSEIF
    : Rif parA EXP parC BODY {$$= new AST_Node("ELSEIF","ELSEIF"); $$.addHijos($3,$5);}                     
    | ELSEIF Relse Rif parA EXP parC BODY {$$= $1; $$.addHijos($5,$7);}   
    | Rif error parC
;

LCASOS
    :Rcase EXP dosPun LINS {$$= new AST_Node("CASE","CASE"); $$.addHijos($2,$4);}              
    |LCASOS Rcase EXP dosPun LINS  {$$= $1; $$.addHijos($3,$5);}   
    |Rcase error parC                   {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
;

DOWHILE
    :Rdo BODY Rwhile parA EXP parC {$$= new AST_Node("WHILE","WHILE"); $$.addHijos($2,$5);}   
    |Rdo error pcoma                       {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
;

WHILE
    :Rwhile parA EXP parC BODY   {$$= new AST_Node("WHILE","WHILE"); $$.addHijos($3,$5);}     
    |Rwhile error parC                    {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
;
FOR
    :Rfor parA ASIGNAR pcoma EXP pcoma ACTUALIZAR parC BODY   {$$= new AST_Node("FOR","FOR"); $$.addHijos($3,$5,$7,$9);}      
    |Rfor parA DECLARAR pcoma EXP pcoma ACTUALIZAR parC BODY  {$$= new AST_Node("FOR","FOR"); $$.addHijos($3,$5,$7,$9);}        
    |Rfor error llavC                                                    {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
;


BODY
    : llavA LINS llavC  {$$= new AST_Node("BODY","BODY"); $$.addHijos($2);  }  
    | llavA llavC    {$$= new AST_Node("BODY","BODY"); $$.addHijos(new AST_Node("body_null","body_null"));  }       
    | llavC error llavC   {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
;


ACTUALIZAR                                                      //Valores AST name, value, tipo,entorno, fila, columna
    : ID igual EXP {$$= new AST_Node("ACTUALIZAR","ACTUALIZAR"); $$.addHijos(new AST_Node("ID",$1,"ID","",this._$.first_line,this._$.last_column),$3);  }                            
    | ID INCorDEC {$$= new AST_Node("ACTUALIZAR","ACTUALIZAR"); $$.addHijos(new AST_Node("ID",$1,"ID","",this._$.first_line,this._$.last_column),new AST_Node("INCDEC",$2,"INCDEC","",this._$.first_line,this._$.last_column));  }                    
    | ID error              {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
;

LLAMADA //Valores AST name, value, tipo,entorno, fila, columna
    : ID parA parC {$$= new AST_Node("LLAMADA","LLAMADA"); $$.addHijos(new AST_Node("ID_LLAMADA",$1,"ID_LLAMADA","LLAMADA",this._$.first_line,this._$.last_column));  }                                            
    | ID parA L_EXP parC {$$= new AST_Node("LLAMADA","LLAMADA"); $$.addHijos(new AST_Node("ID_LLAMADA",$1,"ID_LLAMADA","LLAMADA",this._$.first_line,this._$.last_column),$3);  }                                                      
    | Rrun ID parA parC    {$$= new AST_Node("RUN","RUN"); $$.addHijos(new AST_Node("ID_RUN",$1,"ID_RUN","LLAMADA",this._$.first_line,this._$.last_column));  }                                                   
    | Rrun ID parA L_EXP parC {$$= new AST_Node("RUN","RUN"); $$.addHijos(new AST_Node("ID_RUN",$1,"ID_RUN","LLAMADA",this._$.first_line,this._$.last_column),$4);  }                                                      
;

CASTEO
    : parA TIPO parC EXP  {$$= new AST_Node("CASTEO","CASTEO"); $$.addHijos(new AST_Node("TIPO",$2,$2,"CASTEO",this._$.first_line,this._$.last_column),$4);  }        
    | parA error EXP   {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
;
////////////////////////////////////////////////////////////////

TIPO
    : Rint {tipo_variable = "int" ; $$=$1;}
    | Rdouble {tipo_variable = "double" ; $$=$1;}
    | Rstring {tipo_variable = "string" ; $$=$1;}
    | Rchar {tipo_variable = "char" ; $$=$1}
    | Rboolean {tipo_variable = "boolean" ; $$=$1;}
    ;


                    //Valores AST name, value, tipo,entorno, fila, columna
EXP  
    : EXP mas EXP  {$$= new AST_Node("EXP","EXP");$$.addHijos($1,new AST_Node("op",$2,"op","op",this._$.first_line,this._$.last_column),$3);}
    | EXP menos EXP {$$= new AST_Node("EXP","EXP");$$.addHijos($1,new AST_Node("op",$2,"op","op",this._$.first_line,this._$.last_column),$3);}
    | EXP mul EXP {$$= new AST_Node("EXP","EXP");$$.addHijos($1,new AST_Node("op",$2,"op","op",this._$.first_line,this._$.last_column),$3);}
    | EXP div EXP {$$= new AST_Node("EXP","EXP");$$.addHijos($1,new AST_Node("op",$2,"op","op",this._$.first_line,this._$.last_column),$3);}
    | EXP mod EXP {$$= new AST_Node("EXP","EXP");$$.addHijos($1,new AST_Node("op",$2,"op","op",this._$.first_line,this._$.last_column),$3);}
    | EXP min EXP {$$= new AST_Node("EXP","EXP");$$.addHijos($1,new AST_Node("op",$2,"op","op",this._$.first_line,this._$.last_column),$3);}
    | EXP max EXP {$$= new AST_Node("EXP","EXP");$$.addHijos($1,new AST_Node("op",$2,"op","op",this._$.first_line,this._$.last_column),$3);}
    | EXP notEquals EXP {$$= new AST_Node("EXP","EXP");$$.addHijos($1,new AST_Node("op",$2,"op","op",this._$.first_line,this._$.last_column),$3);}
    | EXP equals EXP {$$= new AST_Node("EXP","EXP");$$.addHijos($1,new AST_Node("op",$2,"op","op",this._$.first_line,this._$.last_column),$3);}
    | EXP minEqual EXP {$$= new AST_Node("EXP","EXP");$$.addHijos($1,new AST_Node("op",$2,"op","op",this._$.first_line,this._$.last_column),$3);}
    | EXP maxEqual EXP {$$= new AST_Node("EXP","EXP");$$.addHijos($1,new AST_Node("op",$2,"op","op",this._$.first_line,this._$.last_column),$3);}
    | EXP and EXP {$$= new AST_Node("EXP","EXP");$$.addHijos($1,new AST_Node("op",$2,"op","op",this._$.first_line,this._$.last_column),$3);}
    | EXP or EXP {$$= new AST_Node("EXP","EXP");$$.addHijos($1,new AST_Node("op",$2,"op","op",this._$.first_line,this._$.last_column),$3);}
    | EXP opt EXP dosPun EXP {$$= new AST_Node("TERNARIO","TERNARIO");$$.addHijos($1,new AST_Node("opt",$2,"opt","opt",this._$.first_line,this._$.last_column),$3,$5);}                   
    | corA EXP corC {$$= new AST_Node("EXP","EXP");$$.addHijos(new AST_Node("op",$2,"op","op",this._$.first_line,this._$.last_column));}
    | EXP inc {$$= new AST_Node("EXP","EXP");$$.addHijos($1,new AST_Node("op",$2,"op","op",this._$.first_line,this._$.last_column));}
    | EXP dec {$$= new AST_Node("EXP","EXP");$$.addHijos($1,new AST_Node("op",$2,"op","op",this._$.first_line,this._$.last_column));}
    | not EXP %prec unot {$$= new AST_Node("EXP","EXP");$$.addHijos(new AST_Node("op",$1,"op","op",this._$.first_line,this._$.last_column) , $2);}
    | menos EXP %prec umenos {$$= new AST_Node("EXP","EXP");$$.addHijos(new AST_Node("op",$1,"op","op",this._$.first_line,this._$.last_column) , $2);}  
    | Cadena {$$= new AST_Node("EXP","EXP");$$.addHijos(new AST_Node("string",$1,"string","string",this._$.first_line,this._$.last_column));}
    | Char {$$= new AST_Node("EXP","EXP");$$.addHijos(new AST_Node("char",$1,"char","char",this._$.first_line,this._$.last_column));}
    | ID {$$= new AST_Node("EXP","EXP");$$.addHijos(new AST_Node("ID",$1,"ID","ID",this._$.first_line,this._$.last_column));}
    | ID parA parC {$$= new AST_Node("EXP","EXP");$$.addHijos(new AST_Node("ID_LLAMADA",$1,"ID_LLAMADA","ID_LLAMADA",this._$.first_line,this._$.last_column));}
    | ID parA LST_EXP parC {$$= new AST_Node("EXP","EXP");$$.addHijos(new AST_Node("ID_LLAMADA",$1,"ID_LLAMADA","ID_LLAMADA",this._$.first_line,this._$.last_column), $3);}
    | ID corA EXP corC {$$= new AST_Node("EXP","EXP");$$.addHijos(new AST_Node("VECTOR1D",$1,"VECTOR1D","VECTOR1D",this._$.first_line,this._$.last_column), $3);}
    | ID corA EXP corC corA EXP corC {$$= new AST_Node("EXP","EXP");$$.addHijos(new AST_Node("VECTOR1D",$1,"VECTOR1D","VECTOR1D",this._$.first_line,this._$.last_column), $3);} 
    | entero {$$= new AST_Node("EXP","EXP");$$.addHijos(new AST_Node("entero",$1,"entero","entero",this._$.first_line,this._$.last_column));} 
    | decimal {$$= new AST_Node("EXP","EXP");$$.addHijos(new AST_Node("double",$1,"double","double",this._$.first_line,this._$.last_column));} 
    | lit_boleanV {$$= new AST_Node("EXP","EXP");$$.addHijos(new AST_Node("true",$1,"true","true",this._$.first_line,this._$.last_column));} 
    | lit_boleanF {$$= new AST_Node("EXP","EXP");$$.addHijos(new AST_Node("false",$1,"false","false",this._$.first_line,this._$.last_column));} 
    | parA EXP parC {$$= new AST_Node("EXP","EXP");$$.addHijos($2);} 
    | parA TIPO parC %prec ucast {$$= new AST_Node("EXP","EXP");$$.addHijos(new AST_Node("cast",$2,"cast","cast",this._$.first_line,this._$.last_column));} 
    | RtoStr parA EXP parC %prec ucast {$$= new AST_Node("EXP","EXP");$1=new AST_Node("toStr",$1,"toStr","toStr",this._$.first_line,this._$.last_column);$1.addHijos($3) ;$$.addHijos($1);} 
    | RtoLower parA EXP parC %prec ucast {$$= new AST_Node("EXP","EXP");$1=new AST_Node("toLower",$1,"toLower","toLower",this._$.first_line,this._$.last_column);$1.addHijos($3) ;$$.addHijos($1);} 
    | RtoUpper parA EXP parC %prec ucast {$$= new AST_Node("EXP","EXP");$1=new AST_Node("toUpper",$1,"toUpper","toUpper",this._$.first_line,this._$.last_column);$1.addHijos($3) ;$$.addHijos($1);} 
    | Rround parA EXP parC %prec ucast {$$= new AST_Node("EXP","EXP");$1=new AST_Node("round",$1,"round","round",this._$.first_line,this._$.last_column);$1.addHijos($3) ;$$.addHijos($1);} 
    | Rlength parA EXP parC %prec ucast {$$= new AST_Node("EXP","EXP");$1=new AST_Node("leng",$1,"leng","leng",this._$.first_line,this._$.last_column);$1.addHijos($3) ;$$.addHijos($1);} 
    | Rtypeof parA EXP parC %prec ucast {$$= new AST_Node("EXP","EXP");$1=new AST_Node("typeOf",$1,"typeOf","typeOf",this._$.first_line,this._$.last_column);$1.addHijos($3) ;$$.addHijos($1);} 
    ;

AUXVECTOR  //Valores AST name, value, tipo,entorno, fila, columna
    : AUXVECTOR coma corA LST_EXP corC {$1.addHijos($4) ; $$=$1}    
    | corA LST_EXP corC {$$= new AST_Node("AUXVECTOR","AUXVECTOR"); $$.addHijos($2);  }    
    ;
LST_EXP 
    : LST_EXP coma EXP {$1.addHijos($3) ; $$=$1}    
    | EXP {$$= new AST_Node("LST_EXP","LST_EXP"); $$.addHijos($1);  }    
    ;
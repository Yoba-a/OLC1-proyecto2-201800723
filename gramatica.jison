/**
 * Ejemplo mi primer proyecto con Jison utilizando Nodejs en Ubuntu
 */

/* Definición Léxica */
%{
 var cadena =""
%}
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

.                       { console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }
/lex

/* Asociación de operadores y precedencia */




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
    : LINS EOF;


LINS
    : LINS INSTRUCC 
    | INSTRUCC 
    ;

INSTRUCC
    : Rprintln parA EXP parC pcoma 
    | Rprint parA EXP parC pcoma
    | DECLARAR pcoma 
    | ASIGNAR pcoma 
    | IF
    | DOWHILE pcoma
    | WHILE
    | FOR 
    | SWITCH
    | Rbreak pcoma
    | Rcontinue pcoma
    | METODOS
    | LLAMADA pcoma
    | RUNMETOD
    | RETORNAR
    | error INS {errores.push("Se recupero en ",yytext," (",this._$.last_line,",",this._$.last_column,")");
     console.log("Sintactico","Error en : '"+yytext+"'",
     this._$.first_line,this._$.first_column);
     console.log("Se recupero en ",yytext," (",this._$.last_line,",",this._$.last_column,")");}
    ;

RETORNAR
    : Rreturn EXP pcoma
    | Rreturn pcoma
    ;


DECLARAR // aqui inician las declaraciones de variables
    : DECLARACION_INDV LST_IDS 
    | DECLARACION_INDV
    ;


DECLARACION_INDV  // esta funciona para hacer una declaracion simple
    : TIPO ID igual EXP
    | TIPO ID igual CASTEO
    | TIPO ID
    | TIPO ID corA corC  igual Rnew TIPO corA EXP corC
    | TIPO ID corA corC  igual  corA LST_EXP corC
    | TIPO ID corA corC corA corC igual Rnew TIPO corA EXP corC corA EXP corC
    | TIPO ID corA corC corA corC igual  corA AUXVECTOR corC 
    | TIPO error pcoma {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")")}
    ;
LST_IDS //esta funciona para devolver ,id,id ,id para declarar variables
    : LST_IDS coma ID
    | LST_IDS coma ID igual EXP
    | coma ID
    ;

METODOS
    : ID parA parC dosPun TIPO BODY
    | ID parA parC dosPun Rvoid BODY
    | ID parA parC dosPun BODY
    | ID parA PARAMETROS parC dosPun TIPO BODY
    | ID parA PARAMETROS parC dosPun Rvoid  BODY
    | ID parA PARAMETROS parC dosPun BODY
    | ID parA error dosPun TIPO BODY  {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
    ;
PARAMETROS
    : PARAMETROS coma TIPO ID
    | TIPO ID
    ;

ASIGNAR
    : ID igual EXP
    | ID igual CASTEO
    | ID INCorDEC
    | ID corA EXP corC igual EXP
    | ID corA EXP corC  corA EXP corC igual corA EXP corC  corA EXP corC
    | ID error pcoma
        {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")")}
    ;



INCorDEC
    : inc
    | dec
    ;
IF
    : Rif parA EXP parC BODY              
    | Rif parA EXP parC BODY Relse BODY 
    | Rif parA EXP parC BODY Relse IF
    | Rif error llavA
        {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}                         
    ;
///////////////////    
SWITCH
    : Rswitch parA EXP parC llavA LCASOS Rdefault dosPun LINS llavC  
    | Rswitch parA EXP parC llavA LCASOS llavC                        
    | Rswitch error llavC  
        {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
    ;

ELSEIF
    : Rif parA EXP parC BODY        
    | ELSEIF Relse Rif parA EXP parC BODY 
    | Rif error parC
;

LCASOS
    :Rcase EXP dosPun LINS               
    |LCASOS Rcase EXP dosPun LINS        
    |Rcase error parC                   {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
;

DOWHILE
    :Rdo BODY Rwhile parA EXP parC   
    |Rdo error pcoma                       {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
;

WHILE
    :Rwhile parA EXP parC BODY        
    |Rwhile error parC                    {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
;
FOR
    :Rfor parA ASIGNAR pcoma EXP pcoma ACTUALIZAR parC BODY         
    |Rfor parA DECLARAR pcoma EXP pcoma ACTUALIZAR parC BODY        
    |Rfor error llavC                                                    {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
;


BODY
    : llavA LINS llavC   
    | llavA llavC         
    | llavC error llavC   {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
;


ACTUALIZAR
    : ID igual EXP         
    | ID INCorDEC             
    | ID error              {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
;

LLAMADA 
    : ID parA parC                 
    | ID parA L_EXP parC          
    | Rrun ID parA parC           
    | Rrun ID parA L_EXP parC     
;

CASTEO
    : parA TIPO_AUX parC EXP       
    | parA error EXP              {console.log("Se recupero en ",yytext," (", this._$.last_line,", ", this._$.last_column,")");}
;
////////////////////////////////////////////////////////////////

TIPO
    : Rint
    | Rdouble
    | Rstring
    | Rchar
    | Rboolean
    ;

TIPO_AUX
    : Rint          
    | Rdouble       
    | Rstring       
    | Rchar         
;
EXP
    : EXP mas EXP
    | EXP menos EXP
    | EXP mul EXP
    | EXP div EXP
    | EXP mod EXP
    | EXP min EXP
    | EXP max EXP
    | EXP notEquals EXP
    | EXP equals EXP
    | EXP minEqual EXP
    | EXP maxEqual EXP
    | EXP and EXP
    | EXP or EXP
    | EXP opt EXP dosPun EXP                  
    | corA EXP corC
    | EXP inc
    | EXP dec
    | not EXP %prec unot
    | menos EXP %prec umenos 
    | Cadena
    | Char
    | ID
    | ID parA parC
    | ID parA LST_EXP parC
    | ID corA EXP corC
    | ID corA EXP corC corA EXP corC 
    | entero
    | decimal
    | lit_boleanV
    | lit_boleanF
    | parA EXP parC
    | parA TIPO_AUX parC %prec ucast
    | RtoStr parA EXP parC %prec ucast
    | RtoLower parA EXP parC %prec ucast 
    | RtoUpper parA EXP parC %prec ucast
    | Rround parA EXP parC %prec ucast
    | Rlength parA EXP parC %prec ucast
    | Rtypeof parA EXP parC %prec ucast
    
    ;

AUXVECTOR 
    : AUXVECTOR coma corA LST_EXP corC 
    | corA LST_EXP corC
    ;
LST_EXP 
    : LST_EXP coma EXP
    | EXP
    ;
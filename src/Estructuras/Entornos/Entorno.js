export var Entorno = (function(){
    var instance;

    class Entorno {
        constructor(){
            this.Entorno = "global"
        }

        entorno(){
            return  this.Entorno;
        }

        global(){
            this.Entorno = "global";
        }

        if_entorno(){
            this.Entorno = "if";
        }

        else_entorno(){
            this.Entorno = "else";
        }

        while_entorno(){
            this.Entorno = "while";
        }

        for_entorno(){
            this.Entorno = "for";
        }

        dowhile_entorno(){
            this.Entorno = "dowhile";
        }

        switch_entorno(){
            this.Entorno = "switch";
        }

        vo_entorno(){
            this.Entorno = "vo";
        }
    }

    function crearInstancia(){
        return new Entorno();
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


//------------------- Base Obj ----------------------
class Input_Element{
    constructor(domElement){
        this.element=domElement;
    }
    get(){
        return this.element.value;
    }

    set(value){
        this.element.value=value;
    }

    enable(){
        this.element.disabled=false;
        this.element.style.opacity=1;
    }

    disable(){
        this.element.disabled=true;
        this.element.style.opacity=0.7;
    }

}
//------------------- Obj types ------------------------
class Text extends Input_Element{
    constructor(domElement){
        super(domElement);
        this.element=domElement;
    }

    get(){
        return this.element.value;
    }

    set(value){
        this.element.value=value;
    }
}

class Range extends Input_Element{
    constructor(domElement){
        super(domElement);
        this.element=domElement;
    }

    get(){
        return this.element.value;
    }

    set(value){
        this.element.value=value;
    }
}

class Select extends Input_Element{
    constructor(domElement){
        super(domElement);
        this.element=domElement;
    }

    get(){
        return this.element.options[this.element.selectedIndex].value;
    }

    set(value){}
}

class CheckBx extends Input_Element{
    constructor(domElement){
        super(domElement);
        this.element=domElement;
    }
    
    get(){
        return this.element.checked;
    }

}

class Button extends Input_Element{
    constructor(domElement){
        super(domElement);
    }
}

//-------------------------------------------------------------------------------------
//------ Permite hacer acciones simples(como obtener data o activar/desactivar) con objetos del dom, de forma sencilla---
export class Dom_Manager{
    constructor(){
        this.objects={};
        this.data=[];
        this.types={"text":Text,"range":Range,"select":Select,"checkbox":CheckBx,"button":Button};
    }
    
    //Se pasan los objs que se quieren usar, con sus ids que tendran en el dom
    set_objsData(arr){ //recibe arr-> {id:str,type:str}
        this.data=this.data.concat(arr);
    }
    
    //Se buscan los elements en el dom y se agregan
    build_objs(){
        for (let obj of this.data){
            this.__add(obj.id,obj.type);
        }
    }
    
    //Obtener el curr value
    get(id){
        return this.objects[id].get();
    }
    
    //Setearle un value
    set(id,value){
        this.objects[id].set(value);
    }
    
    //Habilitar interaccion
    enable(id){
        this.objects[id].enable();
    }
    
    //Deshabilitar interacion
    disable(id){
        this.objects[id].disable();
    }

    __add(id,type){
        let element=document.getElementById(id);
        if (element){
            let ObjType=this.types[type];
            this.objects[id]=new ObjType(element);

        }
    }
}

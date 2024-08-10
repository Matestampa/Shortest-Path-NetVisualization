//------------------- Base Obj ----------------------

class Input_Element{
    element:HTMLInputElement
    constructor(domElement:HTMLInputElement){
        this.element=domElement;
    }
    get():(string|boolean){
        return this.element.value;
    }

    set(value){
        this.element.value=value;
    }

    enable(){
        this.element.disabled=false;
        this.element.style.opacity="1";
    }

    disable(){
        this.element.disabled=true;
        this.element.style.opacity="0.7";
    }

}
//------------------- Obj types ------------------------
class Text extends Input_Element{
    constructor(domElement){
        super(domElement);
        this.element=domElement;
    }
}

class Range extends Input_Element{
    constructor(domElement){
        super(domElement);
        this.element=domElement;
    }
}

class Select extends Input_Element{
    constructor(domElement){
        super(domElement);
        this.element=domElement;
    }

    get(){
        let elem=this.element as unknown as HTMLSelectElement
        return elem.options[elem.selectedIndex].value;
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

//Obj con los contructors
const INPUT_ELEMENTS={
    "text":Text,
    "range":Range,
    "select":Select,
    "checkbox":CheckBx,
    "button":Button
}

//Obj para q los q los usan puedan pasar bien el tipo del que quieren
const INPUT_ELEMENTS_OPTIONS={
    "text":"text",
    "range":"range",
    "select":"select",
    "checkbox":"checkbox",
    "button":"button"
}

//-------------------------------------------------------------------------------------
//------ Permite hacer acciones simples(como obtener data o activar/desactivar) con objetos del dom, de forma sencilla---
class Dom_Manager{
    
    objects:Map<"id",Input_Element>
    data:{"id":any,"type":"string"}[];
    //types:{[key:string]:typeof Input_Element}
    
    constructor(){
        this.objects=new Map();
        this.data=[];
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
        let element=document.getElementById(id) as unknown as HTMLInputElement;
        if (element){
            let ObjType=INPUT_ELEMENTS[type];
            this.objects[id]=new ObjType(element);

        }
    }
}

export {Dom_Manager,INPUT_ELEMENTS_OPTIONS};

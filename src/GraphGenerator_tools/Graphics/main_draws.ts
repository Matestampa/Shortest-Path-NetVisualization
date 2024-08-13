import {fabric} from "fabric";

import {DataNode,DataEdge } from "../graphData_classes.js";
import type { GeneratedGraphData } from "../graphData_classes.js";

import {GraphDraw_Node,GraphDraw_Edge} from "./draw_help.js";


//Permite guardar elementos que pertenezcan a varios grupos
//Se los busca segun sus tags(grupos a los que pertenecen)
//los elementos en concreto los guardamos en un array
//cada una de las tags que haya es un array que contiene los index de los elementos que le pertenecen
class TagGroups{
    tags:{}
    objs:any[]
    curr_index:number
    length:number  

    constructor(){
      this.tags={}; //guardamos sus indices en cada tag --->{tag:[index0,index4,indexN]}
      this.objs=[]; //guardamos los elementos

      this.curr_index=0; //lo aumentamos a medida que añadimos nuevos
      this.length=0;
    }

    add(tags:any[],obj){
      for (let key of tags){
          if (this.tags[key]==undefined){ //si no existe la creamos
            this.tags[key]=[];
          }
          this.tags[key].push(this.curr_index);

      }
      this.objs.push(obj);
      this.curr_index++;
      this.length+=1;
    }

    get(tags:any[]):any[]{
      let matched_objs=[];
      for (let key of tags){
        if (this.tags[key]!=undefined){ //si existe           
           for (let index of this.tags[key]){
               let obj=this.objs[index];
               if (obj!=null){
                matched_objs.push(this.objs[index]); //traemos todos los elementos de esa tag
               }
           }
        }
        else{
            throw new Error(`Tag ${key} doesnt exist`);
        }
      }
      return matched_objs; //devolvemos todo lo que encontramos
    }

    remove(tags:any[]){
      for (let key of tags){
        if (this.tags[key]!=undefined){ //si existe la tag
           for (let index of this.tags[key]){
               this.objs[index]=null;  //ponemos el elemento del array en null
               this.length-=1;
           }
           delete this.tags[key];//borramos la tag
        }
      }
    }
}

//Es un canvas pero especifico de grafo; o sea tiene acciones especificas para lo que requiere el grafo
//Solo crea objetos de tipo "GraphDraw_Node" o "GraphDraw_Edge"
//Cada uno de estos contiene adentro suyo el elemento de Fabric.js(se llama cv_object) que le corresponde

//Se guarda el objeto agrupado por tags en el "TagGropus" para poder acceder con facilidad y rapidamente
//Se guarda el elemento de Fabric en el canvas, para que pueda verse en pantalla.

//Encargada de crear ,almacenar y manejar objetos graficos
//tambien administrat sus eventos y cambiarles ciertos atributos.
class GraphDraw_Manager{
    
    cv:fabric.Canvas
    objects:TagGroups
    node_size:number
    DEFAULT_NODE_COLOR:string
    node_movility:boolean
    DEAFULT_EDGE_COLOR:string
    edge_movility:boolean


    constructor(canvas:fabric.Canvas,node_config,edge_config){ //canvasObj, node{"size","default_color","movility"}, edge{"default_color","movility"}
        this.cv=canvas;
        this.objects=new TagGroups();
        
        this.node_size=node_config.size;
        this.DEFAULT_NODE_COLOR=node_config.default_color;
        this.node_movility=!node_config.movility; //lo invertimos(porque los attrs del fabric son para bloquear movimiento)
                                                  //(osea si en movility ponemos false, en fabric hay que poner "true"
                                                  // de bloquear movimiento)
        this.DEAFULT_EDGE_COLOR=edge_config.default_color;
        this.edge_movility=!edge_config.movility; //aca lo mismo para el edge
    }

    render_from(objects:GeneratedGraphData){
      objects.forEach((object)=>{
        if (object instanceof DataNode){
            this.create_node(object);
        }
        
        if (object instanceof DataEdge){
            this.create_edge(object);
        }

        /*if (object.type=="division"){
          this.create_division(object);
      }*/

      })
    }

    create_node(node:DataNode){
        let color=this.DEFAULT_NODE_COLOR;

        let object_data={"left":node.x_cor-(this.node_size/2),"top":node.y_cor-(this.node_size/2),
                                      "radius":this.node_size/2,
                                      "fill":color,"hasControls":false,"hasBorders":false,"hoverCursor":"default",
                                      "lockMovementX":this.node_movility,"lockMovementY":this.node_movility};
        
        let new_node=new GraphDraw_Node(node.value,object_data);

        //poner tags
        node["tags"]=["nodes",node.value];

        //guardar
        this.__save(node,new_node);
    }

    create_edge(edge:DataEdge){
      let color=this.DEAFULT_EDGE_COLOR;

      let object_data={"coords":[edge.x_cor1,edge.y_cor1,edge.x_cor2,edge.y_cor2],
                         "attrs":{"stroke":color,"hasControls":false,"hasBorders":false,"hoverCursor":"default",
                                  "lockMovementX":this.edge_movility,"lockMovementY":this.edge_movility,"strokeWidth":2}};
        
        let new_edge=new GraphDraw_Edge(edge.value,object_data);

        //Poner tags
        edge["tags"]=["edges",edge.value,edge.get_invertedValue()];

        //Guardar
        this.__save(edge,new_edge);
    }
    
    /*create_division(div){
      let object_data={"coords":[div.x_cor1,div.y_cor1,div.x_cor2,div.y_cor2],
                        "attrs":{"fill":div.color,"stroke":"white","hasControls":false,"hasBorders":false,
                        "lockMovementX":true,"lockMovementY":true}};
      
      let new_div=new GraphDraw_Division(div.value,object_data);
      this.__save(div,new_div);
    }*/

    remove(tags:any[]){
      let objs_toRemove=this.objects.get(tags); //necesitamos los concrete elements, para poder borrarlos del canvas
      objs_toRemove.forEach(obj=>{
        this.cv.remove(obj.cv_object); //los borramos del canvas
      })
      this.objects.remove(tags); //los borramos del TagGroup
    }

    item_config(tags:any,property:string,value?:any){
      let objs=this.objects.get(tags);
      objs.forEach(obj=>{
        if (property=="color"){ //aca se pueden agregar propiedades para el futuro
          obj.change_color(value);
        }
        if (property=="toFront"){
          this.cv.bringToFront(obj.cv_object);
        }
      })
    }
    
    
    //Poner evento de click
    setClick_event(tags:any[],callback:(obj)=>void){ 
      let objs=this.objects.get(tags);
      for (let obj of objs){
        obj.cv_object.on("mousedown",function(){
          return callback(obj);
        })
        obj.cv_object.hoverCursor="pointer";
      }
    }
    
    //Sacar evento de click
    removeClick_event(tags:any[]){
      let objs=this.objects.get(tags);
      for (let obj of objs){
        obj.cv_object.off("mousedown");
        obj.cv_object.hoverCursor="default";
      }
    }
    
    //Borrar todos los objs de la clase
    clear(){
      if (this.objects.length!=0){
        this.remove(["all"]);
        this.objects=new TagGroups(); //hacemos de 0 el TagGroups
      }
    }

    //Renderizar todo, refrescar la pagina
    refresh(){
      this.cv.renderAll();
    }
    
    //Guarda en canvas y en objects
    private __save(object,new_element){
      
      this.cv.add(new_element.cv_object);
      
      if (object.tags){
          object.tags.push("all");
          this.objects.add(object.tags,new_element);
      }

      else{
        this.objects.add(["all"],new_element);
      }
    }
}

export {GraphDraw_Manager};
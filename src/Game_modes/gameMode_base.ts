import {GraphGenerator as GraphGenerat,generate_shortPath} from "../generators.js";
import {sleep} from "./GameMode_tools/extras.js";

import type { DrawGraphElems_conf } from "../types.js";

import type { Dom_Manager } from "./GameMode_tools/Dom_Manager.js";

import type { InMemory_Graph,GraphDraw_Manager } from "../generators.js";


//-------------- Clase Base de la que debe heredar todo GameMode ------------------------
abstract class Base_GameMode{
    
    area_limits:{"x":[number,number],"y":[number,number]}

    default_colors:{node:string,edge:string}
    active_colors:{node:string,edge:string}
    path_colors:{}
    selectedNode_color:string

    DrawManager_config:DrawGraphElems_conf
    Dom_Manager:Dom_Manager

    GraphGenerator:GraphGenerat
    generator_type:string

    MemoryGraph:InMemory_Graph
    DrawManager:GraphDraw_Manager

    onNode_click:(obj)=>void
    onEdge_click:(obj)=>void

    start_node:string
    end_node:string

    constructor(area_limits,Canvas:fabric.Canvas,Dom_Manager:Dom_Manager){
        this.area_limits=area_limits;
        
        //definir colores en cada situacion
        this.default_colors={"node":"#F50753","edge":"black"};
        this.active_colors={"node":"#29f3cf","edge":"#29f3cf"};
        this.path_colors={"node":"#8000ff","edge":"#8000ff"};
        this.selectedNode_color="orange";
  
        this.DrawManager_config={"canvas":Canvas,"node":{ "default_color":this.default_colors.node,"movility":false},
        "edge":{"default_color":this.default_colors.edge,"movility":false}};

        this.Dom_Manager=Dom_Manager;
        this.Dom_Manager.build_objs();
        
        this.generator_type="aligned";
        this.GraphGenerator=new GraphGenerat(this.generator_type,area_limits,this.DrawManager_config);
        
        this.onNode_click=this.__onNode_click.bind(this);
        this.onEdge_click=this.__onEdge_click.bind(this);
        
  
    }
    
    //Genera el Graph
    generate(cant_nodes,cant_conex,type="aligned"){
        if (type!=this.generator_type){
           this.GraphGenerator=new GraphGenerat(type,this.area_limits,this.DrawManager_config);
        }
        
        [this.MemoryGraph,this.DrawManager]=this.GraphGenerator.generate(cant_nodes,cant_conex);
        this.start_node=undefined;
        this.end_node=undefined;

        this.p_afterGenerate();
    }
    
    //Limpia el Canvas
    clear_screen(){
        if (this.DrawManager!=undefined){
            this.DrawManager.clear();
        }
    }
    
    __show_path(){
        this.p_show_path();

    }

    __find_path(start:string,end:string,algorithm:string){
        let results=generate_shortPath(this.MemoryGraph,start,end,algorithm);
        return results;
    }

    __onNode_click(obj){
        this.p_onNode_click(obj);
    }

    __onEdge_click(obj){
        this.p_onEdge_click(obj);
    }

    /*__set_allDefault(){
        this.__set_color("nodes",this.default_colors["node"]);
        this.__set_color("edges",this.default_colors["edge"]);

        this.p_set_allDefault();
    }*/
    
    //Habilita o deshabilita el click de nodes
    __set_nodes(action:("on"|"off")){
        if (action=="on"){
          this.DrawManager.setClick_event(["nodes"],this.onNode_click);
        }
        if (action=="off"){
          this.DrawManager.removeClick_event(["nodes"]);
        }
    }
    
    //Habilita o deshabilita el click de edges
    __set_edges(action:("on"|"off")){
        if (action=="on"){
          this.DrawManager.setClick_event(["edges"],this.onEdge_click);
        }
        if (action=="off"){
          this.DrawManager.removeClick_event(["edges"]);
        }
    }
  
    __move_nodesToFront(){
        this.DrawManager.item_config(["nodes"],"toFront");
    }

    __move_edgesToFront(){
        this.DrawManager.item_config(["edges"],"toFront");
    }
      
    //Para mostrar un path, pasos, etc
    async __animate(steps,colors,speed){
        for (let step of steps){
            this.__set_color(step.value,colors[step.type]);
            this.DrawManager.refresh();
            await sleep(speed);
        }
    }
    
    __set_color(value,color){ //si necesitamos cambiar el color de algo en any moment
        this.DrawManager.item_config([value],"color",color);
    }
    
    //Acciones luego de generar el Graph
    abstract p_afterGenerate()

    abstract p_show_path()
    
    //Callback utilizado al activar el click de los nodes en __set_nodes("on")
    abstract p_onNode_click(obj)
    
    //Callback utilizado al activar el click de los edges en __set_edges("on")
    abstract p_onEdge_click(obj)

}

export {Base_GameMode};
import {GraphGenerator as GraphGenerat,generate_shortPath} from "../generators.js";
import {sleep} from "./GameMode_tools/extras.js";

//-------------- Clase Base de la que debe heredar todo GameMode ------------------------
export class Base_GameMode{
    constructor(area_limits,Canvas,Dom_Manager){
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
        
        this.GraphGenerator=new GraphGenerat("aligned",area_limits,this.DrawManager_config);
        this.generator_type="aligned";
        
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

    __find_path(start,end,algorithm){
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
    __set_nodes(action){
        if (action=="on"){
          this.DrawManager.setClick_event(["nodes"],this.onNode_click);
        }
        if (action=="off"){
          this.DrawManager.removeClick_event(["nodes"]);
        }
    }
    
    //Habilita o deshabilita el click de edges
    __set_edges(action){
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
    p_afterGenerate(){}

    p_show_path(){}
    
    //Callback utilizado al activar el click de los nodes en __set_nodes("on")
    p_onNode_click(obj){}
    
    //Callback utilizado al activar el click de los edges en __set_edges("on")
    p_onEdge_click(obj){}

}
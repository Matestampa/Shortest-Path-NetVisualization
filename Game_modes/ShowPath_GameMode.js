import {Base_GameMode} from "./gameMode_base.js";
import {Dom_Manager} from "./GameMode_tools/Dom_Manager.js";
import {sleep} from "./GameMode_tools/extras.js";


//--------------------- HTML -----------------------
let HTML=`<div style="text-align:center">
<label for="nodes">Cant-Nodes</label>
<input type="range" id="nodes" name="nodes" min="10" max="180">
<button class="normal-btn" onclick="generate()">Generate Graph</button>
<label for="conex">Conex-Complex</label>
<input type="range" id="conex" name="conex" min="3" max="6" value="3">
</div>
<div style="text-align:center;position: relative;top:10">
<button class="normal-btn" onclick="select_start()" id="select_startBtn">Selct.Start</button>
<button class="normal-btn" onclick="select_end()" id="select_endBtn">Selct.End</button>
<select id="algorithm">
    <option selected disabled>Algorithm</option>
    <option value="Dijkstra">Dijkstra</option>
    <option value="A*">A*</option>
</select>
<label for="show-steps">Show-Steps</label>
<input type="checkbox" id="show-steps" checked=true>
</div>

<div id="cv_home" style="position:fixed;top: 150px;">
<canvas id="c"></canvas>
</div>`


//---------------- funciones asocidadas al html ----------------------
//Todas deben recibir el GameMode Class.
const functions={"generate":(GameMode)=>{
    console.log(document.getElementById("nodes").value);
    console.log(document.getElementById("conex").value);
    let nodes=parseInt(document.getElementById("nodes").value);
    let conex=parseInt(document.getElementById("conex").value);
    GameMode.generate(nodes,conex,"aligned");},
    "select_start":(GameMode)=>{
        GameMode.allowSelect_startNode();},
    "select_end":(GameMode)=>{
        GameMode.allowSelect_finishNode();}
    }

//------------ Objetos del DOM con los que interactuamos -------------------------
let ObJ_Manager=new Dom_Manager();
ObJ_Manager.set_objsData([{"id":"nodes","type":"range"},{"id":"conex","type":"range"},{"id":"algorithm","type":"select"},
{"id":"dist","type":"text"},{"id":"show-steps","type":"checkbox"},{"id":"select_startBtn","type":"button"},{"id":"select_endBtn","type":"button"}]);


//--------------------------- clase GameMode ---------------------------------
class ShowPath_GameMode extends Base_GameMode{
    constructor(area_limits,Canvas,Dom_Manager){
        super(area_limits,Canvas,Dom_Manager);
        
        //Callbacks al hacer click en un Node
        this.nodeSelection={"start":this.__select_start,"finish":this.__select_finish};
        
        //Deshabilitar Cosas de abajo (botones)
        this.Dom_Manager.disable("select_startBtn");
        this.Dom_Manager.disable("select_endBtn");
        //this.Dom_Manager.disable("algorithm")

    }

    allowSelect_startNode(){ //activamos modo seleccionar nodo de start
        this.__setAll_default();
        this.nodeSelection_callback=this.nodeSelection["start"];
        //deshabilitar end button
        this.Dom_Manager.disable("select_endBtn")
    }
  
    allowSelect_finishNode(){//actibamos modo de selecionar nodo de finish
        this.nodeSelection_callback=this.nodeSelection["finish"];
    }
    
    p_afterGenerate(){
        this.__set_nodes("on"); //habilitamos Event click de nodes
        this.__move_nodesToFront()

        this.Dom_Manager.enable("select_startBtn")//habilitar select startNode button
        this.Dom_Manager.disable("select_endBtn");//deshabilitar  select endNode button
    }

    p_onNode_click(obj){ //callback para el Event click del node
        this.nodeSelection_callback(obj); //o __select_start o __select_finish
    }

    p_onEdge_click(obj){ //callback para el Event click del edge
        ////borrar edge del grafo in memory
        let [val1,val2]=obj.value.split("-");
        this.MemoryGraph.remove_edge(val1,val2);
  
        this.DrawManager.remove([obj.value]);//borrar edge de pantalla
        
        this.__set_edges("off");
        this.__show_path();//llamar a la funcion de find_path()
        this.__set_edges("on");//habilitar edges de nuevo
    }

    async p_show_path(){
        this.__setAll_default();//setear todos los objs a su estado normal
        this.__set_color(this.start_node,this.selectedNode_color);//menos los seleccionados
        this.__set_color(this.end_node,this.selectedNode_color);
        
        //elegir algorithm de pantalla
        let pathAlgorithm=this.Dom_Manager.get("algorithm");
        
        let results=this.__find_path(this.start_node,this.end_node,pathAlgorithm);
        let [path,steps]=[results.path,results.steps];

        if (path.length==0){ //si no hay path posible
            await this.__animate(steps,this.active_colors,5); //solo mostramos los steps
            alert("No existe un camino al nodo seleccionado")
            //------------------- SHOW INFO (NO EXISTE PATH) --------------------------
        }
        else if (this.Dom_Manager.get("show-steps")==false){ //Si no se quieren los steps
            await this.__animate(path,this.path_colors,20);
        }
        
        else{
            await this.__animate(steps,this.active_colors,5); //mostramos los steps (y esperamos que terminen)
            await sleep(50);
            await this.__animate(path,this.path_colors,20); //mostramos el path (tambien esperamos que termine)
        }
        
        //this.Dom_Manager.set("dist",results.dist);
    }

    __select_start(obj){
        if (this.start_node!=undefined){ //si no es la primera vez
          this.__set_color(this.start_node,this.default_colors["node"]); //ponemos en default el que estaba antes
        }
        this.start_node=obj.value;
        this.__set_color(obj.value,this.selectedNode_color); //color especial para el seleccionado
        
        this.Dom_Manager.enable("select_endBtn") //Una vez elegido el startNode, habilitamos para select endNode
    }
  
    __select_finish(obj){
        if (this.start_node!=undefined && this.start_node!=obj.value){//verificacion
          this.__set_color(obj.value,this.selectedNode_color);
          this.end_node=obj.value;
          this.__show_path();
          this.__set_edges("off")//por las dudas para que no buguee
          this.__set_edges("on");
        }
        else{
          //--------------------- SHOW ERROR ------------------------------------------
          throw new Error("No ha elegido un punto de partida o ha elegido el mismo");
        }
    }

    __setAll_default(){
        this.__set_color("nodes",this.default_colors["node"]);
        this.__set_color("edges",this.default_colors["edge"]);
  
        this.__set_nodes("off");
        this.__set_nodes("on");
  
        this.__set_edges("off");
    } 

}


let toExport={"html":HTML,"functions":functions,"Obj_Manager":ObJ_Manager,"class":ShowPath_GameMode}

export {toExport as ShowPath_GameMode};
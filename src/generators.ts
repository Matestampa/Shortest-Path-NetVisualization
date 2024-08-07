//------ Imports del GraphGenerator -------
import { get_nodeSize } from "./GraphGenerator_tools/params_functions.js";

import {RandGraphData_Generator} from "./GraphGenerator_tools/DataGraph_Generators/Generator.js";
import { InMemory_Graph } from "./GraphGenerator_tools/Graph_functionality/InMemory_Graph.js";
import {GraphDraw_Manager} from "./GraphGenerator_tools/Graphics/main_draws.js";

import type { _2DCoords_Type } from "./GraphGenerator_tools/DataGraph_Generators/types.js";

//------- Imoports del generate_shortPath --------
import { Dijkstra,A_Star } from "./GraphGenerator_tools/Graph_functionality/path_algorithms.js";

import type { ShortPath_Algorithm,shortestPath_data } from "./GraphGenerator_tools/Graph_functionality/path_algorithms.js";

import { fromPath_2_Draw } from "./GraphGenerator_tools/formaters.js";

import type { shortestPath_drawData } from "./GraphGenerator_tools/formaters.js";

//------------------------- Generador de Random Graph -----------------------------------
//El Generador se encarga de hacer un Graph en dataStructure, y tambien de crear su grafico
//Osea devuelve un InMemory_Graph y un GraphDraw_Manager con cada generate()
//Recibe como params: 
//type:str ---> tipo de generador que se va a utilzar
//area_limits:{x:[int,int],y:[int,int]}
//draw_data: {canvas:{"id","color"}, node:{"default_color","movility"},edge:(lo mismo q node)}

class GraphGenerator{
    
    min_dist:number
    node_size:number
    DataGenerator:RandGraphData_Generator
    InMemoryGraph:InMemory_Graph
    DrawGraph:GraphDraw_Manager

    constructor(type:string,area_limits:_2DCoords_Type,draw_data){
      
      let area_size={"width":area_limits.x[1]-area_limits.x[0],"height":area_limits.y[1]-area_limits.y[0]};
      this.min_dist=30; //fijamos esta minima distanica entre nodes
      
      this.node_size=get_nodeSize(area_size,420,this.min_dist);
      
      
      //Aplicamos una reduccion del limite "logico" para que el Graph no se salga de la pantalla(limite fisico)
      area_limits.y[1]=area_limits.y[1]-(this.node_size*0.25)
     
      //Llamar al construct de GraphData_Generator
      this.DataGenerator=new RandGraphData_Generator(type,area_limits,this.node_size,this.min_dist);
      
      //Definir el Graph para guardar la data generada
      this.InMemoryGraph;
      
      //Llamar al construct del Draw
      draw_data.node.size=this.node_size;
      this.DrawGraph=new GraphDraw_Manager(draw_data.canvas,draw_data.node,draw_data.edge);

    }

    generate(cant_nodes:number,cant_conex:number):[InMemory_Graph,GraphDraw_Manager]{
      //limpiar los antiguos elementos dibujados del Graph
      this.DrawGraph.clear();
      
      //generar graph_data
      let data=this.DataGenerator.generate(cant_nodes,cant_conex);
      

      //generar Graph_inMemory
      this.InMemoryGraph=new InMemory_Graph()
      this.InMemoryGraph.build_from(data);
      
      //renderizar el Draw con eso
      this.DrawGraph.render_from(data);
      
      return [this.InMemoryGraph,this.DrawGraph];
    }
}


//------------------------------------ Generador de Shortest Path ------------------------------------------------------

type ShortestPath_Data=Pick<shortestPath_data,"reached"|"dist">&shortestPath_drawData


const SHORT_PATH_ALGORITHMS={"Dijkstra":Dijkstra,"A*":A_Star};

let ShortPath_Algo_ref:any; //para guardar la no instanciada de Dijks o A_star
let Algorithm:ShortPath_Algorithm //para guardar la ya instanciada y que tenga los methodos


//Genera el shortest path, formateado para GameMode
function generate_shortPath(Graph:InMemory_Graph,start:string,end:string,
                            algo_option="Dijkstra"):ShortestPath_Data{
  
  ShortPath_Algo_ref=SHORT_PATH_ALGORITHMS[algo_option];
  Algorithm=new ShortPath_Algo_ref(Graph);
  
  //find_path
  let results=Algorithm.find_path(start,end); //recibimos {"reached":bool,"path":Array,"steps":Array,"dist":int};
  
  //modificamos para que los podamos usar en los GameMode
  let formatted_results=fromPath_2_Draw(Graph,results.path,results.steps); //recibimos {"path":Array,"steps":Array};

  return {...results,...formatted_results}; //Los juntamos y eliminamos las props repetidas(path, steps) anteriores
}

export {GraphGenerator,generate_shortPath};
export type {ShortestPath_Data};
export type {InMemory_Graph,GraphDraw_Manager};
import {RandGraphData_Generator} from "./GraphGenerator_tools/DataGraph_Generators/Generator.js";
import { InMemory_Graph } from "./GraphGenerator_tools/Graph_functionality/InMemory_Graph.js";
import {GraphDraw_Manager} from "./GraphGenerator_tools/Graphics/main_draws.js";
import { get_nodeSize } from "./GraphGenerator_tools/params_functions.js";
import {fromPath_2_Draw} from "./GraphGenerator_tools/formaters.js";

import { Dijkstra,A_Star } from "./GraphGenerator_tools/Graph_functionality/path_algorithms.js";


//------------------------- Generador de Random Graph -----------------------------------
//El Generador se encarga de hacer un Graph en dataStructure, y tambien de crear su grafico
//Osea devuelve un InMemory_Graph y un GraphDraw_Manager con cada generate()
//Recibe como params: 
//type:str ---> tipo de generador que se va a utilzar
//area_limits:{x:[int,int],y:[int,int]}
//draw_data: {canvas:{"id","color"}, node:{"default_color","movility"},edge:(lo mismo q node)}

export class GraphGenerator{
    constructor(type,area_limits,draw_data){
      
      let area_size={"width":area_limits.x[1]-area_limits.x[0],"height":area_limits.y[1]-area_limits.y[0]};
      this.min_dist=30; //fijamos esta minima distanica entre nodes
      
      this.node_size=get_nodeSize(area_size,420,this.min_dist);
      
      
      //Aplicamos una reduccion del limite "logico" para que el Graph no se salga de la pantalla(limite fisico)
      area_limits.y[1]=area_limits.y[1]-(this.node_size*0.25)
     
      //Llamar al construct de GraphData_Generator
      this.DataGenerator=new RandGraphData_Generator(type,area_limits,this.node_size,this.min_dist);
      
      //Definir el Graph para guardar la data generada
      this.inMemoryGraph;
      
      //Llamar al construct del Draw
      draw_data.node.size=this.node_size;
      this.DrawGraph=new GraphDraw_Manager(draw_data.canvas,draw_data.node,draw_data.edge);

    }

    generate(cant_nodes,cant_conex){
      //limpiar los antiguos elementos dibujados del Graph
      this.DrawGraph.clear();
      
      //generar graph_data
      let data=this.DataGenerator.generate(cant_nodes,cant_conex);
      

      //generar Graph_inMemory
      this.inMemoryGraph=new InMemory_Graph()
      this.inMemoryGraph.build_from(data);
      
      //renderizar el Draw con eso
      this.DrawGraph.render_from(data);
      
      return [this.inMemoryGraph,this.DrawGraph];
    }
}


//------------------------------------ Generador de Shortest Path ------------------------------------------------------


const SHORT_PATH_ALGORITHMS={"Dijkstra":Dijkstra,"A*":A_Star};

//Genera el shortest path, formateado para GameMode
export function generate_shortPath(Graph,start,end,algo_option="Dijkstra"){
  let ShortPath_Algo=SHORT_PATH_ALGORITHMS[algo_option];
  let Algorithm=new ShortPath_Algo(Graph);
  
  //find_path
  let results=Algorithm.find_path(start,end); //recibimos {"reached":bool,"path":Array,"steps":Array,"dist":int};
  
  //modificamos para que los podamos usar en los GameMode
  let formatted_results=fromPath_2_Draw(Graph,results.path,results.steps); //recibimos {"path":Array,"steps":Array};

  return {...results,...formatted_results}; //Los juntamos y eliminamos las props repetidas(path, steps) anteriores
}
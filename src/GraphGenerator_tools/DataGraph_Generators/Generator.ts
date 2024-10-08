//Opcion 2: Se crea una sola vez el generator, y luego se reutiliza ese.

//----- IMPORT Divisions generators -----
import type { DivisionsGenerator as DivisionsGenerator_type } from "./Divisions/DivGenerator.js";
import {AlignedRandom_DivisionsGenerator} from "./Divisions/DivGenerator.js";

//----- IMPORT Divisions classes or classes as types ---------------
import {DivisionsGraph} from "./Divisions/div_structures.js";
import type { Division_NodeAndGraph} from "./Divisions/div_structures.js";

//----- IMPORT Divisions make connect funcs ----------------------
import {makeInsideDiv_conex,makeInterDiv_conex} from "./Divisions/connections.js";

//----- IMPORT Node generator class ------------------
import {RandNode_Generator} from "./nodes.js";

//----- IMPORT used types & classes --------------------
import type {GeneratedGraphData} from "../graphData_classes.js";
import type { DataEdge,DataNode } from "../graphData_classes.js";

import type { _2DCoords_Type } from "./types.js";
//------------------------------------------------------

class RandGraphData_Generator{

    area_limits:{};
    node_size:number;
    nodes_x_div:number;
    min_dist:number;

    DivsGenerator:typeof DivisionsGenerator_type;
    NodesGenerator:typeof RandNode_Generator;

    constructor(option:string, area_limits:_2DCoords_Type, node_size:number, min_dist:number){
        this.area_limits=area_limits;
        this.node_size=node_size;
        this.nodes_x_div=10;
        this.min_dist=min_dist;

        const DIVSGENERATOR_OPTS={"aligned":AlignedRandom_DivisionsGenerator}; //star, circle, etc
        this.DivsGenerator=this.__get_DivsGenerator(option,DIVSGENERATOR_OPTS);

        this.NodesGenerator=RandNode_Generator;
    }

    generate(cant_nodes,cant_conex):GeneratedGraphData{
        let formatted_objs;
        
        let DivsGraph=new DivisionsGraph();
        
        let {divisions,interConex_condition}=this.__make_divs(this.DivsGenerator,this.area_limits,this.nodes_x_div,cant_nodes,this.node_size,this.min_dist);
        
        //añadir divs al DivsGraph
        divisions.forEach(div=>{
            DivsGraph.add_div(div);
        })
        
        //creamos los nodes
        let formatted_nodes=this.__make_nodes(this.NodesGenerator,divisions,this.node_size,this.min_dist);

        //creamos los edges internos de cada div
        let formatted_edges=this.__make_insideDiv_edges(divisions,cant_conex,this.node_size);
        
        //creamos los edeges entre divs
        formatted_edges=formatted_edges.concat(this.__make_interDiv_edges(DivsGraph,divisions,cant_conex,this.node_size,interConex_condition));

        formatted_objs=[...formatted_nodes,...formatted_edges]; //juntamos todos
    
        return formatted_objs;
    }
    
    //          type: typeof DivisionsGenerator (si no es any da erros por abstarct class)
    __make_divs(DivsGenerator:any,area_limits,nodes_x_div,total_nodes,node_size,min_dist){
        let DivsGen=new DivsGenerator(area_limits,nodes_x_div,total_nodes,node_size,min_dist) as DivisionsGenerator_type;

        let results=DivsGen.generate();
        
        return results
    }

    __make_nodes(NodesGenerator:typeof RandNode_Generator,divisions:Division_NodeAndGraph[],
                node_size,min_dist):DataNode[]{
        let created_nodes=[];
        
        for (let Div of divisions){
            let NodeGen=new NodesGenerator({"x":Div.coords.x,"y":Div.coords.y},node_size,min_dist,Div.max_dist,310);
            let [func_nodes,data_nodes]=NodeGen.generate(Div.cant_nodes);
            
           
            for (let i=0;i<func_nodes.length;i++){
                Div.add_node(func_nodes[i]);
                created_nodes.push(data_nodes[i]);
            }
        }
        
        return created_nodes;
    }

    __make_insideDiv_edges(divisions:Division_NodeAndGraph[],cant_conex,node_size):DataEdge[]{
        let maxDist_condition;
        let created_edges=[];
        
        let div_edges;
        for (let div of divisions){
            maxDist_condition=cant_conex* (div.max_dist*2) / 3;
            div_edges=makeInsideDiv_conex(div,div.get_nodes(),cant_conex,maxDist_condition,node_size);
            
            created_edges=created_edges.concat(div_edges);

        }
        
        return created_edges;
    }

    __make_interDiv_edges(DivsGraph:DivisionsGraph,divisions:Division_NodeAndGraph[],
                          cant_conex,node_size,interConex_cond):DataEdge[]{
        let cant_interConex;
        const cant_interConex_x_div={};
        
        //Define la cant de interconexiones x div, y genera los sideNodes para cada una
        for (let div of divisions){
            cant_interConex= div.curr_nodes<cant_conex ? div.curr_nodes : cant_conex;
            cant_interConex_x_div[div.value]=cant_interConex;    
            
            div.make_sideNodes(cant_interConex);
        
        }
        
        let created_edges=[];
        
        for (let div of divisions){
            cant_interConex=cant_interConex_x_div[div.value];
            created_edges=created_edges.concat(makeInterDiv_conex(DivsGraph,div,cant_interConex,node_size,interConex_cond));

        }
        return created_edges;
    }

    __get_DivsGenerator(option:string,divsGenerators_options:{}):typeof DivisionsGenerator_type{
        let DivsGenerator_choosed=divsGenerators_options[option];

        return DivsGenerator_choosed;
    }
}

export {RandGraphData_Generator};
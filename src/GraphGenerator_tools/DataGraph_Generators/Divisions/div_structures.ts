//DivisionsGraph
//Division_GraphNode
import { PriorQueue } from "../../../utils/pQueue.js";
import { Graph , Node } from "../../../utils/graph_base.js";

import type { RandNode } from "../nodes.js";
import type { _2DCoords_Type } from "../types.js";

class DivisionsGraph extends Graph{
    constructor(){
        super();
    }

    get_node(value:string):Division_NodeAndGraph{
        return super.get_node(value) as Division_NodeAndGraph;
    }
    
    add_div(new_div){
        super.add_node(new_div.value,new_div);
    }
}


class Division_NodeAndGraph extends Node{
    value:string;
    coords:_2DCoords_Type;
    possible_neighs:{};
    opositeSides_toConnect:{}

    cant_nodes:number;
    curr_nodes:number;
    max_dist:number;
    Graph:DivisionGraph;
    side_nodes:{ [key:string] : RandNode[] };
    available_nodes:{ [key:string] : RandNode[] };

    constructor(value:string,coords:_2DCoords_Type,cant_nodes:number,dist:number){
        super(value);
        //---------- Attrs Node -----------------------
        this.coords=coords; //este de ambos ponele
        this.possible_neighs={};
        this.opositeSides_toConnect={};
        
        //---------- Attrs Graph ------------------------
        this.cant_nodes=cant_nodes;
        this.curr_nodes=0;
        this.max_dist=dist;
        this.Graph=new DivisionGraph();

        this.side_nodes={}; //Los nodes q tenemos para conectar 
                            //con otra div en una direc {"direc":Arr}
        this.available_nodes={};//Los mismos nodes pero con la direc 
                                //opuesta para q la otra div pueda conectarse
                                //primero si quiere {"opositeDirec":Arr}
    
    }
    
    //------------------------ Funciones de Node ----------------------------------
    get_data(){
        return {"type":"division","value":this.value,"coords":this.coords};
    }
    
    //Elige los nodes mas cercanos, a cada una de sus divs vecinas.
    //Genera this.side_nodes;
    //Genera this.available_nodes
    make_sideNodes(cant_x_side:number){
        const opposite_sides=this.opositeSides_toConnect;
        
        for (let side of Object.keys(this.possible_neighs)){
           
            let sides=side.split("-"); //separamos por si venia un side compuesto de varias
                                       //sino queda una sola normal 
           
           this.side_nodes[side]=[];
           let opposite=opposite_sides[side];
           this.available_nodes[opposite]=[];
           
           let Pqueue=new PriorQueue();           
           
           for (let node of this.Graph.get_nodes()){
               let side_coords={"left":[this.coords.x[0],node.y_cor],"right":[this.coords.x[1],node.y_cor],
                                "top":[node.x_cor,this.coords.y[0]],"down":[node.x_cor,this.coords.y[1]]}
               let dist=0;
               
               sides.forEach(direc=>{ //en caso de ser compuesta suma ambas distancias
                dist+=this.__get_dist([node.x_cor,node.y_cor],side_coords[direc]);
               })
               Pqueue.add(node,dist);
           }
           
           //elegir cant nodes del Pqueue
           for (let i=0;i<cant_x_side;i++){
              let near_node=Pqueue.pop_from("end").obj;
              this.side_nodes[side].push(near_node);
              this.available_nodes[opposite].push(near_node);
           }
       }
    }
    get_sideNodes(){
        let sideNodes=[];
        for (let sid_nodes of Object.values(this.side_nodes)){
            sid_nodes.forEach(node=>{
                sideNodes.push(node);
            })
        }
        return sideNodes;
    }

    __get_dist(coords1,coords2){
        return Math.sqrt((coords2[0]-coords1[0])**2 + (coords2[1]-coords1[1])**2)
    }


    //------------------------ Funciones de Graph --------------------------------
    add_node(new_node:RandNode){
        this.Graph.add_node(new_node.value,new_node);
        this.curr_nodes++;
    }
    add_edge(nodeVal1,nodeVal2,height){
        this.Graph.add_edge(nodeVal1,nodeVal2,height);
    }

    remove_edge(nodeVal1,nodeVal2){
        this.Graph.remove_edge(nodeVal1,nodeVal2);
    }

    get_nodes(){
       return this.Graph.get_nodes();
    }
}

class DivisionGraph extends Graph{
    constructor(){
        super();
    }

    add_node(value:string,new_node:RandNode){
        super.add_node(value,new_node);
    }

    get_nodes():RandNode[]{
        return Object.values(this.nodes) as RandNode[];
    }
}

export {DivisionsGraph,Division_NodeAndGraph}
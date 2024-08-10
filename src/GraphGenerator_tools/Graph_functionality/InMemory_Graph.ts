//import { Dijkstra,A_Star } from "./path_algorithms.js";
import {Graph,Node} from "../../utils/graph_base.js";

import { DataNode,DataEdge } from "../graphData_classes.js";
import type { GeneratedGraphData } from "../graphData_classes.js";

class Coord_Node extends Node{
    
    x:number
    y:number

    constructor(value:any,x:number,y:number){
        super(value);
        this.x=x;
        this.y=y;
    }
}


class InMemory_Graph extends Graph{
    constructor(){
        super();
        //this.path_algorithms={"Dijkstra":Dijkstra,"A*":A_Star}
    };

    build_from(data:GeneratedGraphData){
       for (let obj of data){
           if (obj instanceof DataNode){

              super.add_node(obj.value,new Coord_Node(obj.value,obj.x_cor,obj.y_cor));
           }
           else if(obj instanceof DataEdge){
              let [value1,value2]=obj.value.split("-");
              
              super.add_edge(value1,value2,obj.height);
           }
       }
    };

    clear(){
        //
    }
}

export {InMemory_Graph,Coord_Node};
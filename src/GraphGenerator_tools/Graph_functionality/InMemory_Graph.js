//import Graph
import { Dijkstra,A_Star } from "./path_algorithms.js";
import {Graph,Node} from "../../utils/graph_base.js";

class Coord_Node extends Node{
    constructor(value,x,y){
        super(value);
        this.x=x;
        this.y=y;
    }
}

//Despues seguimos
export class InMemory_Graph extends Graph{
    constructor(){
        super();
        this.path_algorithms={"Dijkstra":Dijkstra,"A*":A_Star}
    };

    build_from(data){
       for (let obj of data){
           if (obj.type=="node"){

              let [x,y]=obj.value.split(",");
              [x,y]=[parseInt(x),parseInt(y)];

              super.add_node(obj.value,new Coord_Node(obj.value,x,y));
           }
           else if(obj.type=="edge"){
              let [value1,value2]=obj.value.split("-");
              
              super.add_edge(value1,value2,obj.height);
           }
       }
    };

    clear(){
        //
    }
}
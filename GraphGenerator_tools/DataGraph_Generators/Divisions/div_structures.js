//DivisionsGraph
//Division_GraphNode
import { PriorQueue } from "./extras.js";

export class DivisionsGraph extends Graph{
    constructor(){
        super();
    }
    
    add_div(new_div){
        super.add_node(new_div.value,new_div);
    }
}

export class Division_NodeAndGraph extends Node{
    constructor(value,coords,cant_nodes,dist,possible_neighs){
        super(value,coords,cant_nodes,possible_neighs);
        //---------- Attrs Node -----------------------
        this.coords=coords; //este de ambos ponele
        this.possible_neighs=possible_neighs;
        this.opositeSides_toConnect;
        
        //---------- Attrs Graph ------------------------
        this.cant_nodes=cant_nodes;
        this.curr_nodes=0;
        this.max_dist=dist;
        this.Graph=new DivisionGraph();
        this.side_nodes={}; //Para usarlos nosotros {"direc":Arr}
        this.available_nodes={}; //Para que los usen los vecinos {"opositeDirec":Arr}
    }
    
    //------------------------ Funciones de Node ----------------------------------
    get_data(){
        return {"type":"division","value":this.value,"coords":this.coords};
    }
    
    //Elige los nodes mas cercanos, a cada una de sus divs vecinas
    make_sideNodes(cant_x_side){
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
    add_node(new_node){
        this.Graph.add_node(new_node);
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

    add_node(new_node){
        super.add_node(new_node.value,new_node);
    }

    get_nodes(){
        return Object.values(this.nodes);
    }
}
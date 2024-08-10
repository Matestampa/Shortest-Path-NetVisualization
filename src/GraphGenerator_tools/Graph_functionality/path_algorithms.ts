//Priority Queue adaptado para ShortPath
import { PriorQueue } from "../../utils/pQueue.js";
import { Coord_Node, InMemory_Graph } from "./InMemory_Graph.js";

//------------------- TYPES --------------------------------

type stepsORpathArr_type=(string |`${string},${string}`)[]

type shortestPath_data={
    "reached":boolean
    "path":stepsORpathArr_type,
    "steps":stepsORpathArr_type,
    "dist":number
}

//------------------  Pqueue especifica Util  ----------------------

class ShortPath_pQueue extends PriorQueue{
    
    visited_nodes:{
        [key:string]:number
    }

    constructor(){
        super();
        this.visited_nodes={};
    }

    add(obj,cant,key){
        super.add(obj,cant,key);
        this.visited_nodes[obj.value]=cant;
    }
    update(obj,cant,key){
        super.update(obj,cant,key);
        this.visited_nodes[obj.value]=cant;
    }

    get_dist(node_value){
        return this.visited_nodes[node_value];
    }

    pop_from(option="end"){
        let poped=super.pop_from(option);
        delete this.visited_nodes[poped.obj.value];
        return poped;
    }
}

//-------------------------- Clase Padre -----------------------------------------
abstract class ShortPath_Algorithm{

    Graph:InMemory_Graph
    path:stepsORpathArr_type
    steps:stepsORpathArr_type
    
    start_node:Coord_Node
    end_node:Coord_Node

    constructor(Graph:InMemory_Graph){
      this.Graph=Graph;
      this.path=[];
      this.steps=[];
    }

    find_path(start:string,end:string):shortestPath_data{
        [this.start_node,this.end_node]=this.__check(start,end);

        const previouses={}; //los previos de cada uno, para poder hacer el camino despues
        const already_poped={}; //los que ya fueron sacados de la Pqueue, y no deberian volver a entrar.
        let Pqueue=new ShortPath_pQueue();

        Pqueue.add(this.p__build_obj2Queue(this.start_node,undefined,0),0,start);
        previouses[start]=undefined;
        
        let first=true;

        while(!Pqueue.is_empty()){
           let poped=Pqueue.pop_from("end");
           let poped_obj=poped.obj;
           //let poped_dist=poped.cant;
           let poped_dist=this.p__get_popedDist(poped);
           
           if (first==true){first=false}
           else{
               this.steps.push(`${poped_obj.prev}-${poped_obj.value}`);
           }
           this.steps.push(poped_obj.value);

           already_poped[poped_obj.value]=1;
           
           //---- Si damos con el end hacemos return----
           if (poped_obj.value==end){return {"reached":true,"path":this.__path(end,previouses),"steps":this.steps,"dist":Math.ceil(poped_dist)}};

           let node=this.Graph.get_node(poped_obj.value);
           
           for (let neigh of node.get_neighs()){
               
               if (neigh.value!=poped_obj.prev){
                   
                   //hacer un get del Pqueue del current neigh
                   let neigh_currDist=Pqueue.get_dist(neigh.value);
                  
                   //ver si no esta en la lista, y si no es uno de los que salio
                   if (previouses[neigh.value]==undefined && already_poped[neigh.value]==undefined){
                       Pqueue.add({"value":neigh.value,"prev":poped_obj.value},100000,neigh.value);
                       previouses[neigh.value]=poped_obj.value;
                       neigh_currDist=100000;
                   }
                   
                   let new_dist=this.p__get_new_neighDist(poped_dist,neigh);
                   if (new_dist<neigh_currDist){
                       //Pqueue.update({"value":neigh.value,"prev":poped_obj.value},new_dist,neigh.value);
                       let obj2Queue=this.p__build_obj2Queue(neigh,poped_obj.value,poped_dist);
                       new_dist+=this.p__add_cost(neigh,poped_dist);

                       Pqueue.update(obj2Queue,new_dist,neigh.value)
                       previouses[neigh.value]=poped_obj.value;
                   }    
               }
           }
        }
        //Si llegamos aca significa que no hay path.
        return {"reached":false,"path":[],"steps":this.steps,"dist":0};

    }
    
    //Chequea si los nodos ,pasados para el path, estan en el Grafo y de ser asi los devuelve
    private __check(start_value:string,end_value:string):[Coord_Node,Coord_Node]{ 
        let start_node,end_node;
        try{
            start_node=this.Graph.get_node(start_value);
        }
        catch{throw new Error("The start node doesnt belong to the Graph")};
        try{
            end_node=this.Graph.get_node(end_value);
        }
        catch{throw new Error("The end node doesnt belong to the Graph")};
        
        return [start_node,end_node];
    }
    
    //Construye el path, una vez encontrado el final.
    private __path(end:string,previouses:{}):stepsORpathArr_type{ 
        const path=[];
        let curr=end;
        let prev;
        
        while (previouses[curr]!=undefined){
           path.push(curr);
           prev=previouses[curr];
           path.push(`${prev}-${curr}`);
           curr=prev;    
        }
      
        path.push(curr);
        return path.reverse();
    }
    
    //Obtiene la dist del element sacado del Pqueue.
    //Puede elegir si usar la cant del Pqueue o si usa otro attr propio del poped.obj.
    abstract p__get_popedDist(poped:{}):number
    
    //Determina la nueva dist con la que se llega a un node
    abstract p__get_new_neighDist(poped_dist:number,neigh):number
    
    //Contruye el obj que se debe meter en la Pqueue.
    //Si o si debe contener {"value":,"prev"}
    p__build_obj2Queue(neigh,poped_value:string,poped_dist:number){ //obj {"value":str,"prev":str,....los que se agreguen}
    }
    
    //Costo para agregarle a la nueva dist con la que se llega a un node.
    abstract p__add_cost(neigh,poped_dist:number):number
}

//---------------- Clases individuales ---------------------------------
class Dijkstra extends ShortPath_Algorithm{
    constructor(Graph:InMemory_Graph){
        super(Graph);
    }

    p__get_popedDist(poped):number{
        return poped.cant;
    }

    p__get_new_neighDist(poped_dist:number,neigh):number{
        return poped_dist+neigh.height;
  
    }

    p__build_obj2Queue(neigh,poped_value:string,poped_dist:number){
        return {"value":neigh.value,"prev":poped_value};
    }

    p__add_cost(neigh,poped_dist:number):number{
        return 0;
    }
}

class A_Star extends ShortPath_Algorithm{
    constructor(Graph:InMemory_Graph){
        super(Graph);
    }
    p__get_popedDist(poped):number{
        return poped.obj.origDist;
    }

    p__get_new_neighDist(poped_dist:number,neigh):number{
        return poped_dist+neigh.height;
    }

    p__build_obj2Queue(neigh,poped_value:string,poped_dist:number){
        let neigh_height;
        if (neigh.height){neigh_height=neigh.height}else{neigh_height=0}
        
        return {"value":neigh.value,"prev":poped_value,"origDist":neigh_height+poped_dist};
    }
    
    //En este caso le metemos un cost basado en la distancia con respecto al end.
    p__add_cost(neigh,poped_dist:number):number{
        let neigh_node=this.Graph.get_node(neigh.value) as Coord_Node;
        let heuristic=this.__get_dist([this.end_node.x,this.end_node.y],[neigh_node.x,neigh_node.y]);
        return poped_dist+neigh.height+heuristic;
    }

    private __get_dist(coords1,coords2):number{
        return Math.round(Math.sqrt((coords2[0]-coords1[0])**2 + (coords2[1]-coords1[1])**2));
    }
}

export type {ShortPath_Algorithm,shortestPath_data};
export {Dijkstra,A_Star};
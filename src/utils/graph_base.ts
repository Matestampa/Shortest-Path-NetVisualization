//Aca va la data structure basica de grafo

class Edge{

    value:any;
    height:number;
    next!:Edge;

    constructor(value:any,height:number){
        this.value=value;
        this.height=height;

        this.next;

    }
}


class Edges_List{

    /*head!:Edge
    last!:Edge*/
    head:(Edge|undefined);
    last:(Edge|undefined);

    constructor(){
        this.head;
        this.last;
    }

    append(value:any,height:number){
        let new_node=new Edge(value,height);
        if (this.head==undefined){
            this.head=new_node;
            this.last=new_node;
        }
        else{
            this.last.next=new_node;
            this.last=new_node;
        }
    }

    remove(value:any){
        let prev;
        let actual=this.head;

        while (true){
            if (actual.value==value){
                if (prev==undefined){ //si es el primero
                    if (actual.next!=undefined){
                        this.head=actual.next;
                    }
                    else{
                        this.head=undefined;
                    }
                }
                else if (actual.next==undefined){//si es el ultimo
                    prev.next=undefined;
                }

                else{ //si esta en medio de dos
                    prev.next=actual.next
                }

                //habria que hacer delete actual (pero no podemos)
                break
            }
            else{
                prev=actual;
                actual=actual.next;
            }
        }
    }

    get(value:any):(Edge|false){
        let actual=this.head;
        while (actual!=undefined){
            if (actual.value==value){
                return actual;
            }
            actual=actual.next;
        }
        return false;
    }

    get_all():Edge[]{
        let list=[];
        let actual=this.head;

        while (actual!=undefined){
            list.push(actual);
            actual=actual.next;
        }
        return list;
    }

    search(value:any):boolean{
        let actual=this.head;
        while (actual!=undefined){
            if (actual.value==value){
                return true;
            }
            actual=actual.next;
        }
        return false;
    }

    show(){
        let actual=this.head;
        let string="";

        while (actual!=undefined){
            string+=`------>${actual.value}/${actual.height}`;
            actual=actual.next;
        }
        return string;
    }
}


class Node{
    
    value:any;
    neighs:Edges_List;

    constructor(value:any){
        this.value=value;
        this.neighs=new Edges_List();
    }

    connect(value:any,height:number){
        this.neighs.append(value,height);
    }

    disconnect(value:any){
        this.neighs.remove(value);
    }
    
    get_neigh(value:any){
        return this.neighs.get(value);
    }

    get_neighs(only_values=false){
        let neighs=this.neighs.get_all();
        if (only_values==true){
            let values=[];
            for (let i of neighs){
                values.push(i.value);
            }
            return values;
        }
        else{
            return neighs;
        }
    }

    has_neigh(value:any):boolean{
        return this.neighs.search(value);
    }

    show_neighs(){
        console.log(`${this.value}:${this.neighs.show()}`);
    }
}


type NodesMap_type={
    [key:string]:Node
}

class Graph{
    
    nodes:NodesMap_type

    constructor(){
        this.nodes={};
    }
    
    //el node_obj que se pase debe ser si o si de algun tipo Node().
    add_node(value:string,node_obj=undefined){
        if (this.nodes[value]==undefined){
            if (node_obj){
                this.nodes[value]=node_obj;
            }
            else{
                this.nodes[value]=new Node(value);
            }
        }
        else{
            throw new Error(`Node: '${value}' already exists`);
        }
    }

    remove_node(value:string){
        let neighs=this.nodes[value].get_neighs();

        for (let i of neighs){
            this.nodes[i.value].disconnect(value);
        }

        delete this.nodes[value];
    }

    get_node(value:string):Node{
        if (this.nodes[value]==undefined){
            throw new Error(`Node: '${value}' doesnt exist`)
        }
        return this.nodes[value];
    }

    add_edge(nodeVal_1:any,nodeVal_2:any,height=0){
        this.nodes[nodeVal_1].connect(nodeVal_2,height);
        this.nodes[nodeVal_2].connect(nodeVal_1,height);
    }

    remove_edge(nodeVal_1:string,nodeVal_2:string){
        this.nodes[nodeVal_1].disconnect(nodeVal_2);
        this.nodes[nodeVal_2].disconnect(nodeVal_1);
    }

    get_edge(nodeVal_1:string,nodeVal_2:string){
        if (this.nodes[nodeVal_1]==undefined){
            throw new Error("This edge does not exists");
        }
        let node1=this.nodes[nodeVal_1];
        
        let neigh=node1.get_neigh(nodeVal_2);
        
        if (neigh){
            return {"node1":node1,"node2":this.nodes[nodeVal_2],"height":neigh.height};
        }
        else{throw new Error("This edge does not exists")};

    }

    show(){
      for (let i of Object.keys(this.nodes)){
        this.nodes[i].show_neighs();
      }
    }
}

export {Node,Graph};
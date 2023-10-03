import {PriorQueue} from "../../../utils/pQueue.js";

function get_distance(node1,node2){
    return Math.sqrt((node2.x_cor-node1.x_cor)**2 + (node2.y_cor-node1.y_cor)**2);
}

//----------------------- Conection de nodes dentro de una Division------------------------------------------------
export function makeInsideDiv_conex(div,nodes,conex_x_node,maxDist_condition,node_size){
    let num_connections={};
    let max_connections={};
    let new_edges=[];
    let val;
    
    //inicializamos en 0 las num_connections actuales de c/u
    //inicializamos con un valor random (conex_x_node o conex_x_node+1) la max_connection que puede tener c/u
    nodes.forEach(node=>{
        num_connections[node.value]=0;
        val=Math.round(Math.random() * (conex_x_node+1-conex_x_node) + conex_x_node-0.3)
        max_connections[node.value]=val
    });
    
    for (let node of nodes){ //por cada node
        
        let Pqueue=new PriorQueue();
        let new_dist;
        
        if (num_connections[node.value]<max_connections[node.value]){ //si todavia no esta full conectado
            
            for (let possible of nodes){
                //si no es el mismo, ni lo tiene como vecino, ni alcanzo sus max_connections
                if (possible!=node && !node.has_neigh(possible.value) && num_connections[possible.value]<max_connections[possible.value]){//si no es el mismo, y no lo tiene como vecino  
                  new_dist=get_distance(node,possible)-node_size; //obtenemos dist y restamos el nodeSize
                  Pqueue.add(possible,parseInt(new_dist)); //se agrega el node a la cola de ordenamiento
                  //-----------------------------------
               }
           }
           //Se busca que se satisfagan sus max_connections aca
           while (num_connections[node.value]<max_connections[node.value]){
                if (Pqueue.is_empty()==false){ //si todavia quedan opciones
                    let min=Pqueue.pop_from("end"); //sacamos el mas pequeño (la distancia mas corta)

                    if (min.cant<maxDist_condition+node_size){ //la dist sacada debe pasar la cond para que se de la conex
                    num_connections[node.value]++;
                    num_connections[min.obj.value]++;
                    
                    let edge_value=`${node.value}-${min.obj.value}`
                    new_edges.push({"type":"edge","value":edge_value,"height":min.cant});
                    
                    div.add_edge(node.value,min.obj.value,min.cant);
                    }
                }
                
                else{ //si no hay mas elementos nos vamos
                    break;
                }
           }
        }
        
    }
    return new_edges;
}

//---------------------------- Conection de Nodes entre Divisions --------------------------
export function makeInterDiv_conex(DivGraph,div,cant_conex,node_size,isValid_condition){
    let new_edges=[];
   
    for (let direc of Object.keys(div.possible_neighs)){
        
        let divNeigh=DivGraph.get_node(div.possible_neighs[direc]);
        
        if (!div.has_neigh(divNeigh.value)){ //si todavia no estan conectadas
            let div_nodes=div.side_nodes[direc];
            let divNeigh_nodes=divNeigh.available_nodes[direc];

            let still_unconnected=[]; //van a ir los indices de los nodes(de la otra div)(divNeigh_nodes) para conectar disponibles
            divNeigh_nodes.forEach((value,index)=>{ //aca lo llenamos
                still_unconnected.push(index);
            })
            
            let conexControl=0; //controla que si el divOrigen tiene mas nodes que el neigh, siga pudiendo conectarse.
            let pasadas=0; //iteraciones
            let sideConex_created=0; //cuenta la cantidad de conex que se crearon en esta direc o side
            for (let node of div_nodes){ //por cada node de la curr div
                let Pqueue=new PriorQueue();
                
                if (conexControl==divNeigh_nodes.length){ //si las creadas igualaron a la cantNodes del neigh
                    conexControl=0;
                    divNeigh_nodes.forEach((value,index)=>{ //aca lo llenamos
                       still_unconnected[index]=index;
                    })
                } 

                still_unconnected.forEach((indexValue)=>{
                    if (indexValue!=undefined){
                    let canConnect_Node=divNeigh_nodes[indexValue]; //obtenenmos el node por su index
                    let dist=get_distance(node,canConnect_Node)-node_size; //calculamos dist
                    Pqueue.add(indexValue,dist); //metemos al Pqueue con su index como "obj"
                    }
                })

                let nearest_chossed=Pqueue.pop_from("end"); //sacamos el mas cercano
                let index=nearest_chossed.obj; //agarramos index
                let nearest_node=divNeigh_nodes[index]; //obtenemos node
                let dist=nearest_chossed.cant
                
                pasadas++;
                
                if (!isValid_condition(dist,div,divNeigh,cant_conex,node_size)){ //si no cumple la condition no lo conectamos 
                    
                    if (div_nodes.length-pasadas==1 && sideConex_created==0){} //pero si esta llegando casi al final
                                                                                //y todavia no tiene ninguno, lo conectamos
                    else{ //si no es el caso, sigue la primera condicion y no conecta
                        continue;
                    }
                }
            
                //hacemos el edge
                let edge_value=`${node.value}-${nearest_node.value}`;
                new_edges.push({"type":"edge","value":edge_value,"height":dist});
                
                //añadimos edge al DivisionsGraph
                DivGraph.add_edge(div.value,divNeigh.value,dist);
                
                still_unconnected[index]=undefined;//sacamos el index que obtuvimos del Pqueue, de los diponibles para conectar
                conexControl++;
                sideConex_created++;
            }
        }
    }
    return new_edges;
}
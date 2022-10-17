//Opcion 2: Se crea una sola vez el generator, y luego se reutiliza ese.

import {AlignedRandom_DivisionsGenerator} from "./Divisions/DivGenerator.js";
import { DivisionsGraph } from "./Divisions/div_structures.js";
import {RandNode_Generator} from "./nodes.js";
import {makeInsideDiv_conex,makeInterDiv_conex} from "./Divisions/connections.js";

export class RandGraphData_Generator{
    constructor(type, area_limits, node_size, min_dist){
        this.area_limits=area_limits;
        this.node_size=node_size;
        this.nodes_x_div=10;
        this.min_dist=min_dist;

        const divsGenerators_options={"aligned":AlignedRandom_DivisionsGenerator}; //star, circle, etc
        this.DivsGenerator=divsGenerators_options[type];
        this.NodesGenerator=RandNode_Generator;
    }

    generate(cant_nodes,cant_conex){
        let formatted_objs;
        
        let DivsGraph=new DivisionsGraph();
        
        let [divisions,interConex_Condition]=this.__make_divs(this.DivsGenerator,this.area_limits,this.nodes_x_div,cant_nodes,this.node_size,this.min_dist);
        
        //añadir divs al DivsGraph
        divisions.forEach(div=>{
            DivsGraph.add_div(div);
        })
        
        //creamos los nodes
        let formatted_nodes=this.__make_nodes(this.NodesGenerator,divisions,this.node_size,this.min_dist);
        
        //creamos los edges internos de cada div
        let formatted_edges=this.__make_insideDiv_edges(divisions,cant_conex,this.node_size);
        
        //creamos los edeges entre divs
        formatted_edges=formatted_edges.concat(this.__make_interDiv_edges(DivsGraph,divisions,cant_conex,this.node_size,interConex_Condition));
        
        formatted_objs=[...formatted_nodes,...formatted_edges]; //juntamos todos
    
        return formatted_objs;
    }

    __make_divs(DivsGenerator,area_limits,nodes_x_div,total_nodes,node_size,min_dist){
        let DivsGen=new DivsGenerator(area_limits,nodes_x_div,total_nodes,node_size,min_dist);

        let results=DivsGen.generate();
        
        return [results.divisions,results.interConex_condition];
    }

    __make_nodes(NodesGenerator,divisions,node_size,min_dist){
        let created_nodes=[];
        
        for (let Div of divisions){
            let NodeGen=new NodesGenerator({"x":Div.coords.x,"y":Div.coords.y},node_size,min_dist,Div.max_dist,310);
            let new_nodes=NodeGen.generate(Div.cant_nodes);
            
            new_nodes.forEach(node=>{
                    Div.add_node(node);
                    created_nodes.push(node.get_data());
            })
        }
        console.log(`Nodes created:${created_nodes.length}`);
        return created_nodes;
    }

    __make_insideDiv_edges(divisions,cant_conex,node_size){
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

    __make_interDiv_edges(DivsGraph,divisions,cant_conex,node_size,interConex_cond){
        let cant_interConex;
        const cant_interConex_x_div={};
        
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
}
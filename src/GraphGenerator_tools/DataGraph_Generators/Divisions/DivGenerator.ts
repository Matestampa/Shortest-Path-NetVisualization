import {Division_NodeAndGraph} from "./div_structures.js";
import type { _2DCoords_Type } from "../types.js";

//------------------- Utilities functions --------------------------------------

function get_maxCantNodes(screen={"width":150,"height":150},nodeSize=20,max_dist=30){
    let mid_nodeSize=Math.floor(nodeSize/2);
    let cant_nodes=(screen.width*screen.height) / (Math.PI * (mid_nodeSize+(max_dist/2))**2);

    return Math.round(cant_nodes);
}

function get_maxDist(screen={"width":324,"height":324},node_size=20,cant_nodes=10){
    let mid_nodeSize=Math.floor(node_size/2);
    let max_dist=Math.sqrt(((screen.width*screen.height)/ cant_nodes)/ Math.PI) - mid_nodeSize;

    return Math.floor(max_dist*2);
}

//---------- Clase Base -------------------------



//Type de la funcion de interconex condition, q debe devolver el generator
type interConex_CondFuncType=(dist,divOrigin,divDest,cant_conex,node_size)=>boolean;

abstract class DivisionsGenerator{
    limit_x1:number
    limit_x2:number
    limit_y1:number
    limit_y2:number

    nodes_x_div:number;
    total_nodes:number;
    node_size:number;
    div_dist:number; //dist entre divs
    max_dist:number; //dist tope para que quepa un node


    constructor(totalArea_limits:_2DCoords_Type,nodes_x_div,
               total_nodes,node_size,max_dist){
        
        [this.limit_x1,this.limit_x2]=[totalArea_limits.x[0],totalArea_limits.x[1]];
        [this.limit_y1,this.limit_y2]=[totalArea_limits.y[0],totalArea_limits.y[1]];

        this.nodes_x_div=nodes_x_div;
        this.total_nodes=total_nodes;
        this.node_size=node_size;
        this.div_dist=node_size+10;
        this.max_dist=max_dist;
    }

    generate(){
        const generated_divs=this.p_generate();

        generated_divs.forEach(div=>{
            div.possible_neighs=this.p_make_neighs(div);
            div.opositeSides_toConnect=this.p_get_opositeSides();
            
            //debe tener estas dos si o si
            if (div.possible_neighs==undefined || div.opositeSides_toConnect==undefined){
                throw Error("The division does not have the neccesary atributtes to be connected")
            }
        })
        
        let interConex_condition=this.p_get_interConex_condition();

        return {"divisions":generated_divs,"interConex_condition":interConex_condition};

    }
    
    //Si o si debe usarlo el p_generate de cualquier clase
    __make_div(value:string,coords:_2DCoords_Type,
              toPut_nodes:number):{"obj":Division_NodeAndGraph,"cant_nodes":number}{ 
        
        let div_width=Math.abs(coords.x[1]-coords.x[0]);
        let div_height=Math.abs(coords.y[1]-coords.y[0]);
        let cant_nodes;
        let max_dist;

        //Ver cuantos nodes entran en el tamaño dado, con la minima distancia
        let maxNodes=get_maxCantNodes({"width":div_width,"height":div_height},this.node_size,this.max_dist);
       
        if (maxNodes<=toPut_nodes){ //si entran menos o igual de los que se necesitan
            if (maxNodes<=1){ return {"obj":undefined,"cant_nodes":0} } //si entran <=1 no es valida la div
           
            cant_nodes=maxNodes;
            max_dist=this.max_dist;
        }
        else{ //si entran mas
            //Vemos hasta que dist le podemos poner
            max_dist=get_maxDist({"width":div_width,"height":div_height},this.node_size,toPut_nodes)-20; //le bajamos un tok
            cant_nodes=toPut_nodes;
        }
        
        let div_obj=new Division_NodeAndGraph(value,coords,cant_nodes,max_dist); //creamos una nueva div Instance

        return {"obj":div_obj,"cant_nodes":cant_nodes};

    }
    
    //------------------ Personalizadas y obligatorias de c/u -------------------
    abstract p_generate():Division_NodeAndGraph[];

    abstract p_make_neighs(div:Division_NodeAndGraph):{[key:string]:string}
        //debe retornar un object {side:divNeigh_value,otroSide:divNeighVal} por cada Division
    
    abstract p_get_opositeSides():{[key:string]:string}
    //debe retornar un object {side:su opuesto,......} por cada Division
    //Sirve para que luego la div y el proceso de interConex determinen que nodes se conectan

    abstract p_get_interConex_condition():interConex_CondFuncType
        //debe retornar un callback que tenga si o si los argumentos (dist,divOrigin,divDest,cant_conex,node size)
        //el mismo debe contener dentro una condicion y ,retornar true(si se cumple) o false(si no se cumple)
}

//--------------- Clases individuales ----------------------------

//Types de params q usa "AlignedRandom" para direccionar la generacion de divs
type generationDirec_params={
    "limit_x1":number,"limit_y1":number,"limit_x2":number,"limit_y2":number,
    "direction_x":1|-1,"direction_y":1|-1
}


class AlignedRandom_DivisionsGenerator extends DivisionsGenerator{
    
    div_size:{"width":number,"height":number};
    opositeSides:{};
    interConex_cond:interConex_CondFuncType;

    generated_divValues:{}
    params:generationDirec_params


    constructor(totalArea_limits:_2DCoords_Type,nodes_x_div,
                total_nodes,node_size,max_dist){        
        
        super(totalArea_limits,nodes_x_div,total_nodes,node_size,max_dist)
        
        this.div_size=this.__calc_divSize(totalArea_limits,nodes_x_div,total_nodes,this.div_dist,max_dist);
        
        //---------------- Props a retornar ------------------------------------

        //Se definen los opposite sides de este generator
        this.opositeSides={"left":"right","right":"left","top":"down","down":"top"};
        
        //Se define la func de interconex condition de este generator
        this.interConex_cond=(dist,divOrigin,divDest,cant_conex,node_size)=>{
            let condition=cant_conex * (divOrigin.max_dist+20+divDest.max_dist)/3;
            
            if (dist>condition){return false}
            else{return true}
        };

        
    }
    
    p_generate():Division_NodeAndGraph[]{
        let generated_divs=[];
        let extra_divs=[];
        let restant_nodes=this.total_nodes; //los que nos quedan por meter
        this.generated_divValues={}; //metemos los values ya generados (se usan luego para determinar los neighs)
        
        
        //eleccion random del punto de inicio de generacion
        let options=["topLeft","topRight","bottomLeft","bottomRight"];

        let option_selected=options[Math.floor(Math.random()*options.length)];
    
        let params=this.__get_params(option_selected); //nos dan lo necesario para que funcione en cada caso.
        
        //Limites generales (independientes de params)
        let genLimit_x=this.limit_x2;
        let genLimit_y=this.limit_y2;
        
        //Contadores para comparar con los de arriba y ver si hay que parar de generar (independientes de params)
        let genLimit_countX=0;
        let genLimit_countY=this.div_size.height+this.div_dist;
        
        //Cuanto se mueve c/u (indepeendientes de params)
        let move_x=this.div_size.width;
        let move_y=this.div_size.height;

        //Vars que usamos para ir modificando las coords
        let cursor_x=params.limit_x1;
        let cursor_y=params.limit_y1;

        let x1=params.limit_x1;
        let y1=params.limit_y1;
        let x2=0; //0 para poner algun numero
        let y2=0;
        
        //para manejar el value de cada div (independientes de params)
        let value_x=0;
        let value_y=0;

        let last_one=false;
        let limit=0;
        
        while (true){
           //################## PARTE DE COORDS #####################################
            x1=cursor_x;
            x2=cursor_x + (move_x * params.direction_x);
            
            y1=cursor_y;
            y2=cursor_y+ (move_y * params.direction_y);

            genLimit_countX+=move_x + this.div_dist;
            
            let final_value=`${value_y},${value_x}`;
            
            //-------------- chequear y ----------------------------------
            if (genLimit_countY>=genLimit_y){
                y2=params.limit_y2;
                genLimit_countY=genLimit_y;

            }
            
            //-----------------chequear x -------------------------
            if (genLimit_countX>=genLimit_x){
                
                if (genLimit_countY==genLimit_y){last_one=true}; //clave para que termine
                
                x2=params.limit_x2;
                
                cursor_x=params.limit_x1;
                cursor_y=y2 + (this.div_dist * params.direction_y); //aplicamos dist entre div

                value_x=0;
                value_y++;

                genLimit_countX=0;
                genLimit_countY+= move_y + this.div_dist
                
                if (genLimit_countY>genLimit_y){genLimit_countY=genLimit_y};
               
            }

            else{
                cursor_x=x2 + (this.div_dist * params.direction_x); //aplicamos dist entre div
                value_x++;

            }

            //Pasar las coords a enteros
            [x1,x2]=[Math.floor(x1),Math.floor(x2)];
            [y1,y2]=[Math.floor(y1),Math.floor(y2)];
            
            //############ PARTE DE NODES CHECK Y MAKE DIV################################
            //------------ chequear nodes suficientes -----------------
            let rest;
            
            if (restant_nodes-this.nodes_x_div>=0 || restant_nodes<=1){ //si quedan suficientes para meter otro pack de nodes_x_div
                rest=this.nodes_x_div;
            }
            
            else{ //si no metemos, los que nos quedan
                rest=restant_nodes%this.nodes_x_div;
            }
                
            //---------------- hacer div -----------------------------
            let new_div=this.__make_div(final_value,{"x":this.__order_coords(x1,x2),"y":this.__order_coords(y1,y2)},rest);
                
            if (new_div.obj){ //si se hizo una div valida
                if (restant_nodes>=1){
                    generated_divs.push(new_div.obj);
                    restant_nodes-=new_div.cant_nodes; //le restamos a los nodes que nos quedan
                }
                else{
                    extra_divs.push(new_div.obj);
                }
                this.generated_divValues[new_div.obj.value]=1;
            }

            if (last_one==true){break}; //si es el ultimo nos vamos
            
            //if (limit>20){break};
            //limit++;
        
        }   
        
        //-------------------- Repartir los nodes con las extra_divs -----------------
        for (let i=0;i<extra_divs.length;i++){
            let toFill_nodes=extra_divs[i].cant_nodes;
            extra_divs[i].cant_nodes=0;
            for (let div of generated_divs){
                if (toFill_nodes){
                    extra_divs[i].cant_nodes++;
                    div.cant_nodes-=1;
                    toFill_nodes-=1;
                }
                else{break}
            }
            extra_divs[i]=this.__make_div(extra_divs[i].value,{"x":extra_divs[i].coords.x,"y":extra_divs[i].coords.y},extra_divs[i].cant_nodes).obj;

        }

        generated_divs=generated_divs.concat(extra_divs);

        
        this.params=params; //ponemos global los params para que se puedan usar en p_make_neighs()
        
        return generated_divs;
    }
    
    p_make_neighs(div:Division_NodeAndGraph):{[key:string]:string}{
        return this.__get_neighs(div.value,this.params.direction_x,this.params.direction_y);
    }

    p_get_opositeSides():{[key:string]:string}{
        return this.opositeSides;
    }

    p_get_interConex_condition():interConex_CondFuncType{
        return this.interConex_cond;
    }
    
    //----------------- Privadas propias -------------------------------------------
    private __calc_divSize(totalLimits,nodes_x_div,total_nodes,
                          div_dist,min_dist):{"width":number,"height":number}{
        
        let total_size={"width":totalLimits.x[1]-totalLimits.x[0],"height":totalLimits.y[1]-totalLimits.y[0]};
        
        let cant_divs=Math.ceil(total_nodes/nodes_x_div);
        
        let initial_divSize=Math.floor(Math.sqrt((total_size.width*total_size.height)/(cant_divs)));
        
        let div_size={"width":initial_divSize,"height":initial_divSize}
    
        //------------ width ------------
        let side_cant=(total_size.width+min_dist)/(div_size.width+min_dist);
    
        let cantWidth_divs=Math.ceil(side_cant);
        if (side_cant>cant_divs){
           side_cant=Math.floor(side_cant);
           let toModule=(side_cant*div_size.width+(side_cant-1)*div_dist);
           let toAgregate=Math.floor(total_size.width%toModule)/side_cant;
           cantWidth_divs-=1;
           div_size.width+=toAgregate;
        }
    
        //------------ height ----------------------------
        side_cant=(total_size.height+min_dist)/(div_size.height+min_dist);
        let cantHeight_divs=Math.ceil(cant_divs/cantWidth_divs);
    
        if (side_cant>cantHeight_divs){
           side_cant=Math.floor(side_cant);
           let toModule=(side_cant*div_size.height+(side_cant-1)*div_dist);
           let toAgregate=Math.floor(total_size.height%toModule)/side_cant;
    
           div_size.height+=toAgregate;
        }

        return div_size;
    }
    
    //Obtener params de generationDirec, segun por q parte se quiera empezar 
    //a generar (option)
    private __get_params(option="topLeft"):generationDirec_params{
      let topLeft={"limit_x1":this.limit_x1,"limit_y1":this.limit_y1,"limit_x2":this.limit_x2,"limit_y2":this.limit_y2,
                   "direction_x":1,"direction_y":1};
      
      let topRight={"limit_x1":this.limit_x2,"limit_y1":this.limit_y1,"limit_x2":this.limit_x1,"limit_y2":this.limit_y2,
                    "direction_x":-1,"direction_y":1};
      
      let bottomLeft={"limit_x1":this.limit_x1,"limit_y1":this.limit_y2,"limit_x2":this.limit_x2,"limit_y2":this.limit_y1,
                    "direction_x":1,"direction_y":-1};
      
      let bottomRight={"limit_x1":this.limit_x2,"limit_y1":this.limit_y2,"limit_x2":this.limit_x1,"limit_y2":this.limit_y1,
                    "direction_x":-1,"direction_y":-1};
      
     let params={"topLeft":topLeft,"topRight":topRight,"bottomLeft":bottomLeft,"bottomRight":bottomRight};

      return params[option];
    }

    private __order_coords(coord1:number,coord2:number):[number,number]{
        if (coord1<coord2){
            return [coord1,coord2];
        }
        else{
            return [coord2,coord1];
        }
    }
    
    //Obtener neigh de cada direccion de una div
    private __get_neighs(value,direc_x,direc_y):{[key:string]:string}{ 

        let directions={"left":{"move":"column","cant":direc_x*(-1)},
                        "right":{"move":"column","cant":direc_x},
                        "top":{"move":"row","cant":direc_y*(-1)},
                        "down":{"move":"row","cant":direc_y}};
        
        let [initValue_row,initValue_column]=value.split(",");
        [initValue_row,initValue_column]=[Math.floor(initValue_row),Math.floor(initValue_column)]
        
        let neighs={};
        for (let direc of Object.keys(directions)){
            let [value_row,value_column]=[initValue_row,initValue_column];

            if (directions[direc].move=="column"){
                value_column+=directions[direc].cant;
            }
            if (directions[direc].move=="row"){
                value_row+=directions[direc].cant;
            }

            let neigh_value=`${value_row},${value_column}`;
            if (this.generated_divValues[neigh_value] && neigh_value!=value){ //si existe
                neighs[direc]=neigh_value;
            }
        }
        return neighs;
    }
}

export {AlignedRandom_DivisionsGenerator};
export type{interConex_CondFuncType};
export {DivisionsGenerator};
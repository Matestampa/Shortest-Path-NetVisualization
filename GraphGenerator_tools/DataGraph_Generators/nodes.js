class RandNode extends Node{
    constructor(value){
      super(value);
      [this.x_cor,this.y_cor]=value.split(",")
      this.x_cor=parseInt(this.x_cor);
      this.y_cor=parseInt(this.y_cor);
      if (this.x_cor<0 || this.y_cor<0){console.log(`negativo ${value}`)};
    }

    get_data(){
      return {"type":"node","value":this.value}
    }

    //el get_distance debe hacerlo otra entidad
}


export class RandNode_Generator{
    constructor(total_space,node_size,min_dist=0,max_dist=0,limit_x_node){
      this.range_x=total_space.x;
      this.range_y=total_space.y;
      this.node_size=node_size;
      this.min_dist=min_dist;
      this.max_dist=max_dist;
      this.limit_x_node=limit_x_node;

      this.nodes=[];
    }
    
    generate(cant_nodes=1){
      let created_nodes=[];
      let error_margin=cant_nodes*0.4;
      let current_nodes=0;

      let general_attempts=0;

      while (current_nodes<cant_nodes && general_attempts<cant_nodes+error_margin){
        let limit=0;
        
        while (limit<this.limit_x_node){
          let new_node=this.__create_node();

          if (new_node!=undefined){
            created_nodes.push(new_node);
            current_nodes++;
            break;
          }
          limit++
        }
        
        general_attempts++;
      }

      return created_nodes;
  
    }
    __create_node(){
      let coords_x=parseInt(Math.random()*(this.range_x[1]-this.range_x[0])+this.range_x[0]);
      let coords_y=parseInt(Math.random()*(this.range_y[1]-this.range_y[0])+this.range_y[0]);

      let value=`${coords_x},${coords_y}`
      let new_node=new RandNode(value);
      
      if (this.__isValid(new_node)){
        this.nodes.push(new_node);
        return new_node;
      }
      return undefined; //solo para aclarar
    }

    __isValid(node){
      let valid=true;
      
      for (let other of this.nodes){
        let dist=Math.sqrt((other.x_cor-node.x_cor)**2 + (other.y_cor-node.y_cor)**2)
        
        if (dist-this.node_size<this.max_dist){ //---------------------------------------
          valid=false;
          break;
        }
        
      }
      return valid;
    }
}
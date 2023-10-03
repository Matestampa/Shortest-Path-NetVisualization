//Covierte data de un GraphData_Generator a formato de GraphDraw_Manager
export function fromGraph_2_draw(objectsArr,color){
   for (let obj of objectsArr){
      if (obj.type=="node"){
         let coords=obj.value.split(",");
         obj.x_cor=parseInt(coords[0]);
         obj.y_cor=parseInt(coords[1]);
         obj.tags=["nodes",obj.value];
      }

      if (obj.type=="edge"){
        let components=obj.value.split("-");
        let inverted_value=`${components[1]}-${components[0]}`
        
        let coords1=components[0].split(",");
        let coords2=components[1].split(",");

        [obj.x_cor1,obj.y_cor1]=[parseInt(coords1[0]),parseInt(coords1[1])];
        [obj.x_cor2,obj.y_cor2]=[parseInt(coords2[0]),parseInt(coords2[1])];
        
        obj.tags=["edges",obj.value,inverted_value];

      }

      if (obj.type=="division"){
         let x_coords=obj.coords.x;
         let y_coords=obj.coords.y;
         
         [obj.x_cor1,obj.y_cor1]=[parseInt(x_coords[0]),parseInt(y_coords[0])];
         [obj.x_cor2,obj.y_cor2]=[parseInt(x_coords[1]),parseInt(y_coords[1])];

         obj.tags=["divisions"];

      }
      if (color){
        obj.color=color;
      }
   }
   
   return objectsArr;
}

//Covierte data de ShortPath_Algorithm a data legible para GameMode
export function fromPath_2_Draw(Graph,pathArr,stepsArr){//return {type:"node"/"edge", value:str} y agrega dist:int en el caso de path
   let curr_dist=0;
   let edge_height;
   let formatted_path=[];
   let formatted_steps=[];
   
   for (let i=0;i<stepsArr.length;i++){

      if (i%2==0){
          if (pathArr.length!=0 && i<pathArr.length){
             formatted_path.push({"type":"node","value":pathArr[i]});
          }
          formatted_steps.push({"type":"node","value":stepsArr[i]});
      }
      else{
          if (pathArr.length!=0 && i<pathArr.length){
             let [nodeVal1,nodeVal2]=pathArr[i].split("-");
             edge_height=Graph.get_edge(nodeVal1,nodeVal2).height;
             curr_dist+=parseInt(edge_height); //aumentamos la curr_dist de cada edge
             
             formatted_path.push({"type":"edge","value":pathArr[i],"dist":curr_dist}); 
          }
          formatted_steps.push({"type":"edge","value":stepsArr[i]});
      }
  }
  
  return {"path":formatted_path,"steps":formatted_steps};
}

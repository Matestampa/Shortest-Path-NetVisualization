
import type { InMemory_Graph } from "./Graph_functionality/InMemory_Graph";


type shortestPath_drawData={
   path:({type:"node",value:string}|{type:"edge",value:string,dist:number})[],
   steps:({type:"node",value:string}|{type:"edge",value:string})[]
}

//Covierte data de ShortPath_Algorithm a data legible para GameMode
function fromPath_2_Draw(Graph:InMemory_Graph,pathArr,stepsArr):shortestPath_drawData{
   let curr_dist=0;
   let edge_height;
   let formatted_path:shortestPath_drawData["path"]=[];
   let formatted_steps:shortestPath_drawData["steps"]=[];
   
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

export {fromPath_2_Draw};
export type {shortestPath_drawData};

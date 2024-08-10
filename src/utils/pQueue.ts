
type Pqueue_dataType={
   [key:string]:object;
}

type Pqueue_indexesType={
   [key:string]:number;
}

class PriorQueue{
   data:Pqueue_dataType;
   list:{id:any,cant:number}[];
   indexes:Pqueue_indexesType;
   currId:number;

   constructor(){
      this.data={}; //aca van los objetos que mandemos
      this.list=[];
      this.indexes={}; //aca van los particulares que usa para ordenar {"id","cant"} 
      
      this.currId=0;
   }

   add(obj:any,cant:number,key?:string){
      if (key){
         this.data[key]=obj;
         this.list.push({id:key,cant:cant});
         this.indexes[key]=this.list.length-1;
      }
      
      else{
         this.data[this.currId]=obj;
         this.list.push({id:this.currId,cant:cant});
         this.indexes[this.currId]=this.list.length-1;
         this.currId++;
      }
      
      if (this.list.length>1){this.__re_order()};

   }

   update(obj:any,cant:number,key:string){
      if (this.data[key]==undefined){throw Error(`The element ${key} is not in the Pqueue`)};
      
      let toUpdate_index=this.indexes[key];
      this.data[key]=obj;
      this.list[toUpdate_index]={id:key,cant:cant};

      this.__re_order(toUpdate_index);
   }
   
   pop_from(option:("start"|"medium"|"end"|string) = "end"){
      if (this.list.length==0){throw new Error("The queue is empty")};
      if (this.list.length==1 && option=="medium"){option="end"}; //si es medium y solo hay uno nos va a dar error de index
      
      const OPTIONS_INDEXES={"start":0,"medium":Math.round(this.list.length/2),"end":this.list.length-1};
      let index=OPTIONS_INDEXES[option];

      let toPop=this.list[index];
      let objReturned;
      
      objReturned={"obj":this.data[toPop.id],"cant":toPop.cant};
     
      delete this.data[toPop.id];
      delete this.indexes[toPop.id];
      this.list.splice(index,1);

      return objReturned;

   }
   is_empty():boolean{
      if (this.list.length==0){
         return true;
      }
      return false;
   }

   get_all(){
      console.log(this.indexes);
      console.log(this.list);
   }

   __re_order(from_index?:number){
      let start;
      let end;
      let indexMove;
      let condition:(curr:number,next:number)=>boolean;
      
      if (from_index!=undefined && from_index!=this.list.length-1){
         start=from_index;
         
         if (start==0){
            end=this.list.length-1;
            indexMove=1;
            condition=(curr,next)=>{return curr<next?true:false};
         }

         else if (this.list[start].cant>this.list[start-1].cant){
            end=0;
            indexMove=-1;
            condition=(curr,next)=>{return curr>next?true:false};
         }
         else if(this.list[start].cant<this.list[start+1].cant){
            end=this.list.length-1;
            indexMove=1;
            condition=(curr,next)=>{return curr<next?true:false};
         }
         else{return}
      }
      else{
        start=this.list.length-1;
        end=0;
        indexMove=-1;
        condition=(curr,next)=>{return curr>next?true:false};
      }


      let curr,next;
      for (let i=start;i!=end;i+=indexMove){
          curr=this.list[i];
          next=this.list[i+indexMove];
          if (condition(curr.cant,next.cant)){ //queremos los mas chicos prioritarios
            [this.list[i],this.list[i+indexMove]]=[this.list[i+indexMove],this.list[i]];
            this.indexes[curr.id]=i+indexMove;
            this.indexes[next.id]=i;
          }
          else{
            break;
          }
      }
   }
}

export {PriorQueue};

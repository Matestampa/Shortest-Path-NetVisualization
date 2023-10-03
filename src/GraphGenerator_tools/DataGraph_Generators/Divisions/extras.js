export class PriorQueue{
    constructor(){
       this.data={}; //aca van los objetos que mandemos
       this.list=[]; //aca van los particulares que usa para ordenar {"id","cant"} 
       
       this.currId=0;
    }
 
    add(obj,cant){
       this.data[this.currId]=obj;
       this.list.push({id:this.currId,cant:cant});
 
       if (this.list.length>1){this.__re_order()};
 
       this.currId++
    }
    
    pop_from(option="end"){
       if (this.list.length==0){throw new Error("The queue is empty")};
       if (this.list.length==1 && option=="medium"){option="end"}; //si es medium y solo hay uno nos va a dar error de index
       
       const OPTIONS_INDEXES={"start":0,"medium":Math.round(this.list.length/2),"end":this.list.length-1};
       let index=OPTIONS_INDEXES[option];
 
       let toPop=this.list[index];
       let objReturned;
       
       objReturned={"obj":this.data[toPop.id],"cant":toPop.cant};
       
       delete this.data[toPop.id];
       this.list.splice(index,1);
 
       return objReturned;
 
    }
    is_empty(){
       if (this.list.length==0){
          return true;
       }
       return false;
    }
 
    get_all(){
       console.log(this.data);
       console.log(this.list);
    }
 
    __re_order(){
       let curr,next;
       for (let i=this.list.length-1;i>0;i--){
           curr=this.list[i];
           next=this.list[i-1];
           if (curr.cant>next.cant){ //queremos los mas chicos prioritarios
             [this.list[i],this.list[i-1]]=[this.list[i-1],this.list[i]];
           }
           else{
             break;
           }
       }
    }
 }
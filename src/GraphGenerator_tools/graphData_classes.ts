
type GeneratedGraphData= (DataNode|DataEdge) []

class DataNode{
    value:`${number},${number}`
    x_cor:number
    y_cor:number

    constructor(x_cor:number,y_cor:number){
        this.value=`${x_cor},${y_cor}`
        this.x_cor=x_cor;
        this.y_cor=y_cor;
    }
}

class DataEdge{
    value:`${number},${number}-${number},${number}`
    x_cor1:number
    y_cor1:number
    x_cor2:number
    y_cor2:number
    height:number

    constructor(x_cor1:number,y_cor1:number,x_cor2:number,y_cor2:number,height:number){
        this.value=`${x_cor1},${y_cor1}-${x_cor2},${y_cor2}`
        this.x_cor1=x_cor1;
        this.y_cor1=y_cor1;
        this.x_cor2=x_cor2;
        this.y_cor2=y_cor2;
        this.height=height;

    }

    get_invertedValue(){
        let components=this.value.split("-");
        return `${components[1]}-${components[0]}`;
    }
}

let edge=new DataEdge(40,20,50,60,5)

console.log(edge.value);
console.log(edge.get_invertedValue());

export {GeneratedGraphData,DataNode,DataEdge};
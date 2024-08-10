import {fabric} from "fabric";

abstract class GraphDraw_Element{

    type:string
    value:any
    cv_object:fabric.Object

    constructor(value:any,object_data:{}){
        this.type="cada uno pone el suyo";
        this.value=value;
        this.cv_object=this.p__create_object(object_data);
    }

    abstract p__create_object(object_data):fabric.Object
}


class GraphDraw_Node extends GraphDraw_Element{
    constructor(value:any,object_data:{}){
        super(value,object_data);
        this.type="node";
    }

    change_color(color:string){
        this.cv_object.set("fill",color);
    }

    p__create_object(object_data){
        let new_rect=new fabric.Circle(object_data);
        return new_rect;
    }
}

class GraphDraw_Edge extends GraphDraw_Element{
    constructor(value:any,object_data:{}){
        super(value,object_data);
        this.type="edge";
    }

    change_color(color:string){
        this.cv_object.set("stroke",color);
    }

    p__create_object(object_data){
        let new_line=new fabric.Line(object_data.coords,object_data.attrs);
        return new_line;
    }
}

class GraphDraw_Division extends GraphDraw_Element{
    constructor(value,object_data){
        super(value,object_data);
        this.type="division";
    }
    p__create_object(object_data){
        object_data.attrs.top=object_data.coords[1];
        object_data.attrs.left=object_data.coords[0];
        object_data.attrs.width=object_data.coords[2]-object_data.coords[0];
        object_data.attrs.height=object_data.coords[3]-object_data.coords[1];
        
        let new_div=new fabric.Rect(object_data.attrs);

        return new_div;
    }
}

export {GraphDraw_Node,GraphDraw_Edge};
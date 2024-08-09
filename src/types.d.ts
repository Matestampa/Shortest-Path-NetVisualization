
type DrawNode_conf={size?:number,default_color:string,movility:boolean}

type DrawEdge_conf={default_color:string,movility:boolean}

type DrawGraphElems_conf={canvas:fabric.Canvas,
                          node:DrawNode_conf,
                          edge:DrawEdge_conf};

export type {DrawNode_conf,DrawEdge_conf,DrawGraphElems_conf}
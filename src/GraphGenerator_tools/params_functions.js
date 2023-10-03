//---------------------------- Ecuaciones para determinar parametros para generar el Graph ------------------

function get_maxCantNodes(screen={"width":1500,"height":550},nodeSize=20,max_dist=30){
    let mid_nodeSize=parseInt(nodeSize/2);
    let cant_nodes=(screen.width*screen.height) / (Math.PI * (mid_nodeSize+(max_dist/2))**2);

    return parseInt(cant_nodes);
}


export function get_nodeSize(screen={"width":1516,"height":541},cant_nodes=420,max_dist=30){
    let mid_nodeSize=Math.sqrt((screen.width*screen.height / cant_nodes) / Math.PI) - max_dist/2;
    
    return parseInt(mid_nodeSize) * 2; 
}

function get_maxDist(screen={"width":1500,"height":550},node_size=20,cant_nodes=420){
    let mid_nodeSize=parseInt(node_size/2);
    let max_dist=Math.sqrt(((screen.width*screen.height)/ cant_nodes)/ Math.PI) - mid_nodeSize;

    return parseInt(max_dist*2);
}

function get_divSize(node_size=20,cant_nodes=420,max_dist=30){
    let mid_nodeSize=parseInt(node_size/2);
    let div_side=Math.sqrt(cant_nodes * (Math.PI * (mid_nodeSize+(max_dist/2))**2))

    return parseInt(div_side);
}
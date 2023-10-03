import {Base_GameMode} from "./gameMode_base.js";
//todo el html que querramos poner
let HTML=`<button onclick="play()">Play</button>`;

//funciones asocidadas al html
let functions={"play":(GameMode)=>{console.log("empieza el guesser")}};

//clase

class GuessPath_GameMode extends Base_GameMode{
    constructor(area_limits,Canvas,Dom_Manager){
        super(area_limits,Canvas,Dom_Manager);
    }
}

let toExport={"html":HTML,"functions":functions,"class":GuessPath_GameMode}//"class":la clase;

//export {toExport as GuessPath_GameMode};

/*###################### AVAILABLE SOON ###############################
#######################################################################*/
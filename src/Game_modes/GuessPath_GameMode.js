/*###################### AVAILABLE SOON ###############################
#######################################################################*/

import {Base_GameMode} from "./gameMode_base.js";

import { Dom_Manager,
        INPUT_ELEMENTS_OPTIONS as INPUT_ELEMS} from "./GameMode_tools/Dom_Manager.js";

//------------- HTML ----------------------------
let HTML=`<button onclick="play()">Play</button>`;

//------------FUNCIONES ASOCIDADAS AL HTML----------------------
let functions={"play":(GameMode)=>{console.log("empieza el guesser")}};

//------------ OBJETOS DEL DOM CON LOS QUE INTERACTUAMOS -------------------------
let ObJ_Manager=new Dom_Manager();


//--------------------------- CLASE GAMEMODE ---------------------------------

class GuessPath_GameMode extends Base_GameMode{
    constructor(area_limits,Canvas,Dom_Manager){
        super(area_limits,Canvas,Dom_Manager);
    }
}

let toExport={"html":HTML,"functions":functions,"class":GuessPath_GameMode}//"class":la clase;

//export {toExport as GuessPath_GameMode};
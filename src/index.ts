import "./styles.css";

//import { ShowPath_GameMode } from "./Game_modes/ShowPath_GameMode.js";
import {fabric} from "fabric";

import { GAME_MODES } from "./Game_modes/index.js";

import type { GameMode_All,Any_GameMode_Class,} from "./Game_modes/index.js";


//-------------------- POSICIONAMIENTO Y CREACION DE CANVAS ----------------------
let cvDiv=document.getElementById("cv_home");
let cvItem=document.getElementById("c");

let position=cvDiv.getBoundingClientRect();

cvItem.setAttribute("width",(window.screen.availWidth-20).toString());
cvItem.setAttribute("height",(window.screen.availHeight-position.y-100).toString());


const cv=new fabric.Canvas("c",{"backgroundColor":"#313131"});

const area_limits={"x":[0,cv.width],"y":[0,cv.height]};


//--------------------------  MANEJO DE GAME MODES  --------------------------------


let controls_zone=document.getElementById("gameMode_controls");
let curr_mode:string;
let GameMode:GameMode_All;
let GameMode_Class:Any_GameMode_Class
//window.dale=ChangeMode;


function ChangeMode(){
    //let e=document.getElementById("game_modes");
    //let new_mode=e.options[e.selectedIndex].value;
    let new_mode="Show"
    
    if (new_mode!=curr_mode){
        curr_mode=new_mode;
        
        if (GameMode!=undefined){GameMode_Class.clear_screen()};
        
        GameMode=GAME_MODES[curr_mode];

        //Cambia Html
        controls_zone.innerHTML=GameMode.html;
    
        //Nueva Clase GameMode
        GameMode_Class=new GameMode.class(area_limits,cv,GameMode.Obj_Manager);
        
        //Añadir funciones que requiera el html a window
        for (let key of Object.keys(GameMode.functions)){
            window[key]=()=>{
                GameMode.functions[key](GameMode_Class);
            };
        }
    }
}

ChangeMode(); //Seteamos por defecto el primero
import "./styles.css";

import { ShowPath_GameMode } from "./Game_modes/ShowPath_GameMode.js";
import {fabric} from "fabric";


//-------------------- Posicionamiento de Canvas ----------------------
let cvDiv=document.getElementById("cv_home");
let cvItem=document.getElementById("c");

let position=cvDiv.getBoundingClientRect();

cvItem.setAttribute("width",window.screen.availWidth-20);
cvItem.setAttribute("height",window.screen.availHeight-position.y-100);


const cv=new fabric.Canvas("c",{"backgroundColor":"#313131"});

const area_limits={"x":[0,cv.width],"y":[0,cv.height]};



const GAME_MODES={"Show":ShowPath_GameMode}; //(Por ahora hay uno solo)
let controls_zone=document.getElementById("gameMode_controls");
let curr_mode;
let GameMode;
let GameMode_Class;

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
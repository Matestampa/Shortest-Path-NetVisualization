import type { Base_GameMode_Class } from "./gameMode_base.js";
import { ShowPath_GameMode } from "./ShowPath_GameMode.js";

import type { Dom_Manager } from "./GameMode_tools/Dom_Manager.js";

type GameMode_All={
    html:string,
    functions:Array<(GameMode)=>void>,
    Obj_Manager:Dom_Manager,
    class:new (area_limits,Canvas,Dom_Manager)=>Base_GameMode_Class
}

const GAME_MODES={"Show":ShowPath_GameMode};


export {GAME_MODES};
export type {GameMode_All};
export type {Base_GameMode_Class as Any_GameMode_Class}
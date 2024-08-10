//--------- Pausa el programa por cierto tiempo ------------------
export function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
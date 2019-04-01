import TempModule from 'TempModule';
export default class TempProxy {
    DataModule = null
    Reset() {
        this.DataModule = null
    }
    get module() {
        if (this.DataModule == null) {
            this.DataModule = new TempModule()
        }
        return this.DataModule
    }
    set module(value) { }

    randomBgColor() {
        let curColor = this.module._bg_Color;
        let nextColor = Math.floor(Math.random() * 5) + 1;
        if(nextColor === curColor) {
            if(nextColor === 1) {
                nextColor =2;
            } else if(nextColor === 5) {
                nextColor = 4;
            } else {
                nextColor -=1;
            }
        }
       // console.log(nextColor)
        this.module._bg_Color = nextColor;
        Notification.emit("randomBgColorChange")
        
        return this.module._bg_Color;
    }
}
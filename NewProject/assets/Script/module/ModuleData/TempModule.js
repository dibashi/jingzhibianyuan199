export default class TempModule{
    constructor(data) {
        this._nowNoviceData = {}
        this._is_hall = false
        this._is_sound = true
        this._score = 0
        this._bg_Color = 1;
    }
    get nowNoviceData(){//当前的新手引导关卡数据id、idx
        return this._nowNoviceData
    }
    set nowNoviceData(value){
        this._nowNoviceData = value
    }
    get is_hall(){
        return this._is_hall
    }
    set is_hall(value){
        this._is_hall = value
    }
    get is_sound(){
        return this._is_sound
    }
    set is_sound(value){
        return this._is_sound = value
    }

    get bg_Color(){
        return this._bg_Color
    }
    set bg_Color(value){
        this._bg_Color = value
    }

    get score(){
        return this._score
    }
    set score(value){
        this._score = value
        Notification.emit("TempModuleScoreUpdate")
    }
}
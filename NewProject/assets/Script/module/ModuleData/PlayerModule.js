export default class PlayerModule{
    constructor(data) {
        this._playerData = {
                pid:data.pid != null ? data.pid : this._playerData.pid,
                name:data.name != null ? data.name : this._playerData.name,
                lv:data.lv != null ? data.lv : this._playerData.lv,
                time:data.time != null ? data.time : (this._playerData ? this._playerData.time : 0),
                score:data.score != null ? data.score : (this._playerData ? this._playerData.score : 0),
                OldScore:data.OldScore != null ? data.OldScore : (this._playerData ? this._playerData.OldScore : 0),
                Role:data.Role != null ? data.Role : (this._playerData ? this._playerData.Role : 1001),
            }
    };
    get pid(){
        return this._playerData.pid
    }
    set pid(value){
        this._playerData.pid = value
    }
    get name(){
        return this._playerData.name
    }
    set name(value){
        this._playerData.name = value
    }
    get lv(){
        return this._playerData.lv
    }
    set lv(value){
        this._playerData.lv = value
    }
    get time(){
        return this._playerData.time
    }
    set time(value){
        this._playerData.time = value
    }
    get score(){
        return this._playerData.score
    }
    set score(value){
        if (value > this.OldScore){
            this.OldScore = value
        }
        this._playerData.score = value
    }
    get OldScore(){
        return this._playerData.OldScore
    }
    set OldScore(value){
        this._playerData.OldScore = value
    }
    get Role(){
        return this._playerData.Role
    }
    set Role(value){
        this._playerData.Role = value
    }
}
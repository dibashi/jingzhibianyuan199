export default class PlayerModule{
    constructor(data) {
        this._playerData = {
                pid:data.pid != null ? data.pid : this._playerData.pid,
                name:data.name != null ? data.name : this._playerData.name,
                lv:data.lv != null ? data.lv : this._playerData.lv,
                score:data.score != null ? data.score : (this._playerData ? this._playerData.score : 0),
                OldScore:data.OldScore != null ? data.OldScore : (this._playerData ? this._playerData.OldScore : 0),
                body:data.body != null ? data.body : (this._playerData ? this._playerData.body : 1001),//衣服
                earrings:data.earrings != null ? data.earrings : (this._playerData ? this._playerData.earrings : 2001),//耳环
                house:data.house != null ? data.house : (this._playerData ? this._playerData.house : 3001),//房屋
                title:data.title != null ? data.title : (this._playerData ? this._playerData.title : 1000),//默认称号
                time:data.time != null ? data.time : (this._playerData ? this._playerData.time : 0)
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
    get score(){
        return this._playerData.score
    }
    set score(value){
        this._playerData.score = value
    }
    get OldScore(){
        return this._playerData.OldScore
    }
    set OldScore(value){
        this._playerData.OldScore = value
    }
    get body(){
        return this._playerData.body
    }
    set body(value){
        this._playerData.body = value
    }
    get earrings(){
        return this._playerData.earrings
    }
    set earrings(value){
        this._playerData.earrings = value
    }
    get house(){
        return this._playerData.house
    }
    set house(value){
        this._playerData.house = value
    }
    get title(){
        return this._playerData.title
    }
    set title(value){
        this._playerData.title = value
    }
    get time(){
        return this._playerData.time
    }
    set time(value){
        this._playerData.time = value
    }
}
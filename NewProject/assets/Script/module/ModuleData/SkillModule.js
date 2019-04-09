export default class SkillModule{
    constructor(data,idx) {
        this.index = idx != null ? idx : this.index
        this._Data = {
                id:data.id != null ? data.id : this._playerData.id,
                lv:data.lv != null ? data.lv : this._playerData.lv,
            }
    };
    get id(){
        return this._Data.id
    }
    set id(value){
        this._Data.pid = value
    }
    get lv(){
        return this._Data.lv
    }
    set lv(value){
        this._Data.lv = value
    }
}